const STORAGE_KEY = "vowsuite-plan-v2";
const LEGACY_STORAGE_KEY = "vowsuite-plan-v1";
const COUPLES_STORAGE_KEY = "vowsuite-couples-v1";
const CLOUD_SYNC_STORAGE_KEY = "vowsuite-cloud-sync-v1";
const APP_VERSION = "v1.4.0";
const money = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
const today = new Date();

const demoPlan = {
  couple: "Amelia Chen and Sofia Martinez",
  venue: "The Glasshouse Conservatory",
  weddingDate: "2026-10-17",
  budgetTarget: 85000,
  guestTarget: 120,
  style: "Modern garden formal",
  weights: { guests: 25, tasks: 25, vendors: 25, finance: 25 },
  budgetCaps: { Venue: 32000, Food: 22000, Floral: 10000, Photo: 10000, Music: 8500, Fashion: 6000 },
  financeModel: { taxRate: 8.25, serviceRate: 20, tipRate: 3 },
  packetSections: { summary: true, risks: true, timeline: true, vendors: true, photos: true },
  portal: { pin: "1026", unlocked: false, share: { budget: false, vendors: true, timeline: true, photos: true, guests: false, seating: true } },
  snapshots: [],
  attachments: [
    { id: uid(), name: "Glasshouse signed agreement.pdf", area: "Contract", size: 482000, type: "application/pdf", addedAt: "2026-06-24" },
    { id: uid(), name: "Reception floor plan v2.png", area: "Floor plan", size: 934000, type: "image/png", addedAt: "2026-06-24" }
  ],
  profile: {
    planner: "Mina Rao, Principal Planner",
    rsvpDeadline: "2026-08-20",
    ceremonyTime: "16:30",
    receptionTime: "18:00",
    venueContact: "Nora Ellis, venue director",
    emergencyContact: "Daniel Chen - 555-0198"
  },
  decisions: [
    { title: "Late-night menu", owner: "Amelia", status: "Approved", note: "Truffle fries, churros, and espresso martinis." },
    { title: "Ceremony processional", owner: "Sofia", status: "Review", note: "String quartet options due next week." },
    { title: "Guest transport", owner: "Planner", status: "Open", note: "Need final shuttle count after RSVP cutoff." }
  ],
  guests: [
    { id: uid(), name: "Maya Patel", email: "maya@example.com", phone: "555-0111", group: "College friends", status: "Accepted", meal: "Vegetarian", partySize: 1, plusOne: "", inviteSent: "2026-06-18", inviteMethod: "Email", reminder: "No", tags: "VIP", notes: "No onions" },
    { id: uid(), name: "Jon Bell", email: "jon@example.com", phone: "555-0112", group: "Family - Chen", status: "Accepted", meal: "Chicken", partySize: 2, plusOne: "Ari Bell", inviteSent: "2026-06-18", inviteMethod: "Mail", reminder: "No", tags: "Family", notes: "" },
    { id: uid(), name: "Priya Bell", email: "", phone: "555-0113", group: "Family - Chen", status: "Maybe", meal: "Vegan", partySize: 1, plusOne: "", inviteSent: "2026-06-18", inviteMethod: "Mail", reminder: "Yes", tags: "Accessibility", notes: "Travel pending" },
    { id: uid(), name: "Noah Reid", email: "noah@example.com", phone: "", group: "Work", status: "Invited", meal: "Fish", partySize: 1, plusOne: "Pending", inviteSent: "2026-06-19", inviteMethod: "Email", reminder: "Yes", tags: "", notes: "" },
    { id: uid(), name: "Elena Cruz", email: "elena@example.com", phone: "555-0114", group: "Family - Martinez", status: "Accepted", meal: "Chicken", partySize: 2, plusOne: "Mateo Cruz", inviteSent: "2026-06-17", inviteMethod: "Mail", reminder: "No", tags: "Family", notes: "Near aisle" },
    { id: uid(), name: "Marco Cruz", email: "", phone: "", group: "Family - Martinez", status: "Declined", meal: "Fish", partySize: 1, plusOne: "", inviteSent: "2026-06-17", inviteMethod: "Mail", reminder: "No", tags: "", notes: "" },
    { id: uid(), name: "Talia Brooks", email: "talia@example.com", phone: "555-0115", group: "Wedding party", status: "Accepted", meal: "Vegan", partySize: 1, plusOne: "", inviteSent: "2026-06-15", inviteMethod: "Text", reminder: "No", tags: "Toast", notes: "Toast" },
    { id: uid(), name: "Iris Wang", email: "iris@example.com", phone: "555-0116", group: "Wedding party", status: "Accepted", meal: "Fish", partySize: 1, plusOne: "", inviteSent: "2026-06-15", inviteMethod: "Text", reminder: "No", tags: "VIP", notes: "" }
  ],
  expenses: [
    { id: uid(), category: "Venue", item: "Venue rental and service", estimated: 28000, actual: 30000, paid: 15000, dueDate: "2026-09-01" },
    { id: uid(), category: "Food", item: "Dinner and late-night", estimated: 21000, actual: 19800, paid: 6000, dueDate: "2026-09-15" },
    { id: uid(), category: "Floral", item: "Ceremony and reception", estimated: 9000, actual: 11200, paid: 2500, dueDate: "2026-08-15" },
    { id: uid(), category: "Photo", item: "Photo and video", estimated: 9500, actual: 9500, paid: 9500, dueDate: "2026-07-10" },
    { id: uid(), category: "Music", item: "Band and DJ", estimated: 7800, actual: 7200, paid: 3000, dueDate: "2026-10-01" },
    { id: uid(), category: "Fashion", item: "Attire and alterations", estimated: 5200, actual: 4700, paid: 4700, dueDate: "2026-07-20" }
  ],
  vendors: [
    { id: uid(), name: "Glasshouse Events", category: "Venue", stage: "Booked", owner: "Planner", contact: "Nora Ellis", contract: "Signed", insurance: "Received", quote: 30000, deposit: 15000, balanceDue: 15000, nextFollowUp: "2026-08-15" },
    { id: uid(), name: "Olive Stem Studio", category: "Floral", stage: "Proposal", owner: "Sofia", contact: "Lena Ortiz", contract: "Review", insurance: "Pending", quote: 11200, deposit: 2500, balanceDue: 8700, nextFollowUp: "2026-07-12" },
    { id: uid(), name: "Northlight Photo", category: "Photo", stage: "Booked", owner: "Amelia", contact: "Theo March", contract: "Signed", insurance: "Received", quote: 9500, deposit: 9500, balanceDue: 0, nextFollowUp: "2026-09-12" },
    { id: uid(), name: "Juniper Quartet", category: "Ceremony music", stage: "Shortlisted", owner: "Sofia", contact: "Ana Meier", contract: "Missing", insurance: "Pending", quote: 2400, deposit: 0, balanceDue: 2400, nextFollowUp: "2026-07-05" },
    { id: uid(), name: "Toast & Thyme", category: "Catering", stage: "Paid", owner: "Planner", contact: "Ira Singh", contract: "Signed", insurance: "Received", quote: 19800, deposit: 19800, balanceDue: 0, nextFollowUp: "2026-09-15" }
  ],
  tasks: [
    { id: uid(), title: "Finalize invitation proof", owner: "Amelia", due: "2026-07-05", priority: "High", dependency: "Guest list lock", stage: "This Week", done: false },
    { id: uid(), title: "Confirm floral proposal", owner: "Sofia", due: "2026-07-12", priority: "High", dependency: "Floral quote", stage: "Waiting", done: false },
    { id: uid(), title: "Book shuttle blocks", owner: "Planner", due: "2026-08-01", priority: "Medium", dependency: "RSVP count", stage: "Backlog", done: false },
    { id: uid(), title: "Menu tasting feedback", owner: "Both", due: "2026-07-20", priority: "Medium", dependency: "", stage: "Done", done: true },
    { id: uid(), title: "Build ceremony script", owner: "Officiant", due: "2026-09-05", priority: "Low", dependency: "Readings selected", stage: "Backlog", done: false }
  ],
  runSheet: [
    { id: uid(), time: "12:00", title: "Planner and venue load-in", location: "Service entrance", owner: "Planner", vendor: "Venue", notes: "Confirm floor plan and weather call." },
    { id: uid(), time: "14:00", title: "Wedding party photos", location: "Conservatory garden", owner: "Photo lead", vendor: "Northlight Photo", notes: "Bouquets delivered before first look." },
    { id: uid(), time: "16:30", title: "Ceremony begins", location: "Atrium", owner: "Officiant", vendor: "Juniper Quartet", notes: "Cue processional after family seating." },
    { id: uid(), time: "18:00", title: "Reception doors open", location: "Glass hall", owner: "Venue captain", vendor: "Toast & Thyme", notes: "Bar open, passed snacks begin." },
    { id: uid(), time: "20:15", title: "Toasts", location: "Main dining room", owner: "Planner", vendor: "Band", notes: "Keep to 18 minutes total." }
  ],
  events: [
    { id: uid(), name: "Welcome drinks", date: "2026-10-16", start: "19:00", location: "Hotel roof terrace", owner: "Planner" },
    { id: uid(), name: "Ceremony and reception", date: "2026-10-17", start: "16:30", location: "The Glasshouse Conservatory", owner: "Venue captain" },
    { id: uid(), name: "Farewell brunch", date: "2026-10-18", start: "10:30", location: "Garden room", owner: "Family host" }
  ],
  tables: [
    { id: uid(), name: "Table 1", seats: ["Maya Patel", "Jon Bell", "Elena Cruz", "Talia Brooks", "", ""] },
    { id: uid(), name: "Table 2", seats: ["Iris Wang", "", "", "", "", ""] }
  ],
  documents: [
    { id: uid(), name: "Master timeline", owner: "Planner", status: "Review" },
    { id: uid(), name: "Floor plan", owner: "Venue", status: "Draft" },
    { id: uid(), name: "Photo shot list", owner: "Amelia", status: "Approved" },
    { id: uid(), name: "Vendor contact sheet", owner: "Planner", status: "Sent" }
  ],
  ceremony: [
    { id: uid(), role: "Processional", name: "Wedding party entrance", music: "Juniper Quartet cue 1" },
    { id: uid(), role: "Reading", name: "Maya Patel", music: "Printed copy on lectern" }
  ],
  music: [
    { id: uid(), moment: "First dance", song: "At Last", status: "Approved" },
    { id: uid(), moment: "Dance floor", song: "Do not play explicit versions", status: "Do not play" }
  ],
  photos: [
    { id: uid(), shot: "Couple with both immediate families", people: "Family groups", priority: "Must-have" },
    { id: uid(), shot: "Reception room before entry", people: "No guests", priority: "Detail" }
  ],
  photoGroups: [
    { id: uid(), group: "Immediate families", people: "Couple, parents, siblings" },
    { id: uid(), group: "Wedding party", people: "Couple, attendants, officiant" }
  ],
  packing: [
    { id: uid(), item: "Welcome sign", owner: "Planner", status: "Pack" },
    { id: uid(), item: "Emergency kit", owner: "Planner", status: "Loaded" }
  ],
  zones: [
    { id: uid(), zone: "Ceremony atrium", owner: "Venue", notes: "70 chairs, aisle florals" },
    { id: uid(), zone: "Escort card table", owner: "Planner", notes: "Alphabetized cards and candles" }
  ],
  weatherPlan: [
    { id: uid(), item: "Rain ceremony backup held", done: true },
    { id: uid(), item: "Umbrella stand and towel station assigned", done: false },
    { id: uid(), item: "Heat/cold guest comfort plan confirmed", done: false }
  ],
  accessibility: [
    { id: uid(), item: "Step-free guest route confirmed", done: true },
    { id: uid(), item: "Reserved seating for mobility needs", done: true },
    { id: uid(), item: "Dietary and sensory notes shared with catering", done: false }
  ],
  seatingRules: [
    { id: uid(), rule: "Keep Family - Chen near ceremony aisle", type: "Accessibility" },
    { id: uid(), rule: "Keep wedding party together near dance floor", type: "VIP" }
  ],
  leads: [
    { id: uid(), name: "Lena Park and Omar Smith", date: "2027-05-22", budget: 62000, style: "Editorial city wedding", stage: "Discovery" }
  ],
  proposals: [
    { id: uid(), name: "Full-service planning", price: 12500, scope: "Design, vendor management, production, and wedding weekend lead", status: "Sent" }
  ],
  invoices: [
    { id: uid(), label: "Planning retainer", amount: 4500, due: "2026-07-01", status: "Paid" },
    { id: uid(), label: "Production balance", amount: 8000, due: "2026-09-15", status: "Sent" }
  ],
  moodboard: [
    { id: uid(), label: "Palette", value: "Ivory, fern, black accents" },
    { id: uid(), label: "Texture", value: "Linen, glass, brushed brass" },
    { id: uid(), label: "Floral", value: "Architectural greenery and white orchids" }
  ],
  floorPlan: [
    { id: uid(), label: "Ceremony", x: 12, y: 14, w: 34, h: 20 },
    { id: uid(), label: "Dinner", x: 52, y: 18, w: 34, h: 24 },
    { id: uid(), label: "Band", x: 58, y: 62, w: 22, h: 14 },
    { id: uid(), label: "Bar", x: 14, y: 66, w: 24, h: 12 }
  ],
  selectedVendorId: "",
  changeLog: [
    { at: "2026-06-24 15:10", action: "Created professional wedding plan" }
  ]
};

let plan = loadPlan();
let undoStack = [];
let draggedSeat = null;
let saveTimer = null;
let savedCouples = loadSavedCouples();
let cloudSyncTimer = null;
let cloudSyncBusy = false;
let cloudStatus = { state: "idle", message: "Local storage is active. Add cloud settings when you want shared access." };

