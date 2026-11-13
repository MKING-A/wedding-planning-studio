/* VowSuite Toronto Wedding add-on, v1.0.0. No dependencies or remote services. */
(() => {
  'use strict';
  const STORAGE = 'vowsuite-toronto-v1';
  const datePlaceholder = '2028-05-20'; // planning placeholder, NOT a confirmed date
  const allocationDefaults = [
    { id:'venue', label:'Venue, dinner & bar', amount:32000 },
    { id:'photo', label:'Photography & video', amount:5000 },
    { id:'decor', label:'Florals & décor', amount:3500 },
    { id:'music', label:'DJ & entertainment', amount:2500 },
    { id:'attire', label:'Attire & alterations', amount:2500 },
    { id:'beauty', label:'Hair & makeup', amount:1000 },
    { id:'cake', label:'Cake & favours', amount:1000 },
    { id:'travel', label:'Transportation', amount:1000 },
    { id:'ceremony', label:'Ceremony & officiant', amount:1000 },
    { id:'reserve', label:'Contingency reserve', amount:5500 }
  ];
  const taskDefaults = [
    ['venues','Shortlist Toronto-area venues and request itemized quotes','2026-11-20','High'],
    ['venue','Confirm venue, cancellation terms and deposit schedule','2026-11-30','High'],
    ['photographer','Compare and reserve photography / videography','2027-02-28','High'],
    ['vendors','Book DJ, florist and major vendors','2027-05-31','Medium'],
    ['guestlist','Build preliminary guest list and meal categories','2027-06-30','Medium'],
    ['save','Prepare save-the-dates and accommodation guidance','2027-09-30','Medium'],
    ['menu','Compare catering selections, service and bar packages','2027-11-30','High'],
    ['invitations','Send invitations and track replies','2028-01-31','High'],
    ['rsvp','Review RSVP deadline, dietary requirements and seating','2028-03-31','High'],
    ['final','Confirm final headcount, floorplan, vendors and final invoices','2028-04-30','High'],
    ['day','Prepare rehearsal, final run sheet and emergency contacts','2028-05-10','High']
  ].map(([id,title,due,priority]) => ({id,title,due,priority,done:false}));
  const defaults = () => ({
    settings:{budget:55000,guests:150,date:datePlaceholder,drive:60,hst:13,admin:19,deadline:'2026-11-30'},
    allocations:allocationDefaults.map(x=>({...x})),
    venues:[], tasks:taskDefaults.map(x=>({...x})), revision:1
  });
  const $ = (selector,root=document) => root.querySelector(selector);
  const $$ = (selector,root=document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const n = (value, fallback=0) => { const result=Number(value); return Number.isFinite(result)?result:fallback; };
  const money = value => new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:0}).format(n(value));
  const decMoney = value => new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',minimumFractionDigits:2,maximumFractionDigits:2}).format(n(value));
  const uid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)+Date.now());
  const max0 = value => Math.max(0,n(value));
  function normalize(input) {
    const d=defaults();
    if(!input || typeof input !== 'object' || Array.isArray(input)) return d;
    const settings={...d.settings,...(input.settings && typeof input.settings==='object'?input.settings:{})};
    for(const key of ['budget','guests','drive','hst','admin']) settings[key]=max0(settings[key]);
    settings.guests=Math.max(1,Math.round(settings.guests));
    const allocations=d.allocations.map(x=>({...x,amount:max0(input.allocations?.find?.(v=>v.id===x.id)?.amount ?? x.amount)}));
    const venues=Array.isArray(input.venues)?input.venues.slice(0,300).filter(v=>v && typeof v==='object' && String(v.name||'').trim()).map(v=>({
      id:String(v.id||uid()),name:String(v.name).slice(0,180),area:String(v.area||'').slice(0,180),status:String(v.status||'Shortlisted'),
      guests:Math.max(1,Math.round(max0(v.guests||settings.guests))),perGuest:max0(v.perGuest),room:max0(v.room),bar:max0(v.bar),extras:max0(v.extras),minimum:max0(v.minimum),
      admin:max0(v.admin ?? settings.admin),hst:max0(v.hst ?? settings.hst),adminScope:v.adminScope==='all'?'all':'food',taxAdmin:v.taxAdmin!==false,
      deposit:max0(v.deposit),balanceDue:String(v.balanceDue||''),drive:max0(v.drive),
      packageName:String(v.packageName||'').slice(0,130),starter:String(v.starter||'').slice(0,130),main:String(v.main||'').slice(0,130),dessert:String(v.dessert||'').slice(0,130),lateNight:String(v.lateNight||'').slice(0,130),
      notes:String(v.notes||'').slice(0,1500),updated:String(v.updated||'')
    })):[];
    const tasks=d.tasks.map(t=>({...t,done:Boolean(input.tasks?.find?.(v=>v.id===t.id)?.done)}));
    return {...d,settings,allocations,venues,tasks};
  }
  let state;
  try{state=normalize(JSON.parse(localStorage.getItem(STORAGE)||'null'));}catch{state=defaults();}
  let tab='venues',editingId=null;
  const save = () => { try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch{notice('Could not save locally. Export a JSON backup and check browser storage.',true);} };
  function notice(message,error=false){const el=$('#tw-notice');if(el){el.textContent=message;el.setAttribute('role',error?'alert':'status');}}
  function calc(v){
    const meal=max0(v.perGuest)*Math.max(1,n(v.guests,1)), fnb=Math.max(meal+max0(v.bar),max0(v.minimum)),
      subtotal=fnb+max0(v.room)+max0(v.extras),adminBase=v.adminScope==='all'?subtotal:fnb,
      fee=adminBase*max0(v.admin)/100,taxable=subtotal+(v.taxAdmin!==false?fee:0),hst=taxable*max0(v.hst)/100,
      total=subtotal+fee+hst,paid=Math.min(total,max0(v.deposit));
    return {meal,fnb,subtotal,fee,hst,total,paid,balance:total-paid,perGuest:total/Math.max(1,n(v.guests,1))};
  }
  function layout(){
    const nav=$('#primaryNav');const workspace=$('main.workspace');
    if(!nav||!workspace){return false;}
    if(!$('#tw-nav')){
      const button=document.createElement('button');button.className='nav-item';button.id='tw-nav';button.dataset.view='toronto';button.type='button';
      button.innerHTML='<i data-lucide="map-pin"></i><span>Toronto Wedding</span>';
      const budgetLink=$('[data-view="budget"]',nav);if(budgetLink)nav.insertBefore(button,budgetLink);else nav.appendChild(button);
    }
    if($('#toronto'))return true;
    const section=document.createElement('section');section.id='toronto';section.className='view';section.innerHTML=`
      <header class="tw-header"><div><p class="tw-eyebrow">Your private planning workspace · Toronto, Ontario</p><h2>A beautiful wedding, thoughtfully planned.</h2><p>Spring 2028 · Scarborough + up to 60 minutes · CAD</p></div><div class="tw-actions"><button id="tw-start" class="tw-btn tw-btn-header" type="button">Start blank VowSuite plan</button><button id="tw-export" class="tw-btn tw-btn-header" type="button">Export backup</button></div></header>
      <div class="tw-kpis" id="tw-kpis" aria-live="polite"></div>
      <div class="tw-tabs" role="tablist" aria-label="Toronto planning tools">
        <button class="tw-tab" data-tw-tab="venues" role="tab" type="button">Venue comparison</button>
        <button class="tw-tab" data-tw-tab="budget" role="tab" type="button">Budget planner</button>
        <button class="tw-tab" data-tw-tab="tasks" role="tab" type="button">2028 checklist</button>
        <button class="tw-tab" data-tw-tab="settings" role="tab" type="button">Wedding settings</button>
      </div>
      <div id="tw-notice" role="status" aria-live="polite"></div>
      <div id="tw-pane-venues" class="tw-pane"></div><div id="tw-pane-budget" class="tw-pane"></div><div id="tw-pane-tasks" class="tw-pane"></div><div id="tw-pane-settings" class="tw-pane"></div>
      <p class="tw-footer">Planning estimates only. Confirm each venue's eligible charges, HST treatment, administration fees, tips, guaranteed minimums and deadlines against its written contract. Local-only storage in this browser; export backups regularly. The provided VowSuite cloud sync configuration should not be used for sensitive guest data without proper authentication and restrictive access policies.</p>`;
    workspace.appendChild(section);
    if(window.lucide?.createIcons)window.lucide.createIcons();
    return true;
  }
  function renderKpis(){
    const venueCosts=state.venues.map(v=>calc(v).total);const lowest=venueCosts.length?Math.min(...venueCosts):null;
    const booked=state.venues.find(v=>v.status==='Booked');const bookedCost=booked?calc(booked).total:null;
    const categories=state.allocations.reduce((s,x)=>s+x.amount,0);
    const vals=[
      ['Total wedding budget',money(state.settings.budget),`${state.settings.guests} guests · CAD`],
      ['Venue / catering allowance',money(getAllocation('venue')),'Includes admin fees + HST'],
      ['Lowest venue quotation',lowest===null?'No quotes yet':money(lowest),`${state.venues.length} venue${state.venues.length===1?'':'s'} compared`],
      [booked?'Balance after booked venue':'Unallocated plan amount',money(booked?state.settings.budget-bookedCost:state.settings.budget-categories),booked?'For everything else':'Budget minus category allocations']
    ];
    $('#tw-kpis').innerHTML=vals.map(([label,val,note])=>`<article class="tw-kpi"><span class="tw-label">${esc(label)}</span><strong>${esc(val)}</strong><small>${esc(note)}</small></article>`).join('');
  }
  const getAllocation=id=>state.allocations.find(a=>a.id===id)?.amount||0;
  function getFormMarkup(v){
    const draft=v||{id:'',name:'',area:'',status:'Shortlisted',guests:state.settings.guests,perGuest:0,room:0,bar:0,extras:0,minimum:0,admin:state.settings.admin,hst:state.settings.hst,adminScope:'food',taxAdmin:true,deposit:0,balanceDue:'',drive:0,packageName:'',starter:'',main:'',dessert:'',lateNight:'',notes:''};
    const field=(key,label,type='text',step='any',span='')=>`<label class="${span}">${esc(label)}<input name="${key}" type="${type}" ${type==='number'?`min="0" step="${step}"`:''} value="${esc(draft[key])}" ${key==='name'?'required maxlength="180"':''}></label>`;
    return `<section class="tw-card" id="tw-venue-editor"><div class="tw-card-head"><div><h3>${v?'Edit venue quote':'Add a venue quote'}</h3><p class="tw-hint">Use actual written quotes. This never invents Toronto venue prices.</p></div>${v?'<button class="tw-btn tw-btn-quiet" type="button" id="tw-cancel-edit">Cancel edit</button>':''}</div>
      <form id="tw-venue-form"><input type="hidden" name="id" value="${esc(draft.id)}"><div class="tw-form-grid">
        ${field('name','Venue name')}${field('area','Neighbourhood / address')}${field('guests','Quoted guest count','number','1')}
        <label>Stage<select name="status">${['Shortlisted','Contacted','Visited','Proposal received','Preferred','Booked','Rejected'].map(st=>`<option value="${esc(st)}" ${draft.status===st?'selected':''}>${esc(st)}</option>`).join('')}</select></label>
        ${field('packageName','Catering / package title')}${field('perGuest','Price per guest (CAD)','number','0.01')}${field('room','Room rental / site fee','number','0.01')}${field('bar','Bar / drinks fixed cost','number','0.01')}
        ${field('extras','Additional fixed items','number','0.01')}${field('minimum','Food + bar minimum spend','number','0.01')}${field('admin','Admin fee %','number','0.01')}${field('hst','HST / sales tax %','number','0.01')}
        <label>Admin fee applies to<select name="adminScope"><option value="food" ${draft.adminScope==='food'?'selected':''}>Food + bar (after minimum)</option><option value="all" ${draft.adminScope==='all'?'selected':''}>Whole pre-tax subtotal</option></select></label>
        <label class="tw-check"><input name="taxAdmin" type="checkbox" ${draft.taxAdmin?'checked':''}> HST also applies to admin fee</label>
        ${field('drive','Drive from Scarborough (minutes)','number','1')}${field('deposit','Deposit already paid (CAD)','number','0.01')}${field('balanceDue','Final balance due','date')}
        ${field('starter','Starter selection')}${field('main','Main selection')}${field('dessert','Dessert selection')}${field('lateNight','Late-night food')}
        <label class="tw-span4">Quote notes, exclusions, service and gratuity terms<textarea name="notes" rows="3" maxlength="1500">${esc(draft.notes)}</textarea></label>
      </div><div class="tw-summary" id="tw-live-preview" aria-live="polite"></div>
      <div class="tw-row" style="margin-top:16px"><button class="tw-btn tw-btn-primary" type="submit">${v?'Save changes':'Save venue quote'}</button><span class="tw-mini">Total includes quote assumptions and excludes extra tips unless recorded in the quote.</span></div>
      </form></section>`;
  }
  function dataFromForm(form){
    const d=new FormData(form),old=state.venues.find(v=>v.id===String(d.get('id')))||{};
    const out={...old,id:String(d.get('id')||uid())};
    for(const key of ['name','area','status','packageName','starter','main','dessert','lateNight','notes','balanceDue','adminScope'])out[key]=String(d.get(key)||'').trim();
    for(const key of ['guests','perGuest','room','bar','extras','minimum','admin','hst','drive','deposit'])out[key]=max0(d.get(key));
    out.guests=Math.max(1,Math.round(out.guests));out.taxAdmin=d.has('taxAdmin');out.updated=new Date().toISOString().slice(0,10);
    return out;
  }
  function renderLive(){const form=$('#tw-venue-form');if(!form)return;
    const v=dataFromForm(form),c=calc(v);
    $('#tw-live-preview').innerHTML=`<div class="tw-summaryline"><span>Food + bar (${v.guests} guests, minimum applied)</span><strong>${money(c.fnb)}</strong></div>
      <div class="tw-summaryline"><span>Pre-tax subtotal including rental and extras</span><strong>${money(c.subtotal)}</strong></div>
      <div class="tw-summaryline"><span>Administration fee (${n(v.admin)}%)</span><strong>${money(c.fee)}</strong></div>
      <div class="tw-summaryline"><span>HST (${n(v.hst)}%)</span><strong>${money(c.hst)}</strong></div>
      <div class="tw-summaryline"><span>Estimated all-in total</span><strong>${decMoney(c.total)}</strong></div>
      <div class="tw-row tw-between" style="margin-top:10px"><span class="tw-mini">${decMoney(c.perGuest)} / guest · ${money(c.balance)} balance after deposit</span><strong class="${c.total>getAllocation('venue')?'tw-bad':'tw-good'}">${c.total>getAllocation('venue')?'Over venue allocation':'Within venue allocation'}</strong></div>`;
  }
  function renderVenues(){
    const sorted=[...state.venues].sort((a,b)=>calc(a).total-calc(b).total);
    const rows=sorted.map(v=>{const c=calc(v),over=c.total>getAllocation('venue'),dist=v.drive>state.settings.drive;
      return `<tr><td><strong>${esc(v.name)}</strong><small>${esc(v.area)} · ${esc(v.status)}</small></td><td>${esc(v.guests)}</td><td>${money(v.perGuest)}</td><td><strong>${money(c.total)}</strong><small>${money(c.perGuest)} per guest</small></td><td class="${over?'tw-bad':'tw-good'}">${over?money(c.total-getAllocation('venue'))+' over':'In range'}</td><td>${v.drive?esc(v.drive)+' min'+(dist?' ⚠':''):'Not entered'}</td><td><div class="tw-table-actions"><button type="button" data-tw-edit="${esc(v.id)}">Edit</button><button type="button" data-tw-sync="${esc(v.id)}">To VowSuite</button><button type="button" data-tw-delete="${esc(v.id)}">Delete</button></div></td></tr>`;
    }).join('');
    const cards=sorted.slice(0,3).map((v,i)=>{const c=calc(v);return `<article><span class="tw-chip">${i===0?'Lowest estimated cost':'Option '+(i+1)}</span><h4 style="margin-top:12px">${esc(v.name)}</h4><div class="tw-price">${money(c.total)}</div><p class="tw-mini">${esc(v.status)} · ${c.perGuest.toFixed(0)} CAD / guest · deposit ${money(v.deposit)}</p><p class="tw-mini">${esc(v.packageName||'Package details not entered')}</p></article>`;}).join('');
    $('#tw-pane-venues').innerHTML=`<div class="tw-card"><div class="tw-card-head"><div><h3>Compare Toronto-area venues</h3><p class="tw-hint">All-in cost, admin fees, HST, menu packages and deposits in one place. Sorted by estimated total.</p></div><button type="button" class="tw-btn" id="tw-csv">Export CSV</button></div>
    ${sorted.length?`<div class="tw-compare">${cards}</div>`:'<div class="tw-empty">No venue quotes entered yet. Add the first venue below to see an apples-to-apples comparison.</div>'}
    </div><section class="tw-card"><div class="tw-card-head"><div><h3>Venue cost comparison</h3><p class="tw-hint">Prices are estimates, not booking availability or confirmed offers.</p></div></div><div class="tw-table-wrap"><table><thead><tr><th>Venue</th><th>Guests</th><th>Package/guest</th><th>Estimated all-in</th><th>vs allocation</th><th>Drive</th><th>Actions</th></tr></thead><tbody>${rows||'<tr><td colspan="7" class="tw-empty">No quote rows yet</td></tr>'}</tbody></table></div></section>${getFormMarkup(state.venues.find(v=>v.id===editingId))}
      <p class="tw-alert">Calculation assumption: food + bar is raised to the quoted minimum if necessary; the administration fee applies to the selected base; HST applies to the pre-tax subtotal plus the admin fee when checked. Not every charge is necessarily taxable; verify the contract. A gratuity can be included in Additional fixed items only if appropriate to that quote.</p>`;
    renderLive();
  }
  function renderBudget(){
    const allocation=state.allocations.reduce((s,a)=>s+a.amount,0),budget=state.settings.budget;
    const overshoot=allocation>budget,done=allocation/budget*100;
    const booked=state.venues.find(v=>v.status==='Booked');const bookedQuote=booked?calc(booked).total:0;
    const rows=state.allocations.map(a=>`<div class="tw-statrow"><span>${esc(a.label)}</span><label style="font-size:11px">CAD<input type="number" min="0" step="100" class="tw-budget-input" data-tw-allocation="${esc(a.id)}" value="${esc(a.amount)}"></label></div>`).join('');
    $('#tw-pane-budget').innerHTML=`<div class="tw-grid2"><section class="tw-card"><h3>Allocate the ${money(budget)} budget</h3><p class="tw-hint">These are planning targets, not claimed market prices. Edit each line to fit the couple's priorities.</p>${rows}
      <div class="tw-statrow"><strong>Total allocated</strong><strong>${money(allocation)}</strong></div><div class="tw-statrow"><strong>Unallocated / overallocated</strong><strong class="${overshoot?'tw-bad':'tw-good'}">${money(budget-allocation)}</strong></div><div class="tw-progress"><span style="width:${Math.min(100,Math.max(0,done))}%"></span></div><p class="tw-mini">${done.toFixed(1)}% of target allocated. Includes a ${money(getAllocation('reserve'))} reserve for unexpected costs.</p>
      <button class="tw-btn tw-btn-primary" type="button" id="tw-apply-allocations">Save allocation changes</button></section>
      <section class="tw-card"><h3>Financial readiness</h3><p class="tw-hint">Review an all-in venue quote before committing deposits.</p>
      <div class="tw-statrow"><span>Venue & catering cap</span><strong>${money(getAllocation('venue'))}</strong></div>
      <div class="tw-statrow"><span>Booked venue quote</span><strong>${booked?money(bookedQuote):'Not booked'}</strong></div>
      <div class="tw-statrow"><span>Headroom after booked venue</span><strong>${booked?money(budget-bookedQuote):'—'}</strong></div>
      <div class="tw-statrow"><span>Per-guest full wedding budget</span><strong>${money(budget/state.settings.guests)}</strong></div>
      <p class="tw-alert" style="margin-top:20px">The base VowSuite budget should record tax-inclusive totals for booked expenses. Leave its global finance adjustment rates at zero for those lines, or it may add taxes/fees twice. This extension never changes the original guest list or existing expenses automatically.</p></section></div>`;
  }
  function renderTasks(){
    const done=state.tasks.filter(x=>x.done).length;
    $('#tw-pane-tasks').innerHTML=`<section class="tw-card"><div class="tw-card-head"><div><h3>Spring 2028 planning checklist</h3><p class="tw-hint">Suggested target dates, not vendor commitments or a confirmed wedding date. Adjust dates in VowSuite after importing.</p></div><div class="tw-row"><span class="tw-chip">${done} / ${state.tasks.length} done</span><button type="button" class="tw-btn" id="tw-tasks-sync">Copy tasks to VowSuite</button></div></div>
      ${state.tasks.map(t=>`<label class="tw-task ${t.done?'tw-done':''}"><input type="checkbox" data-tw-task="${esc(t.id)}" ${t.done?'checked':''}><span><strong>${esc(t.title)}</strong><small>Suggested by ${esc(t.due)} · ${esc(t.priority)} priority</small></span></label>`).join('')}
      <div class="tw-row" style="margin-top:18px"><button class="tw-btn" id="tw-reset-tasks" type="button">Reset suggested checklist</button></div></section>`;
  }
  function renderSettings(){const s=state.settings;
    $('#tw-pane-settings').innerHTML=`<section class="tw-card"><h3>Wedding assumptions</h3><p class="tw-hint">Configured for a wedding near Toronto. The 2028 date is only a planning placeholder until a venue is booked.</p><form id="tw-settings-form"><div class="tw-form-grid">
      <label>Overall budget (CAD)<input name="budget" type="number" min="0" step="100" value="${esc(s.budget)}"></label>
      <label>Expected guest count<input name="guests" type="number" min="1" step="1" value="${esc(s.guests)}"></label>
      <label>Tentative wedding date<input name="date" type="date" value="${esc(s.date)}"></label>
      <label>Maximum drive (minutes)<input name="drive" type="number" min="0" step="1" value="${esc(s.drive)}"></label>
      <label>Default Ontario HST %<input name="hst" type="number" min="0" step="0.01" value="${esc(s.hst)}"></label>
      <label>Default venue admin fee %<input name="admin" type="number" min="0" step="0.01" value="${esc(s.admin)}"></label>
      <label>Venue selection target<input name="deadline" type="date" value="${esc(s.deadline)}"></label>
      </div><div class="tw-row" style="margin-top:16px"><button class="tw-btn tw-btn-primary" type="submit">Save wedding settings</button><span class="tw-mini">Changing defaults does not retroactively override saved venue quotes.</span></div></form></section>
      <section class="tw-card"><h3>Data & privacy</h3><p class="tw-hint">The Toronto extension stores its venues and checklist separately in browser local storage. Nothing is uploaded by this add-on.</p><div class="tw-row"><button class="tw-btn" id="tw-export-settings" type="button">Export Toronto JSON</button><button class="tw-btn" id="tw-import-trigger" type="button">Import Toronto JSON</button><input id="tw-import-file" type="file" accept="application/json" hidden><button class="tw-btn" id="tw-reset" type="button">Reset Toronto workspace</button></div><p class="tw-alert" style="margin-top:12px">Save backups somewhere private. The original VowSuite export does not include this extension's separate data, so export both when migrating devices. Do not use VowSuite's sample permissive Supabase sharing policy for private wedding data.</p></section>`;
  }
  function render(){if(!$('#toronto'))return;renderKpis();
    $$('.tw-tab').forEach(el=>el.setAttribute('aria-selected',el.dataset.twTab===tab?'true':'false'));
    $$('.tw-pane').forEach(el=>el.hidden=el.id!==`tw-pane-${tab}`);
    if(tab==='venues')renderVenues();if(tab==='budget')renderBudget();if(tab==='tasks')renderTasks();if(tab==='settings')renderSettings();
  }
  function changeTab(next){tab=next;editingId=null;render();}
  function csvEscape(v){let s=String(v??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
  function download(name,data,type){const blob=new Blob([data],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
  function exportJSON(){download('toronto-wedding-planning-backup.json',JSON.stringify(state,null,2),'application/json');notice('Toronto workspace backup exported. Also export the original VowSuite plan separately.');}
  function exportCSV(){const head=['Venue','Area','Status','Guests','Package','Price per guest','Room rental','Bar','Extras','F&B minimum','Admin percent','HST percent','Admin fee taxable','Admin scope','Pre-tax subtotal','Admin fee','HST amount','Estimated all-in CAD','All-in per guest','Deposit paid','Balance','Balance due','Drive minutes','Starter','Main','Dessert','Late night','Notes'];
    const rows=state.venues.map(v=>{const c=calc(v);return [v.name,v.area,v.status,v.guests,v.packageName,v.perGuest,v.room,v.bar,v.extras,v.minimum,v.admin,v.hst,v.taxAdmin?'Yes':'No',v.adminScope,c.subtotal,c.fee,c.hst,c.total,c.perGuest,v.deposit,c.balance,v.balanceDue,v.drive,v.starter,v.main,v.dessert,v.lateNight,v.notes].map(csvEscape).join(',')});
    download('toronto-venue-comparison.csv','\ufeff'+head.map(csvEscape).join(',')+'\r\n'+rows.join('\r\n'),'text/csv;charset=utf-8;');notice('Venue comparison exported as CSV.');
  }
  function baseAppReady(){return typeof plan !== 'undefined' && typeof window.render==='function' && typeof createBlankPlan==='function';}
  function syncVenue(id){const v=state.venues.find(x=>x.id===id);if(!v){notice('Venue not found.',true);return;}
    if(!baseAppReady()){notice('Open the installed VowSuite app to sync this venue. Preview mode cannot update its budget.',true);return;}
    const c=calc(v);
    if(v.status!=='Booked'&&!confirm(`This quote is marked "${v.status}", not Booked. Add it as a provisional expense anyway?`))return;
    if(!confirm(`Replace any previously synced Toronto venue in VowSuite with ${v.name} at ${money(c.total)} all-in? This will not affect unrelated expenses.`))return;
    // The regular VowSuite plan is intentionally only modified after explicit confirmation.
    plan.expenses=plan.expenses.filter(e=>!e.torontoVenueId);
    plan.vendors=plan.vendors.filter(e=>!e.torontoVenueId);
    plan.expenses.push({id:uid(),torontoVenueId:v.id,category:'Venue',item:`${v.name} · ${v.packageName||'Catering package'} (all-in quote)`,estimated:Math.round(c.total*100)/100,actual:Math.round(c.total*100)/100,paid:c.paid,dueDate:v.balanceDue||state.settings.date});
    plan.vendors.push({id:uid(),torontoVenueId:v.id,name:v.name,category:'Venue',stage:v.status==='Booked'?'Booked':'Shortlisted',owner:'Planner',contact:v.area||'',contract:v.status==='Booked'?'Review':'Missing',insurance:'Pending',quote:Math.round(c.total*100)/100,deposit:c.paid,balanceDue:Math.round(c.balance*100)/100,nextFollowUp:v.balanceDue||state.settings.deadline});
    window.render();notice(`${v.name} synced to the original VowSuite budget and vendor records. Do not apply global tax again to this tax-inclusive line.`);
  }
  function syncTasks(){if(!baseAppReady()){notice('Task sync is only available in the installed VowSuite app.',true);return;}
    let added=0;for(const t of state.tasks){if(plan.tasks.some(x=>x.torontoTaskId===t.id))continue;plan.tasks.push({id:uid(),torontoTaskId:t.id,title:t.title,owner:'Both',due:t.due,priority:t.priority,dependency:'',stage:t.done?'Done':'Backlog',done:t.done});added++;}
    window.render();notice(`Added ${added} new suggested tasks to VowSuite. Existing synced tasks were not duplicated.`);
  }
  function bind(){const root=$('#toronto');
    root.addEventListener('click',e=>{
      const tabEl=e.target.closest('[data-tw-tab]');if(tabEl){changeTab(tabEl.dataset.twTab);return;}
      const edit=e.target.closest('[data-tw-edit]');if(edit){tab='venues';editingId=edit.dataset.twEdit;render();$('#tw-venue-editor').scrollIntoView({behavior:'smooth',block:'start'});return;}
      const del=e.target.closest('[data-tw-delete]');if(del){const v=state.venues.find(x=>x.id===del.dataset.twDelete);if(v&&confirm(`Delete ${v.name} from the Toronto comparison? It will not delete previously synced original VowSuite expenses.`)){state.venues=state.venues.filter(x=>x.id!==v.id);save();render();notice('Venue deleted from comparison.');}return;}
      const sync=e.target.closest('[data-tw-sync]');if(sync){syncVenue(sync.dataset.twSync);return;}
      if(e.target.closest('#tw-cancel-edit')){editingId=null;render();return;}
      if(e.target.closest('#tw-csv')){exportCSV();return;}
      if(e.target.closest('#tw-export')||e.target.closest('#tw-export-settings')){exportJSON();return;}
      if(e.target.closest('#tw-tasks-sync')){syncTasks();return;}
      if(e.target.closest('#tw-apply-allocations')){ $$('#tw-pane-budget [data-tw-allocation]').forEach(el=>{const a=state.allocations.find(x=>x.id===el.dataset.twAllocation);if(a)a.amount=max0(el.value);});save();render();notice('Allocation plan saved.');return;}
      if(e.target.closest('#tw-reset-tasks')){if(confirm('Reset the suggested checklist statuses?')){state.tasks=taskDefaults.map(x=>({...x}));save();render();}return;}
      if(e.target.closest('#tw-import-trigger')){$('#tw-import-file')?.click();return;}
      if(e.target.closest('#tw-reset')){if(confirm('Delete all Toronto quotes, allocations and checklist progress stored in this browser? Export a backup first.')){state=defaults();editingId=null;save();render();notice('Toronto workspace reset.');}return;}
      if(e.target.closest('#tw-start')){const btn=$('#newCoupleBtn');if(btn){btn.click();notice('Use VowSuite’s New couple workflow. The blank plan defaults to a tentative spring 2028 date.');}else notice('Open this extension inside VowSuite to start its blank plan.',true);}
    });
    root.addEventListener('submit',e=>{
      if(e.target.matches('#tw-venue-form')){e.preventDefault();const v=dataFromForm(e.target);if(!v.name){notice('Enter a venue name.',true);return;}const idx=state.venues.findIndex(x=>x.id===v.id);if(idx<0)state.venues.push(v);else state.venues[idx]=v;editingId=null;save();render();notice(`Saved quote for ${v.name}.`);}
      if(e.target.matches('#tw-settings-form')){e.preventDefault();const d=new FormData(e.target);for(const key of ['budget','guests','drive','hst','admin'])state.settings[key]=max0(d.get(key));state.settings.guests=Math.max(1,Math.round(state.settings.guests));state.settings.date=String(d.get('date')||datePlaceholder);state.settings.deadline=String(d.get('deadline')||'');save();render();notice('Wedding settings saved. Existing quotes retain their own admin/HST assumptions.');}
    });
    root.addEventListener('input',e=>{if(e.target.closest('#tw-venue-form'))renderLive();});
    root.addEventListener('change',async e=>{
      const task=e.target.closest('[data-tw-task]');if(task){const t=state.tasks.find(t=>t.id===task.dataset.twTask);if(t){t.done=task.checked;save();render();}return;}
      if(e.target.id==='tw-import-file'&&e.target.files?.[0]){const f=e.target.files[0];if(f.size>2_000_000){notice('Backup too large (2 MB maximum).',true);return;}
        try{const incoming=JSON.parse(await f.text());if(!incoming||!incoming.settings||!Array.isArray(incoming.venues)||!Array.isArray(incoming.allocations))throw new Error('Incorrect Toronto backup format');if(!confirm('Replace the Toronto workspace in this browser with the imported file?'))return;state=normalize(incoming);save();render();notice('Toronto workspace imported successfully.');}catch(err){notice('Import failed: '+err.message,true);}finally{e.target.value='';}
      }
    });
  }
  window.VowSuiteTorontoBridge = Object.freeze({
    snapshot: () => JSON.parse(JSON.stringify(state)),
    restore: data => { state=normalize(data); editingId=null; save(); render(); }
  });
  if(layout()){bind();save();render();}
})();

