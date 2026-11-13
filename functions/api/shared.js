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
async function identity(ctx){
  const env=ctx.env;
  const team=String(env.TEAM_DOMAIN||"").replace(/\/+$/,"");
  const domain=new URL(team);
  if(domain.protocol!=="https:"||!domain.hostname.endsWith(".cloudflareaccess.com")||
     domain.pathname!=="/"||!env.POLICY_AUD||!env.WRITER_EMAILS) throw Error("CONFIG");
  const jwt=ctx.request.headers.get("Cf-Access-Jwt-Assertion");
  if(!jwt) throw Error("ACCESS");
  const parts=jwt.split(".");
  if(parts.length!==3||parts.some(p=>!p)||jwt.length>12000) throw Error("ACCESS");
  let head,payload;
  try {head=readJson(decode(parts[0]));payload=readJson(decode(parts[1]));}
  catch {throw Error("ACCESS");}
  if(head.alg!=="RS256"||typeof head.kid!=="string"||head.kid.length>200)throw Error("ACCESS");
  const now=Math.floor(Date.now()/1000);
  if(payload.iss!==team||!(Array.isArray(payload.aud)?payload.aud.includes(env.POLICY_AUD):payload.aud===env.POLICY_AUD)||
     !Number.isFinite(payload.exp)||payload.exp<=now||
     (payload.nbf!==undefined&&(!Number.isFinite(payload.nbf)||payload.nbf>now))||
     (payload.iat!==undefined&&(!Number.isFinite(payload.iat)||payload.iat>now+60)))throw Error("ACCESS");
  const email=String(payload.email||"").trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Error("ACCESS");
  if(!keyCache||Date.now()>cacheUntil){
    const response=await fetch(team+"/cdn-cgi/access/certs",{headers:{Accept:"application/json"}});
    if(!response.ok)throw Error("ACCESS");
    const certs=await response.json();
    if(!Array.isArray(certs.keys))throw Error("ACCESS");
    keyCache=certs.keys;
    cacheUntil=Date.now()+5*60*1000;
  }
  const jwk=keyCache.find(k=>k.kid===head.kid&&k.kty==="RSA"&&k.n&&k.e);
  if(!jwk)throw Error("ACCESS");
  try{
    const key=await crypto.subtle.importKey("jwk",{kty:"RSA",n:jwk.n,e:jwk.e,alg:"RS256",ext:true},
       {name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
    const ok=await crypto.subtle.verify("RSASSA-PKCS1-v1_5",key,decode(parts[2]),new TextEncoder().encode(parts[0]+"."+parts[1]));
    if(!ok)throw Error("ACCESS");
  }catch{throw Error("ACCESS");}
  const writers=emails(env.WRITER_EMAILS);
  const readers=emails(env.READER_EMAILS);
  if(!writers.has(email)&&!readers.has(email))throw Error("DENIED");
  return {email,role:writers.has(email)?"editor":"viewer"};
}
async function authorized(ctx){
  if(!ctx.env.DB||!ctx.env.TEAM_DOMAIN||!ctx.env.POLICY_AUD||!ctx.env.WRITER_EMAILS)
    return {error:reply({error:"Shared storage is not configured yet. Check Cloudflare D1 binding and Access variables."},503)};
  try{return {user:await identity(ctx)};}
  catch(e){
    return {error:reply({error:e.message==="CONFIG"?"Access configuration is invalid.":"Access denied: sign in with an approved email."},
      e.message==="CONFIG"?503:403)};
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