function createBlankPlan() {
  const nextYear = today.getFullYear() + 1;
  return {
    couple: "New Couple",
    venue: "Venue TBD",
    weddingDate: "2028-05-20",
    budgetTarget: 55000,
    guestTarget: 150,
    style: "",
    weights: { guests: 25, tasks: 25, vendors: 25, finance: 25 },
    budgetCaps: {},
    financeModel: { taxRate: 0, serviceRate: 0, tipRate: 0 },
    packetSections: { summary: true, risks: true, timeline: true, vendors: true, photos: true },
    portal: { pin: "0000", unlocked: false, share: { budget: false, vendors: true, timeline: true, photos: true, guests: false, seating: true } },
    snapshots: [],
    attachments: [],
    profile: {
      planner: "",
      rsvpDeadline: "2028-03-20",
      ceremonyTime: "16:00",
      receptionTime: "18:00",
      venueContact: "",
      emergencyContact: ""
    },
    decisions: [],
    guests: [],
    expenses: [],
    vendors: [],
    tasks: [],
    runSheet: [],
    events: [],
    tables: [{ id: uid(), name: "Table 1", seats: ["", "", "", "", "", ""] }],
    documents: [],
    ceremony: [],
    music: [],
    photos: [],
    photoGroups: [],
    packing: [],
    zones: [],
    weatherPlan: [
      { id: uid(), item: "Weather backup decision date set", done: false },
      { id: uid(), item: "Guest comfort supplies assigned", done: false },
      { id: uid(), item: "Indoor/outdoor flip plan documented", done: false }
    ],
    accessibility: [
      { id: uid(), item: "Mobility route checked", done: false },
      { id: uid(), item: "Reserved seating identified", done: false },
      { id: uid(), item: "Dietary notes confirmed", done: false }
    ],
    seatingRules: [],
    leads: [],
    proposals: [],
    invoices: [],
    moodboard: [],
    floorPlan: [
      { id: uid(), label: "Ceremony", x: 12, y: 16, w: 32, h: 20 },
      { id: uid(), label: "Reception", x: 52, y: 20, w: 32, h: 24 },
      { id: uid(), label: "Bar", x: 16, y: 68, w: 22, h: 12 }
    ],
    selectedVendorId: "",
    changeLog: [{ at: new Date().toLocaleString(), action: "Started blank plan for a new couple" }]
  };
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function loadPlan() {
  const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
  return migratePlan(saved ? JSON.parse(saved) : structuredClone(demoPlan));
}

function loadSavedCouples() {
  try {
    return JSON.parse(localStorage.getItem(COUPLES_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSavedCouples() {
  localStorage.setItem(COUPLES_STORAGE_KEY, JSON.stringify(savedCouples));
}

function getCoupleSidesFrom(couple) {
  const names = String(couple || "Partner 1 and Partner 2")
    .split(/\s+(?:and|&|\+)\s+/i)
    .map(name => name.trim())
    .filter(Boolean);
  if (names.length >= 2) return names.slice(0, 2);
  return [names[0] || "Partner 1", "Partner 2"];
}

function getCoupleSides() {
  return getCoupleSidesFrom(plan?.couple);
}

function inferGuestSide(guest, couple) {
  const sides = getCoupleSidesFrom(couple);
  if (sides.includes(guest.side)) return guest.side;
  const haystack = `${guest.group || ""} ${guest.tags || ""} ${guest.notes || ""}`.toLowerCase();
  const matched = sides.find(side => side.toLowerCase().split(/\s+/).some(part => part.length > 2 && haystack.includes(part)));
  return matched || sides[0];
}

function renderGuestSideOptions() {
  const sideSelect = document.getElementById("guestSideSelect");
  if (!sideSelect) return;
  const current = sideSelect.value;
  const sides = getCoupleSides();
  sideSelect.innerHTML = sides.map(side => `<option ${side === current ? "selected" : ""}>${escapeHtml(side)}</option>`).join("");
}

function migratePlan(rawPlan) {
  const merged = { ...structuredClone(demoPlan), ...rawPlan };
  merged.weights = { ...demoPlan.weights, ...(rawPlan.weights || {}) };
  merged.budgetCaps = { ...demoPlan.budgetCaps, ...(rawPlan.budgetCaps || {}) };
  merged.financeModel = { ...demoPlan.financeModel, ...(rawPlan.financeModel || {}) };
  merged.packetSections = { ...demoPlan.packetSections, ...(rawPlan.packetSections || {}) };
  merged.portal = { ...demoPlan.portal, ...(rawPlan.portal || {}), share: { ...demoPlan.portal.share, ...(rawPlan.portal?.share || {}) }, unlocked: false };
  merged.snapshots = rawPlan.snapshots || [];
  merged.attachments = rawPlan.couple === demoPlan.couple && (!rawPlan.attachments || rawPlan.attachments.length === 0) ? demoPlan.attachments : rawPlan.attachments || [];
  merged.profile = { ...demoPlan.profile, ...(rawPlan.profile || {}) };
  merged.guests = (rawPlan.guests || demoPlan.guests).map(g => {
    const guest = { email: "", phone: "", side: "", partySize: 1, plusOne: "", inviteSent: "", inviteMethod: "Email", reminder: "No", tags: "", notes: "", ...g };
    guest.side = inferGuestSide(guest, merged.couple);
    return guest;
  });
  merged.expenses = (rawPlan.expenses || demoPlan.expenses).map(e => {
    const demoExpense = demoPlan.expenses.find(d => d.category === e.category && d.item === e.item) || {};
    const demoLikeLine = demoExpense.actual === e.actual && demoExpense.estimated === e.estimated;
    return {
      paid: 0,
      dueDate: merged.weddingDate,
      ...demoExpense,
      ...e,
      paid: e.paid === 0 && demoLikeLine ? demoExpense.paid : e.paid ?? demoExpense.paid ?? 0,
      dueDate: demoLikeLine && e.dueDate === merged.weddingDate ? demoExpense.dueDate : e.dueDate || demoExpense.dueDate || merged.weddingDate
    };
  });
  merged.vendors = (rawPlan.vendors || demoPlan.vendors).map(v => {
    const demoVendor = demoPlan.vendors.find(d => d.name === v.name) || {};
    return {
      contact: "",
      contract: "Missing",
      insurance: "Pending",
      quote: 0,
      deposit: 0,
      balanceDue: 0,
      nextFollowUp: merged.weddingDate,
      ...demoVendor,
      ...v,
      contact: v.contact || demoVendor.contact || "",
      contract: v.contract === "Missing" && demoVendor.contract ? demoVendor.contract : v.contract || demoVendor.contract || "Missing",
      insurance: v.insurance === "Pending" && demoVendor.insurance ? demoVendor.insurance : v.insurance || demoVendor.insurance || "Pending",
      quote: v.quote === 0 ? demoVendor.quote ?? 0 : v.quote ?? demoVendor.quote ?? 0,
      deposit: v.deposit === 0 ? demoVendor.deposit ?? 0 : v.deposit ?? demoVendor.deposit ?? 0,
      balanceDue: v.balanceDue === 0 ? demoVendor.balanceDue ?? 0 : v.balanceDue ?? demoVendor.balanceDue ?? 0,
      nextFollowUp: v.nextFollowUp || demoVendor.nextFollowUp || merged.weddingDate
    };
  });
  merged.runSheet = rawPlan.runSheet || demoPlan.runSheet;
  merged.events = rawPlan.events || demoPlan.events;
  merged.tasks = (rawPlan.tasks || demoPlan.tasks).map(t => {
    const demoTask = demoPlan.tasks.find(d => d.title === t.title) || {};
    return {
      dependency: "",
      stage: t.done ? "Done" : "Backlog",
      ...demoTask,
      ...t,
      dependency: t.dependency || demoTask.dependency || "",
      stage: t.stage === "Backlog" && demoTask.stage ? demoTask.stage : t.stage || demoTask.stage || (t.done ? "Done" : "Backlog")
    };
  });
  merged.ceremony = rawPlan.ceremony || demoPlan.ceremony;
  merged.music = rawPlan.music || demoPlan.music;
  merged.photos = rawPlan.photos || demoPlan.photos;
  merged.photoGroups = rawPlan.photoGroups || demoPlan.photoGroups;
  merged.packing = rawPlan.packing || demoPlan.packing;
  merged.zones = rawPlan.zones || demoPlan.zones;
  merged.weatherPlan = rawPlan.weatherPlan || demoPlan.weatherPlan;
  merged.accessibility = rawPlan.accessibility || demoPlan.accessibility;
  merged.seatingRules = rawPlan.seatingRules || demoPlan.seatingRules;
  merged.leads = rawPlan.leads || demoPlan.leads;
  merged.proposals = rawPlan.proposals || demoPlan.proposals;
  merged.invoices = rawPlan.invoices || demoPlan.invoices;
  merged.moodboard = rawPlan.moodboard || demoPlan.moodboard;
  merged.floorPlan = rawPlan.floorPlan || demoPlan.floorPlan;
  merged.selectedVendorId = rawPlan.selectedVendorId || merged.vendors[0]?.id || "";
  merged.changeLog = rawPlan.changeLog || demoPlan.changeLog;
  return merged;
}

function savePlan() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  const status = document.getElementById("autosaveStatus");
  if (status) {
    status.textContent = "Saved";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { status.textContent = "Autosaved"; }, 900);
  }
  const settings = loadCloudSyncSettings();
  if (settings.autoPush && isCloudSyncReady(settings) && !cloudSyncBusy) scheduleCloudPush();
}

function loadCloudSyncSettings() {
  try {
    return { url: "", anonKey: "", syncId: "", autoPush: false, ...JSON.parse(localStorage.getItem(CLOUD_SYNC_STORAGE_KEY) || "{}") };
  } catch {
    return { url: "", anonKey: "", syncId: "", autoPush: false };
  }
}

function saveCloudSyncSettings(settings) {
  localStorage.setItem(CLOUD_SYNC_STORAGE_KEY, JSON.stringify({
    url: normalizeSupabaseUrl(settings.url),
    anonKey: settings.anonKey.trim(),
    syncId: settings.syncId.trim(),
    autoPush: Boolean(settings.autoPush)
  }));
}

function normalizeSupabaseUrl(url) {
  return String(url || "").trim().replace(/\/+$/, "");
}

function isCloudSyncReady(settings = loadCloudSyncSettings()) {
  return Boolean(normalizeSupabaseUrl(settings.url) && settings.anonKey && settings.syncId);
}

function cloudHeaders(settings) {
  return {
    apikey: settings.anonKey,
    Authorization: `Bearer ${settings.anonKey}`,
    "Content-Type": "application/json"
  };
}

function cloudRowsUrl(settings, query = "") {
  const base = `${normalizeSupabaseUrl(settings.url)}/rest/v1/wedding_plans`;
  return query ? `${base}?${query}` : base;
}

function setCloudStatus(message, state = "idle") {
  cloudStatus = { message, state };
  const target = document.getElementById("cloudSyncStatus");
  if (target) target.innerHTML = renderCloudStatus();
}

function renderCloudStatus() {
  const settings = loadCloudSyncSettings();
  const readiness = isCloudSyncReady(settings) ? "Ready for shared sync" : "Needs URL, anon key, and sync ID";
  const mode = settings.autoPush ? "Auto-push on local changes" : "Manual push/pull";
  return [
    `<article class="mini-row sync-${escapeHtml(cloudStatus.state)}"><strong>${escapeHtml(readiness)}</strong><small>${escapeHtml(cloudStatus.message)}</small></article>`,
    `<article class="mini-row"><strong>${escapeHtml(mode)}</strong><small>Sync ID: ${escapeHtml(settings.syncId || "Not set")}</small></article>`
  ].join("");
}

function generateCloudSyncId() {
  const date = plan.weddingDate || new Date().toISOString().slice(0, 10);
  const randomBytes = new Uint8Array(4);
  crypto.getRandomValues(randomBytes);
  const suffix = Array.from(randomBytes, byte => byte.toString(16).padStart(2, "0")).join("");
  return `${plan.couple}-${date}-${suffix}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || `wedding-${Date.now()}`;
}

function scheduleCloudPush() {
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(() => pushCloudPlan({ silent: true }), 1400);
}

async function pushCloudPlan(options = {}) {
  const settings = loadCloudSyncSettings();
  if (!isCloudSyncReady(settings)) {
    setCloudStatus("Add cloud settings before pushing.", "warn");
    return false;
  }
  cloudSyncBusy = true;
  if (!options.silent) setCloudStatus("Pushing the current plan to cloud storage...", "busy");
  try {
    const response = await fetch(cloudRowsUrl(settings), {
      method: "POST",
      headers: { ...cloudHeaders(settings), Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ id: settings.syncId, data: plan, updated_at: new Date().toISOString() })
    });
    if (!response.ok) throw new Error(await response.text() || `Cloud push failed (${response.status})`);
    setCloudStatus("Cloud copy updated.", "ok");
    return true;
  } catch (error) {
    setCloudStatus(error.message || "Cloud push failed.", "error");
    return false;
  } finally {
    cloudSyncBusy = false;
  }
}

async function pullCloudPlan() {
  const settings = loadCloudSyncSettings();
  if (!isCloudSyncReady(settings)) {
    setCloudStatus("Add cloud settings before pulling.", "warn");
    return false;
  }
  cloudSyncBusy = true;
  setCloudStatus("Pulling the shared plan from cloud storage...", "busy");
  try {
    const response = await fetch(cloudRowsUrl(settings, `id=eq.${encodeURIComponent(settings.syncId)}&select=id,data,updated_at&limit=1`), {
      headers: cloudHeaders(settings)
    });
    if (!response.ok) throw new Error(await response.text() || `Cloud pull failed (${response.status})`);
    const rows = await response.json();
    if (!rows.length) {
      setCloudStatus("No cloud plan exists for this sync ID yet. Push this plan first.", "warn");
      return false;
    }
    pushUndo();
    plan = migratePlan(rows[0].data || {});
    recordChange(`Pulled cloud sync ${settings.syncId}`);
    setCloudStatus(`Pulled cloud plan from ${rows[0].updated_at ? new Date(rows[0].updated_at).toLocaleString() : "cloud storage"}.`, "ok");
    render();
    return true;
  } catch (error) {
    setCloudStatus(error.message || "Cloud pull failed.", "error");
    return false;
  } finally {
    cloudSyncBusy = false;
  }
}

function daysUntil(dateString) {
  const target = new Date(`${dateString}T12:00:00`);
  return Math.ceil((target - today) / 86400000);
}

function dateDiff(dateString) {
  return Math.ceil((new Date(`${dateString}T12:00:00`) - today) / 86400000);
}

function sum(list, key) {
  return list.reduce((total, item) => total + Number(item[key] || 0), 0);
}

function byStatus(items, key) {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function paymentStatus(expense) {
  const balance = Number(expense.actual || 0) - Number(expense.paid || 0);
  if (balance <= 0) return { label: "Paid", className: "" };
  if (dateDiff(expense.dueDate) < 0) return { label: "Overdue", className: "overdue" };
  if (dateDiff(expense.dueDate) <= 30) return { label: "Due soon", className: "due" };
  return { label: "Open", className: "open" };
}

function render() {
  savePlan();
  renderShell();
  renderGlobalSearch();
  renderOverview();
  renderGuests();
  renderBudget();
  renderVendors();
  renderTasks();
  renderRunSheet();
  renderSeating();
  renderDayMode();
  renderProduction();
  renderReports();
  renderDocuments();
  renderStudio();
  renderPortal();
  const undoBtn = document.getElementById("undoBtn");
  if (undoBtn) undoBtn.disabled = undoStack.length === 0;
  document.body.classList.toggle("client-mode", document.getElementById("modeSelect")?.value === "Client mode");
  if (window.lucide) lucide.createIcons();
  enhanceAccessibility();
}

function renderShell() {
  document.getElementById("coupleNames").value = plan.couple;
  document.getElementById("venueName").value = plan.venue;
  document.getElementById("weddingDate").value = plan.weddingDate;
  document.getElementById("budgetTarget").value = plan.budgetTarget;
  document.getElementById("plannerName").value = plan.profile.planner;
  document.getElementById("rsvpDeadline").value = plan.profile.rsvpDeadline;
  document.getElementById("ceremonyTime").value = plan.profile.ceremonyTime;
  document.getElementById("receptionTime").value = plan.profile.receptionTime;
  document.getElementById("venueContact").value = plan.profile.venueContact;
  document.getElementById("emergencyContact").value = plan.profile.emergencyContact;
  document.getElementById("portalPinSetting").value = plan.portal.pin;
  setText("aboutVersion", APP_VERSION);
  setText("coupleTitle", plan.couple);
  setText("daysUntil", Math.max(0, daysUntil(plan.weddingDate)));
}

function renderGlobalSearch() {
  const input = document.getElementById("globalSearch");
  const target = document.getElementById("globalSearchResults");
  if (!input || !target) return;
  const query = input.value.trim().toLowerCase();
  if (!query) {
    target.innerHTML = "";
    target.classList.remove("open");
    return;
  }
  const rows = [
    ...plan.guests.map(g => ({ view: "guests", title: g.name, copy: `${g.side || inferGuestSide(g, plan.couple)} side - ${g.group} - ${g.status}` })),
    ...plan.vendors.map(v => ({ view: "vendors", title: v.name, copy: `${v.category} - ${v.stage}` })),
    ...plan.tasks.map(t => ({ view: "timeline", title: t.title, copy: `${t.owner} - ${t.due}` })),
    ...plan.expenses.map(e => ({ view: "budget", title: e.item, copy: `${e.category} - ${money.format(e.actual || 0)}` })),
    ...plan.runSheet.map(r => ({ view: "runsheet", title: r.title, copy: `${r.time} - ${r.location}` })),
    ...plan.documents.map(d => ({ view: "documents", title: d.name, copy: `${d.owner} - ${d.status}` })),
    ...plan.attachments.map(a => ({ view: "documents", title: a.name, copy: `${a.area} attachment` })),
    ...plan.leads.map(l => ({ view: "studio", title: l.name, copy: `${l.stage} - ${money.format(l.budget || 0)}` })),
    ...plan.proposals.map(p => ({ view: "studio", title: p.name, copy: `${p.status} - ${money.format(p.price || 0)}` })),
    ...plan.moodboard.map(m => ({ view: "portal", title: m.label, copy: m.value }))
  ].filter(row => `${row.title} ${row.copy}`.toLowerCase().includes(query)).slice(0, 8);
  target.innerHTML = rows.map(row => `<button data-search-view="${row.view}"><strong>${escapeHtml(row.title)}</strong><span>${escapeHtml(row.copy)}</span></button>`).join("") || `<p>No matches</p>`;
  target.classList.add("open");
}

function renderOverview() {
  const acceptedGuests = plan.guests.filter(g => g.status === "Accepted");
  const accepted = acceptedGuests.reduce((total, g) => total + Number(g.partySize || 1), 0);
  const invited = plan.guests.reduce((total, g) => total + Number(g.partySize || 1), 0);
  const openTasks = plan.tasks.filter(t => !t.done).length;
  const overdue = plan.tasks.filter(t => !t.done && new Date(t.due) < today).length;
  const booked = plan.vendors.filter(v => ["Booked", "Paid"].includes(v.stage)).length;
  const actual = sum(plan.expenses, "actual");
  const paid = sum(plan.expenses, "paid");
  const scores = {
    guests: accepted / Math.max(invited || plan.guestTarget || 1, 1),
    tasks: (plan.tasks.length - openTasks) / Math.max(plan.tasks.length, 1),
    vendors: booked / Math.max(plan.vendors.length, 1),
    finance: Math.min(paid / Math.max(actual, 1), 1)
  };
  const weightTotal = Object.values(plan.weights).reduce((total, value) => total + Number(value || 0), 0) || 100;
  const readiness = Math.round(Object.entries(scores).reduce((total, [key, value]) => total + value * Number(plan.weights[key] || 0), 0) / weightTotal * 100);
  const variance = actual - plan.budgetTarget;

  setText("readinessScore", `${readiness}%`);
  setText("acceptedMini", accepted);
  setText("openTasksMini", openTasks);
  setText("criticalPath", overdue ? `${overdue} overdue items` : `${openTasks} open items`);
  setText("criticalCopy", overdue ? "Immediate attention is needed on overdue work." : "Planning remains controlled, with upcoming work still movable.");
  setText("budgetPosture", variance > 0 ? `${money.format(variance)} over` : `${money.format(Math.abs(variance))} under`);
  setText("budgetCopy", variance > 0 ? "Review high-variance categories before signing new proposals." : `${money.format(paid)} paid against ${money.format(actual)} committed.`);
  setText("guestSignal", `${accepted}/${invited} confirmed`);
  setText("guestCopy", `${Math.round((accepted / Math.max(invited, 1)) * 100)}% RSVP acceptance by party size.`);

  document.getElementById("kpiGrid").innerHTML = [
    ["Budget committed", money.format(actual), `${Math.round((actual / plan.budgetTarget) * 100)}% of target`],
    ["Balance unpaid", money.format(actual - paid), `${money.format(paid)} already paid`],
    ["Vendors secured", booked, `${plan.vendors.length - booked} in motion`],
    ["Days remaining", Math.max(0, daysUntil(plan.weddingDate)), `${plan.profile.planner} lead`]
  ].map(([label, value, sub]) => `<article class="kpi"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(sub)}</small></article>`).join("");

  const risks = buildRisks();
  setText("riskCount", `${risks.length} alerts`);
  document.getElementById("riskList").innerHTML = risks.map(r => `<article class="risk-item"><span class="severity ${r.level}"></span><div><strong>${escapeHtml(r.title)}</strong><p>${escapeHtml(r.copy)}</p></div></article>`).join("") || `<p class="muted">No active alerts detected.</p>`;
  document.getElementById("decisionList").innerHTML = plan.decisions.map((d, index) => `<article class="decision-item"><div class="status-row"><strong>${escapeHtml(d.title)}</strong><span class="pill">${escapeHtml(d.status)}</span></div><small>${escapeHtml(d.owner)}</small><p>${escapeHtml(d.note)}</p><button class="row-action" data-delete-decision="${index}"><i data-lucide="trash-2"></i></button></article>`).join("");
  renderOnboarding();
  renderWeightControls();
}

function renderOnboarding() {
  const checks = [
    ["Set couple and venue", plan.couple !== "New Couple" && plan.venue !== "Venue TBD"],
    ["Add first guests", plan.guests.length > 0],
    ["Create budget lines", plan.expenses.length > 0],
    ["Add vendors", plan.vendors.length > 0],
    ["Build run sheet", plan.runSheet.length > 0],
    ["Save a backup snapshot", plan.snapshots.length > 0]
  ];
  document.getElementById("onboardingChecklist").innerHTML = checks.map(([title, done]) => `<article class="mini-row"><strong>${done ? "Done" : "Next"}: ${escapeHtml(title)}</strong><small>${done ? "Complete" : "Recommended for a clean plan foundation"}</small></article>`).join("");
}

function renderWeightControls() {
  const labels = { guests: "Guest readiness", tasks: "Task progress", vendors: "Vendor security", finance: "Financial progress" };
  document.getElementById("weightControls").innerHTML = Object.entries(labels).map(([key, label]) => `
    <label>${label}<input type="range" min="0" max="50" value="${Number(plan.weights[key] || 0)}" data-weight="${key}"><span>${Number(plan.weights[key] || 0)}%</span></label>
  `).join("");
}

function buildRisks() {
  const risks = [];
  const actual = sum(plan.expenses, "actual");
  const overdue = plan.tasks.filter(t => !t.done && new Date(t.due) < today);
  const proposalVendors = plan.vendors.filter(v => !["Booked", "Paid"].includes(v.stage));
  const rsvpOpen = plan.guests.filter(g => ["Invited", "Maybe"].includes(g.status));
  const unseated = getUnseatedAccepted();
  const paymentsDue = plan.expenses.filter(e => paymentStatus(e).className === "due");
  const paymentsOverdue = plan.expenses.filter(e => paymentStatus(e).className === "overdue");
  const vendorFollowUps = plan.vendors.filter(v => dateDiff(v.nextFollowUp) <= 14 && !["Paid"].includes(v.stage));
  const missingContracts = plan.vendors.filter(v => ["Booked", "Paid"].includes(v.stage) && v.contract !== "Signed");
  const missingInsurance = plan.vendors.filter(v => ["Booked", "Paid"].includes(v.stage) && v.insurance !== "Received");
  const missingContacts = plan.guests.filter(g => g.status !== "Declined" && !g.email && !g.phone);
  const overCaps = Object.entries(plan.budgetCaps || {}).filter(([category, cap]) => plan.expenses.filter(e => e.category === category).reduce((total, e) => total + Number(e.actual || 0), 0) > Number(cap || 0));
  if (actual > plan.budgetTarget) risks.push({ level: "high", title: "Budget target exceeded", copy: `${money.format(actual - plan.budgetTarget)} over target across committed lines.` });
  if (overCaps.length) risks.push({ level: "high", title: "Category cap exceeded", copy: `${overCaps.length} category cap${overCaps.length > 1 ? "s are" : " is"} over target.` });
  if (paymentsOverdue.length) risks.push({ level: "high", title: "Payment overdue", copy: `${paymentsOverdue.length} budget line${paymentsOverdue.length > 1 ? "s" : ""} have unpaid balances past due.` });
  if (overdue.length) risks.push({ level: "high", title: "Overdue planning tasks", copy: `${overdue.length} overdue task${overdue.length > 1 ? "s" : ""} require owner follow-up.` });
  if (missingContracts.length) risks.push({ level: "high", title: "Booked vendor missing contract", copy: `${missingContracts.length} booked vendor${missingContracts.length > 1 ? "s" : ""} need signed contract status.` });
  if (paymentsDue.length) risks.push({ level: "medium", title: "Payments due soon", copy: `${paymentsDue.length} balance${paymentsDue.length > 1 ? "s are" : " is"} due within 30 days.` });
  if (vendorFollowUps.length) risks.push({ level: "medium", title: "Vendor follow-up window", copy: `${vendorFollowUps.length} vendor follow-up${vendorFollowUps.length > 1 ? "s" : ""} due in the next 14 days.` });
  if (proposalVendors.length > 2) risks.push({ level: "medium", title: "Vendor pipeline still open", copy: `${proposalVendors.length} vendors are not yet booked or paid.` });
  if (rsvpOpen.length && dateDiff(plan.profile.rsvpDeadline) <= 30) risks.push({ level: "medium", title: "RSVP deadline approaching", copy: `${rsvpOpen.length} guests still need confirmation before ${plan.profile.rsvpDeadline}.` });
  if (unseated.length) risks.push({ level: "medium", title: "Accepted guests not seated", copy: `${unseated.length} accepted guest${unseated.length > 1 ? "s" : ""} still need seat assignments.` });
  if (missingInsurance.length) risks.push({ level: "medium", title: "Vendor insurance pending", copy: `${missingInsurance.length} secured vendor${missingInsurance.length > 1 ? "s" : ""} still need insurance marked received.` });
  if (missingContacts.length) risks.push({ level: "medium", title: "Guest contact gaps", copy: `${missingContacts.length} active guest${missingContacts.length > 1 ? "s" : ""} need email or phone details.` });
  return risks;
}

function renderGuests() {
  const search = document.getElementById("guestSearch").value.toLowerCase();
  const filter = document.getElementById("guestStatusFilter").value || "All";
  const sides = getCoupleSides();
  renderGuestSideOptions();
  document.getElementById("guestStatusFilter").innerHTML = ["All", "Invited", "Accepted", "Declined", "Maybe"].map(s => `<option ${s === filter ? "selected" : ""}>${s}</option>`).join("");
  const guests = plan.guests.filter(g => (filter === "All" || g.status === filter) && [g.name, g.side, g.group, g.meal, g.tags, g.notes].join(" ").toLowerCase().includes(search));
  document.getElementById("guestRows").innerHTML = guests.map(g => `
    <tr>
      <td><input value="${escapeHtml(g.name)}" data-guest="${g.id}" data-field="name"></td>
      <td><input value="${escapeHtml(g.email)}" data-guest="${g.id}" data-field="email" placeholder="Email"><input value="${escapeHtml(g.phone)}" data-guest="${g.id}" data-field="phone" placeholder="Phone"></td>
      <td><select data-guest="${g.id}" data-field="side">${sides.map(side => `<option ${side === g.side ? "selected" : ""}>${escapeHtml(side)}</option>`).join("")}</select></td>
      <td><input value="${escapeHtml(g.group)}" data-guest="${g.id}" data-field="group"></td>
      <td><select data-guest="${g.id}" data-field="status">${["Invited","Accepted","Declined","Maybe"].map(s => `<option ${s === g.status ? "selected" : ""}>${s}</option>`).join("")}</select></td>
      <td><select data-guest="${g.id}" data-field="meal">${["Chicken","Fish","Vegetarian","Vegan","Kids"].map(s => `<option ${s === g.meal ? "selected" : ""}>${s}</option>`).join("")}</select></td>
      <td><input type="number" min="1" value="${Number(g.partySize || 1)}" data-guest="${g.id}" data-field="partySize"></td>
      <td><input value="${escapeHtml(g.plusOne)}" data-guest="${g.id}" data-field="plusOne"></td>
      <td><input type="date" value="${escapeHtml(g.inviteSent)}" data-guest="${g.id}" data-field="inviteSent"><select data-guest="${g.id}" data-field="inviteMethod">${["Email","Mail","Text","Hand delivered"].map(s => `<option ${s === g.inviteMethod ? "selected" : ""}>${s}</option>`).join("")}</select></td>
      <td><select data-guest="${g.id}" data-field="reminder">${["No","Yes","Sent"].map(s => `<option ${s === g.reminder ? "selected" : ""}>${s}</option>`).join("")}</select></td>
      <td><input value="${escapeHtml(g.tags)}" data-guest="${g.id}" data-field="tags"></td>
      <td><input value="${escapeHtml(g.notes)}" data-guest="${g.id}" data-field="notes"></td>
      <td><button class="row-action" data-delete-guest="${g.id}"><i data-lucide="trash-2"></i></button></td>
    </tr>`).join("") || `<tr><td colspan="13"><div class="empty-state">No guests yet. Add guests manually or import a CSV to start the RSVP tracker.</div></td></tr>`;
  drawDonut("guestChart", byStatus(plan.guests, "status"), ["#2f7d59", "#b18a45", "#b34343", "#7a8894"]);
  const meals = plan.guests.filter(g => g.status === "Accepted").reduce((acc, g) => {
    acc[g.meal] = (acc[g.meal] || 0) + Number(g.partySize || 1);
    return acc;
  }, {});
  document.getElementById("mealBreakdown").innerHTML = Object.entries(meals).map(([k, v]) => `<div><span>${escapeHtml(k)}</span><strong>${v}</strong></div>`).join("") || `<p class="muted">No accepted meals yet.</p>`;
  const sideCounts = byStatus(plan.guests, "side");
  document.getElementById("sideBreakdown").innerHTML = sides.map(side => `<div><span>${escapeHtml(side)}</span><strong>${sideCounts[side] || 0}</strong></div>`).join("");
  const households = byStatus(plan.guests, "group");
  document.getElementById("householdBreakdown").innerHTML = Object.entries(households).map(([k, v]) => `<div><span>${escapeHtml(k)}</span><strong>${v}</strong></div>`).join("");
  const reminders = plan.guests.filter(g => g.reminder === "Yes" || ["Invited", "Maybe"].includes(g.status)).slice(0, 8);
  document.getElementById("reminderQueue").innerHTML = reminders.map(g => `<article class="mini-row"><strong>${escapeHtml(g.name)}</strong><small>${escapeHtml(g.status)} - ${escapeHtml(g.email || g.phone || "contact missing")}</small></article>`).join("") || `<p class="muted">No RSVP reminders queued.</p>`;
}

function renderBudget() {
  document.getElementById("expenseRows").innerHTML = plan.expenses.map(e => {
    const status = paymentStatus(e);
    return `
    <tr>
      <td><input value="${escapeHtml(e.category)}" data-expense="${e.id}" data-field="category"></td>
      <td><input value="${escapeHtml(e.item)}" data-expense="${e.id}" data-field="item"></td>
      <td><input type="number" value="${e.estimated}" data-expense="${e.id}" data-field="estimated"></td>
      <td><input type="number" value="${e.actual}" data-expense="${e.id}" data-field="actual"></td>
      <td><input type="number" value="${e.paid}" data-expense="${e.id}" data-field="paid"></td>
      <td><input type="date" value="${e.dueDate}" data-expense="${e.id}" data-field="dueDate"></td>
      <td><span class="payment-status ${status.className}">${status.label}</span></td>
      <td>${money.format(e.actual - e.estimated)}</td>
      <td><button class="row-action" data-delete-expense="${e.id}"><i data-lucide="trash-2"></i></button></td>
    </tr>`;
  }).join("") || `<tr><td colspan="9"><div class="empty-state">No budget lines yet. Add a category, estimate, commitment, paid amount, and due date.</div></td></tr>`;
  const categories = plan.expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.actual);
    return acc;
  }, {});
  drawBars("budgetChart", categories);
  const actual = sum(plan.expenses, "actual");
  const paid = sum(plan.expenses, "paid");
  const dueSoon = plan.expenses.filter(e => paymentStatus(e).className === "due").length;
  const overdue = plan.expenses.filter(e => paymentStatus(e).className === "overdue").length;
  document.getElementById("budgetSummary").innerHTML = `
    <div><span>Committed</span><strong>${money.format(actual)}</strong></div>
    <div><span>Paid</span><strong>${money.format(paid)}</strong></div>
    <div><span>Unpaid balance</span><strong>${money.format(actual - paid)}</strong></div>
    <div><span>Due soon</span><strong>${dueSoon}</strong></div>
    <div><span>Overdue</span><strong>${overdue}</strong></div>
    <div><span>Target variance</span><strong>${money.format(plan.budgetTarget - actual)}</strong></div>`;
  const model = plan.financeModel || { taxRate: 0, serviceRate: 0, tipRate: 0 };
  const tax = actual * Number(model.taxRate || 0) / 100;
  const service = actual * Number(model.serviceRate || 0) / 100;
  const tip = actual * Number(model.tipRate || 0) / 100;
  document.getElementById("financeModel").innerHTML = `
    <label>Tax %<input type="number" step="0.1" value="${Number(model.taxRate || 0)}" data-finance-field="taxRate"></label>
    <label>Service %<input type="number" step="0.1" value="${Number(model.serviceRate || 0)}" data-finance-field="serviceRate"></label>
    <label>Tip %<input type="number" step="0.1" value="${Number(model.tipRate || 0)}" data-finance-field="tipRate"></label>
    <article class="mini-row"><strong>${money.format(actual + tax + service + tip)}</strong><small>Loaded projected total including ${money.format(tax + service + tip)} in tax, service, and tip</small></article>`;
  document.getElementById("categoryCaps").innerHTML = Object.entries(categories).map(([category, total]) => {
    const cap = Number(plan.budgetCaps?.[category] || Math.ceil(total * 1.1));
    const state = total > cap ? "Over cap" : "Inside cap";
    return `<article class="mini-row"><strong>${escapeHtml(category)}: ${money.format(total)} / ${money.format(cap)}</strong><small>${state}</small><input type="number" value="${cap}" data-budget-cap="${escapeHtml(category)}"></article>`;
  }).join("") || `<p class="muted">Add budget lines to set category caps.</p>`;
  const cash = plan.expenses.reduce((acc, e) => {
    const month = (e.dueDate || plan.weddingDate).slice(0, 7);
    acc[month] = (acc[month] || 0) + Math.max(0, Number(e.actual || 0) - Number(e.paid || 0));
    return acc;
  }, {});
  document.getElementById("cashFlow").innerHTML = Object.entries(cash).sort(([a], [b]) => a.localeCompare(b)).map(([month, total]) => `<article class="mini-row"><strong>${escapeHtml(month)}</strong><small>${money.format(total)} projected cash need</small></article>`).join("") || `<p class="muted">No unpaid cash flow yet.</p>`;
  const upcoming = [...plan.expenses]
    .filter(e => Number(e.actual || 0) > Number(e.paid || 0))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);
  document.getElementById("paymentCalendar").innerHTML = upcoming.map(e => `<article class="mini-row"><strong>${escapeHtml(e.dueDate)} - ${escapeHtml(e.category)}</strong><small>${escapeHtml(e.item)} balance ${money.format(Number(e.actual || 0) - Number(e.paid || 0))}</small></article>`).join("") || `<p class="muted">No unpaid balances.</p>`;
}

function renderVendors() {
  const stages = ["Research", "Shortlisted", "Proposal", "Booked", "Paid"];
  document.getElementById("vendorBoard").innerHTML = stages.map(stage => {
    const vendors = plan.vendors.filter(v => v.stage === stage);
    const cards = vendors.map(v => `
      <article class="vendor-card" data-select-vendor="${v.id}">
        <strong>${escapeHtml(v.name)}</strong><small>${escapeHtml(v.category)} - ${escapeHtml(v.owner)}</small>
        <select data-vendor="${v.id}" data-field="stage">${stages.map(s => `<option ${s === v.stage ? "selected" : ""}>${s}</option>`).join("")}</select>
        <div class="vendor-meta">
          <input value="${escapeHtml(v.contact)}" data-vendor="${v.id}" data-field="contact" placeholder="Contact">
          <input type="date" value="${v.nextFollowUp}" data-vendor="${v.id}" data-field="nextFollowUp">
          <select data-vendor="${v.id}" data-field="contract">${["Missing","Review","Signed"].map(s => `<option ${s === v.contract ? "selected" : ""}>${s}</option>`).join("")}</select>
          <select data-vendor="${v.id}" data-field="insurance">${["Pending","Received","Not required"].map(s => `<option ${s === v.insurance ? "selected" : ""}>${s}</option>`).join("")}</select>
          <input type="number" value="${v.quote}" data-vendor="${v.id}" data-field="quote" placeholder="Quote">
          <input type="number" value="${v.balanceDue}" data-vendor="${v.id}" data-field="balanceDue" placeholder="Balance">
        </div>
        <button class="row-action" data-delete-vendor="${v.id}"><i data-lucide="trash-2"></i></button>
      </article>`).join("");
    return `<section class="kanban-col"><h3>${stage}<span>${vendors.length}</span></h3>${cards}</section>`;
  }).join("");
  renderVendorDetail();
}

function renderVendorDetail() {
  const vendor = plan.vendors.find(v => v.id === plan.selectedVendorId) || plan.vendors[0];
  const target = document.getElementById("vendorDetail");
  if (!vendor) {
    target.innerHTML = `<p class="muted">Select a vendor to inspect details.</p>`;
    return;
  }
  target.innerHTML = `
    <article>
      <strong>${escapeHtml(vendor.name)}</strong>
      <small>${escapeHtml(vendor.category)} - ${escapeHtml(vendor.stage)}</small>
      <dl>
        <dt>Contact</dt><dd>${escapeHtml(vendor.contact || "-")}</dd>
        <dt>Owner</dt><dd>${escapeHtml(vendor.owner)}</dd>
        <dt>Contract</dt><dd>${escapeHtml(vendor.contract)}</dd>
        <dt>Insurance</dt><dd>${escapeHtml(vendor.insurance)}</dd>
        <dt>Quote</dt><dd>${money.format(vendor.quote || 0)}</dd>
        <dt>Balance</dt><dd>${money.format(vendor.balanceDue || 0)}</dd>
        <dt>Follow-up</dt><dd>${escapeHtml(vendor.nextFollowUp)}</dd>
        <dt>Milestones</dt><dd>${escapeHtml(vendor.contract)} / ${escapeHtml(vendor.insurance)}</dd>
      </dl>
    </article>`;
  document.getElementById("vendorMatrix").innerHTML = plan.vendors.map(v => `<article class="mini-row"><strong>${escapeHtml(v.name)} - ${money.format(v.quote || 0)}</strong><small>${escapeHtml(v.stage)} | Contract: ${escapeHtml(v.contract)} | Balance: ${money.format(v.balanceDue || 0)}</small><input value="${escapeHtml(v.pros || "")}" data-vendor="${v.id}" data-field="pros" placeholder="Pros / cons / package notes"></article>`).join("") || `<p class="muted">Add vendors to compare quotes.</p>`;
}

function renderTasks() {
  const filter = document.getElementById("taskFilter").value || "All";
  document.getElementById("taskFilter").innerHTML = ["All", "Open", "Done", "High", "Medium", "Low"].map(s => `<option ${s === filter ? "selected" : ""}>${s}</option>`).join("");
  const tasks = plan.tasks
    .filter(t => filter === "All" || (filter === "Open" && !t.done) || (filter === "Done" && t.done) || t.priority === filter)
    .sort((a, b) => new Date(a.due) - new Date(b.due));
  document.getElementById("taskList").innerHTML = tasks.map(t => `
    <article class="task-item ${t.done ? "done" : ""}">
      <div><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(t.owner)} - due ${t.due}${t.dependency ? ` - blocked by ${escapeHtml(t.dependency)}` : ""}</small></div>
      <span class="priority ${safeClass(t.priority)}">${escapeHtml(t.priority)}</span>
      <label><input type="checkbox" data-task="${t.id}" ${t.done ? "checked" : ""}> Done</label>
      <div class="editable-grid">
        <input value="${escapeHtml(t.owner)}" data-task-edit="${t.id}" data-field="owner" placeholder="Owner">
        <input type="date" value="${escapeHtml(t.due)}" data-task-edit="${t.id}" data-field="due">
        <select data-task-edit="${t.id}" data-field="priority">${["High","Medium","Low"].map(s => `<option ${s === t.priority ? "selected" : ""}>${s}</option>`).join("")}</select>
        <input value="${escapeHtml(t.dependency || "")}" data-task-edit="${t.id}" data-field="dependency" placeholder="Dependency">
        <select data-task-edit="${t.id}" data-field="stage">${["Backlog","This Week","Waiting","Done"].map(s => `<option ${s === (t.stage || "Backlog") ? "selected" : ""}>${s}</option>`).join("")}</select>
      </div>
    </article>`).join("") || `<div class="empty-state">No tasks yet. Add a planning task or use Phase templates.</div>`;
  const stages = ["Backlog", "This Week", "Waiting", "Done"];
  document.getElementById("taskBoard").innerHTML = stages.map(stage => {
    const rows = plan.tasks.filter(t => (t.done ? "Done" : t.stage || "Backlog") === stage);
    return `<section><h4>${stage} (${rows.length})</h4>${rows.map(t => `<div class="mini-row"><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(t.owner)} - ${escapeHtml(t.priority)}</small></div>`).join("") || `<small class="muted">No tasks</small>`}</section>`;
  }).join("");
}

function renderRunSheet() {
  const currentFilter = document.getElementById("runVendorFilter").value || "All vendors";
  const runVendors = ["All vendors", ...new Set(plan.runSheet.map(item => item.vendor).filter(Boolean))];
  document.getElementById("runVendorFilter").innerHTML = runVendors.map(v => `<option ${v === currentFilter ? "selected" : ""}>${escapeHtml(v)}</option>`).join("");
  const sorted = [...plan.runSheet]
    .filter(item => currentFilter === "All vendors" || item.vendor === currentFilter)
    .sort((a, b) => a.time.localeCompare(b.time));
  setText("runSheetCount", `${sorted.length} moments`);
  document.getElementById("runSheetList").innerHTML = sorted.map(item => `
    <article class="run-item">
      <div class="run-time">${escapeHtml(item.time)}</div>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.notes || "")}</small>
        <div class="run-detail"><span>${escapeHtml(item.location)}</span><span>${escapeHtml(item.owner)}</span><span>${escapeHtml(item.vendor || "No vendor")}</span></div>
        <div class="editable-grid"><input type="time" value="${escapeHtml(item.time)}" data-run-edit="${item.id}" data-field="time"><input value="${escapeHtml(item.owner)}" data-run-edit="${item.id}" data-field="owner" placeholder="Owner"><input value="${escapeHtml(item.vendor)}" data-run-edit="${item.id}" data-field="vendor" placeholder="Vendor"><input value="${escapeHtml(item.notes || "")}" data-run-edit="${item.id}" data-field="notes" placeholder="Notes"></div>
      </div>
      <button class="row-action" data-delete-run="${item.id}"><i data-lucide="trash-2"></i></button>
    </article>`).join("") || `<div class="empty-state">No run-sheet moments yet. Add the first call time, ceremony, reception, and key vendor cues.</div>`;
  const first = sorted[0]?.time || "-";
  const last = sorted[sorted.length - 1]?.time || "-";
  const owners = new Set(sorted.map(item => item.owner).filter(Boolean)).size;
  const vendors = new Set(sorted.map(item => item.vendor).filter(Boolean)).size;
  document.getElementById("opsBrief").innerHTML = `
    <div><span>First call</span><strong>${first}</strong></div>
    <div><span>Last tracked moment</span><strong>${last}</strong></div>
    <div><span>Owners active</span><strong>${owners}</strong></div>
    <div><span>Vendors referenced</span><strong>${vendors}</strong></div>
    <div><span>Ceremony</span><strong>${escapeHtml(plan.profile.ceremonyTime)}</strong></div>
    <div><span>Reception</span><strong>${escapeHtml(plan.profile.receptionTime)}</strong></div>`;
  const conflicts = detectRunConflicts(sorted);
  document.getElementById("runConflicts").innerHTML = conflicts.map(c => `<article class="mini-row"><strong>${escapeHtml(c.title)}</strong><small>${escapeHtml(c.copy)}</small></article>`).join("") || `<p class="muted">No owner/vendor conflicts detected.</p>`;
  document.getElementById("eventList").innerHTML = [...plan.events]
    .sort((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`))
    .map(event => `<article class="mini-row"><strong>${escapeHtml(event.date)} ${escapeHtml(event.start)} - ${escapeHtml(event.name)}</strong><small>${escapeHtml(event.location)} | ${escapeHtml(event.owner || "Owner TBD")}</small></article>`)
    .join("") || `<p class="muted">No weekend itinerary events yet.</p>`;
}

