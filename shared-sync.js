/* Shared Cloudflare wedding plan: opt-in, versioned synchronization.
   Requires a Cloudflare Pages Function /api/shared, Cloudflare Access, and D1. */
(() => {
  "use strict";
  const ENDPOINT="/api/shared";
  let revision=null,loaded=false,role="viewer",email="",serverRecord=null;
  let baseline="",busy=false,blocked=false,lastPull=0,notice="Checking cloud connection…";
  const $=(selector)=>document.querySelector(selector);
  const snapshot=()=>({
    plan:JSON.parse(JSON.stringify(plan)),
    toronto:window.VowSuiteTorontoBridge?.snapshot()
  });
  const signature=data=>JSON.stringify(data);
  const status=message=>{
    notice=message;
    const node=$("#shared-status");if(node)node.textContent=message;
  };
  const downloadBackup=()=>{
    const payload={type:"vowsuite-shared-backup",createdAt:new Date().toISOString(),...snapshot()};
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));
    const a=document.createElement("a");
    a.href=url;a.download="wedding-local-backup-"+new Date().toISOString().slice(0,10)+".json";
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),5000);
  };
  async function api(method="GET",data=null){
    const options={method,credentials:"same-origin",cache:"no-store",headers:{Accept:"application/json"}};
    if(data!==null){options.headers["Content-Type"]="application/json";options.body=JSON.stringify(data);}
    const response=await fetch(ENDPOINT,options);
    if(!(response.headers.get("Content-Type")||"").includes("application/json"))
      throw Error("Open the Cloudflare-protected site and sign in. GitHub Pages cannot use shared storage.");
    const result=await response.json();
    if(!response.ok){const error=Error(result.error||"Cloud server unavailable.");error.status=response.status;throw error;}
    return result;
  }
  function redraw(){
    const metadata=$("#shared-meta");
    if(metadata)metadata.textContent=email?
      "Signed in: "+email+" · "+(role==="editor"?"Can edit":"View only")+
      " · Cloud revision "+(revision??"not loaded"):"Sign in through Cloudflare Access to connect.";
    const load=$("#shared-load"),save=$("#shared-save"),create=$("#shared-create");
    if(load)load.disabled=busy||!serverRecord?.plan;
    if(save)save.disabled=busy||!loaded||role!=="editor"||blocked;
    if(create)create.disabled=busy||!!serverRecord?.plan||role!=="editor"||revision===null;
    const flag=$("#shared-autosync");
    if(flag){flag.checked=loaded&&!blocked;flag.disabled=true;}
    status(notice);
  }
  function applyRemote(data){
    if(!data?.plan||!data?.toronto||!window.VowSuiteTorontoBridge)throw Error("Shared plan is missing expected wedding data.");
    plan=migratePlan(data.plan);
    window.VowSuiteTorontoBridge.restore(data.toronto);
    render();
    revision=data.revision;
    baseline=signature(snapshot());
    serverRecord=data;
    loaded=true;blocked=false;
    status("Shared plan loaded. Automatic saving is ON. Recent editor: "+(data.updatedBy||"unknown")+".");
    redraw();
  }
  async function refresh(){
    if(busy)return;
    busy=true;redraw();
    try{
      const data=await api();
      email=data.email;role=data.role;serverRecord=data;
      if(!loaded){
        revision=data.revision;
        status(data.plan?"Shared plan found. Select “Load shared plan” to use it on this device.":
          "No shared plan exists. Select “Start sharing this browser’s plan” when your local wedding details are ready.");
      }else if(data.revision!==revision){
        if(signature(snapshot())!==baseline){
          blocked=true;
          status("Conflict: someone else saved while you have local edits. Download a backup before loading their version.");
        }else{
          applyRemote(data);
          status("Updated to the latest shared plan from "+(data.updatedBy||"another editor")+".");
        }
      }else if(!blocked)status("Connected · Auto-save enabled · revision "+revision+".");
      lastPull=Date.now();
    }catch(e){status(e.message);if(loaded)status("Connection problem: "+e.message+" Local edits are retained.");}
    finally{busy=false;redraw();}
  }
  async function push(first=false){
    if(busy||blocked||role!=="editor"||(!loaded&&!first))return;
    if(!window.VowSuiteTorontoBridge){status("Toronto extension is missing; cannot save a partial wedding plan.");return;}
    busy=true;redraw();
    try{
      const data=snapshot();
      const result=await api("PUT",{revision,plan:data.plan,toronto:data.toronto});
      revision=result.revision;
      baseline=signature(data);
      loaded=true;serverRecord={...data,...result,revision};
      status("Saved to shared cloud · revision "+revision+" · "+new Date().toLocaleTimeString()+".");
    }catch(e){
      if(e.status===409){blocked=true;status("SAVE BLOCKED: another person saved first. Download a local backup, then load the shared version.");}
      else status("Not saved to cloud: "+e.message+" Your local edits are still on this browser.");
    }finally{busy=false;redraw();}
  }
  async function tick(){
    if(busy||!loaded||blocked)return;
    if(role==="editor"&&signature(snapshot())!==baseline){await push();return;}
    if(Date.now()-lastPull>18000)await refresh();
  }
  function init(){
    const nav=$("#primaryNav"),main=$("main.workspace");
    if(!nav||!main||typeof plan==="undefined"||!window.VowSuiteTorontoBridge)return;
    if(!$("#shared-nav")){
      const button=document.createElement("button");
      button.className="nav-item";button.id="shared-nav";button.type="button";button.dataset.view="shared";
      button.innerHTML='<i data-lucide="cloud"></i><span>Shared plan</span>';
      nav.appendChild(button);
    }
    const view=document.createElement("section");view.id="shared";view.className="view";
    view.innerHTML='<div class="shared-panel"><p class="shared-eyebrow">Private collaboration</p>'+
      '<h2>One wedding plan. Everyone in sync.</h2>'+
      '<p>Cloudflare Access decides who can sign in. The server grants editing access only to email addresses listed as editors.</p>'+
      '<div id="shared-meta" class="shared-meta">Connecting…</div>'+
      '<div id="shared-status" role="status" aria-live="polite" class="shared-status"></div>'+
      '<div class="shared-actions">'+
      '<button id="shared-load" type="button">Load shared plan</button>'+
      '<button id="shared-save" type="button">Save changes now</button>'+
      '<button id="shared-create" type="button">Start sharing this browser’s plan</button>'+
      '<button id="shared-refresh" type="button">Check for updates</button>'+
      '<button id="shared-backup" type="button">Download local backup</button></div>'+
      '<label class="shared-note"><input id="shared-autosync" type="checkbox" disabled> Auto-save and refresh after loading</label>'+
      '<p class="shared-note">Opening another device does not automatically replace its local data. First select <b>Load shared plan</b>. '+
      'When two editors modify the same plan at once, changes are not merged: the second save is blocked to protect the first. '+
      'Download a backup before discarding conflicting edits. Never set up the older permissive VowSuite Supabase sync.</p></div>';
    main.appendChild(view);
    $("#shared-backup").addEventListener("click",downloadBackup);
    $("#shared-refresh").addEventListener("click",refresh);
    $("#shared-load").addEventListener("click",()=>{
      if(!serverRecord?.plan||busy)return;
      if(!confirm("Download a backup of this browser’s current plan and replace it with the shared cloud copy?"))return;
      downloadBackup();
      try{applyRemote(serverRecord);}catch(e){status(e.message);}
    });
    $("#shared-save").addEventListener("click",()=>push());
    $("#shared-create").addEventListener("click",()=>{
      if(revision!==0||!serverRecord||role!=="editor"||busy)return;
      if(!confirm("Create the first SHARED wedding plan from this browser? Everyone you invite will be able to see this data. Make sure the sample demo has been replaced with your real plan."))return;
      push(true);
    });
    if(window.lucide?.createIcons)window.lucide.createIcons();
    redraw();
    refresh();
    setInterval(tick,6500);
    document.addEventListener("visibilitychange",()=>{if(!document.hidden)tick();});
    window.addEventListener("online",()=>tick());
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();