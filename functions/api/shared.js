// Cloudflare Pages Function: /api/shared
// Fail closed: verified Cloudflare Access JWT + server-side email allowlist + D1.
const headers = {"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"};
let keyCache=null;
let cacheUntil=0;
const reply=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers});
const decode = str => {
  const s=str.replace(/-/g,"+").replace(/_/g,"/");
  return Uint8Array.from(atob(s.padEnd(Math.ceil(s.length/4)*4,"=")),c=>c.charCodeAt(0));
};
const readJson = bytes => JSON.parse(new TextDecoder().decode(bytes));
const emails = text => new Set(String(text||"").split(/[,\n;\s]+/).map(s=>s.trim().toLowerCase()).filter(Boolean));
const fail = code => { throw Error(code); };
function tokenFromRequest(request){
  const header=request.headers.get("Cf-Access-Jwt-Assertion");
  if(header) return header.trim();
  // Cloudflare documents this application cookie as another JWT transport.
  // Never trust its contents until the exact same signature and claim checks pass.
  const cookies=(request.headers.get("Cookie")||"").split(";")
    .map(part=>part.trim()).filter(part=>part.startsWith("CF_Authorization="));
  if(cookies.length!==1)return "";
  return cookies[0].slice("CF_Authorization=".length).trim();
}
async function signingKey(team,kid){
  const find=()=>keyCache?.team===team&&keyCache.keys.find(k=>k.kid===kid&&k.kty==="RSA"&&k.n&&k.e);
  let jwk=Date.now()<cacheUntil?find():null;
  if(jwk)return jwk;
  // Refresh when an unknown key ID appears, including during key rotation.
  // Avoid fetching on every untrusted request with a made-up key ID.
  if(keyCache?.team===team&&Date.now()<keyCache.fetchedAt+30000)fail("UNKNOWN_KEY");
  try{
    const response=await fetch(team+"/cdn-cgi/access/certs",{headers:{Accept:"application/json"},redirect:"error"});
    if(!response.ok)fail("KEYS_UNAVAILABLE");
    const certs=await response.json();
    if(!Array.isArray(certs.keys))fail("KEYS_UNAVAILABLE");
    keyCache={team,keys:certs.keys,fetchedAt:Date.now()};
    cacheUntil=Date.now()+5*60*1000;
  }catch{fail("KEYS_UNAVAILABLE");}
  jwk=find();
  if(!jwk)fail("UNKNOWN_KEY");
  return jwk;
}
async function identity(ctx){
  const env=ctx.env;
  const team=String(env.TEAM_DOMAIN||"").trim().replace(/\/+$/,"");
  const aud=String(env.POLICY_AUD||"").trim();
  let domain;
  try{domain=new URL(team);}catch{fail("CONFIG");}
  if(domain.protocol!=="https:"||!domain.hostname.endsWith(".cloudflareaccess.com")||
     domain.pathname!=="/"||domain.port||domain.username||domain.password||domain.search||domain.hash||
     !/^[a-f0-9]{64}$/i.test(aud)||!emails(env.WRITER_EMAILS).size)fail("CONFIG");
  const jwt=tokenFromRequest(ctx.request);
  if(!jwt)fail("NO_TOKEN");
  const parts=jwt.split(".");
  if(parts.length!==3||parts.some(p=>!p||!/^[A-Za-z0-9_-]+$/.test(p))||jwt.length>12000)fail("MALFORMED_TOKEN");
  let head,payload;
  try{head=readJson(decode(parts[0]));payload=readJson(decode(parts[1]));}
  catch{fail("MALFORMED_TOKEN");}
  if(!head||!payload||head.alg!=="RS256"||typeof head.kid!=="string"||head.kid.length>200)fail("MALFORMED_TOKEN");
  if(payload.iss!==team)fail("ISSUER_MISMATCH");
  if(!(Array.isArray(payload.aud)?payload.aud.includes(aud):payload.aud===aud))fail("AUD_MISMATCH");
  const now=Math.floor(Date.now()/1000);
  if(!Number.isFinite(payload.exp)||payload.exp<=now||
     (payload.nbf!==undefined&&(!Number.isFinite(payload.nbf)||payload.nbf>now))||
     (payload.iat!==undefined&&(!Number.isFinite(payload.iat)||payload.iat>now+60)))fail("EXPIRED_OR_EARLY");
  const jwk=await signingKey(team,head.kid);
  try{
    const key=await crypto.subtle.importKey("jwk",{kty:"RSA",n:jwk.n,e:jwk.e,alg:"RS256",ext:true},
       {name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
    const ok=await crypto.subtle.verify("RSASSA-PKCS1-v1_5",key,decode(parts[2]),new TextEncoder().encode(parts[0]+"."+parts[1]));
    if(!ok)fail("BAD_SIGNATURE");
  }catch{fail("BAD_SIGNATURE");}
  const email=String(payload.email||"").trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail("NO_EMAIL");
  const writers=emails(env.WRITER_EMAILS);
  const readers=emails(env.READER_EMAILS);
  if(!writers.has(email)&&!readers.has(email))fail("DENIED");
  return {email,role:writers.has(email)?"editor":"viewer"};
}
// Fixed diagnostic messages only; never expose token, claim values, keys or email addresses.
const authErrors=Object.freeze({
  CONFIG:"[CONFIG] Check TEAM_DOMAIN, the 64-character application AUD tag, and WRITER_EMAILS.",
  NO_TOKEN:"[NO_TOKEN] No Cloudflare Access login token reached the shared API. Sign in on the main protected Pages hostname; check Access covers /api/shared.",
  MALFORMED_TOKEN:"[MALFORMED_TOKEN] Access token is invalid. Sign out of Cloudflare Access and sign in again.",
  ISSUER_MISMATCH:"[ISSUER_MISMATCH] Login token belongs to another Access team. Check TEAM_DOMAIN.",
  AUD_MISMATCH:"[AUD_MISMATCH] Login token audience does not match POLICY_AUD. Use the main Pages application's AUD tag, then redeploy and sign in again.",
  EXPIRED_OR_EARLY:"[EXPIRED_OR_EARLY] Access login has expired or is not yet valid. Sign in again.",
  KEYS_UNAVAILABLE:"[KEYS_UNAVAILABLE] Could not retrieve the team's public signing keys. Check TEAM_DOMAIN and retry.",
  UNKNOWN_KEY:"[UNKNOWN_KEY] Login signing key is not recognized. Sign in again and retry shortly.",
  BAD_SIGNATURE:"[BAD_SIGNATURE] Login token signature could not be verified. Sign in again.",
  NO_EMAIL:"[NO_EMAIL] Verified Access token has no valid email identity. Use an email-based user login.",
  DENIED:"[DENIED] Verified login email is not on WRITER_EMAILS or READER_EMAILS. Check the approved email lists in Production and redeploy."
});
async function authorized(ctx){
  if(!ctx.env.DB||!ctx.env.TEAM_DOMAIN||!ctx.env.POLICY_AUD||!ctx.env.WRITER_EMAILS)
    return {error:reply({error:"[SETUP] Shared storage is not configured yet. Check Cloudflare D1 binding and Access variables."},503)};
  try{return {user:await identity(ctx)};}
  catch(e){
    const code=Object.prototype.hasOwnProperty.call(authErrors,e?.message)?e.message:"AUTH_FAILED";
    return {error:reply({error:authErrors[code]||"[AUTH_FAILED] Access verification failed. Contact the planner administrator.",code},
      code==="CONFIG"||code==="KEYS_UNAVAILABLE"?503:403)};
  }
}
async function getPlan(ctx){
  const auth=await authorized(ctx);if(auth.error)return auth.error;
  try{
    const row=await ctx.env.DB.prepare(
      "SELECT revision,plan_json,toronto_json,updated_by,updated_at FROM shared_wedding WHERE id=?")
      .bind("main").first();
    return reply({
      role:auth.user.role,email:auth.user.email,revision:row?.revision||0,
      plan:row?JSON.parse(row.plan_json):null,toronto:row?JSON.parse(row.toronto_json):null,
      updatedBy:row?.updated_by||null,updatedAt:row?.updated_at||null
    });
  }catch(e){console.error("Shared data read error",e);return reply({error:"Database unavailable or migration missing."},503);}
}
async function putPlan(ctx){
  const auth=await authorized(ctx);if(auth.error)return auth.error;
  if(auth.user.role!=="editor")return reply({error:"You have view-only access."},403);
  const origin=ctx.request.headers.get("Origin");
  if(!origin||origin!==new URL(ctx.request.url).origin)return reply({error:"Invalid request origin."},403);
  const contentType=ctx.request.headers.get("Content-Type")||"";
  if(!contentType.toLowerCase().startsWith("application/json"))return reply({error:"Expected JSON."},415);
  const declared=Number(ctx.request.headers.get("Content-Length")||0);
  if(declared>900000)return reply({error:"Wedding data is too large to sync."},413);
  let body;
  try{
    const content=await ctx.request.text();
    if(new TextEncoder().encode(content).byteLength>900000)return reply({error:"Wedding data is too large to sync."},413);
    body=JSON.parse(content);
  }catch{return reply({error:"Invalid JSON."},400);}
  if(!body||!Number.isSafeInteger(body.revision)||body.revision<0||
     !body.plan||typeof body.plan!=="object"||Array.isArray(body.plan)||
     !Array.isArray(body.plan.guests)||!Array.isArray(body.plan.expenses)||
     !body.toronto||typeof body.toronto!=="object"||Array.isArray(body.toronto)||
     !Array.isArray(body.toronto.venues)||!body.toronto.settings)
    return reply({error:"Invalid wedding data."},400);
  const p=JSON.stringify(body.plan),t=JSON.stringify(body.toronto);
  const stamp=new Date().toISOString();
  try{
    if(body.revision===0){
      const result=await ctx.env.DB.prepare(
        "INSERT OR IGNORE INTO shared_wedding (id,revision,plan_json,toronto_json,updated_by,updated_at) VALUES (?,?,?,?,?,?)")
        .bind("main",1,p,t,auth.user.email,stamp).run();
      if(result.meta?.changes===1)return reply({revision:1,updatedBy:auth.user.email,updatedAt:stamp});
    }else{
      const result=await ctx.env.DB.prepare(
        "UPDATE shared_wedding SET revision=revision+1,plan_json=?,toronto_json=?,updated_by=?,updated_at=? WHERE id=? AND revision=?")
        .bind(p,t,auth.user.email,stamp,"main",body.revision).run();
      if(result.meta?.changes===1)return reply({revision:body.revision+1,updatedBy:auth.user.email,updatedAt:stamp});
    }
    return reply({error:"Another person saved changes first. Export your local copy and reload the shared plan to avoid overwriting their work."},409);
  }catch(e){console.error("Shared data write error",e);return reply({error:"Database unavailable or migration missing."},503);}
}
export const onRequestGet=getPlan;
export const onRequestPut=putPlan;
export const onRequest=()=>reply({error:"Method not allowed."},405);