function detectRunConflicts(items) {
  const conflicts = [];
  const seen = new Map();
  items.forEach(item => {
    const ownerKey = `${item.time}|owner|${item.owner}`;
    const vendorKey = `${item.time}|vendor|${item.vendor}`;
    [ownerKey, vendorKey].forEach(key => {
      if (seen.has(key)) conflicts.push({ title: `Overlap at ${item.time}`, copy: `${item.title} overlaps with ${seen.get(key)}.` });
      seen.set(key, item.title);
    });
  });
  return conflicts;
}

function getUnseatedAccepted() {
  const accepted = plan.guests.filter(g => g.status === "Accepted").map(g => g.name);
  const seated = new Set(plan.tables.flatMap(t => t.seats).filter(Boolean));
  return accepted.filter(name => !seated.has(name));
}

function renderSeating() {
  const unseated = getUnseatedAccepted();
  const picker = document.getElementById("seatGuestPicker");
  picker.innerHTML = [`<option value="">Select guest</option>`, ...unseated.map(g => `<option>${escapeHtml(g)}</option>`)].join("");
  document.getElementById("unseatedList").innerHTML = unseated.map(g => `<span>${escapeHtml(g)}</span>`).join("") || `<span>All accepted guests seated</span>`;
  document.getElementById("seatConstraints").innerHTML = plan.seatingRules.map(r => `<article class="mini-row"><strong>${escapeHtml(r.type)}</strong><small>${escapeHtml(r.rule)}</small></article>`).join("") || `<p class="muted">No constraints tracked.</p>`;
  renderSeatRuleWarnings();
  document.getElementById("tableMap").innerHTML = plan.tables.map(table => `
    <section class="reception-table">
      <div class="table-title"><strong>${escapeHtml(table.name)}</strong><span class="pill">${table.seats.filter(Boolean).length}/${table.seats.length}</span><button class="row-action" data-delete-table="${table.id}"><i data-lucide="trash-2"></i></button></div>
      <div class="seat-grid">${table.seats.map((seat, index) => `<button class="seat ${seat ? "occupied" : ""}" data-table="${table.id}" data-seat="${index}" ${seat ? 'draggable="true"' : ""}>${escapeHtml(seat || "Open seat")}</button>`).join("")}</div>
    </section>`).join("");
}

function renderSeatRuleWarnings() {
  const seated = new Map();
  plan.tables.forEach(table => table.seats.filter(Boolean).forEach(name => seated.set(name, table.name)));
  const warnings = [];
  plan.seatingRules.forEach(rule => {
    const matchingGuests = plan.guests.filter(guest => rule.rule.toLowerCase().includes(guest.name.toLowerCase()));
    if (rule.type === "Keep together" && matchingGuests.length > 1) {
      const tables = new Set(matchingGuests.map(guest => seated.get(guest.name)).filter(Boolean));
      if (tables.size > 1) warnings.push({ title: "Keep-together split", copy: `${matchingGuests.map(g => g.name).join(", ")} are seated across ${[...tables].join(", ")}.` });
    }
    if (rule.type === "Keep apart" && matchingGuests.length > 1) {
      const tables = matchingGuests.map(guest => seated.get(guest.name)).filter(Boolean);
      if (new Set(tables).size === 1 && tables.length > 1) warnings.push({ title: "Keep-apart conflict", copy: `${matchingGuests.map(g => g.name).join(", ")} are both at ${tables[0]}.` });
    }
    if (["VIP", "Accessibility"].includes(rule.type) && !matchingGuests.length) warnings.push({ title: `${rule.type} rule needs names`, copy: rule.rule });
  });
  document.getElementById("seatRuleWarnings").innerHTML = warnings.map(w => `<article class="mini-row"><strong>${escapeHtml(w.title)}</strong><small>${escapeHtml(w.copy)}</small></article>`).join("") || `<p class="muted">No rule conflicts detected.</p>`;
}

function renderDayMode() {
  const sorted = [...plan.runSheet].sort((a, b) => a.time.localeCompare(b.time));
  const nowIndex = Math.max(0, sorted.findIndex(item => item.time >= plan.profile.ceremonyTime));
  document.getElementById("dayModeClock").textContent = `${plan.weddingDate} brief`;
  document.getElementById("dayModeTimeline").innerHTML = sorted.map((item, index) => `
    <article class="day-item ${index === nowIndex ? "current" : ""}">
      <strong>${escapeHtml(item.time)}</strong>
      <div><b>${escapeHtml(item.title)}</b><span>${escapeHtml(item.location)} | ${escapeHtml(item.owner)} | ${escapeHtml(item.vendor || "Internal")}</span><small>${escapeHtml(item.notes || "")}</small></div>
    </article>
  `).join("") || `<p class="muted">No run-sheet moments yet.</p>`;
  document.getElementById("dayModeAlerts").innerHTML = buildRisks().slice(0, 6).map(r => `<article class="mini-row"><strong>${escapeHtml(r.title)}</strong><small>${escapeHtml(r.copy)}</small></article>`).join("") || `<p class="muted">No active critical alerts.</p>`;
  document.getElementById("dayModeVendors").innerHTML = plan.vendors.filter(v => ["Booked", "Paid"].includes(v.stage)).map(v => `<article class="mini-row"><strong>${escapeHtml(v.name)}</strong><small>${escapeHtml(v.category)} | ${escapeHtml(v.contact || "Contact TBD")} | Balance ${money.format(v.balanceDue || 0)}</small></article>`).join("") || `<p class="muted">No booked vendors yet.</p>`;
  document.getElementById("dayModeContacts").innerHTML = [
    ["Planner", plan.profile.planner],
    ["Venue", plan.profile.venueContact],
    ["Emergency", plan.profile.emergencyContact]
  ].map(([title, copy]) => `<article class="mini-row"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(copy || "Not set")}</small></article>`).join("");
  document.getElementById("dayModeChecklist").innerHTML = [
    ["Vendor meals confirmed", plan.expenses.some(e => e.category === "Food")],
    ["Family photos grouped", plan.photoGroups.length > 0],
    ["Weather backup checked", plan.weatherPlan.some(item => item.done)],
    ["Accessibility seating checked", plan.accessibility.some(item => item.done)],
    ["Emergency contact present", Boolean(plan.profile.emergencyContact)]
  ].map(([label, checked]) => `<label><input type="checkbox" ${checked ? "checked" : ""} disabled> ${escapeHtml(label)}</label>`).join("");
}

function renderProduction() {
  renderMiniList("ceremonyList", plan.ceremony, item => `${item.role}: ${item.name}`, item => item.music);
  renderMiniList("musicList", plan.music, item => `${item.moment}: ${item.song}`, item => item.status);
  renderMiniList("photoList", plan.photos, item => item.shot, item => `${item.people} - ${item.priority}`);
  renderMiniList("photoGroupList", plan.photoGroups, item => item.group, item => item.people);
  renderMiniList("packingList", plan.packing, item => item.item, item => `${item.owner} - ${item.status}`);
  renderMiniList("zoneList", plan.zones, item => item.zone, item => `${item.owner} - ${item.notes}`);
  renderChecklist("weatherChecklist", plan.weatherPlan, "weather");
  renderChecklist("accessibilityChecklist", plan.accessibility, "accessibility");
}

function renderChecklist(id, rows, type) {
  document.getElementById(id).innerHTML = rows.map(row => `
    <label><input type="checkbox" data-check-type="${type}" data-check-id="${row.id}" ${row.done ? "checked" : ""}> ${escapeHtml(row.item)}</label>
  `).join("") || `<p class="muted">No checklist items tracked.</p>`;
}

function renderReports() {
  const mealCounts = plan.guests.filter(g => g.status === "Accepted").reduce((acc, g) => {
    acc[g.meal] = (acc[g.meal] || 0) + Number(g.partySize || 1);
    return acc;
  }, {});
  const allergies = plan.guests.filter(g => g.notes || g.tags).map(g => `${g.name}: ${[g.tags, g.notes].filter(Boolean).join(" - ")}`);
  document.getElementById("cateringReport").innerHTML = [
    ...Object.entries(mealCounts).map(([meal, count]) => `<article class="mini-row"><strong>${escapeHtml(meal)}</strong><small>${count} meals</small></article>`),
    `<article class="mini-row"><strong>Notes and VIPs</strong><small>${escapeHtml(allergies.join("; ") || "No special notes")}</small></article>`
  ].join("");
  const packetType = document.getElementById("packetType").value || "Planner packet";
  document.getElementById("packetSections").innerHTML = Object.entries({ summary: "Summary", risks: "Risks", timeline: "Timeline", vendors: "Vendors", photos: "Photos" }).map(([key, label]) => `<label><input type="checkbox" data-packet-section="${key}" ${plan.packetSections[key] ? "checked" : ""}> ${label}</label>`).join("");
  document.getElementById("packetPreview").innerHTML = buildPacket(packetType).map(row => `<article class="mini-row"><strong>${escapeHtml(row.title)}</strong><small>${escapeHtml(row.copy)}</small></article>`).join("");
  const accepted = plan.guests.filter(g => g.status === "Accepted").length;
  const openTasks = plan.tasks.filter(t => !t.done).length;
  const booked = plan.vendors.filter(v => ["Booked", "Paid"].includes(v.stage)).length;
  const paidRatio = Math.round((sum(plan.expenses, "paid") / Math.max(sum(plan.expenses, "actual"), 1)) * 100);
  document.getElementById("readinessMethod").innerHTML = [
    ["RSVP readiness", `${accepted}/${plan.guests.length} accepted guests are confirmed.`],
    ["Task readiness", `${openTasks} open tasks remain on the planning path.`],
    ["Vendor readiness", `${booked}/${plan.vendors.length} vendors are secured.`],
    ["Financial readiness", `${paidRatio}% of committed spend is paid.`]
  ].map(([title, copy]) => `<article class="mini-row"><strong>${title}</strong><small>${copy}</small></article>`).join("");
  document.getElementById("changeLogList").innerHTML = plan.changeLog.slice(-12).reverse().map(entry => `<article class="mini-row"><strong>${escapeHtml(entry.at)}</strong><small>${escapeHtml(entry.action)}</small></article>`).join("");
  document.getElementById("snapshotSelect").innerHTML = [`<option value="">Choose snapshot</option>`, ...plan.snapshots.map(s => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name)}</option>`)].join("");
  renderVendorTimelinePreview();
  document.getElementById("exportPackSummary").innerHTML = [
    ["Planner packet", `${buildPacket("Planner packet").length} lines`],
    ["Vendor packet", `${buildPacket("Vendor packet").length} lines`],
    ["Client packet", `${buildPacket("Client packet").length} lines`],
    ["Day brief", `${plan.runSheet.length} run-sheet moments`],
    ["Printable binder", `${getBinderSections().length} sections`]
  ].map(([title, copy]) => `<article class="mini-row"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(copy)}</small></article>`).join("");
  renderCalendarView();
}

function renderVendorTimelinePreview() {
  const select = document.getElementById("vendorPacketSelect");
  const vendors = ["All vendors", ...new Set(plan.runSheet.map(row => row.vendor).filter(Boolean))];
  const current = select.value || "All vendors";
  select.innerHTML = vendors.map(v => `<option ${v === current ? "selected" : ""}>${escapeHtml(v)}</option>`).join("");
  const rows = plan.runSheet.filter(row => current === "All vendors" || row.vendor === current).sort((a, b) => a.time.localeCompare(b.time));
  document.getElementById("vendorTimelinePreview").innerHTML = rows.map(row => `<article class="mini-row"><strong>${escapeHtml(row.time)} ${escapeHtml(row.title)}</strong><small>${escapeHtml(row.location)} | ${escapeHtml(row.owner)} | ${escapeHtml(row.notes || "")}</small></article>`).join("") || `<p class="muted">No timeline moments for this vendor.</p>`;
}

function renderCalendarView() {
  const rows = [
    ...plan.tasks.map(t => ({ date: t.due, title: t.title, type: t.done ? "Task done" : "Task", copy: t.owner })),
    ...plan.expenses.filter(e => Number(e.actual || 0) > Number(e.paid || 0)).map(e => ({ date: e.dueDate, title: e.item, type: "Payment", copy: money.format(Number(e.actual || 0) - Number(e.paid || 0)) })),
    ...plan.events.map(e => ({ date: e.date, title: e.name, type: "Event", copy: `${e.start} ${e.location}` })),
    ...plan.vendors.map(v => ({ date: v.nextFollowUp, title: v.name, type: "Vendor follow-up", copy: v.owner }))
  ].filter(row => row.date).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 16);
  document.getElementById("calendarView").innerHTML = rows.map(row => `<article class="mini-row"><strong>${escapeHtml(row.date)} - ${escapeHtml(row.title)}</strong><small>${escapeHtml(row.type)} | ${escapeHtml(row.copy)}</small></article>`).join("") || `<p class="muted">No dated work yet.</p>`;
}

function renderMiniList(id, rows, titleFn, subFn) {
  document.getElementById(id).innerHTML = rows.map(row => `<article class="mini-row"><strong>${escapeHtml(titleFn(row))}</strong><small>${escapeHtml(subFn(row) || "")}</small></article>`).join("") || `<p class="muted">Nothing tracked yet.</p>`;
}

function buildPacket(type) {
  const base = plan.packetSections.summary ? [
    { title: "Wedding date", copy: `${plan.weddingDate} at ${plan.venue}` },
    { title: "Emergency contact", copy: plan.profile.emergencyContact }
  ] : [];
  const risks = plan.packetSections.risks ? buildRisks().map(r => ({ title: r.title, copy: r.copy })) : [];
  const timeline = plan.packetSections.timeline ? plan.runSheet.map(r => ({ title: `${r.time} ${r.title}`, copy: `${r.location} - ${r.vendor || "Internal"}` })) : [];
  const vendors = plan.packetSections.vendors ? plan.vendors.map(v => ({ title: v.name, copy: `${v.stage} - ${money.format(v.quote || 0)}` })) : [];
  const photos = plan.packetSections.photos ? plan.photos.filter(p => type !== "Family packet" || p.priority === "Must-have").map(p => ({ title: p.shot, copy: p.people })) : [];
  if (type === "Vendor packet") return [...base, ...timeline, ...vendors];
  if (type === "Wedding party packet") return [...base, ...plan.ceremony.map(c => ({ title: c.role, copy: `${c.name} - ${c.music}` })), ...timeline];
  if (type === "Family packet") return [...base, ...photos, ...plan.photoGroups.map(g => ({ title: g.group, copy: g.people }))];
  if (type === "Client packet") {
    return [
      ...base,
      ...(plan.portal.share.timeline ? timeline : []),
      ...(plan.portal.share.vendors ? vendors.filter(v => !v.copy.includes("Research")) : []),
      ...(plan.portal.share.photos ? photos : []),
      ...(plan.portal.share.seating ? plan.tables.map(t => ({ title: t.name, copy: `${t.seats.filter(Boolean).length}/${t.seats.length} seats assigned` })) : []),
      ...(plan.portal.share.budget ? [{ title: "Budget posture", copy: `${money.format(sum(plan.expenses, "actual"))} committed against ${money.format(plan.budgetTarget)}` }] : [])
    ];
  }
  return [...base, ...risks, ...timeline, ...vendors, ...photos, ...plan.tasks.filter(t => !t.done).map(t => ({ title: t.title, copy: `${t.owner} by ${t.due}` }))];
}

function getMessageTemplates() {
  const coupleFirst = plan.couple.split(" and ")[0] || "there";
  return [
    { title: "RSVP reminder", body: `Hi {{guest_name}}, a quick reminder to RSVP for ${plan.couple}'s wedding by ${plan.profile.rsvpDeadline}. We would love to confirm your meal and party details.` },
    { title: "Vendor follow-up", body: `Hi {{vendor_name}}, checking in on next steps for ${plan.couple} at ${plan.venue}. Could you confirm contract, insurance, final balance, and arrival needs?` },
    { title: "Family update", body: `Hi everyone, sharing the latest wedding update for ${plan.couple}: ceremony is planned for ${plan.profile.ceremonyTime}, reception for ${plan.profile.receptionTime}, and the current priority is final confirmations.` },
    { title: "Client weekly update", body: `Hi ${coupleFirst}, this week's planning focus is: ${buildAssistantGuidance().map(item => item.title).slice(0, 3).join("; ")}.` }
  ];
}

function buildAssistantGuidance() {
  const risks = buildRisks();
  const overdueInvoices = plan.invoices.filter(invoice => invoice.status === "Overdue");
  const proposalOpen = plan.proposals.filter(proposal => proposal.status !== "Accepted");
  return [
    ...risks.slice(0, 5).map(risk => ({ title: risk.title, copy: risk.copy })),
    overdueInvoices.length ? { title: "Planner invoice follow-up", copy: `${overdueInvoices.length} planner invoice${overdueInvoices.length > 1 ? "s" : ""} marked overdue.` } : { title: "Planner billing", copy: `${plan.invoices.filter(i => i.status === "Paid").length}/${plan.invoices.length} studio invoices are paid.` },
    proposalOpen.length ? { title: "Proposal opportunity", copy: `${proposalOpen.length} proposal${proposalOpen.length > 1 ? "s" : ""} still need acceptance.` } : { title: "Proposal posture", copy: "All tracked proposals are accepted or no proposals are pending." },
    { title: "Next best action", copy: getUnseatedAccepted().length ? "Finish seating accepted guests before exporting the client packet." : "Export the day brief and vendor-specific timelines for final review." }
  ];
}

function getChecklistTemplate(name) {
  const templates = {
    "Luxury final month": [
      ["Confirm valet, coat check, and guest arrival staffing", "Planner", "High"],
      ["Lock final floral strike and room flip schedule", "Planner", "High"],
      ["Send family and wedding-party movement brief", "Planner", "Medium"],
      ["Confirm vendor meal count and green-room setup", "Venue", "Medium"]
    ],
    "Destination weekend": [
      ["Confirm travel manifest and hotel rooming list", "Planner", "High"],
      ["Send welcome event arrival map", "Planner", "Medium"],
      ["Confirm local transport and backup vehicles", "Planner", "High"],
      ["Prepare emergency contact card", "Couple", "Medium"]
    ],
    "Backyard logistics": [
      ["Confirm power load and generator placement", "Planner", "High"],
      ["Map restroom, catering, trash, and parking zones", "Planner", "High"],
      ["Create rain tent decision deadline", "Couple", "High"],
      ["Notify neighbors of load-in and music windows", "Couple", "Medium"]
    ],
    "Cultural multi-event": [
      ["Build ceremony-by-ceremony family role matrix", "Planner", "High"],
      ["Confirm attire changes and private rooms", "Planner", "High"],
      ["Align catering timing with ritual schedule", "Caterer", "High"],
      ["Create multilingual family packet", "Planner", "Medium"]
    ]
  };
  return (templates[name] || templates["Luxury final month"]).map(([title, owner, priority]) => ({ title, owner, priority }));
}

function renderDocuments() {
  document.getElementById("docGrid").innerHTML = plan.documents.map(doc => `
    <article class="doc-card">
      <div class="status-row"><strong>${escapeHtml(doc.name)}</strong><button class="row-action" data-delete-doc="${doc.id}"><i data-lucide="trash-2"></i></button></div>
      <small>${escapeHtml(doc.owner)}</small>
      <select data-doc="${doc.id}" data-field="status">${["Draft","Review","Approved","Sent"].map(s => `<option ${s === doc.status ? "selected" : ""}>${s}</option>`).join("")}</select>
    </article>`).join("");
  document.getElementById("attachmentList").innerHTML = plan.attachments.map(file => `
    <article class="mini-row">
      <div class="status-row"><strong>${escapeHtml(file.name)}</strong><button class="row-action" data-delete-attachment="${file.id}"><i data-lucide="trash-2"></i></button></div>
      <small>${escapeHtml(file.area)} | ${formatBytes(file.size)} | ${escapeHtml(file.addedAt)}</small>
    </article>
  `).join("") || `<p class="muted">No attachment metadata indexed yet.</p>`;
}

function renderStudio() {
  document.getElementById("coupleDashboard").innerHTML = savedCouples.map(couple => `
    <article class="mini-row">
      <div class="status-row"><strong>${escapeHtml(couple.couple)}</strong><button class="row-action neutral-action" data-load-couple="${couple.id}"><i data-lucide="folder-open"></i></button></div>
      <small>${escapeHtml(couple.weddingDate)} | ${escapeHtml(couple.venue)} | ${money.format(couple.budgetTarget || 0)}</small>
    </article>
  `).join("") || `<p class="muted">No saved couples yet. Save this plan to start a studio dashboard.</p>`;
  document.getElementById("leadList").innerHTML = plan.leads.map(lead => `<article class="mini-row"><strong>${escapeHtml(lead.name)}</strong><small>${escapeHtml(lead.date)} | ${money.format(lead.budget || 0)} | ${escapeHtml(lead.style || "Style TBD")} | ${escapeHtml(lead.stage)}</small></article>`).join("") || `<p class="muted">No leads captured yet.</p>`;
  document.getElementById("proposalList").innerHTML = plan.proposals.map(proposal => `<article class="mini-row"><strong>${escapeHtml(proposal.name)} - ${money.format(proposal.price || 0)}</strong><small>${escapeHtml(proposal.scope)} | ${escapeHtml(proposal.status)}</small></article>`).join("") || `<p class="muted">No proposals yet.</p>`;
  document.getElementById("invoiceList").innerHTML = plan.invoices.map(invoice => `<article class="mini-row"><strong>${escapeHtml(invoice.label)} - ${money.format(invoice.amount || 0)}</strong><small>${escapeHtml(invoice.due)} | ${escapeHtml(invoice.status)}</small></article>`).join("") || `<p class="muted">No planner invoices tracked yet.</p>`;
  const templates = getMessageTemplates();
  const current = document.getElementById("messageTemplateSelect").value || templates[0].title;
  document.getElementById("messageTemplateSelect").innerHTML = templates.map(template => `<option ${template.title === current ? "selected" : ""}>${escapeHtml(template.title)}</option>`).join("");
  document.getElementById("messageTemplateOutput").value = templates.find(template => template.title === current)?.body || "";
  document.getElementById("assistantPanel").innerHTML = buildAssistantGuidance().map(item => `<article class="mini-row"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.copy)}</small></article>`).join("");
  renderChecklistLibrary();
  renderShareReadiness();
  renderCloudSync();
}

function renderCloudSync() {
  const settings = loadCloudSyncSettings();
  const urlInput = document.getElementById("cloudSyncUrl");
  if (!urlInput) return;
  urlInput.value = settings.url || "";
  document.getElementById("cloudSyncAnonKey").value = settings.anonKey || "";
  document.getElementById("cloudSyncId").value = settings.syncId || "";
  document.getElementById("cloudAutoPush").checked = Boolean(settings.autoPush);
  const ready = isCloudSyncReady(settings);
  document.getElementById("cloudPushBtn").disabled = !ready || cloudSyncBusy;
  document.getElementById("cloudPullBtn").disabled = !ready || cloudSyncBusy;
  document.getElementById("cloudSyncStatus").innerHTML = renderCloudStatus();
}

function renderChecklistLibrary() {
  const rows = getChecklistTemplate(document.getElementById("checklistTemplateSelect").value || "Luxury final month");
  document.getElementById("checklistLibraryPreview").innerHTML = rows.map(row => `<article class="mini-row"><strong>${escapeHtml(row.title)}</strong><small>${escapeHtml(row.owner)} | ${escapeHtml(row.priority)}</small></article>`).join("");
}

function renderPortal() {
  const locked = !plan.portal.unlocked;
  document.getElementById("portalLocked").style.display = locked ? "block" : "none";
  document.getElementById("portalLocked").innerHTML = `Enter the portal PIN to preview the client-facing packet.<br><small>Demo PIN: ${escapeHtml(plan.portal.pin)}</small>`;
  document.getElementById("portalContent").style.display = locked ? "none" : "block";
  document.getElementById("portalTitle").textContent = `${plan.couple} at ${plan.venue}`;
  document.getElementById("portalSettings").innerHTML = Object.entries({ timeline: "Timeline", vendors: "Vendors", photos: "Photos", seating: "Seating", guests: "Guest details", budget: "Budget" }).map(([key, label]) => `<label><input type="checkbox" data-portal-share="${key}" ${plan.portal.share[key] ? "checked" : ""}> ${label}</label>`).join("");
  const accepted = plan.guests.filter(g => g.status === "Accepted").reduce((total, g) => total + Number(g.partySize || 1), 0);
  document.getElementById("portalSummary").innerHTML = [
    ["Wedding date", plan.weddingDate, `${Math.max(0, daysUntil(plan.weddingDate))} days remaining`],
    ["Accepted guests", accepted, `${plan.guestTarget || plan.guests.length} target`],
    ["Open tasks", plan.tasks.filter(t => !t.done).length, "Planner-managed"],
    ["Events", plan.events.length, "Weekend itinerary"]
  ].map(([label, value, sub]) => `<article class="kpi"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(sub)}</small></article>`).join("");
  document.getElementById("clientPacketPreview").innerHTML = buildPacket("Client packet").map(row => `<article class="mini-row"><strong>${escapeHtml(row.title)}</strong><small>${escapeHtml(row.copy)}</small></article>`).join("");
  document.getElementById("clientVendorDirectory").innerHTML = plan.portal.share.vendors ? plan.vendors.filter(v => ["Booked", "Paid"].includes(v.stage)).map(v => `<article class="mini-row"><strong>${escapeHtml(v.name)}</strong><small>${escapeHtml(v.category)} | ${escapeHtml(v.contact || "Contact TBD")} | ${escapeHtml(v.nextFollowUp)}</small></article>`).join("") : `<p class="muted">Vendor details hidden from client view.</p>`;
  renderVendorPortalPreview();
  renderRelationshipMap();
  renderSeatingWarnings();
  renderFloorPlan();
  document.getElementById("moodboardList").innerHTML = plan.moodboard.map(item => `<article class="mood-card"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.value)}</span></article>`).join("") || `<p class="muted">No moodboard items yet.</p>`;
}

function renderShareReadiness() {
  const readiness = [
    ["Exported JSON backup", plan.changeLog.some(entry => entry.action.includes("Exported"))],
    ["Client portal PIN set", Boolean(plan.portal.pin && plan.portal.pin !== "0000")],
    ["Client packet sections selected", Object.values(plan.portal.share).some(Boolean)],
    ["Saved couple to dashboard", savedCouples.some(couple => couple.couple === plan.couple)],
    ["Cloud sync configured", isCloudSyncReady()],
    ["Documents indexed", plan.documents.length > 0],
    ["Attachment metadata indexed", plan.attachments.length > 0]
  ];
  document.getElementById("shareReadiness").innerHTML = readiness.map(([title, done]) => `<article class="mini-row"><strong>${done ? "Ready" : "Missing"}: ${escapeHtml(title)}</strong><small>${done ? "Prepared for a polished handoff." : "Recommended before sending to clients or vendors."}</small></article>`).join("");
  document.getElementById("backendReadiness").innerHTML = [
    ["Database", "Use Cloud sync for shared plan data, then expand into dedicated hosted tables as the product grows."],
    ["Authentication", "Add planner, couple, vendor, and family roles."],
    ["Storage", "Store real contracts, invoices, floor plans, and moodboard assets."],
    ["Public routes", "Create /portal, /vendor, and /rsvp links per couple."],
    ["Audit log", "Track who changed each guest, budget, task, or document."],
    ["Email/calendar jobs", "Send reminders and sync deadlines automatically."]
  ].map(([title, copy]) => `<article class="mini-row"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(copy)}</small></article>`).join("");
}

function renderVendorPortalPreview() {
  const select = document.getElementById("portalVendorSelect");
  const vendors = plan.vendors.map(v => v.name);
  const current = select.value || vendors[0] || "";
  select.innerHTML = vendors.map(name => `<option ${name === current ? "selected" : ""}>${escapeHtml(name)}</option>`).join("");
  const vendor = plan.vendors.find(v => v.name === current) || plan.vendors[0];
  if (!vendor) {
    document.getElementById("vendorPortalPreview").innerHTML = `<p class="muted">No vendors available.</p>`;
    return;
  }
  const moments = plan.runSheet.filter(item => item.vendor === vendor.name || item.vendor?.includes(vendor.category) || vendor.category.includes(item.vendor || "___"));
  document.getElementById("vendorPortalPreview").innerHTML = [
    { title: vendor.name, copy: `${vendor.category} | ${vendor.contact || "Contact TBD"} | ${vendor.stage}` },
    { title: "Arrival and follow-up", copy: `${moments[0]?.time || "Call time TBD"} | Next follow-up ${vendor.nextFollowUp}` },
    { title: "Contract status", copy: `${vendor.contract} | Insurance ${vendor.insurance} | Balance ${money.format(vendor.balanceDue || 0)}` },
    ...moments.map(moment => ({ title: `${moment.time} ${moment.title}`, copy: `${moment.location} | ${moment.notes || ""}` }))
  ].map(row => `<article class="mini-row"><strong>${escapeHtml(row.title)}</strong><small>${escapeHtml(row.copy)}</small></article>`).join("");
}

function renderRelationshipMap() {
  const groups = plan.guests.reduce((acc, guest) => {
    const key = `${guest.side || inferGuestSide(guest, plan.couple)} - ${guest.group}`;
    acc[key] = acc[key] || { accepted: 0, total: 0, vip: 0 };
    acc[key].total += Number(guest.partySize || 1);
    if (guest.status === "Accepted") acc[key].accepted += Number(guest.partySize || 1);
    if ((guest.tags || "").toLowerCase().includes("vip")) acc[key].vip += 1;
    return acc;
  }, {});
  document.getElementById("relationshipMap").innerHTML = Object.entries(groups).map(([group, data]) => `<article class="mini-row"><strong>${escapeHtml(group)}</strong><small>${data.accepted}/${data.total} accepted by party size | ${data.vip} VIP flags</small></article>`).join("") || `<p class="muted">No guest groups mapped.</p>`;
}

function renderSeatingWarnings() {
  const seatedNames = new Set(plan.tables.flatMap(table => table.seats).filter(Boolean));
  const warnings = [
    ...getUnseatedAccepted().map(name => ({ title: "Accepted guest unseated", copy: name })),
    ...plan.seatingRules.filter(rule => rule.type === "Keep together" && ![...seatedNames].some(name => rule.rule.includes(name))).map(rule => ({ title: "Keep-together rule needs review", copy: rule.rule })),
    ...plan.tables.filter(table => table.seats.filter(Boolean).length > table.seats.length).map(table => ({ title: "Table over capacity", copy: table.name }))
  ];
  document.getElementById("seatingWarnings").innerHTML = warnings.map(w => `<article class="mini-row"><strong>${escapeHtml(w.title)}</strong><small>${escapeHtml(w.copy)}</small></article>`).join("") || `<p class="muted">No seating warnings detected.</p>`;
}

function renderFloorPlan() {
  document.getElementById("floorPlanCanvas").innerHTML = plan.floorPlan.map(zone => `<div class="floor-zone" style="left:${zone.x}%;top:${zone.y}%;width:${zone.w}%;height:${zone.h}%">${escapeHtml(zone.label)}</div>`).join("");
}

function drawDonut(id, values, colors) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const entries = Object.entries(values);
  const total = entries.reduce((a, [, v]) => a + v, 0) || 1;
  let angle = -Math.PI / 2;
  entries.forEach(([, value], index) => {
    const slice = (value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(120, 120);
    ctx.arc(120, 120, 86, angle, angle + slice);
    ctx.fillStyle = colors[index % colors.length];
    ctx.fill();
    angle += slice;
  });
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(120, 120, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#25211d";
  ctx.font = "700 22px Inter, sans-serif";
  ctx.fillText(`${total}`, 108, 128);
  entries.forEach(([label, value], i) => {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(245, 48 + i * 28, 12, 12);
    ctx.fillStyle = "#756f68";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText(`${label}: ${value}`, 264, 59 + i * 28);
  });
}

function drawBars(id, values) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext("2d");
  const entries = Object.entries(values);
  const max = Math.max(...entries.map(([, value]) => value), 1);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  entries.forEach(([label, value], index) => {
    const y = 22 + index * 34;
    const width = (value / max) * 210;
    ctx.fillStyle = "#e9dfd3";
    ctx.fillRect(120, y, 210, 18);
    ctx.fillStyle = index % 2 ? "#2f6b64" : "#9a5d45";
    ctx.fillRect(120, y, width, 18);
    ctx.fillStyle = "#25211d";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText(label.slice(0, 14), 8, y + 13);
    ctx.fillText(money.format(value), 120 + Math.min(width + 7, 165), y + 13);
  });
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function safeClass(value) {
  return String(value ?? "").replace(/[^a-z0-9_-]/gi, "");
}

function formatBytes(size) {
  const value = Number(size || 0);
  if (value > 1000000) return `${(value / 1000000).toFixed(1)} MB`;
  if (value > 1000) return `${Math.round(value / 1000)} KB`;
  return `${value} B`;
}

function enhanceAccessibility() {
  const labelMap = [
    ["addDecisionBtn", "Add decision"],
    ["undoBtn", "Undo last change"],
    ["aboutBtn", "Open app version and storage details"],
    ["exportBtn", "Export plan"],
    ["printBtn", "Print brief"],
    ["resetBtn", "Restore demo plan"],
    ["newCoupleBtn", "Start a new couple plan"]
  ];
  labelMap.forEach(([id, label]) => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute("aria-label", label);
      if (!el.title) el.title = label;
    }
  });
  document.querySelectorAll(".row-action").forEach(button => {
    const action = button.classList.contains("neutral-action") ? "Load saved couple" : "Delete item";
    button.setAttribute("aria-label", action);
    button.title = action;
  });
  document.querySelectorAll("input, select, textarea").forEach(field => {
    if (field.getAttribute("aria-label") || field.closest("label")) return;
    const label = field.placeholder || field.name || field.id || field.dataset.field || "Field";
    field.setAttribute("aria-label", label);
  });
}

function pushUndo() {
  undoStack.push(JSON.stringify(plan));
  if (undoStack.length > 30) undoStack.shift();
  const undoBtn = document.getElementById("undoBtn");
  if (undoBtn) undoBtn.disabled = false;
}

function confirmAction(message) {
  return window.confirm(message);
}

function filenameSlug(value) {
  return String(value || "vowsuite")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "vowsuite";
}

function exportPlanBackup(reason) {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  downloadFile(`${filenameSlug(plan.couple)}-${reason}-${stamp}.json`, JSON.stringify(plan, null, 2), "application/json");
  recordChange(`Exported ${reason.replaceAll("-", " ")} backup`);
}

function confirmWithBackup(actionLabel) {
  const first = `Before ${actionLabel}, VowSuite can download a JSON backup of the current plan.\n\nChoose OK to download a backup first, or Cancel to continue without downloading.`;
  if (confirmAction(first)) exportPlanBackup("pre-change-backup");
  return confirmAction(`Continue and ${actionLabel}? This replaces the current active plan.`);
}

function activateView(viewName) {
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.view === viewName));
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active-view", view.id === viewName));
  document.body.classList.remove("nav-open");
  document.getElementById("mobileNavToggle")?.setAttribute("aria-expanded", "false");
}

document.addEventListener("click", event => {
  const mobileNavToggle = event.target.closest("#mobileNavToggle");
  if (mobileNavToggle) {
    const isOpen = document.body.classList.toggle("nav-open");
    mobileNavToggle.setAttribute("aria-expanded", String(isOpen));
  }
  const nav = event.target.closest(".nav-item");
  if (nav) {
    activateView(nav.dataset.view);
  }
  const dayJump = event.target.closest("[data-day-jump]");
  if (dayJump) {
    const target = document.getElementById(dayJump.dataset.dayJump)?.closest(".day-section");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (event.target.closest(".menu-action")) {
    setTimeout(() => document.querySelectorAll(".actions-menu[open]").forEach(menu => menu.removeAttribute("open")), 0);
  }
  if (!event.target.closest(".actions-menu")) {
    document.querySelectorAll(".actions-menu[open]").forEach(menu => menu.removeAttribute("open"));
  }
  const searchResult = event.target.closest("[data-search-view]");
  if (searchResult) {
    activateView(searchResult.dataset.searchView);
    document.getElementById("globalSearch").value = "";
    renderGlobalSearch();
  }
  const loadCouple = event.target.closest("[data-load-couple]");
  if (loadCouple) {
    const record = savedCouples.find(couple => couple.id === loadCouple.dataset.loadCouple);
    if (!record) return;
    if (!confirmAction(`Load ${record.couple}? Unsaved changes should be exported or saved first.`)) return;
    pushUndo();
    plan = migratePlan(JSON.parse(record.data));
    recordChange(`Loaded saved couple ${record.couple}`);
    render();
  }
  const vendorSelect = event.target.closest("[data-select-vendor]");
  if (vendorSelect && !event.target.closest("input,select,button")) {
    plan.selectedVendorId = vendorSelect.dataset.selectVendor;
    recordChange(`Selected vendor detail: ${plan.vendors.find(v => v.id === plan.selectedVendorId)?.name || "Vendor"}`);
    render();
  }
  const del = event.target.closest("[data-delete-guest],[data-delete-expense],[data-delete-vendor],[data-delete-doc],[data-delete-table],[data-delete-decision],[data-delete-run],[data-delete-attachment]");
  if (del) {
    if (!confirmAction("Delete this item from the plan?")) return;
    pushUndo();
    if (del.dataset.deleteGuest) {
      const guest = plan.guests.find(g => g.id === del.dataset.deleteGuest);
      if (guest) clearSeatingName(guest.name);
      plan.guests = plan.guests.filter(g => g.id !== del.dataset.deleteGuest);
    }
    if (del.dataset.deleteExpense) plan.expenses = plan.expenses.filter(e => e.id !== del.dataset.deleteExpense);
    if (del.dataset.deleteVendor) plan.vendors = plan.vendors.filter(v => v.id !== del.dataset.deleteVendor);
    if (del.dataset.deleteDoc) plan.documents = plan.documents.filter(d => d.id !== del.dataset.deleteDoc);
    if (del.dataset.deleteTable) plan.tables = plan.tables.filter(t => t.id !== del.dataset.deleteTable);
    if (del.dataset.deleteRun) plan.runSheet = plan.runSheet.filter(r => r.id !== del.dataset.deleteRun);
    if (del.dataset.deleteAttachment) plan.attachments = plan.attachments.filter(a => a.id !== del.dataset.deleteAttachment);
    if (del.dataset.deleteDecision) plan.decisions.splice(Number(del.dataset.deleteDecision), 1);
    recordChange("Deleted an item from the plan");
    render();
  }
  const seat = event.target.closest(".seat");
  if (seat) {
    pushUndo();
    const table = plan.tables.find(t => t.id === seat.dataset.table);
    const index = Number(seat.dataset.seat);
    const selected = document.getElementById("seatGuestPicker").value;
    if (table.seats[index] || selected) table.seats[index] = table.seats[index] ? "" : selected;
    recordChange("Updated seating assignment");
    render();
  }
});

document.addEventListener("dragstart", event => {
  const seat = event.target.closest(".seat.occupied");
  if (!seat) return;
  draggedSeat = { tableId: seat.dataset.table, seatIndex: Number(seat.dataset.seat) };
  event.dataTransfer.effectAllowed = "move";
});

document.addEventListener("dragover", event => {
  if (event.target.closest(".seat")) event.preventDefault();
});

document.addEventListener("drop", event => {
  const seat = event.target.closest(".seat");
  if (!seat || !draggedSeat) return;
  event.preventDefault();
  const fromTable = plan.tables.find(t => t.id === draggedSeat.tableId);
  const toTable = plan.tables.find(t => t.id === seat.dataset.table);
  const toIndex = Number(seat.dataset.seat);
  if (!fromTable || !toTable) return;
  pushUndo();
  const moving = fromTable.seats[draggedSeat.seatIndex];
  fromTable.seats[draggedSeat.seatIndex] = toTable.seats[toIndex] || "";
  toTable.seats[toIndex] = moving;
  draggedSeat = null;
  recordChange("Moved seating assignment by drag and drop");
  render();
});

document.addEventListener("focusin", event => {
  const target = event.target;
  if (target.matches("input,select,textarea") && (target.dataset.field || target.dataset.guest || target.dataset.expense || target.dataset.vendor || target.dataset.taskEdit || target.dataset.runEdit || target.dataset.financeField || target.dataset.weight || target.dataset.budgetCap)) {
    if (target.dataset.undoCaptured) return;
    target.dataset.undoCaptured = "true";
    pushUndo();
  }
});

document.addEventListener("focusout", event => {
  if (event.target?.dataset?.undoCaptured) delete event.target.dataset.undoCaptured;
});

document.addEventListener("input", event => {
  const target = event.target;
  if (target.id === "coupleNames") plan.couple = target.value;
  if (target.id === "venueName") plan.venue = target.value;
  if (target.id === "weddingDate") plan.weddingDate = target.value;
  if (target.id === "budgetTarget") plan.budgetTarget = Number(target.value);
  const profileMap = {
    plannerName: "planner",
    rsvpDeadline: "rsvpDeadline",
    ceremonyTime: "ceremonyTime",
    receptionTime: "receptionTime",
    venueContact: "venueContact",
    emergencyContact: "emergencyContact"
  };
  if (profileMap[target.id]) plan.profile[profileMap[target.id]] = target.value;
  if (target.id === "portalPinSetting") plan.portal.pin = target.value;
  const guest = plan.guests.find(g => g.id === target.dataset.guest);
  if (guest) {
    if (target.dataset.field === "name") replaceSeatingName(guest.name, target.value);
    guest[target.dataset.field] = target.dataset.field === "partySize" ? Number(target.value) : target.value;
  }
  const expense = plan.expenses.find(e => e.id === target.dataset.expense);
  if (expense) expense[target.dataset.field] = ["estimated", "actual", "paid"].includes(target.dataset.field) ? Number(target.value) : target.value;
  const vendor = plan.vendors.find(v => v.id === target.dataset.vendor);
  if (vendor) vendor[target.dataset.field] = ["quote", "deposit", "balanceDue"].includes(target.dataset.field) ? Number(target.value) : target.value;
  const taskEdit = plan.tasks.find(t => t.id === target.dataset.taskEdit);
  if (taskEdit) {
    taskEdit[target.dataset.field] = target.value;
    if (target.dataset.field === "stage") taskEdit.done = target.value === "Done";
  }
  const runEdit = plan.runSheet.find(r => r.id === target.dataset.runEdit);
  if (runEdit) runEdit[target.dataset.field] = target.value;
  if (target.dataset.weight) plan.weights[target.dataset.weight] = Number(target.value);
  if (target.dataset.budgetCap) plan.budgetCaps[target.dataset.budgetCap] = Number(target.value);
  if (target.dataset.financeField) plan.financeModel[target.dataset.financeField] = Number(target.value);
  savePlan();
  if (target.id === "coupleNames") setText("coupleTitle", plan.couple);
  if (target.id === "globalSearch") renderGlobalSearch();
  if (target.id === "coupleNames") renderGuestSideOptions();
  if (["guestSearch", "guestStatusFilter", "taskFilter", "runVendorFilter", "weddingDate", "budgetTarget", "rsvpDeadline", "ceremonyTime", "receptionTime", "portalPinSetting"].includes(target.id) || target.dataset.weight || target.dataset.budgetCap || target.dataset.financeField) render();
});

document.addEventListener("change", event => {
  const target = event.target;
  const vendor = plan.vendors.find(v => v.id === target.dataset.vendor);
  if (vendor) vendor[target.dataset.field] = ["quote", "deposit", "balanceDue"].includes(target.dataset.field) ? Number(target.value) : target.value;
  const doc = plan.documents.find(d => d.id === target.dataset.doc);
  if (doc) doc[target.dataset.field] = target.value;
  const task = plan.tasks.find(t => t.id === target.dataset.task);
  if (task) task.done = target.checked;
  const guest = plan.guests.find(g => g.id === target.dataset.guest);
  if (guest) {
    if (target.dataset.field === "name") replaceSeatingName(guest.name, target.value);
    guest[target.dataset.field] = target.dataset.field === "partySize" ? Number(target.value) : target.value;
  }
  const expense = plan.expenses.find(e => e.id === target.dataset.expense);
  if (expense) expense[target.dataset.field] = ["estimated", "actual", "paid"].includes(target.dataset.field) ? Number(target.value) : target.value;
  const taskEdit = plan.tasks.find(t => t.id === target.dataset.taskEdit);
  if (taskEdit) {
    taskEdit[target.dataset.field] = target.value;
    if (target.dataset.field === "stage") taskEdit.done = target.value === "Done";
  }
  const runEdit = plan.runSheet.find(r => r.id === target.dataset.runEdit);
  if (runEdit) runEdit[target.dataset.field] = target.value;
  if (target.dataset.packetSection) plan.packetSections[target.dataset.packetSection] = target.checked;
  if (target.dataset.portalShare) plan.portal.share[target.dataset.portalShare] = target.checked;
  if (target.dataset.checkType) {
    const list = target.dataset.checkType === "weather" ? plan.weatherPlan : plan.accessibility;
    const item = list.find(row => row.id === target.dataset.checkId);
    if (item) item.done = target.checked;
  }
  if (target.id === "importInput") importPlan(target.files[0]);
  if (target.id === "attachmentInput") addAttachments(target.files);
  if (target.id === "templateSelect" && target.value) applyTemplate(target.value);
  if (vendor || doc || task || taskEdit || runEdit || guest || expense || target.id === "taskFilter" || target.id === "guestStatusFilter" || target.id === "runVendorFilter" || target.id === "vendorPacketSelect" || target.id === "portalVendorSelect" || target.id === "modeSelect" || target.dataset.packetSection || target.dataset.portalShare || target.dataset.checkType || target.id === "attachmentInput") render();
  if (target.id === "packetType") renderReports();
  if (target.id === "messageTemplateSelect") renderStudio();
  if (target.id === "checklistTemplateSelect") renderChecklistLibrary();
});

function handleForm(id, handler) {
  document.getElementById(id).addEventListener("submit", event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    pushUndo();
    handler(data);
    event.target.reset();
    render();
  });
}

handleForm("guestForm", data => {
  plan.guests.push({ id: uid(), name: data.name, email: "", phone: "", side: data.side || getCoupleSides()[0], group: data.group, status: data.status, meal: data.meal, partySize: Number(data.partySize || 1), plusOne: data.plusOne || "", inviteSent: "", inviteMethod: "Email", reminder: "No", tags: "", notes: "" });
  recordChange(`Added guest ${data.name}`);
});
handleForm("setupForm", data => {
  plan.couple = data.couple;
  plan.venue = data.venue;
  plan.weddingDate = data.weddingDate;
  plan.budgetTarget = Number(data.budgetTarget);
  plan.guestTarget = Number(data.guestTarget || plan.guestTarget || 0);
  plan.style = data.style || "";
  recordChange("Applied setup wizard details");
});
handleForm("expenseForm", data => {
  plan.expenses.push({ id: uid(), category: data.category, item: data.item, estimated: Number(data.estimated), actual: Number(data.actual), paid: Number(data.paid || 0), dueDate: data.dueDate || plan.weddingDate });
  recordChange(`Added budget line ${data.item}`);
});
handleForm("vendorForm", data => {
  const vendor = { id: uid(), name: data.name, category: data.category, stage: data.stage, owner: data.owner, contact: "", contract: "Missing", insurance: "Pending", quote: 0, deposit: 0, balanceDue: 0, nextFollowUp: data.nextFollowUp || plan.weddingDate };
  plan.vendors.push(vendor);
  plan.selectedVendorId = vendor.id;
  recordChange(`Added vendor ${data.name}`);
});
handleForm("taskForm", data => {
  plan.tasks.push({ id: uid(), ...data, done: data.stage === "Done" });
  recordChange(`Added task ${data.title}`);
});
handleForm("docForm", data => {
  plan.documents.push({ id: uid(), ...data });
  recordChange(`Added document ${data.name}`);
});
handleForm("runForm", data => {
  plan.runSheet.push({ id: uid(), time: data.time, title: data.title, location: data.location, owner: data.owner, vendor: data.vendor, notes: "" });
  recordChange(`Added run-sheet moment ${data.title}`);
});
handleForm("eventForm", data => {
  plan.events.push({ id: uid(), name: data.name, date: data.date, start: data.start, location: data.location, owner: data.owner || "" });
  recordChange(`Added itinerary event ${data.name}`);
});
handleForm("ceremonyForm", data => { plan.ceremony.push({ id: uid(), ...data }); recordChange(`Added ceremony item ${data.role}`); });
handleForm("musicForm", data => { plan.music.push({ id: uid(), ...data }); recordChange(`Added music item ${data.moment}`); });
handleForm("photoForm", data => { plan.photos.push({ id: uid(), ...data }); recordChange(`Added photo shot ${data.shot}`); });
handleForm("photoGroupForm", data => { plan.photoGroups.push({ id: uid(), ...data }); recordChange(`Added photo group ${data.group}`); });
handleForm("packingForm", data => { plan.packing.push({ id: uid(), ...data }); recordChange(`Added packing item ${data.item}`); });
handleForm("zoneForm", data => { plan.zones.push({ id: uid(), ...data }); recordChange(`Added floor-plan zone ${data.zone}`); });
handleForm("seatRuleForm", data => { plan.seatingRules.push({ id: uid(), ...data }); recordChange(`Added seating rule ${data.type}`); });
handleForm("leadForm", data => {
  plan.leads.push({ id: uid(), name: data.name, date: data.date, budget: Number(data.budget || 0), style: data.style || "", stage: data.stage });
  recordChange(`Captured lead ${data.name}`);
});
handleForm("proposalForm", data => {
  plan.proposals.push({ id: uid(), name: data.name, price: Number(data.price || 0), scope: data.scope, status: data.status });
  recordChange(`Added proposal ${data.name}`);
});
handleForm("invoiceForm", data => {
  plan.invoices.push({ id: uid(), label: data.label, amount: Number(data.amount || 0), due: data.due, status: data.status });
  recordChange(`Added invoice ${data.label}`);
});
handleForm("moodForm", data => {
  plan.moodboard.push({ id: uid(), label: data.label, value: data.value });
  recordChange(`Added moodboard item ${data.label}`);
});

document.getElementById("addDecisionBtn").addEventListener("click", () => {
  pushUndo();
  plan.decisions.unshift({ title: "New decision", owner: "Planner", status: "Open", note: "Add context, options, and approval owner." });
  recordChange("Added a decision placeholder");
  render();
});
document.getElementById("addTableBtn").addEventListener("click", () => {
  pushUndo();
  const capacity = Math.max(2, Number(document.getElementById("tableCapacityInput").value || 6));
  plan.tables.push({ id: uid(), name: `Table ${plan.tables.length + 1}`, seats: Array.from({ length: capacity }, () => "") });
  recordChange("Added reception table");
  render();
});
document.getElementById("addTaskTemplatesBtn").addEventListener("click", () => {
  pushUndo();
  const templates = [
    ["Book core vendors", "Planner", "High", "Backlog"],
    ["Send RSVP reminder batch", "Planner", "Medium", "This Week"],
    ["Confirm final guest count", "Couple", "High", "Waiting"],
    ["Finalize vendor packet", "Planner", "Medium", "Backlog"],
    ["Confirm final payments", "Planner", "High", "Backlog"]
  ];
  templates.forEach(([title, owner, priority, stage], index) => {
    if (!plan.tasks.some(t => t.title === title)) plan.tasks.push({ id: uid(), title, owner, due: plan.weddingDate, priority, dependency: index === 2 ? "RSVP deadline" : "", stage, done: false });
  });
  recordChange("Added recurring planning phase task templates");
  render();
});
document.getElementById("saveCoupleBtn").addEventListener("click", () => {
  const record = { id: uid(), couple: plan.couple, venue: plan.venue, weddingDate: plan.weddingDate, budgetTarget: plan.budgetTarget, data: JSON.stringify(plan) };
  savedCouples = [record, ...savedCouples.filter(couple => couple.couple !== plan.couple)].slice(0, 20);
  saveSavedCouples();
  recordChange(`Saved ${plan.couple} to studio dashboard`);
  render();
});
document.getElementById("cloudSyncSaveBtn").addEventListener("click", () => {
  saveCloudSyncSettings({
    url: document.getElementById("cloudSyncUrl").value,
    anonKey: document.getElementById("cloudSyncAnonKey").value,
    syncId: document.getElementById("cloudSyncId").value,
    autoPush: document.getElementById("cloudAutoPush").checked
  });
  setCloudStatus("Cloud sync settings saved in this browser.", isCloudSyncReady() ? "ok" : "warn");
  renderCloudSync();
});
document.getElementById("cloudSyncGenerateBtn").addEventListener("click", () => {
  document.getElementById("cloudSyncId").value = generateCloudSyncId();
  setCloudStatus("Generated a shareable sync ID. Save settings before syncing.", "idle");
});
document.getElementById("cloudPushBtn").addEventListener("click", async () => {
  await pushCloudPlan();
  renderCloudSync();
});
document.getElementById("cloudPullBtn").addEventListener("click", async () => {
  if (!window.confirm("Pulling will replace this browser's current plan with the cloud copy. Continue?")) return;
  await pullCloudPlan();
  renderCloudSync();
});
document.getElementById("applyChecklistBtn").addEventListener("click", () => {
  pushUndo();
  const rows = getChecklistTemplate(document.getElementById("checklistTemplateSelect").value || "Luxury final month");
  rows.forEach(row => {
    if (!plan.tasks.some(task => task.title === row.title)) plan.tasks.push({ id: uid(), title: row.title, owner: row.owner, due: plan.weddingDate, priority: row.priority, dependency: "", stage: "Backlog", done: false });
  });
  recordChange("Applied checklist library tasks");
  render();
});
document.getElementById("generateAssistantBtn").addEventListener("click", () => {
  recordChange("Refreshed planning assistant guidance");
  render();
});
document.getElementById("portalUnlockBtn").addEventListener("click", () => {
  const input = document.getElementById("portalPinInput").value;
  if (input === plan.portal.pin) {
    plan.portal.unlocked = true;
    recordChange("Unlocked client portal preview");
    render();
  } else {
    window.alert("Portal PIN does not match.");
  }
});
document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirmWithBackup("restore the sample demo plan")) return;
  pushUndo();
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  plan = structuredClone(demoPlan);
  recordChange("Restored sample demo plan");
  render();
});
document.getElementById("newCoupleBtn").addEventListener("click", () => {
  if (!confirmWithBackup("start a blank plan for a new couple")) return;
  pushUndo();
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  plan = createBlankPlan();
  render();
});
document.getElementById("aboutBtn").addEventListener("click", () => {
  const dialog = document.getElementById("aboutDialog");
  if (dialog.showModal) dialog.showModal();
  else window.alert(`VowSuite Wedding Planning Studio ${APP_VERSION}\nLocal browser storage\nGitHub Pages deployment`);
});
document.getElementById("closeAboutBtn").addEventListener("click", () => {
  document.getElementById("aboutDialog").close();
});
document.getElementById("undoBtn").addEventListener("click", () => {
  const previous = undoStack.pop();
  if (!previous) return;
  plan = migratePlan(JSON.parse(previous));
  recordChange("Undid last change");
  render();
});
document.getElementById("printBtn").addEventListener("click", () => window.print());
document.getElementById("exportBtn").addEventListener("click", () => {
  downloadFile("vowsuite-wedding-plan.json", JSON.stringify(plan, null, 2), "application/json");
  recordChange("Exported JSON plan backup");
});
document.getElementById("exportGuestsBtn").addEventListener("click", () => {
  const headers = ["name", "email", "phone", "side", "group", "status", "meal", "partySize", "plusOne", "inviteSent", "inviteMethod", "reminder", "tags", "notes"];
  const rows = [headers.join(","), ...plan.guests.map(g => headers.map(h => csvCell(g[h])).join(","))];
  downloadFile("vowsuite-guests.csv", rows.join("\n"), "text/csv");
  recordChange("Exported guest CSV");
});
document.getElementById("guestCsvInput").addEventListener("change", event => importGuestCsv(event.target.files[0]));
document.getElementById("addDocTemplatesBtn").addEventListener("click", () => {
  pushUndo();
  const templates = ["Floor plan", "Photo shot list", "Song list", "Ceremony script", "Vendor packet", "Family photo combinations", "Load-in manifest", "Emergency contacts"];
  templates.forEach(name => {
    if (!plan.documents.some(doc => doc.name === name)) plan.documents.push({ id: uid(), name, owner: "Planner", status: "Draft" });
  });
  recordChange("Added document checklist template set");
  render();
});
document.getElementById("exportPacketBtn").addEventListener("click", () => {
  const type = document.getElementById("packetType").value || "Planner packet";
  const content = buildPacket(type).map(row => `${row.title}\n${row.copy}`).join("\n\n");
  downloadFile(`${type.toLowerCase().replaceAll(" ", "-")}.txt`, `${plan.couple}\n${type}\n\n${content}`, "text/plain");
  recordChange(`Exported ${type}`);
});
document.getElementById("exportFullPackBtn").addEventListener("click", () => {
  const sections = [
    ["Planner packet", buildPacket("Planner packet")],
    ["Vendor packet", buildPacket("Vendor packet")],
    ["Client packet", buildPacket("Client packet")],
    ["Catering report", plan.guests.filter(g => g.status === "Accepted").map(g => ({ title: g.name, copy: `${g.meal} | party ${g.partySize} | ${g.notes || "No notes"}` }))],
    ["Vendor directory", plan.vendors.map(v => ({ title: v.name, copy: `${v.category} | ${v.contact || "Contact TBD"} | ${v.stage}` }))],
    ["Documents", plan.documents.map(d => ({ title: d.name, copy: `${d.owner} | ${d.status}` }))]
  ];
  const content = sections.map(([title, rows]) => `# ${title}\n${rows.map(row => `- ${row.title}: ${row.copy}`).join("\n")}`).join("\n\n");
  downloadFile("vowsuite-complete-export-pack.txt", `${plan.couple}\n${plan.weddingDate}\n\n${content}`, "text/plain");
  recordChange("Exported complete planning pack");
});
document.getElementById("exportDayBriefBtn").addEventListener("click", () => {
  const rows = [...plan.runSheet].sort((a, b) => a.time.localeCompare(b.time)).map(row => `${row.time} ${row.title}\n${row.location} | ${row.owner} | ${row.vendor || "Internal"}\n${row.notes || ""}`).join("\n\n");
  downloadFile("vowsuite-wedding-day-brief.txt", `${plan.couple}\nWedding day brief\n${plan.weddingDate}\n\n${rows}`, "text/plain");
  recordChange("Exported wedding day brief");
});
document.getElementById("exportBinderBtn").addEventListener("click", () => exportWeddingDayBinder());
document.getElementById("exportBinderReportBtn").addEventListener("click", () => exportWeddingDayBinder());
document.getElementById("exportHtmlPackBtn").addEventListener("click", () => {
  downloadFile("vowsuite-client-packet.html", buildHtmlPacket(), "text/html");
  recordChange("Exported HTML client packet");
});
document.getElementById("exportMobileBriefBtn").addEventListener("click", () => {
  const rows = [...plan.runSheet].sort((a, b) => a.time.localeCompare(b.time)).map(row => `${row.time} - ${row.title} | ${row.location} | ${row.owner} | ${row.vendor || "Internal"}`).join("\n");
  const contacts = [`Planner: ${plan.profile.planner}`, `Venue: ${plan.profile.venueContact}`, `Emergency: ${plan.profile.emergencyContact}`].join("\n");
  downloadFile("vowsuite-mobile-day-brief.txt", `${plan.couple}\n${plan.weddingDate}\n\n${contacts}\n\nRUN SHEET\n${rows}`, "text/plain");
  recordChange("Exported mobile day brief");
});
document.getElementById("saveSnapshotBtn").addEventListener("click", () => {
  pushUndo();
  const snapshot = { id: uid(), name: new Date().toLocaleString(), data: JSON.stringify({ ...plan, snapshots: [] }) };
  plan.snapshots.push(snapshot);
  recordChange(`Saved snapshot ${snapshot.name}`);
  render();
});
document.getElementById("restoreSnapshotBtn").addEventListener("click", () => {
  const id = document.getElementById("snapshotSelect").value;
  const snapshot = plan.snapshots.find(s => s.id === id);
  if (!snapshot) return;
  if (!confirmAction(`Restore snapshot ${snapshot.name}?`)) return;
  pushUndo();
  const existingSnapshots = plan.snapshots;
  plan = migratePlan(JSON.parse(snapshot.data));
  plan.snapshots = existingSnapshots;
  recordChange(`Restored snapshot ${snapshot.name}`);
  render();
});

function applyTemplate(name) {
  const templates = {
    "Micro wedding": { budgetTarget: 18000, guestTarget: 35, style: "Intimate dinner-party", tables: 4 },
    "Luxury ballroom": { budgetTarget: 140000, guestTarget: 180, style: "Black-tie ballroom", tables: 22 },
    "Destination wedding": { budgetTarget: 70000, guestTarget: 75, style: "Travel-forward resort weekend", tables: 10 },
    "Cultural celebration": { budgetTarget: 95000, guestTarget: 220, style: "Multi-event cultural celebration", tables: 28 },
    "Backyard wedding": { budgetTarget: 32000, guestTarget: 90, style: "Warm backyard garden", tables: 12 }
  };
  const template = templates[name];
  if (!template) return;
  pushUndo();
  plan.budgetTarget = template.budgetTarget;
  plan.guestTarget = template.guestTarget;
  plan.style = template.style;
  plan.tables = Array.from({ length: template.tables }, (_, index) => ({ id: uid(), name: `Table ${index + 1}`, seats: ["", "", "", "", "", ""] }));
  recordChange(`Applied ${name} template`);
  render();
}

function importPlan(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      pushUndo();
      plan = migratePlan(JSON.parse(reader.result));
      render();
    } catch {
      window.alert("That file could not be imported. Please choose a valid VowSuite JSON export.");
    }
  };
  reader.readAsText(file);
}

function addAttachments(files) {
  if (!files?.length) return;
  pushUndo();
  const area = document.getElementById("attachmentArea").value || "Other";
  const addedAt = new Date().toISOString().slice(0, 10);
  plan.attachments.push(...Array.from(files).map(file => ({ id: uid(), name: file.name, area, size: file.size, type: file.type || "unknown", addedAt })));
  recordChange(`Indexed ${files.length} attachment${files.length > 1 ? "s" : ""}`);
}

function importGuestCsv(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const lines = reader.result.split(/\r?\n/).filter(Boolean);
      const headers = parseCsvLine(lines.shift()).map(h => h.trim());
      const imported = lines.map(line => {
        const values = parseCsvLine(line);
        const row = Object.fromEntries(headers.map((h, i) => [h, values[i] || ""]));
        return {
          id: uid(),
          name: row.name || row.Name || "Imported guest",
          email: row.email || row.Email || "",
          phone: row.phone || row.Phone || "",
          side: row.side || row.Side || "",
          group: row.group || row.household || row.Household || "Imported",
          status: row.status || "Invited",
          meal: row.meal || "Chicken",
          partySize: Number(row.partySize || row.party || 1),
          plusOne: row.plusOne || "",
          inviteSent: row.inviteSent || "",
          inviteMethod: row.inviteMethod || "Email",
          reminder: row.reminder || "No",
          tags: row.tags || "",
          notes: row.notes || ""
        };
      });
      pushUndo();
      imported.forEach(guest => { guest.side = inferGuestSide(guest, plan.couple); });
      plan.guests.push(...imported);
      recordChange(`Imported ${imported.length} guests from CSV`);
      render();
    } catch {
      window.alert("That CSV could not be imported. Use headers like name, group, status, meal, partySize, notes.");
    }
  };
  reader.readAsText(file);
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (const char of line) {
    if (char === "\"") quoted = !quoted;
    else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else current += char;
  }
  values.push(current);
  return values.map(value => value.trim());
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll("\"", "\"\"")}"`;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function getBinderSections() {
  const timelineRows = [...plan.runSheet].sort((a, b) => a.time.localeCompare(b.time));
  const vendorRows = plan.vendors.filter(v => ["Booked", "Paid", "Proposal", "Shortlisted"].includes(v.stage));
  const acceptedGuests = plan.guests.filter(g => g.status === "Accepted");
  const mealRows = Object.entries(acceptedGuests.reduce((acc, guest) => {
    acc[guest.meal] = (acc[guest.meal] || 0) + Number(guest.partySize || 1);
    return acc;
  }, {})).map(([meal, count]) => ({ title: meal, copy: `${count} meals` }));
  const seatedRows = plan.tables.map(table => ({ title: table.name, copy: table.seats.filter(Boolean).join(", ") || "Open seating" }));
  const paymentRows = plan.expenses
    .filter(expense => Number(expense.actual || 0) > Number(expense.paid || 0))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .map(expense => ({ title: `${expense.dueDate} ${expense.category}`, copy: `${expense.item}: ${money.format(Number(expense.actual || 0) - Number(expense.paid || 0))} due` }));
  return [
    { title: "Command Snapshot", rows: [
      { title: "Couple", copy: plan.couple },
      { title: "Venue", copy: plan.venue },
      { title: "Wedding date", copy: plan.weddingDate },
      { title: "Planner", copy: plan.profile.planner || "Planner TBD" },
      { title: "Emergency", copy: plan.profile.emergencyContact || "Not set" }
    ] },
    { title: "Run Of Show", rows: timelineRows.map(row => ({ title: `${row.time} ${row.title}`, copy: `${row.location} | ${row.owner} | ${row.vendor || "Internal"} | ${row.notes || ""}` })) },
    { title: "Vendor Call Sheet", rows: vendorRows.map(row => ({ title: row.name, copy: `${row.category} | ${row.contact || "Contact TBD"} | ${row.stage} | Balance ${money.format(row.balanceDue || 0)}` })) },
    { title: "Critical Alerts", rows: buildRisks().map(row => ({ title: row.title, copy: row.copy })) },
    { title: "Emergency And Key Contacts", rows: [
      { title: "Planner", copy: plan.profile.planner || "Not set" },
      { title: "Venue", copy: plan.profile.venueContact || "Not set" },
      { title: "Emergency", copy: plan.profile.emergencyContact || "Not set" }
    ] },
    { title: "Catering And Guest Notes", rows: [
      ...mealRows,
      ...acceptedGuests.filter(guest => guest.notes || guest.tags).map(guest => ({ title: guest.name, copy: `${guest.meal} | ${guest.tags || "No tags"} | ${guest.notes || "No notes"}` }))
    ] },
    { title: "Photo And Ceremony", rows: [
      ...plan.ceremony.map(row => ({ title: row.role, copy: `${row.name} | ${row.music || ""}` })),
      ...plan.photos.map(row => ({ title: row.shot, copy: `${row.people} | ${row.priority}` })),
      ...plan.photoGroups.map(row => ({ title: row.group, copy: row.people }))
    ] },
    { title: "Seating", rows: seatedRows },
    { title: "Packing And Load-In", rows: [
      ...plan.packing.map(row => ({ title: row.item, copy: `${row.owner} | ${row.status}` })),
      ...plan.zones.map(row => ({ title: row.zone, copy: `${row.owner} | ${row.notes || ""}` }))
    ] },
    { title: "Payments Due", rows: paymentRows }
  ].map(section => ({ ...section, rows: section.rows.length ? section.rows : [{ title: "No items tracked", copy: "Nothing to list for this section yet." }] }));
}

function exportWeddingDayBinder() {
  downloadFile("vowsuite-wedding-day-binder.html", buildWeddingDayBinder(), "text/html");
  recordChange("Exported printable wedding-day binder");
  render();
}

function buildWeddingDayBinder() {
  const sections = getBinderSections();
  const rows = sections.map(section => `
    <section>
      <h2>${escapeHtml(section.title)}</h2>
      ${section.rows.map(row => `<article><strong>${escapeHtml(row.title)}</strong><small>${escapeHtml(row.copy)}</small></article>`).join("")}
    </section>
  `).join("");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(plan.couple)} Wedding-Day Binder</title>
  <style>
    :root{font-family:Inter,system-ui,sans-serif;color:#25211d;background:#f8f5f0}
    body{margin:0;padding:32px;background:#f8f5f0}
    main{max-width:980px;margin:auto;background:#fffdfa;border:1px solid #ded8d0;border-radius:8px;padding:28px}
    header{border-bottom:3px solid #2f6b64;margin-bottom:24px;padding-bottom:18px}
    h1{font-size:42px;margin:0 0 8px} h2{font-size:24px;margin:28px 0 12px;page-break-after:avoid}
    p{color:#756f68;margin:0} article{break-inside:avoid;border:1px solid #ded8d0;background:#fffaf4;border-radius:8px;padding:12px;margin:8px 0}
    strong,small{display:block} small{color:#756f68;margin-top:4px;line-height:1.45}
    .meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-top:18px}
    .meta article{background:#eef3ef}
    @media print{body{padding:0;background:#fff}main{border:0;border-radius:0}.meta{grid-template-columns:repeat(3,1fr)}section{page-break-inside:avoid}}
  </style>
</head>
<body>
  <main>
    <header>
      <p>Printable wedding-day binder</p>
      <h1>${escapeHtml(plan.couple)}</h1>
      <p>${escapeHtml(plan.weddingDate)} at ${escapeHtml(plan.venue)}</p>
      <div class="meta">
        <article><strong>${Math.max(0, daysUntil(plan.weddingDate))}</strong><small>days remaining</small></article>
        <article><strong>${plan.runSheet.length}</strong><small>run-sheet moments</small></article>
        <article><strong>${plan.vendors.filter(v => ["Booked","Paid"].includes(v.stage)).length}</strong><small>secured vendors</small></article>
      </div>
    </header>
    ${rows}
  </main>
</body>
</html>`;
}

function buildHtmlPacket() {
  const packetRows = buildPacket("Client packet");
  const timelineRows = [...plan.runSheet].sort((a, b) => a.time.localeCompare(b.time));
  const vendorRows = plan.vendors.filter(v => ["Booked", "Paid"].includes(v.stage));
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(plan.couple)} Client Packet</title>
  <style>
    body{font-family:Inter,system-ui,sans-serif;margin:0;background:#f8f5f0;color:#25211d;padding:32px}
    main{max-width:980px;margin:auto;background:#fffdfa;border:1px solid #ded8d0;border-radius:12px;padding:28px}
    h1{font-size:40px;margin:0 0 8px} h2{margin-top:28px;border-top:1px solid #ded8d0;padding-top:18px}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
    article{border:1px solid #ded8d0;background:#fffaf4;border-radius:8px;padding:12px;margin:8px 0}
    small{color:#756f68}.pill{display:inline-block;background:#eef3ef;border-radius:999px;padding:6px 10px;font-weight:700;color:#2f6b64}
  </style>
</head>
<body>
  <main>
    <p class="pill">Client packet</p>
    <h1>${escapeHtml(plan.couple)}</h1>
    <p>${escapeHtml(plan.weddingDate)} at ${escapeHtml(plan.venue)}</p>
    <section class="grid">
      <article><strong>${Math.max(0, daysUntil(plan.weddingDate))}</strong><br><small>days remaining</small></article>
      <article><strong>${plan.guests.filter(g => g.status === "Accepted").length}</strong><br><small>accepted guests</small></article>
      <article><strong>${plan.events.length}</strong><br><small>weekend events</small></article>
      <article><strong>${plan.vendors.filter(v => ["Booked","Paid"].includes(v.stage)).length}</strong><br><small>secured vendors</small></article>
    </section>
    <h2>Highlights</h2>
    ${packetRows.map(row => `<article><strong>${escapeHtml(row.title)}</strong><br><small>${escapeHtml(row.copy)}</small></article>`).join("")}
    <h2>Timeline</h2>
    ${timelineRows.map(row => `<article><strong>${escapeHtml(row.time)} ${escapeHtml(row.title)}</strong><br><small>${escapeHtml(row.location)} | ${escapeHtml(row.owner)} | ${escapeHtml(row.vendor || "Internal")}</small></article>`).join("")}
    <h2>Vendor Directory</h2>
    ${vendorRows.map(row => `<article><strong>${escapeHtml(row.name)}</strong><br><small>${escapeHtml(row.category)} | ${escapeHtml(row.contact || "Contact TBD")} | ${escapeHtml(row.stage)}</small></article>`).join("")}
  </main>
</body>
</html>`;
}

function recordChange(action) {
  plan.changeLog = plan.changeLog || [];
  plan.changeLog.push({ at: new Date().toLocaleString(), action });
  if (plan.changeLog.length > 80) plan.changeLog = plan.changeLog.slice(-80);
}

function replaceSeatingName(oldName, newName) {
  if (!oldName || !newName || oldName === newName) return;
  plan.tables.forEach(table => {
    table.seats = table.seats.map(seat => seat === oldName ? newName : seat);
  });
}

function clearSeatingName(name) {
  if (!name) return;
  plan.tables.forEach(table => {
    table.seats = table.seats.map(seat => seat === name ? "" : seat);
  });
}

render();
