import React, { useState, useEffect, useRef, useCallback } from "react";

/**
 * The Treeman — Field Ops (Mobile-first edition)
 * ------------------------------------------------
 * Single-file React component, drop into any React host.
 * - Bottom navigation (thumb zone) + "More" bottom sheet
 * - Bottom sheets instead of centered modals
 * - Glassmorphic nav & overlays, dark mode toggle
 * - Bento grid dashboard, contextual FAB, micro-interactions
 * - Official Treeman logo embedded (base64) — works offline
 * - localStorage persistence
 *
 * App icon files (for your hosting/PWA manifest):
 *   treeman-icon-512.png, treeman-icon-192.png, apple-touch-icon.png
 */

const STORAGE_KEY = "treeman_v7";

const LOGO_B64 = "data:image/jpeg;base64,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";
const ICON_B64 = "data:image/png;base64,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";

export const DEFAULT_SETTINGS = {
  hazardTypes: [
    "🌳 Deadwood / widow-makers", "⚡ Powerlines nearby", "🏠 Structures in drop zone",
    "🌬️ High wind / weather", "👥 Public / pedestrians", "🚗 Traffic / vehicles",
    "🐝 Wasps / bees / insects", "🐍 Wildlife hazards", "⛰️ Slope / uneven ground",
    "🪓 Chainsaw use", "🪢 Rope & rigging work", "🧗 Aerial / climbing work",
    "🏗️ Chipper in use", "🚜 Machinery / EWP", "💧 Wet / slippery surfaces",
    "🌿 Dense vegetation", "📡 Underground services", "🪨 Debris / trip hazards",
  ],
  gearItems: [
    { id: "helmet", icon: "⛑️", name: "Hard Hat" },
    { id: "visor", icon: "🥽", name: "Face Shield" },
    { id: "ear", icon: "🎧", name: "Ear Protection" },
    { id: "gloves", icon: "🧤", name: "Gloves" },
    { id: "chaps", icon: "🦺", name: "Chainsaw Chaps" },
    { id: "boots", icon: "👢", name: "Steel Cap Boots" },
    { id: "harness", icon: "🪢", name: "Climbing Harness" },
    { id: "rope", icon: "🧵", name: "Climbing Rope" },
    { id: "lanyard", icon: "🔗", name: "Lanyard" },
    { id: "saw", icon: "⚙️", name: "Chainsaw" },
    { id: "pole", icon: "🪚", name: "Pole Saw" },
    { id: "hi-vis", icon: "🟡", name: "Hi-Vis Vest" },
  ],
  equipmentList: [
    "Chainsaw — Husqvarna 550XP", "Chainsaw — Stihl MS400",
    "Chipper — Vermeer BC1000XL", "Aerial Lift / EWP",
    "Climbing Harness Set A", "Climbing Harness Set B",
    "Rigging System / Blocks", "Stump Grinder",
    "Ute / Truck — Fleet 1", "Ute / Truck — Fleet 2",
    "First Aid Kit — Site", "First Aid Kit — Vehicle",
  ],
  talkTopics: [
    { icon: "🪓", title: "Chainsaw Safety", points: "Always engage chain brake when not cutting. Never cut above shoulder height. Check chain tension and sharpness before use. Wear full PPE including chaps and face shield. Plan your escape route before each cut. Never work alone when chainsawing." },
    { icon: "🧗", title: "Working at Height — Climbing", points: "Inspect harness, rope, and all connections before climbing. Two-point anchor at all times above 3m. Never tie off to dead or suspect limbs. Communication with ground crew must be continuous. Establish exclusion zones below the climbing zone before ascending." },
    { icon: "⚡", title: "Powerline Awareness", points: "Maintain 4m clearance from live lines at all times. Assume all lines are live unless confirmed otherwise. Never allow any part of tree, rope, or equipment to contact lines. Contact network provider before work near HV lines. Keep emergency contact ready." },
    { icon: "⚠️", title: "Hazard Identification on Site", points: "Complete a hazard ID sheet before any work begins. Reassess hazards when conditions change. All crew must be briefed on identified hazards. Exclusion zones must be marked before limbs are dropped. All crew must sign the hazard sheet." },
    { icon: "🧤", title: "PPE Inspection & Correct Use", points: "Inspect all PPE before use each day. Chainsaw chaps must be replaced after any contact with a running chain. Damaged climbing ropes must be removed from service immediately. Helmets must be replaced after any significant impact." },
    { icon: "🏗️", title: "Chipper Safety", points: "Never reach into the chipper feed zone. Keep limbs below shoulder height when feeding. Stand to the side, never in front of discharge. Secure long hair and loose clothing. Never clear blockages without full lockout." },
    { icon: "📞", title: "Site Comms & Emergency Plan", points: "Confirm first aider, nearest hospital, and charged phones before starting. Establish hand signals for chainsaw noise. In an emergency: stop work, secure area, call 111, treat casualty, report to supervisor." },
    { icon: "☀️", title: "Fatigue & Heat Management", points: "Take regular breaks in shade. Hydrate frequently — at least 1L/hr in summer. Rotate crew on physically intense tasks. Speak up if tired, unwell, or stressed." },
  ],
  quoteServices: [
    { name: "Tree Removal & Felling", rate: 0 },
    { name: "Crown Pruning", rate: 0 },
    { name: "Canopy Lift", rate: 0 },
    { name: "Hedge Trimming", rate: 0 },
    { name: "Palm Removal / Trimming", rate: 0 },
    { name: "Stump Grinding", rate: 0 },
    { name: "Powerline Clearance", rate: 0 },
    { name: "Emergency Callout", rate: 0 },
    { name: "Arborist Report", rate: 0 },
    { name: "Waste / Green Waste Removal", rate: 0 },
  ],
  incidentTypes: [
    "🩹 Injury — First Aid", "🚑 Injury — Medical Treatment", "🏥 Injury — Serious / Notifiable",
    "😵 Near Miss", "🌳 Property Damage", "⚙️ Equipment Damage / Failure",
    "⚡ Powerline Contact", "🚗 Vehicle Incident", "🔥 Fire", "🌫️ Environmental Spill", "❓ Other",
  ],
  companyInfo: {
    name: "The Treeman Ltd",
    address: "Franklin 2678, South Auckland",
    phone: "09 238 8265",
    email: "mike@thetreeman.co.nz",
    gstNumber: "",
    gstRate: 15,
  },
  darkMode: false,
  navSlots: ["dashboard", "crew", "jobs", "toolbox", "more"],
};

export const DEFAULT_STATE = {
  jobs: [], hazards: [], incidents: [], gearLog: [], maintenance: [], crew: [], talks: [], quotes: [],
  settings: DEFAULT_SETTINGS,
};

function clone(o) { return JSON.parse(JSON.stringify(o)); }

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      ...clone(DEFAULT_STATE), ...parsed,
      settings: { ...clone(DEFAULT_SETTINGS), ...(parsed.settings || {}) },
    };
  } catch (e) {
    return clone(DEFAULT_STATE);
  }
}

function uid() { return Date.now() + Math.random().toString(36).slice(2, 8); }
function fmtDateTime(ts) { return new Date(ts).toLocaleString("en-NZ", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); }
function fmtMoney(n) { return (Number(n) || 0).toLocaleString("en-NZ", { style: "currency", currency: "NZD" }); }
function today() { return new Date().toISOString().split("T")[0]; }
function jobLabel(job) { return job ? (job.name || job.client || job.site || "Untitled job") : ""; }
function findJob(state, id) { return id ? state.jobs.find((j) => j.id === id) : null; }
function crewName(c) { return c ? `${c.first} ${c.last}`.trim() : ""; }
function findCrew(state, id) { return id ? state.crew.find((c) => c.id === id) : null; }
function initials(name) { return (name || "").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase(); }
// Jobs a crew member (by id) is assigned to.
function jobsForCrew(state, crewId) { return state.jobs.filter((j) => (j.crewIds || []).includes(crewId)); }

// Job lifecycle pipeline. Order matters — used for progress + "next step" buttons.
const JOB_STATUSES = [
  { id: "needs_quote", label: "Needs Quote", icon: "📝", badge: "tm-badge-grey" },
  { id: "quoted",      label: "Quoted",      icon: "💷", badge: "tm-badge-amber" },
  { id: "accepted",    label: "Accepted",    icon: "🤝", badge: "tm-badge-amber" },
  { id: "active",      label: "Active / Scheduled", icon: "🚜", badge: "tm-badge-green" },
  { id: "complete",    label: "Complete",    icon: "✅", badge: "tm-badge-green" },
];
function statusMeta(id) { return JOB_STATUSES.find((s) => s.id === id) || JOB_STATUSES[0]; }
function nextStatus(id) {
  const i = JOB_STATUSES.findIndex((s) => s.id === id);
  return i >= 0 && i < JOB_STATUSES.length - 1 ? JOB_STATUSES[i + 1] : null;
}

// All sections that can occupy a configurable nav slot (Jobs is fixed centre).
const NAV_SECTIONS = [
  { id: "dashboard", icon: "🏠", label: "Home" },
  { id: "crew", icon: "👷", label: "Crew" },
  { id: "incidents", icon: "🚨", label: "Incidents" },
  { id: "gear", icon: "🧤", label: "PPE" },
  { id: "maintenance", icon: "🔧", label: "Maint" },
  { id: "toolbox", icon: "📋", label: "Toolbox" },
  { id: "settings", icon: "⚙️", label: "Settings" },
  { id: "more", icon: "☰", label: "More" },
];

const GALLERY_IMAGES = [
  "https://thetreeman.co.nz/wp-content/uploads/2020/11/4FhlAOwA-scaled.jpeg",
  "https://thetreeman.co.nz/wp-content/uploads/2021/01/camr.jpg",
  "https://thetreeman.co.nz/wp-content/uploads/2020/11/5ECWqCSw-scaled.jpeg",
  "https://thetreeman.co.nz/wp-content/uploads/2020/11/E1IRQPgA-scaled.jpeg",
  "https://thetreeman.co.nz/wp-content/uploads/2020/11/CMRuJqjg-scaled.jpeg",
  "https://thetreeman.co.nz/wp-content/uploads/2021/01/Ma_nBBIQ-01.jpg",
  "https://thetreeman.co.nz/wp-content/uploads/2021/01/kaxXLGhw-1.jpg",
  "https://thetreeman.co.nz/wp-content/uploads/2021/01/brian-01.jpg",
  "https://thetreeman.co.nz/wp-content/uploads/2021/01/plame-removel-01.jpg",
];
const HERO_URL = "https://thetreeman.co.nz/wp-content/uploads/2021/01/homeabt.jpg";

// ══════════════════════════════════════════════════════════════
//  STYLES — mobile-first, light + dark themes
// ══════════════════════════════════════════════════════════════
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap');

.tm-root {
  --lime:       #8DC63F;
  --lime-hi:    #A5D95C;
  --green-deep: #16340C;
  --green-mid:  #2D7A1A;
  --leaf-tint:  #E8F5E0;
  --danger:     #E5493A;
  --warn:       #F0920E;

  /* light theme */
  --bg:         #F4F8F0;
  --surface:    #FFFFFF;
  --surface-2:  #F0F6EA;
  --border:     #DCE8D2;
  --text:       #17240F;
  --text-mid:   #5F7454;
  --text-dim:   #93A688;
  --nav-glass:  rgba(255,255,255,0.78);
  --sheet-bg:   #FFFFFF;
  --shadow:     rgba(23,36,15,0.10);
  --shadow-lg:  rgba(23,36,15,0.18);
  --hero-fade:  rgba(22,52,12,0.62);

  font-family: 'Inter', sans-serif;
  background: var(--bg); color: var(--text);
  min-height: 100vh; min-height: 100dvh;
  -webkit-tap-highlight-color: transparent;
  overscroll-behavior-y: contain;
}
.tm-root.dark {
  --bg:         #0D1508;
  --surface:    #16220F;
  --surface-2:  #1C2B13;
  --border:     #2A3D1E;
  --text:       #ECF4E4;
  --text-mid:   #A8BC98;
  --text-dim:   #6F8262;
  --nav-glass:  rgba(13,21,8,0.78);
  --sheet-bg:   #16220F;
  --shadow:     rgba(0,0,0,0.35);
  --shadow-lg:  rgba(0,0,0,0.55);
  --hero-fade:  rgba(0,0,0,0.66);
}
.tm-root *, .tm-root *::before, .tm-root *::after { box-sizing: border-box; }

/* ── header ── */
.tm-header {
  background: #000;
  display: flex; align-items: center; gap: 12px;
  padding: calc(env(safe-area-inset-top, 0px) + 10px) 16px 10px;
  position: sticky; top: 0; z-index: 90;
}
.tm-header-logo { height: 34px; width: auto; display: block; }
.tm-header-spacer { flex: 1; }
.tm-clock { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--lime); }
.tm-theme-btn {
  border: none; background: rgba(141,198,63,0.15); color: var(--lime);
  width: 38px; height: 38px; border-radius: 50%;
  font-size: 17px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: transform .15s;
}
.tm-theme-btn:active { transform: scale(0.88); }

/* ── content area ── */
.tm-panel {
  padding: 16px 16px calc(96px + env(safe-area-inset-bottom, 0px));
  max-width: 640px; margin: 0 auto;
  animation: tm-fadein .22s ease;
}
@keyframes tm-fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  .tm-panel, .tm-sheet, .tm-fab, .tm-press { animation: none !important; transition: none !important; }
}

/* ── bottom nav (glass, thumb zone) ── */
.tm-bottomnav {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 100;
  display: flex; justify-content: space-around; align-items: stretch;
  background: var(--nav-glass);
  backdrop-filter: blur(18px) saturate(1.4);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
  border-top: 1px solid var(--border);
  padding: 6px 4px calc(env(safe-area-inset-bottom, 0px) + 6px);
}
.tm-navbtn {
  flex: 1; border: none; background: transparent; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 6px 0 4px; min-height: 52px;
  color: var(--text-dim); font-family: 'Inter', sans-serif;
  font-size: 10px; font-weight: 600; letter-spacing: .3px;
  transition: color .18s, transform .12s;
  border-radius: 14px;
}
.tm-navbtn:active { transform: scale(0.92); }
.tm-navbtn .ni { font-size: 21px; line-height: 1; transition: transform .18s; }
.tm-navbtn.active { color: var(--green-mid); }
.tm-root.dark .tm-navbtn.active { color: var(--lime); }
.tm-navbtn.active .ni { transform: translateY(-2px) scale(1.12); }
.tm-navbtn .ndot {
  width: 4px; height: 4px; border-radius: 50%;
  background: transparent; margin-top: 1px; transition: background .18s;
}
.tm-navbtn.active .ndot { background: var(--lime); }
.tm-navbtn.centre { color: var(--text-mid); font-weight: 700; }
.tm-navbtn.centre .ni {
  background: linear-gradient(140deg, var(--lime) 0%, var(--green-mid) 100%);
  width: 46px; height: 46px; border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  margin-top: -16px; margin-bottom: 1px; box-shadow: 0 6px 16px var(--shadow-lg);
  font-size: 24px; transition: transform .18s;
}
.tm-navbtn.centre.active { color: var(--green-mid); }
.tm-root.dark .tm-navbtn.centre.active { color: var(--lime); }
.tm-navbtn.centre.active .ni { transform: scale(1.06); }

/* ── FAB ── */
.tm-fab {
  position: fixed; right: 18px; bottom: calc(84px + env(safe-area-inset-bottom, 0px)); z-index: 99;
  width: 58px; height: 58px; border-radius: 20px;
  background: linear-gradient(140deg, var(--lime) 0%, var(--green-mid) 100%);
  color: #fff; font-size: 26px; border: none; cursor: pointer;
  box-shadow: 0 8px 24px var(--shadow-lg);
  display: flex; align-items: center; justify-content: center;
  transition: transform .15s;
  animation: tm-fabin .25s ease;
}
@keyframes tm-fabin { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.tm-fab:active { transform: scale(0.88); }

/* ── cards ── */
.tm-card {
  background: var(--surface); border-radius: 20px;
  border: 1px solid var(--border);
  padding: 18px; margin-bottom: 14px;
  box-shadow: 0 2px 10px var(--shadow);
}
.tm-card-title {
  font-family: 'Bebas Neue', sans-serif; font-size: 18px;
  letter-spacing: 1.5px; color: var(--text);
  margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
}

/* ── bento grid ── */
.tm-bento {
  display: grid; grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: minmax(88px, auto); gap: 10px; margin-bottom: 14px;
}
.tm-bento-tile {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 20px; padding: 14px;
  display: flex; flex-direction: column; justify-content: space-between;
  cursor: pointer; box-shadow: 0 2px 8px var(--shadow);
  transition: transform .14s, box-shadow .14s;
  min-height: 88px;
}
.tm-bento-tile:active { transform: scale(0.96); }
.tm-bento-tile.wide { grid-column: span 2; }
.tm-bento-tile.accent { background: linear-gradient(140deg, var(--green-mid) 0%, var(--green-deep) 100%); border: none; color: #fff; }
.tm-bento-tile.accent .tm-bento-label, .tm-bento-tile.accent .tm-bento-sub { color: rgba(255,255,255,0.92); }
.tm-bento-tile.accent .tm-bento-num { color: var(--lime-hi); }
.tm-bento-num { font-family: 'Bebas Neue', sans-serif; font-size: 40px; line-height: 0.9; color: var(--green-mid); }
.tm-root.dark .tm-bento-num { color: var(--lime); }
.tm-bento-icon { font-size: 26px; line-height: 1; }
.tm-bento-label { font-weight: 700; font-size: 13px; color: var(--text); margin-top: 8px; }
.tm-bento-sub { font-size: 11px; color: var(--text-mid); margin-top: 2px; }

/* ── hero ── */
.tm-hero { border-radius: 22px; overflow: hidden; position: relative; margin-bottom: 14px; height: 168px; }
.tm-hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tm-hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.02) 20%, var(--hero-fade) 100%);
  display: flex; flex-direction: column; justify-content: flex-end; padding: 16px;
}
.tm-hero-overlay h2 { font-family: 'Bebas Neue', sans-serif; font-size: 30px; letter-spacing: 2px; color: #fff; margin: 0; text-shadow: 0 2px 8px rgba(0,0,0,0.4); }
.tm-hero-overlay p { font-size: 12px; color: rgba(255,255,255,0.88); margin: 3px 0 0; }

.tm-photo-strip { display: flex; gap: 10px; overflow-x: auto; margin-bottom: 14px; scrollbar-width: none; padding-bottom: 4px; -webkit-overflow-scrolling: touch; scroll-snap-type: x proximity; }
.tm-photo-strip::-webkit-scrollbar { display: none; }
.tm-photo-strip img { height: 96px; width: 138px; object-fit: cover; border-radius: 16px; flex-shrink: 0; border: 1px solid var(--border); scroll-snap-align: start; }

.tm-section-photo { width: 100%; height: 104px; object-fit: cover; border-radius: 18px; margin-bottom: 14px; border: 1px solid var(--border); }

/* ── forms — big touch targets ── */
.tm-label { font-size: 11px; font-weight: 700; color: var(--text-mid); text-transform: uppercase; letter-spacing: .6px; display: block; margin-bottom: 6px; }
.tm-input, .tm-select, .tm-textarea {
  width: 100%; padding: 13px 14px; min-height: 48px;
  border: 1.5px solid var(--border); border-radius: 14px;
  font-family: 'Inter', sans-serif; font-size: 16px;
  color: var(--text); background: var(--surface-2);
  margin-bottom: 12px; outline: none;
  transition: border-color .2s, box-shadow .2s;
  -webkit-appearance: none; appearance: none;
}
.tm-input:focus, .tm-select:focus, .tm-textarea:focus { border-color: var(--lime); box-shadow: 0 0 0 3px rgba(141,198,63,0.18); }
.tm-textarea { resize: vertical; min-height: 84px; }
.tm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

/* ── buttons ── */
.tm-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  padding: 13px 20px; min-height: 48px;
  border-radius: 14px; border: none;
  font-family: 'Inter', sans-serif; font-weight: 700; font-size: 14px;
  cursor: pointer; transition: transform .12s, opacity .15s;
}
.tm-btn:active { transform: scale(0.95); }
.tm-btn-primary { background: linear-gradient(140deg, var(--lime) 0%, var(--green-mid) 100%); color: #fff; }
.tm-btn-danger { background: var(--danger); color: #fff; }
.tm-btn-outline { background: transparent; color: var(--green-mid); border: 1.5px solid var(--green-mid); }
.tm-root.dark .tm-btn-outline { color: var(--lime); border-color: var(--lime); }
.tm-btn-sm { padding: 8px 14px; min-height: 38px; font-size: 12px; border-radius: 11px; }
.tm-btn-block { width: 100%; }

/* ── badges ── */
.tm-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; }
.tm-badge-green { background: rgba(141,198,63,0.18); color: var(--green-mid); }
.tm-root.dark .tm-badge-green { color: var(--lime); }
.tm-badge-amber { background: rgba(240,146,14,0.15); color: var(--warn); }
.tm-badge-red { background: rgba(229,73,58,0.13); color: var(--danger); }
.tm-badge-grey { background: rgba(128,128,128,0.14); color: var(--text-mid); }

/* ── risk selector ── */
.tm-hazard-level { display: flex; gap: 8px; margin-bottom: 12px; }
.tm-hl-btn { flex: 1; padding: 13px 6px; min-height: 48px; border: 2px solid var(--border); border-radius: 14px; font-size: 13px; font-weight: 700; cursor: pointer; text-align: center; transition: all .15s; background: var(--surface-2); color: var(--text-dim); }
.tm-hl-btn:active { transform: scale(0.95); }
.tm-hl-btn.low.sel { background: var(--green-mid); border-color: var(--green-mid); color: #fff; }
.tm-hl-btn.med.sel { background: var(--warn); border-color: var(--warn); color: #fff; }
.tm-hl-btn.high.sel { background: var(--danger); border-color: var(--danger); color: #fff; }

/* ── check chips ── */
.tm-checkbox-grid { display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px; }
@media (min-width: 420px) { .tm-checkbox-grid { grid-template-columns: 1fr 1fr; } }
.tm-chk-item {
  display: flex; align-items: center; gap: 10px;
  padding: 12px; min-height: 48px;
  border: 1.5px solid var(--border); border-radius: 14px;
  cursor: pointer; font-size: 13px; user-select: none;
  background: var(--surface-2); transition: all .14s;
}
.tm-chk-item:active { transform: scale(0.97); }
.tm-chk-item.checked { background: rgba(141,198,63,0.14); border-color: var(--lime); color: var(--text); font-weight: 600; }
.tm-chk-box { width: 22px; height: 22px; border: 2px solid var(--border); border-radius: 7px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; transition: all .14s; }
.tm-chk-item.checked .tm-chk-box { border-color: var(--green-mid); background: var(--green-mid); color: #fff; }

/* selectable chips (people picker) */
.tm-chip {
  border: 1.5px solid var(--border); background: var(--surface-2); color: var(--text-mid);
  border-radius: 20px; padding: 7px 13px; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all .14s; font-family: inherit;
}
.tm-chip:active { transform: scale(0.95); }
.tm-chip.on { background: rgba(141,198,63,0.16); border-color: var(--lime); color: var(--green-mid); }
.tm-root.dark .tm-chip.on { color: var(--lime); }

/* ── records ── */
.tm-record-item { display: flex; align-items: flex-start; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--border); }
.tm-record-item:last-child { border-bottom: none; }
.tm-record-icon { width: 42px; height: 42px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; background: var(--surface-2); }
.tm-record-body { flex: 1; min-width: 0; }
.tm-record-title { font-weight: 700; font-size: 14px; }
.tm-record-meta { font-size: 12px; color: var(--text-mid); margin-top: 2px; }

/* ── gear grid ── */
.tm-gear-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px; }
@media (max-width: 380px) { .tm-gear-grid { grid-template-columns: repeat(2, 1fr); } }
.tm-gear-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 12px 8px; text-align: center; box-shadow: 0 1px 4px var(--shadow); }
.tm-gear-card .gi { font-size: 26px; margin-bottom: 4px; }
.tm-gear-card .gn { font-weight: 700; font-size: 11px; }
.tm-gear-card .gc { font-size: 10px; color: var(--text-mid); margin-top: 2px; }

/* ── maintenance bars ── */
.tm-maint-item { display: flex; align-items: center; gap: 10px; padding: 12px 0; border-bottom: 1px solid var(--border); }
.tm-maint-item:last-child { border-bottom: none; }
.tm-maint-bar-bg { height: 7px; background: var(--border); border-radius: 4px; overflow: hidden; }
.tm-maint-bar-fill { height: 100%; border-radius: 4px; transition: width .4s; }

/* ── talk cards ── */
.tm-talk-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 14px; margin-bottom: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: transform .13s; }
.tm-talk-card:active { transform: scale(0.97); }
.tm-talk-card h4 { font-weight: 700; font-size: 13px; margin: 0 0 2px; }
.tm-talk-card p { font-size: 11px; color: var(--text-mid); margin: 0; }

/* ── crew avatar ── */
.tm-crew-avatar { width: 44px; height: 44px; border-radius: 50%; background: rgba(141,198,63,0.2); color: var(--green-mid); font-family: 'Bebas Neue', sans-serif; font-size: 17px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tm-root.dark .tm-crew-avatar { color: var(--lime); }

/* ── BOTTOM SHEET (replaces modals) ── */
.tm-sheet-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  display: flex; align-items: flex-end; justify-content: center;
  animation: tm-ovl .2s ease;
}
@keyframes tm-ovl { from { opacity: 0; } to { opacity: 1; } }
.tm-sheet {
  background: var(--sheet-bg);
  border-radius: 26px 26px 0 0;
  width: 100%; max-width: 640px;
  max-height: 88dvh; max-height: 88vh;
  overflow-y: auto;
  padding: 8px 20px calc(env(safe-area-inset-bottom, 0px) + 22px);
  box-shadow: 0 -12px 44px var(--shadow-lg);
  animation: tm-sheetup .28s cubic-bezier(0.32, 0.72, 0.22, 1);
  -webkit-overflow-scrolling: touch;
}
@keyframes tm-sheetup { from { transform: translateY(100%); } to { transform: none; } }
.tm-sheet-handle { width: 44px; height: 5px; border-radius: 3px; background: var(--border); margin: 8px auto 14px; }
.tm-sheet h3 { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1.5px; color: var(--text); margin: 0 0 16px; }
.tm-sheet-actions { display: flex; gap: 10px; margin-top: 16px; }
.tm-sheet-actions .tm-btn { flex: 1; }

/* ── more menu items ── */
.tm-more-item { display: flex; align-items: center; gap: 14px; padding: 15px 6px; border-bottom: 1px solid var(--border); cursor: pointer; font-weight: 600; font-size: 15px; transition: transform .12s; min-height: 54px; }
.tm-more-item:active { transform: scale(0.98); }
.tm-more-item:last-child { border-bottom: none; }
.tm-more-item .mi { font-size: 22px; width: 32px; text-align: center; }
.tm-more-item .chev { margin-left: auto; color: var(--text-dim); }

/* ── signature ── */
.tm-sig-canvas { border: 2px dashed var(--border); border-radius: 14px; width: 100%; height: 90px; cursor: crosshair; background: var(--surface); touch-action: none; display: block; }

/* ── settings pills ── */
.tm-settings-nav { display: flex; gap: 8px; overflow-x: auto; margin-bottom: 14px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.tm-settings-nav::-webkit-scrollbar { display: none; }
.tm-settings-pill { flex-shrink: 0; padding: 10px 16px; min-height: 40px; border-radius: 20px; border: 1.5px solid var(--border); background: var(--surface); font-size: 13px; font-weight: 600; cursor: pointer; color: var(--text-mid); white-space: nowrap; font-family: 'Inter', sans-serif; }
.tm-settings-pill.active { background: var(--green-mid); color: #fff; border-color: var(--green-mid); }
.tm-editable-row { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid var(--border); }
.tm-editable-row:last-child { border-bottom: none; }
.tm-editable-row .tm-input, .tm-editable-row .tm-select { margin-bottom: 0; }

/* ── quote lines ── */
.tm-quote-line { background: var(--surface-2); border: 1px solid var(--border); border-radius: 16px; padding: 12px; margin-bottom: 10px; }
.tm-quote-line-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.tm-quote-line .tm-input, .tm-quote-line .tm-select { margin-bottom: 8px; }
.tm-quote-totals { background: var(--surface-2); border-radius: 16px; padding: 14px; margin-top: 10px; border: 1px solid var(--border); }
.tm-quote-totals-row { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; }
.tm-quote-totals-row.grand { font-weight: 800; font-size: 18px; color: var(--green-mid); border-top: 1px solid var(--border); margin-top: 6px; padding-top: 8px; }
.tm-root.dark .tm-quote-totals-row.grand { color: var(--lime); }

/* ── toast ── */
.tm-toast { position: fixed; bottom: calc(120px + env(safe-area-inset-bottom, 0px)); left: 50%; transform: translateX(-50%) translateY(16px); opacity: 0; background: var(--green-deep); color: var(--lime-hi); padding: 13px 22px; border-radius: 30px; font-size: 13px; font-weight: 700; z-index: 400; transition: transform .28s, opacity .28s; white-space: nowrap; box-shadow: 0 6px 20px var(--shadow-lg); pointer-events: none; visibility: hidden; }
.tm-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; visibility: visible; }

/* confirm dialog */
.tm-confirm { background: var(--sheet-bg); border-radius: 22px; padding: 24px 22px 20px; width: 100%; max-width: 360px; margin: 20px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.35); border: 1px solid var(--border); animation: tm-pop .2s cubic-bezier(0.32,0.72,0.22,1); }
@keyframes tm-pop { from { transform: scale(0.9); opacity: 0; } to { transform: none; opacity: 1; } }
.tm-confirm-icon { font-size: 40px; margin-bottom: 8px; }
.tm-confirm-title { font-weight: 800; font-size: 17px; margin-bottom: 6px; }
.tm-confirm-msg { font-size: 13px; color: var(--text-mid); line-height: 1.5; margin-bottom: 18px; }
.tm-confirm-actions { display: flex; gap: 10px; }
.tm-confirm-actions .tm-btn { flex: 1; }

/* expandable job section pills */
.tm-jobpill { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 10px; box-shadow: 0 2px 8px var(--shadow); overflow: hidden; }
.tm-jobpill-head { display: flex; align-items: center; gap: 12px; padding: 15px 16px; cursor: pointer; min-height: 56px; transition: background .14s; }
.tm-jobpill-head:active { background: var(--surface-2); }
.tm-jobpill-icon { font-size: 22px; }
.tm-jobpill-title { font-weight: 700; font-size: 15px; }
.tm-jobpill-count { font-size: 12px; color: var(--text-mid); margin-top: 1px; }
.tm-jobpill-chev { color: var(--text-dim); font-size: 18px; transition: transform .2s; }
.tm-jobpill.open .tm-jobpill-chev { transform: rotate(90deg); }
.tm-jobpill-add { border: none; background: rgba(141,198,63,0.16); color: var(--green-mid); width: 34px; height: 34px; border-radius: 11px; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: transform .12s; }
.tm-root.dark .tm-jobpill-add { color: var(--lime); }
.tm-jobpill-add:active { transform: scale(0.86); }
.tm-jobpill-body { padding: 0 16px 8px; border-top: 1px solid var(--border); }

.tm-hr { border: none; border-top: 1px solid var(--border); margin: 14px 0; }
.tm-section-head { font-family: 'Bebas Neue', sans-serif; font-size: 17px; letter-spacing: 1.2px; color: var(--text); margin: 4px 0 12px; }
.tm-flex { display: flex; align-items: center; gap: 10px; }
.tm-flex-between { display: flex; align-items: center; justify-content: space-between; }
.tm-text-mid { color: var(--text-mid); font-size: 13px; }
.tm-mt-8 { margin-top: 8px; }
`;

// ══════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ══════════════════════════════════════════════════════════════
function SignaturePad({ onSign, signed }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const isDark = canvas.closest(".tm-root")?.classList.contains("dark");
    ctx.strokeStyle = isDark ? "#ECF4E4" : "#17240F";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    const getPos = (e) => {
      const r = canvas.getBoundingClientRect();
      const sx = canvas.width / r.width, sy = canvas.height / r.height;
      const src = e.touches ? e.touches[0] : e;
      return { x: (src.clientX - r.left) * sx, y: (src.clientY - r.top) * sy };
    };
    const start = (e) => { e.preventDefault(); drawingRef.current = true; lastRef.current = getPos(e); };
    const move = (e) => {
      if (!drawingRef.current) return;
      e.preventDefault();
      const p = getPos(e);
      ctx.beginPath(); ctx.moveTo(lastRef.current.x, lastRef.current.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      lastRef.current = p;
    };
    const end = () => {
      if (drawingRef.current && onSign) onSign(canvas.toDataURL());
      drawingRef.current = false;
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);
    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", move);
      canvas.removeEventListener("touchend", end);
    };
  }, [onSign]);

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    if (onSign) onSign(null);
  };

  return (
    <div>
      <canvas ref={canvasRef} width={420} height={90} className="tm-sig-canvas" />
      <div className="tm-flex tm-mt-8" style={{ gap: 8 }}>
        <button className="tm-btn tm-btn-outline tm-btn-sm" onClick={clear} type="button">Clear</button>
        {signed ? <span className="tm-badge tm-badge-green">✅ Signed</span> : <span className="tm-badge tm-badge-grey">Not yet signed</span>}
      </div>
    </div>
  );
}

/** Bottom sheet — the mobile-native replacement for modals */
function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = orig; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="tm-sheet-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} onTouchStart={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="tm-sheet">
        <div className="tm-sheet-handle" onClick={onClose} />
        {title && <h3>{title}</h3>}
        {children}
      </div>
    </div>
  );
}

/** In-app confirm dialog. window.confirm() is unreliable inside sandboxed iframes,
 *  so we use this everywhere for destructive actions. Controlled via a { message, onYes } object. */
function ConfirmDialog({ data, onClose }) {
  if (!data) return null;
  return (
    <div className="tm-sheet-overlay" style={{ alignItems: "center" }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="tm-confirm">
        <div className="tm-confirm-icon">{data.icon || "⚠️"}</div>
        <div className="tm-confirm-title">{data.title || "Are you sure?"}</div>
        {data.message && <div className="tm-confirm-msg">{data.message}</div>}
        <div className="tm-confirm-actions">
          <button className="tm-btn tm-btn-outline" onClick={onClose}>{data.cancelLabel || "Cancel"}</button>
          <button className={"tm-btn " + (data.danger ? "tm-btn-danger" : "tm-btn-primary")} onClick={() => { const fn = data.onYes; onClose(); if (fn) fn(); }}>
            {data.confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  PEOPLE PICKER — select one or more people from the crew list
//  and/or add manual names. Value is an array of names (strings).
//  Used anywhere names are captured (incident people, witnesses, etc).
// ══════════════════════════════════════════════════════════════
function PeoplePicker({ state, value, onChange, label, placeholder, single }) {
  const names = single ? (value ? [value] : []) : (value || []);
  const [manual, setManual] = useState("");

  const has = (n) => names.some((x) => x.toLowerCase() === n.toLowerCase());
  const emit = (next) => onChange(single ? (next[0] || "") : next);

  const toggle = (n) => {
    if (has(n)) emit(names.filter((x) => x.toLowerCase() !== n.toLowerCase()));
    else emit(single ? [n] : [...names, n]);
  };
  const addManual = () => {
    const n = manual.trim();
    if (!n) return;
    if (!has(n)) emit(single ? [n] : [...names, n]);
    setManual("");
  };
  const removeName = (n) => emit(names.filter((x) => x !== n));

  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label className="tm-label">{label}</label>}

      {/* selected chips */}
      {!!names.length && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {names.map((n) => (
            <span key={n} className="tm-badge tm-badge-green" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px" }}>
              {n}
              <span onClick={() => removeName(n)} style={{ cursor: "pointer", fontWeight: 800 }}>✕</span>
            </span>
          ))}
        </div>
      )}

      {/* crew quick-pick */}
      {!!state.crew.length && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {state.crew.map((c) => {
            const n = crewName(c);
            const on = has(n);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(n)}
                className={"tm-chip" + (on ? " on" : "")}
              >
                {on ? "✓ " : "+ "}{n}
              </button>
            );
          })}
        </div>
      )}

      {/* manual entry */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="tm-input" style={{ marginBottom: 0 }}
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addManual(); } }}
          placeholder={placeholder || "Type a name…"}
        />
        <button type="button" className="tm-btn tm-btn-outline" style={{ flexShrink: 0 }} onClick={addManual}>Add</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════════════════════════════
export default function TreemanApp({ initialState, onPersist }) {
  const [state, setStateRaw] = useState(initialState);
  const setState = useCallback((updater) => {
    setStateRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (onPersist) onPersist(next);
      return next;
    });
  }, [onPersist]);
  const [tab, setTab] = useState("dashboard");
  const [moreOpen, setMoreOpen] = useState(false);
  const [activeJobId, setActiveJobId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const [toastToken, setToastToken] = useState(0); // bumps on each toast() call
  const [clock, setClock] = useState("");
  const [fabAction, setFabAction] = useState(null); // set by panels
  const [confirmData, setConfirmData] = useState(null); // in-app confirm dialog

  // Persistence handled by the sync layer via onPersist (see App.jsx).

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-NZ", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    setToastShow(true);
    setToastToken((t) => t + 1); // restart the auto-dismiss timer below
  }, []);

  // Auto-dismiss: re-runs whenever a new toast fires (token changes). The cleanup
  // clears the previous timer, so this is immune to re-renders and rapid toasts.
  useEffect(() => {
    if (!toastShow) return;
    const id = setTimeout(() => setToastShow(false), 2600);
    return () => clearTimeout(id);
  }, [toastToken, toastShow]);

  // Ask for confirmation via the in-app dialog. Pass { title, message, danger, confirmLabel, onYes }.
  const confirm = useCallback((opts) => setConfirmData(opts), []);

  const updateSettings = (patch) => setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  const dark = state.settings.darkMode;

  // Fully configurable 5-slot nav. Middle slot (index 2) gets the raised centre styling.
  const defaultSlots = ["dashboard", "crew", "jobs", "toolbox", "more"];
  const slots = (state.settings.navSlots && state.settings.navSlots.length === 5)
    ? state.settings.navSlots : defaultSlots;
  const sectionMeta = (id) => (id === "jobs" ? { id: "jobs", icon: "🌲", label: "Jobs" } : (NAV_SECTIONS.find((s) => s.id === id) || { id, icon: "•", label: id }));
  const NAV = slots.map(sectionMeta);
  // Anything not in a slot shows in More.
  const inSlots = new Set(slots);
  const MORE_ITEMS = [{ id: "jobs", icon: "🌲", label: "Jobs" }, ...NAV_SECTIONS].filter((s) => s.id !== "more" && !inSlots.has(s.id));

  const goTab = (id) => {
    if (id === "more") { setMoreOpen(true); return; }
    setTab(id);
    setMoreOpen(false);
    setActiveJobId(null);
    window.scrollTo({ top: 0 });
  };

  const navActive = (id) => {
    if (id === "more") return MORE_ITEMS.some((m) => m.id === tab);
    return tab === id;
  };

  const panelProps = { state, setState, toast, confirm, setFabAction, activeJobId, setActiveJobId, goTab };

  return (
    <div className={"tm-root" + (dark ? " dark" : "")}>
      <style>{styles}</style>

      <header className="tm-header">
        <a href="https://www.thetreeman.co.nz" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center" }}>
          <img className="tm-header-logo" src={LOGO_B64} alt="The Treeman — visit website" />
        </a>
        <div className="tm-header-spacer" />
        <div className="tm-clock">{clock}</div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "var(--text-dim)", marginLeft: 6, opacity: 0.7 }}>v13</span>
        <button
          className="tm-theme-btn"
          onClick={() => updateSettings({ darkMode: !dark })}
          aria-label="Toggle dark mode"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </header>

      {tab === "dashboard" && <DashboardPanel state={state} goTab={goTab} openJob={(id) => { setActiveJobId(id); setTab("jobs"); }} />}
      {tab === "jobs" && <JobsPanel {...panelProps} />}
      {tab === "gear" && <GearPanel {...panelProps} />}
      {tab === "maintenance" && <MaintenancePanel {...panelProps} />}
      {tab === "crew" && <CrewPanel {...panelProps} openJob={(id) => { setActiveJobId(id); setTab("jobs"); }} />}
      {tab === "incidents" && <IncidentsPanel {...panelProps} openJob={(id) => { setActiveJobId(id); setTab("jobs"); }} />}
      {tab === "toolbox" && <ToolboxPanel {...panelProps} />}
      {tab === "settings" && <SettingsPanel settings={state.settings} updateSettings={updateSettings} toast={toast} />}

      {/* Contextual FAB — single primary action per tab */}
      {fabAction && (
        <button className="tm-fab" onClick={fabAction.onClick} aria-label={fabAction.label}>+</button>
      )}

      <nav className="tm-bottomnav">
        {NAV.map((n, i) => {
          const isCentre = i === 2; // middle slot always gets the raised treatment
          return (
            <button
              key={n.id + i}
              className={"tm-navbtn" + (navActive(n.id) ? " active" : "") + (isCentre ? " centre" : "")}
              onClick={() => goTab(n.id)}
            >
              <span className="ni">{n.icon}</span>
              {n.label}
              <span className="ndot" />
            </button>
          );
        })}
      </nav>

      {/* "More" bottom sheet */}
      <Sheet open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
        {MORE_ITEMS.map((m) => (
          <div className="tm-more-item" key={m.id} onClick={() => goTab(m.id)}>
            <span className="mi">{m.icon}</span>{m.label}<span className="chev">›</span>
          </div>
        ))}
        <div className="tm-flex" style={{ marginTop: 18, gap: 10, justifyContent: "center" }}>
          <img src={ICON_B64} alt="" style={{ width: 34, height: 34, borderRadius: 10 }} />
          <span className="tm-text-mid" style={{ fontSize: 12 }}>{state.settings.companyInfo.name} — Field Ops</span>
        </div>
      </Sheet>

      <ConfirmDialog data={confirmData} onClose={() => setConfirmData(null)} />

      <div className={"tm-toast" + (toastShow ? " show" : "")}>{toastMsg}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  DASHBOARD — bento grid
// ══════════════════════════════════════════════════════════════
function DashboardPanel({ state, goTab, openJob }) {
  const now = new Date();
  const h = now.getHours();
  const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-NZ", { weekday: "long", day: "numeric", month: "long" });

  const activeJobs = state.jobs.filter((j) => j.status !== "complete").length;
  const openHazards = state.hazards.filter((x) => x.status === "open").length;
  const openIncidents = state.incidents.filter((x) => x.status !== "closed").length;
  const dueMaint = state.maintenance.filter((m) => m.nextDue && new Date(m.nextDue) <= now).length;
  const quotesWon = state.quotes.filter((q) => q.status === "accepted").length;

  const activity = [
    ...state.jobs.map((j) => ({ ts: j.ts, text: "Job — " + jobLabel(j), icon: "🌲" })),
    ...state.hazards.map((x) => ({ ts: x.ts, text: "Hazard sheet — " + (x.site || "Unknown site"), icon: "⚠️" })),
    ...state.incidents.map((x) => ({ ts: x.ts, text: "Incident — " + (x.type || "Report"), icon: "🚨" })),
    ...state.gearLog.map((g) => ({ ts: g.ts, text: "PPE logged — " + g.crew, icon: "🧤" })),
    ...state.maintenance.map((m) => ({ ts: m.ts, text: "Serviced: " + m.equip, icon: "🔧" })),
    ...state.talks.map((t) => ({ ts: t.ts, text: "Toolbox: " + t.title, icon: "📋" })),
    ...state.quotes.map((q) => ({ ts: q.ts, text: "Quote — " + q.client, icon: "💷" })),
  ].sort((a, b) => b.ts - a.ts).slice(0, 6);

  return (
    <div className="tm-panel">
      <div className="tm-hero">
        <img src={HERO_URL} alt="The Treeman team at work" />
        <div className="tm-hero-overlay">
          <h2>{greet} 🌿</h2>
          <p>{dateStr}</p>
        </div>
      </div>

      {openIncidents > 0 && (
        <div className="tm-card" style={{ background: "rgba(229,73,58,0.1)", borderColor: "var(--danger)", padding: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🚨</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{openIncidents} open incident{openIncidents > 1 ? "s" : ""}</div>
            <div className="tm-text-mid" style={{ fontSize: 12 }}>Tap to review and follow up</div>
          </div>
          <button className="tm-btn tm-btn-danger tm-btn-sm" onClick={() => goTab("incidents")}>Review</button>
        </div>
      )}

      {/* Bento grid */}
      <div className="tm-bento">
        <div className="tm-bento-tile accent wide" onClick={() => goTab("jobs")}>
          <div className="tm-flex-between">
            <span className="tm-bento-icon">🌲</span>
            <span className="tm-bento-num">{activeJobs}</span>
          </div>
          <div>
            <div className="tm-bento-label">Active Jobs</div>
            <div className="tm-bento-sub">Everything ties back to a job — tap to manage</div>
          </div>
        </div>

        <div className="tm-bento-tile" onClick={() => goTab("jobs")}>
          <span className="tm-bento-icon">⚠️</span>
          <div><div className="tm-bento-num" style={{ fontSize: 30 }}>{openHazards}</div><div className="tm-bento-label">Open Hazards</div></div>
        </div>

        <div className="tm-bento-tile" onClick={() => goTab("incidents")}>
          <span className="tm-bento-icon">🚨</span>
          <div><div className="tm-bento-num" style={{ fontSize: 30 }}>{openIncidents}</div><div className="tm-bento-label">Incidents</div></div>
        </div>

        <div className="tm-bento-tile" onClick={() => goTab("jobs")}>
          <span className="tm-bento-icon">💷</span>
          <div><div className="tm-bento-num" style={{ fontSize: 30 }}>{quotesWon}</div><div className="tm-bento-label">Quotes Won</div></div>
        </div>

        <div className="tm-bento-tile" onClick={() => goTab("maintenance")}>
          <span className="tm-bento-icon">🔧</span>
          <div><div className="tm-bento-num" style={{ fontSize: 30 }}>{dueMaint}</div><div className="tm-bento-label">Maint. Due</div></div>
        </div>
      </div>

      <div className="tm-photo-strip">
        {GALLERY_IMAGES.map((src, i) => <img key={i} src={src} alt="Treeman job" loading="lazy" />)}
      </div>

      <div className="tm-card">
        <div className="tm-card-title"><span>📅</span> Recent Activity</div>
        {!activity.length
          ? <p className="tm-text-mid">No activity yet — get the team started!</p>
          : activity.map((a, i) => (
            <div className="tm-record-item" key={i}>
              <div className="tm-record-icon">{a.icon}</div>
              <div className="tm-record-body">
                <div className="tm-record-title">{a.text}</div>
                <div className="tm-record-meta">{fmtDateTime(a.ts)}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  JOBS PANEL — the hub. Everything is created and lives inside a job.
// ══════════════════════════════════════════════════════════════
function JobPill({ icon, title, count, open, onToggle, onAdd, addLabel, children }) {
  return (
    <div className={"tm-jobpill" + (open ? " open" : "")}>
      <div className="tm-jobpill-head" onClick={onToggle}>
        <span className="tm-jobpill-icon">{icon}</span>
        <div style={{ flex: 1 }}>
          <div className="tm-jobpill-title">{title}</div>
          <div className="tm-jobpill-count">{count}</div>
        </div>
        <button className="tm-jobpill-add" onClick={(e) => { e.stopPropagation(); onAdd(); }} aria-label={addLabel || ("Add " + title)}>+</button>
        <span className="tm-jobpill-chev">›</span>
      </div>
      {open && <div className="tm-jobpill-body">{children}</div>}
    </div>
  );
}

function JobsPanel({ state, setState, toast, confirm, setFabAction, activeJobId, setActiveJobId, goTab }) {
  const [jobSheetOpen, setJobSheetOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // which add-form is open inside a job
  const [addForm, setAddForm] = useState(null); // 'quote' | 'hazard' | 'incident' | 'crew' | null
  const [viewRec, setViewRec] = useState(null);  // { kind, rec }
  const [editIncident, setEditIncident] = useState(null);
  const [openSection, setOpenSection] = useState(null); // 'quotes'|'hazards'|'incidents'|'crew'

  // start-date prompt when scheduling
  const [schedFor, setSchedFor] = useState(null);
  const [schedDate, setSchedDate] = useState(today);

  const openNewJob = useCallback(() => {
    setEditing(null);
    setJobSheetOpen(true);
  }, []);

  useEffect(() => {
    // FAB creates a new job from the list; inside a job it's hidden (job has its own add buttons)
    if (!activeJobId) setFabAction({ label: "New job", onClick: openNewJob });
    else setFabAction(null);
    return () => setFabAction(null);
  }, [setFabAction, openNewJob, activeJobId]);

  const saveJob = (data) => {
    if (editing) {
      setState((st) => ({ ...st, jobs: st.jobs.map((j) => j.id === editing.id ? { ...j, ...data } : j) }));
      toast("✅ Job updated");
    } else {
      const record = { id: uid(), ts: Date.now(), status: "needs_quote", crewIds: [], ...data };
      setState((st) => ({ ...st, jobs: [record, ...st.jobs] }));
      toast("✅ Job created");
    }
    setJobSheetOpen(false);
  };

  const setJobStatus = (id, status, extra = {}) => {
    setState((st) => ({ ...st, jobs: st.jobs.map((j) => j.id === id ? { ...j, status, ...extra } : j) }));
  };

  const setJobCrew = (id, crewIds) => {
    setState((st) => ({ ...st, jobs: st.jobs.map((j) => j.id === id ? { ...j, crewIds } : j) }));
  };

  const advanceStatus = (job) => {
    const nxt = nextStatus(job.status);
    if (!nxt) return;
    // Scheduling → ask for a start date
    if (nxt.id === "active") { setSchedFor(job); setSchedDate(job.startDate || today()); return; }
    confirm({
      title: `Move to ${nxt.label}?`,
      message: `"${jobLabel(job)}" will be marked as ${nxt.label}.`,
      confirmLabel: "Move",
      onYes: () => { setJobStatus(job.id, nxt.id); toast(`${nxt.icon} ${nxt.label}`); },
    });
  };

  const goBackStatus = (job) => {
    const prev = JOB_STATUSES[JOB_STATUSES.findIndex((s) => s.id === job.status) - 1];
    if (!prev) return;
    confirm({
      title: `Move back to ${prev.label}?`,
      confirmLabel: "Move back",
      onYes: () => { setJobStatus(job.id, prev.id); toast("Moved back"); },
    });
  };

  const confirmSchedule = () => {
    setJobStatus(schedFor.id, "active", { startDate: schedDate });
    toast("🚜 Scheduled");
    setSchedFor(null);
  };

  const removeJob = (id) => {
    const linked = state.hazards.filter((h) => h.jobId === id).length
      + state.incidents.filter((x) => x.jobId === id).length
      + state.quotes.filter((q) => q.jobId === id).length;
    confirm({
      title: "Delete this job?",
      message: linked > 0 ? `${linked} linked record(s) (quotes, hazards, incidents) will be deleted too. This can't be undone.` : "This can't be undone.",
      danger: true, confirmLabel: "Delete",
      onYes: () => {
        setState((st) => ({
          ...st,
          jobs: st.jobs.filter((j) => j.id !== id),
          hazards: st.hazards.filter((h) => h.jobId !== id),
          incidents: st.incidents.filter((x) => x.jobId !== id),
          quotes: st.quotes.filter((q) => q.jobId !== id),
        }));
        setActiveJobId(null);
        toast("Job deleted");
      },
    });
  };

  const deleteRecord = (kind, recId) => {
    const key = kind === "quote" ? "quotes" : kind === "hazard" ? "hazards" : "incidents";
    confirm({
      title: `Delete this ${kind}?`, danger: true, confirmLabel: "Delete",
      onYes: () => {
        setState((st) => ({ ...st, [key]: st[key].filter((r) => r.id !== recId) }));
        setViewRec(null);
        toast(`${kind[0].toUpperCase() + kind.slice(1)} deleted`);
      },
    });
  };

  // ════════ JOB DETAIL VIEW ════════
  const activeJob = findJob(state, activeJobId);
  if (activeJob) {
    const jobHazards = state.hazards.filter((h) => h.jobId === activeJob.id);
    const jobIncidents = state.incidents.filter((x) => x.jobId === activeJob.id);
    const jobQuotes = state.quotes.filter((q) => q.jobId === activeJob.id);
    const quotedTotal = jobQuotes.reduce((s, q) => s + (q.total || 0), 0);
    const sm = statusMeta(activeJob.status);
    const nxt = nextStatus(activeJob.status);
    // crew assigned to this job, referenced by id
    const jobCrewIds = activeJob.crewIds || [];
    const jobCrew = jobCrewIds.map((id) => findCrew(state, id)).filter(Boolean);

    return (
      <div className="tm-panel">
        <button className="tm-btn tm-btn-outline tm-btn-sm" onClick={() => setActiveJobId(null)} style={{ marginBottom: 14 }}>‹ All Jobs</button>

        {/* Job header + pipeline */}
        <div className="tm-card">
          <div className="tm-flex-between">
            <div className="tm-card-title" style={{ margin: 0 }}><span>🌲</span> {jobLabel(activeJob)}</div>
            <span className={"tm-badge " + sm.badge}>{sm.icon} {sm.label}</span>
          </div>
          <div className="tm-text-mid" style={{ marginTop: 8, lineHeight: 1.7, fontSize: 13 }}>
            {activeJob.client && <div>👤 {activeJob.client}</div>}
            {activeJob.site && <div>📍 {activeJob.site}</div>}
            {activeJob.phone && <div>📞 {activeJob.phone}</div>}
            {activeJob.jobType && <div>🌳 {activeJob.jobType}</div>}
            {activeJob.status === "active" && activeJob.startDate && <div>📅 Scheduled {activeJob.startDate}</div>}
            {activeJob.notes && <div style={{ marginTop: 6, fontStyle: "italic" }}>{activeJob.notes}</div>}
          </div>

          {/* Pipeline progress dots */}
          <div style={{ display: "flex", gap: 4, marginTop: 14 }}>
            {JOB_STATUSES.map((s) => {
              const idx = JOB_STATUSES.findIndex((x) => x.id === activeJob.status);
              const here = JOB_STATUSES.findIndex((x) => x.id === s.id);
              const done = here <= idx;
              return <div key={s.id} title={s.label} style={{ flex: 1, height: 6, borderRadius: 3, background: done ? "var(--green-mid)" : "var(--border)" }} />;
            })}
          </div>

          {/* State-change buttons */}
          <div className="tm-flex" style={{ gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            {nxt && (
              <button className="tm-btn tm-btn-primary tm-btn-sm" onClick={() => advanceStatus(activeJob)}>
                {nxt.icon} Move to {nxt.label} ›
              </button>
            )}
            {activeJob.status !== "needs_quote" && (
              <button className="tm-btn tm-btn-outline tm-btn-sm" onClick={() => goBackStatus(activeJob)}>‹ Back</button>
            )}
          </div>
          <div className="tm-flex" style={{ gap: 8, marginTop: 10 }}>
            <button className="tm-btn tm-btn-outline tm-btn-sm" onClick={() => { setEditing(activeJob); setJobSheetOpen(true); }}>Edit</button>
            <button className="tm-btn tm-btn-danger tm-btn-sm" onClick={() => removeJob(activeJob.id)}>Delete Job</button>
          </div>
        </div>

        {/* ── One expandable pill per section. Tap header to expand, + to add. ── */}
        <JobPill
          icon="💷" title="Quotes"
          count={`${jobQuotes.length} · ${fmtMoney(quotedTotal)}`}
          open={openSection === "quotes"}
          onToggle={() => setOpenSection(openSection === "quotes" ? null : "quotes")}
          onAdd={() => setAddForm("quote")}
        >
          {!jobQuotes.length ? <p className="tm-text-mid" style={{ padding: "10px 0" }}>No quotes yet.</p> : jobQuotes.map((qq) => {
            const b = qq.status === "accepted" ? "tm-badge-green" : qq.status === "declined" ? "tm-badge-red" : qq.status === "sent" ? "tm-badge-amber" : "tm-badge-grey";
            return (
              <div className="tm-record-item" key={qq.id} onClick={() => setViewRec({ kind: "quote", rec: qq })} style={{ cursor: "pointer" }}>
                <div className="tm-record-icon">💷</div>
                <div className="tm-record-body">
                  <div className="tm-record-title">{fmtMoney(qq.total)}</div>
                  <div className="tm-record-meta">{qq.date} · <span className={"tm-badge " + b}>{qq.status}</span></div>
                </div>
                <span style={{ color: "var(--text-dim)", alignSelf: "center" }}>›</span>
              </div>
            );
          })}
        </JobPill>

        <JobPill
          icon="⚠️" title="Hazard Sheets"
          count={`${jobHazards.length} sheet${jobHazards.length === 1 ? "" : "s"}`}
          open={openSection === "hazards"}
          onToggle={() => setOpenSection(openSection === "hazards" ? null : "hazards")}
          onAdd={() => setAddForm("hazard")}
        >
          {!jobHazards.length ? <p className="tm-text-mid" style={{ padding: "10px 0" }}>No hazard sheets yet.</p> : jobHazards.map((h) => {
            const label = h.risk === "high" ? "🔴 High" : h.risk === "med" ? "🟡 Medium" : "🟢 Low";
            const signed = h.signers.filter((s) => s.signed).length;
            return (
              <div className="tm-record-item" key={h.id} onClick={() => setViewRec({ kind: "hazard", rec: h })} style={{ cursor: "pointer" }}>
                <div className="tm-record-icon">⚠️</div>
                <div className="tm-record-body">
                  <div className="tm-record-title">{h.site || "Hazard sheet"}</div>
                  <div className="tm-record-meta">{h.date} · {label} · {signed}/{h.signers.length} signed</div>
                </div>
                <span style={{ color: "var(--text-dim)", alignSelf: "center" }}>›</span>
              </div>
            );
          })}
        </JobPill>

        <JobPill
          icon="🚨" title="Incidents"
          count={jobIncidents.length ? `${jobIncidents.length} report${jobIncidents.length === 1 ? "" : "s"}` : "None 🌿"}
          open={openSection === "incidents"}
          onToggle={() => setOpenSection(openSection === "incidents" ? null : "incidents")}
          onAdd={() => setAddForm("incident")}
        >
          {!jobIncidents.length ? <p className="tm-text-mid" style={{ padding: "10px 0" }}>No incidents on this job. 🌿</p> : jobIncidents.map((x) => {
            const sb = x.severity === "high" ? "tm-badge-red" : x.severity === "med" ? "tm-badge-amber" : "tm-badge-green";
            return (
              <div className="tm-record-item" key={x.id} onClick={() => setViewRec({ kind: "incident", rec: x })} style={{ cursor: "pointer" }}>
                <div className="tm-record-icon">🚨</div>
                <div className="tm-record-body">
                  <div className="tm-record-title">{x.type}</div>
                  <div className="tm-record-meta">{x.date} {x.time} · <span className={"tm-badge " + sb}>{x.severity}</span></div>
                </div>
                <span style={{ color: "var(--text-dim)", alignSelf: "center" }}>›</span>
              </div>
            );
          })}
        </JobPill>

        <JobPill
          icon="👷" title="Assigned Crew"
          count={jobCrew.length ? `${jobCrew.length} on the job` : "None assigned"}
          open={openSection === "crew"}
          onToggle={() => setOpenSection(openSection === "crew" ? null : "crew")}
          onAdd={() => setAddForm("crew")}
          addLabel="Assign"
        >
          {!jobCrew.length ? <p className="tm-text-mid" style={{ padding: "10px 0" }}>No crew assigned. Tap Assign — they'll be available to sign this job's hazard sheets.</p> : jobCrew.map((c) => (
            <div className="tm-record-item" key={c.id}>
              <div className="tm-crew-avatar">{initials(crewName(c))}</div>
              <div className="tm-record-body">
                <div className="tm-record-title">{crewName(c)}</div>
                <div className="tm-record-meta">{c.role}</div>
              </div>
              <button className="tm-btn tm-btn-danger tm-btn-sm" onClick={() => confirm({ title: "Remove from job?", message: `${crewName(c)} will be unassigned from this job.`, danger: true, confirmLabel: "Remove", onYes: () => setJobCrew(activeJob.id, jobCrewIds.filter((id) => id !== c.id)) })}>✕</button>
            </div>
          ))}
        </JobPill>

        {/* ── Add-forms as bottom sheets, jobId locked to this job ── */}
        {addForm === "quote" && <QuoteForm state={state} setState={setState} toast={toast} jobId={activeJob.id} job={activeJob} onClose={() => setAddForm(null)}
          onSaved={() => { setAddForm(null); setOpenSection("quotes"); if (activeJob.status === "needs_quote") setJobStatus(activeJob.id, "quoted"); }} />}
        {addForm === "hazard" && <HazardForm state={state} setState={setState} toast={toast} jobId={activeJob.id} job={activeJob} onClose={() => setAddForm(null)} onSaved={() => { setAddForm(null); setOpenSection("hazards"); }} />}
        {addForm === "incident" && <IncidentForm state={state} setState={setState} toast={toast} jobId={activeJob.id} job={activeJob} onClose={() => setAddForm(null)} onSaved={() => { setAddForm(null); setOpenSection("incidents"); }} />}
        {addForm === "crew" && <AssignCrewSheet state={state} job={activeJob} onClose={() => setAddForm(null)} onSave={(ids) => { setJobCrew(activeJob.id, ids); setAddForm(null); setOpenSection("crew"); toast("✅ Crew assigned"); }} />}

        {/* Incident edit form (opened from the incident viewer) */}
        {editIncident && <IncidentForm state={state} setState={setState} toast={toast} editing={editIncident} job={activeJob} onClose={() => setEditIncident(null)} onSaved={() => setEditIncident(null)} />}

        {/* Record viewers */}
        {viewRec && viewRec.kind === "quote" && <QuoteView state={state} setState={setState} rec={viewRec.rec} onClose={() => setViewRec(null)} onDelete={() => deleteRecord("quote", viewRec.rec.id)} />}
        {viewRec && viewRec.kind === "hazard" && <HazardView state={state} rec={viewRec.rec} onClose={() => setViewRec(null)} onDelete={() => deleteRecord("hazard", viewRec.rec.id)} />}
        {viewRec && viewRec.kind === "incident" && !editIncident && (() => {
          const live = state.incidents.find((x) => x.id === viewRec.rec.id) || viewRec.rec;
          return <IncidentView state={state} setState={setState} rec={live} onClose={() => setViewRec(null)} onDelete={() => deleteRecord("incident", viewRec.rec.id)} onEdit={(r) => setEditIncident(r)} />;
        })()}

        <JobSheet open={jobSheetOpen} onClose={() => setJobSheetOpen(false)} editing={editing} onSave={saveJob} />

        {/* schedule date prompt */}
        <Sheet open={!!schedFor} onClose={() => setSchedFor(null)} title="🚜 Schedule Job">
          <p className="tm-text-mid" style={{ marginBottom: 12 }}>Set the start date for <b>{schedFor && jobLabel(schedFor)}</b>.</p>
          <label className="tm-label">Start Date</label>
          <input className="tm-input" type="date" value={schedDate} onChange={(e) => setSchedDate(e.target.value)} />
          <div className="tm-sheet-actions">
            <button className="tm-btn tm-btn-outline" onClick={() => setSchedFor(null)}>Cancel</button>
            <button className="tm-btn tm-btn-primary" onClick={confirmSchedule}>Schedule</button>
          </div>
        </Sheet>
      </div>
    );
  }

  // ════════ JOBS LIST VIEW ════════
  const counts = (id) => ({
    h: state.hazards.filter((x) => x.jobId === id).length,
    i: state.incidents.filter((x) => x.jobId === id).length,
    q: state.quotes.filter((x) => x.jobId === id).length,
  });

  const q = search.trim().toLowerCase();
  const filtered = state.jobs.filter((j) => {
    if (filter !== "all" && j.status !== filter) return false;
    if (!q) return true;
    return [j.name, j.client, j.site, j.phone, statusMeta(j.status).label].filter(Boolean).some((v) => v.toLowerCase().includes(q));
  });

  const FILTERS = [{ id: "all", label: "All" }, ...JOB_STATUSES.map((s) => ({ id: s.id, label: s.label }))];

  return (
    <div className="tm-panel">
      <div className="tm-section-head">Jobs</div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <input className="tm-input" style={{ marginBottom: 0, paddingLeft: 40 }} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search client, site, name..." />
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.5 }}>🔍</span>
        {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "var(--text-dim)" }}>✕</button>}
      </div>

      {/* Status filter pills */}
      <div className="tm-settings-nav" style={{ marginBottom: 14 }}>
        {FILTERS.map((f) => {
          const n = f.id === "all" ? state.jobs.length : state.jobs.filter((j) => j.status === f.id).length;
          return (
            <button key={f.id} className={"tm-settings-pill" + (filter === f.id ? " active" : "")} onClick={() => setFilter(f.id)}>
              {f.label}{n > 0 ? ` (${n})` : ""}
            </button>
          );
        })}
      </div>

      <div className="tm-card">
        {!state.jobs.length
          ? <p className="tm-text-mid">No jobs yet — tap + to create your first. Everything (quotes, hazards, incidents, crew) lives inside a job.</p>
          : !filtered.length
            ? <p className="tm-text-mid">No jobs match your search.</p>
            : filtered.map((j) => {
              const c = counts(j.id);
              const sm = statusMeta(j.status);
              return (
                <div className="tm-record-item" key={j.id} onClick={() => { setActiveJobId(j.id); window.scrollTo({ top: 0 }); }} style={{ cursor: "pointer" }}>
                  <div className="tm-record-icon">🌲</div>
                  <div className="tm-record-body">
                    <div className="tm-record-title">{jobLabel(j)}</div>
                    <div className="tm-record-meta">{j.site || j.client || "—"}{j.status === "active" && j.startDate ? " · 📅 " + j.startDate : ""}</div>
                    <div style={{ marginTop: 5, display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span className={"tm-badge " + sm.badge}>{sm.icon} {sm.label}</span>
                      {c.q > 0 && <span className="tm-badge tm-badge-grey">💷 {c.q}</span>}
                      {c.h > 0 && <span className="tm-badge tm-badge-grey">⚠️ {c.h}</span>}
                      {c.i > 0 && <span className="tm-badge tm-badge-red">🚨 {c.i}</span>}
                    </div>
                  </div>
                  <span style={{ color: "var(--text-dim)", alignSelf: "center" }}>›</span>
                </div>
              );
            })}
      </div>

      <JobSheet open={jobSheetOpen} onClose={() => setJobSheetOpen(false)} editing={editing} onSave={saveJob} />
    </div>
  );
}

/** Job create/edit bottom sheet (self-contained state) */
/** Address field with free OpenStreetMap (Nominatim) autocomplete. No API key needed.
 *  Biased to New Zealand. Falls back to a plain text field if the lookup fails/offline. */
function AddressInput({ value, onChange, label, placeholder }) {
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);
  const boxRef = useRef(null);
  const skipNext = useRef(false);

  useEffect(() => {
    if (skipNext.current) { skipNext.current = false; return; }
    if (timer.current) clearTimeout(timer.current);
    const q = (value || "").trim();
    if (q.length < 4) { setResults([]); setOpen(false); return; }
    timer.current = setTimeout(async () => {
      try {
        setLoading(true);
        const url = "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=nz&limit=5&q=" + encodeURIComponent(q);
        const res = await fetch(url, { headers: { "Accept-Language": "en-NZ" } });
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
      } catch (e) {
        setResults([]); setOpen(false); // offline / blocked → silently behave as plain input
      } finally {
        setLoading(false);
      }
    }, 450); // debounce; Nominatim asks for <=1 req/sec
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [value]);

  useEffect(() => {
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (r) => {
    skipNext.current = true; // don't re-search the value we just set
    onChange(r.display_name);
    setResults([]); setOpen(false);
  };

  return (
    <div style={{ position: "relative", marginBottom: 12 }} ref={boxRef}>
      {label && <label className="tm-label">{label}</label>}
      <input
        className="tm-input" style={{ marginBottom: 0 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => { if (results.length) setOpen(true); }}
        placeholder={placeholder || "Start typing an address…"}
        autoComplete="off"
      />
      {loading && <div style={{ position: "absolute", right: 12, top: label ? 38 : 14, fontSize: 12, color: "var(--text-dim)" }}>…</div>}
      {open && results.length > 0 && (
        <div style={{
          position: "absolute", zIndex: 50, left: 0, right: 0, top: "100%", marginTop: 4,
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
          boxShadow: "0 8px 24px var(--shadow-lg)", overflow: "hidden",
        }}>
          {results.map((r) => (
            <div
              key={r.place_id}
              onClick={() => pick(r)}
              style={{ padding: "11px 13px", fontSize: 13, cursor: "pointer", borderBottom: "1px solid var(--border)", lineHeight: 1.4 }}
            >
              📍 {r.display_name}
            </div>
          ))}
          <div style={{ padding: "7px 13px", fontSize: 10, color: "var(--text-dim)" }}>Address data © OpenStreetMap</div>
        </div>
      )}
    </div>
  );
}

function JobSheet({ open, onClose, editing, onSave }) {
  const jobTypes = ["Tree Removal", "Crown Pruning", "Canopy Lift", "Hedge Trimming", "Palm Trimming / Removal", "Stump Grinding", "Emergency Response", "Arborist Report / Inspection", "Powerline Clearance", "Commercial", "Other"];
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [site, setSite] = useState("");
  const [phone, setPhone] = useState("");
  const [jobType, setJobType] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(editing?.name || ""); setClient(editing?.client || ""); setSite(editing?.site || "");
    setPhone(editing?.phone || ""); setJobType(editing?.jobType || ""); setNotes(editing?.notes || "");
  }, [open, editing]);

  const submit = () => {
    if (!client.trim() && !name.trim() && !site.trim()) return; // validated by caller toast
    onSave({ name, client, site, phone, jobType, notes });
  };

  return (
    <Sheet open={open} onClose={onClose} title={editing ? "🌲 Edit Job" : "🌲 New Job"}>
      <label className="tm-label">Job Name / Reference</label>
      <input className="tm-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Karaka phoenix palm removal" />
      <div className="tm-row">
        <div><label className="tm-label">Client</label><input className="tm-input" value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client name" /></div>
        <div><label className="tm-label">Phone</label><input className="tm-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" /></div>
      </div>
      <AddressInput value={site} onChange={setSite} label="Site Address" placeholder="Start typing an address…" />
      <label className="tm-label">Job Type</label>
      <select className="tm-select" value={jobType} onChange={(e) => setJobType(e.target.value)}>
        <option value="">Select...</option>
        {jobTypes.map((j) => <option key={j}>{j}</option>)}
      </select>
      <label className="tm-label">Notes</label>
      <textarea className="tm-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Access, gate codes, special instructions..." />
      {!editing && <p className="tm-text-mid" style={{ fontSize: 12, marginBottom: 8 }}>New jobs start at <b>Needs Quote</b>. Add a quote from inside the job, then move it along the pipeline.</p>}
      <div className="tm-sheet-actions">
        <button className="tm-btn tm-btn-outline" onClick={onClose}>Cancel</button>
        <button className="tm-btn tm-btn-primary" onClick={submit}>{editing ? "Save Changes" : "Create Job"}</button>
      </div>
    </Sheet>
  );
}

/** Assign crew to a job (multi-select from global crew list) */
function AssignCrewSheet({ state, job, onClose, onSave }) {
  const [sel, setSel] = useState(job.crewIds || []);
  const toggle = (id) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  return (
    <Sheet open onClose={onClose} title="👷 Assign Crew">
      {!state.crew.length
        ? <p className="tm-text-mid">No crew in the system yet. Add team members in the Crew section first.</p>
        : (
          <div className="tm-checkbox-grid">
            {state.crew.map((c) => (
              <div key={c.id} className={"tm-chk-item" + (sel.includes(c.id) ? " checked" : "")} onClick={() => toggle(c.id)}>
                <div className="tm-chk-box">{sel.includes(c.id) ? "✓" : ""}</div>
                <span>{crewName(c)} · {c.role}</span>
              </div>
            ))}
          </div>
        )}
      <div className="tm-sheet-actions">
        <button className="tm-btn tm-btn-outline" onClick={onClose}>Cancel</button>
        <button className="tm-btn tm-btn-primary" onClick={() => onSave(sel)}>Save</button>
      </div>
    </Sheet>
  );
}

// ══════════════════════════════════════════════════════════════
//  INCIDENTS PANEL — all incidents across every job + standalone ones.
//  New incidents logged here are standalone (no job link).
// ══════════════════════════════════════════════════════════════
function IncidentsPanel({ state, setState, toast, confirm, setFabAction, openJob }) {
  const [addOpen, setAddOpen] = useState(false);
  const [viewId, setViewId] = useState(null);
  const [editRec, setEditRec] = useState(null);
  const [filter, setFilter] = useState("all"); // all | open | closed

  const openNew = useCallback(() => setAddOpen(true), []);
  useEffect(() => {
    setFabAction({ label: "Log incident", onClick: openNew });
    return () => setFabAction(null);
  }, [setFabAction, openNew]);

  const deleteIncident = (id) => {
    confirm({
      title: "Delete this incident?", danger: true, confirmLabel: "Delete",
      onYes: () => {
        setState((st) => ({ ...st, incidents: st.incidents.filter((r) => r.id !== id) }));
        setViewId(null);
        toast("Incident deleted");
      },
    });
  };

  const all = [...state.incidents].sort((a, b) => b.ts - a.ts);
  const list = all.filter((x) => filter === "all" ? true : filter === "open" ? x.status !== "closed" : x.status === "closed");
  const openCount = all.filter((x) => x.status !== "closed").length;
  const viewRec = viewId ? state.incidents.find((x) => x.id === viewId) : null; // live record

  const sevBadge = (s) => s === "high" ? "tm-badge-red" : s === "med" ? "tm-badge-amber" : "tm-badge-green";
  const FILTERS = [
    { id: "all", label: `All (${all.length})` },
    { id: "open", label: `Open (${openCount})` },
    { id: "closed", label: "Closed" },
  ];

  return (
    <div className="tm-panel">
      <div className="tm-section-head">Incidents</div>
      <p className="tm-text-mid" style={{ marginBottom: 12, fontSize: 13 }}>
        Every incident across all jobs, plus any standalone ones. Tap + to log an incident that isn't tied to a job.
      </p>

      <div className="tm-settings-nav" style={{ marginBottom: 14 }}>
        {FILTERS.map((f) => (
          <button key={f.id} className={"tm-settings-pill" + (filter === f.id ? " active" : "")} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="tm-card">
        {!list.length
          ? <p className="tm-text-mid">No incidents{filter !== "all" ? " in this filter" : ""}. 🌿</p>
          : list.map((x) => {
            const job = findJob(state, x.jobId);
            return (
              <div className="tm-record-item" key={x.id} onClick={() => setViewId(x.id)} style={{ cursor: "pointer" }}>
                <div className="tm-record-icon">🚨</div>
                <div className="tm-record-body">
                  <div className="tm-record-title">{x.type}</div>
                  <div className="tm-record-meta">{x.date} {x.time}{x.site ? " · " + x.site : ""}</div>
                  <div style={{ marginTop: 5, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span className={"tm-badge " + sevBadge(x.severity)}>{x.severity === "high" ? "🔴 Serious" : x.severity === "med" ? "🟡 Moderate" : "🟢 Minor"}</span>
                    {x.notifiable && <span className="tm-badge tm-badge-red">Notifiable</span>}
                    <span className={"tm-badge " + (x.status === "closed" ? "tm-badge-green" : "tm-badge-grey")}>{x.status === "closed" ? "Closed" : "Open"}</span>
                    {job
                      ? <span className="tm-badge tm-badge-grey">🌲 {jobLabel(job)}</span>
                      : <span className="tm-badge tm-badge-grey">No job</span>}
                  </div>
                </div>
                <span style={{ color: "var(--text-dim)", alignSelf: "center" }}>›</span>
              </div>
            );
          })}
      </div>

      {addOpen && <IncidentForm state={state} setState={setState} toast={toast} jobId={null} job={null} onClose={() => setAddOpen(false)} onSaved={() => setAddOpen(false)} />}
      {editRec && <IncidentForm state={state} setState={setState} toast={toast} editing={editRec} job={findJob(state, editRec.jobId)} onClose={() => setEditRec(null)} onSaved={() => setEditRec(null)} />}
      {viewRec && !editRec && <IncidentView state={state} setState={setState} rec={viewRec} onClose={() => setViewId(null)} onDelete={() => deleteIncident(viewRec.id)} openJob={openJob} onEdit={(r) => setEditRec(r)} />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  INCIDENT — form + view (used inside a Job, or standalone)
// ══════════════════════════════════════════════════════════════
function IncidentForm({ state, setState, toast, jobId, job, editing, onClose, onSaved }) {
  const e0 = editing || {};
  // Back-compat: old records stored people/witnesses as plain strings.
  const toArr = (v) => Array.isArray(v) ? v : (v ? [v] : []);
  const [type, setType] = useState(e0.type || "");
  const [date, setDate] = useState(e0.date || today());
  const [time, setTime] = useState(e0.time || new Date().toTimeString().slice(0, 5));
  const [site, setSite] = useState(e0.site ?? (job?.site || ""));
  const [severity, setSeverity] = useState(e0.severity || "");
  const [peopleInvolved, setPeopleInvolved] = useState(toArr(e0.peopleInvolved ?? e0.personInvolved));
  const [injuryDetails, setInjuryDetails] = useState(e0.injuryDetails || "");
  const [description, setDescription] = useState(e0.description || "");
  const [immediateActions, setImmediateActions] = useState(e0.immediateActions || "");
  const [witnesses, setWitnesses] = useState(toArr(e0.witnesses));
  const [notifiable, setNotifiable] = useState(!!e0.notifiable);
  const [reportedBy, setReportedBy] = useState(e0.reportedBy || "");
  const [signed, setSigned] = useState(!!e0.signed);

  const save = () => {
    if (!type) { toast("⚠️ Select an incident type"); return; }
    if (!severity) { toast("⚠️ Select a severity"); return; }
    if (!description.trim()) { toast("⚠️ Describe what happened"); return; }
    const fields = {
      type, date, time, site, severity,
      peopleInvolved, injuryDetails, description, immediateActions, witnesses,
      notifiable, reportedBy, signed,
    };
    if (editing) {
      setState((st) => ({ ...st, incidents: st.incidents.map((x) => x.id === editing.id ? { ...x, ...fields } : x) }));
      toast("✅ Incident updated");
    } else {
      const record = { id: uid(), ts: Date.now(), jobId: jobId ?? null, status: "open", ...fields };
      setState((st) => ({ ...st, incidents: [record, ...st.incidents] }));
      toast("✅ Incident reported");
    }
    onSaved();
  };

  return (
    <Sheet open onClose={onClose} title={editing ? "🚨 Edit Incident" : "🚨 Report Incident"}>
      <label className="tm-label">Incident Type</label>
      <select className="tm-select" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Select...</option>
        {state.settings.incidentTypes.map((t) => <option key={t}>{t}</option>)}
      </select>
      <div className="tm-row">
        <div><label className="tm-label">Date</label><input className="tm-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div><label className="tm-label">Time</label><input className="tm-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
      </div>
      <label className="tm-label">Location / Site</label>
      <input className="tm-input" value={site} onChange={(e) => setSite(e.target.value)} placeholder="Where did it happen?" />

      <hr className="tm-hr" />
      <div className="tm-section-head">Severity</div>
      <div className="tm-hazard-level">
        <div className={"tm-hl-btn low" + (severity === "low" ? " sel" : "")} onClick={() => setSeverity("low")}>🟢 Minor</div>
        <div className={"tm-hl-btn med" + (severity === "med" ? " sel" : "")} onClick={() => setSeverity("med")}>🟡 Moderate</div>
        <div className={"tm-hl-btn high" + (severity === "high" ? " sel" : "")} onClick={() => setSeverity("high")}>🔴 Serious</div>
      </div>
      <div className={"tm-chk-item" + (notifiable ? " checked" : "")} onClick={() => setNotifiable((v) => !v)} style={{ marginBottom: 12 }}>
        <div className="tm-chk-box">{notifiable ? "✓" : ""}</div>
        <span>Potentially notifiable to WorkSafe NZ (death, serious injury/illness, or dangerous incident)</span>
      </div>

      <hr className="tm-hr" />
      <div className="tm-section-head">Details</div>
      <PeoplePicker state={state} value={peopleInvolved} onChange={setPeopleInvolved} label="Person(s) Involved" placeholder="Add a name…" />
      <label className="tm-label">Injury Details (if any)</label>
      <textarea className="tm-textarea" value={injuryDetails} onChange={(e) => setInjuryDetails(e.target.value)} placeholder="Nature and location of injury, treatment given..." />
      <label className="tm-label">What Happened</label>
      <textarea className="tm-textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Sequence of events, conditions, contributing factors..." />
      <label className="tm-label">Immediate Actions Taken</label>
      <textarea className="tm-textarea" value={immediateActions} onChange={(e) => setImmediateActions(e.target.value)} placeholder="First aid, made area safe, stopped work, called 111..." />
      <PeoplePicker state={state} value={witnesses} onChange={setWitnesses} label="Witnesses" placeholder="Add a witness…" />

      <hr className="tm-hr" />
      <div className="tm-section-head">Reported By</div>
      <PeoplePicker state={state} value={reportedBy} onChange={setReportedBy} single placeholder="Your name…" />
      <label className="tm-label">Signature</label>
      <SignaturePad signed={signed} onSign={(data) => setSigned(!!data)} />

      <div className="tm-sheet-actions">
        <button className="tm-btn tm-btn-outline" onClick={onClose}>Cancel</button>
        <button className="tm-btn tm-btn-primary" onClick={save}>{editing ? "Save Changes" : "✅ Submit Report"}</button>
      </div>
    </Sheet>
  );
}

function IncidentView({ state, setState, rec, onClose, onDelete, openJob, onEdit }) {
  const [v, setV] = useState(rec);
  // keep local view in sync if the underlying record changes (e.g. after an edit)
  useEffect(() => { setV(rec); }, [rec]);
  const sevBadge = (s) => s === "high" ? "tm-badge-red" : s === "med" ? "tm-badge-amber" : "tm-badge-green";
  const sevLabel = (s) => s === "high" ? "🔴 Serious" : s === "med" ? "🟡 Moderate" : "🟢 Minor";
  const setStatus = (status) => {
    setState((st) => ({ ...st, incidents: st.incidents.map((x) => x.id === v.id ? { ...x, status } : x) }));
    setV((p) => ({ ...p, status }));
  };
  const fmtList = (val) => Array.isArray(val) ? val.join(", ") : val;
  const people = fmtList(v.peopleInvolved ?? v.personInvolved);
  const witnesses = fmtList(v.witnesses);
  return (
    <Sheet open onClose={onClose} title={"🚨 " + v.type}>
      <div style={{ fontSize: 14, lineHeight: 1.7 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          <span className={"tm-badge " + sevBadge(v.severity)}>{sevLabel(v.severity)}</span>
          {v.notifiable && <span className="tm-badge tm-badge-red">Notifiable</span>}
          <span className={"tm-badge " + (v.status === "closed" ? "tm-badge-green" : "tm-badge-grey")}>{v.status === "closed" ? "Closed" : "Open"}</span>
        </div>
        <p><b>When:</b> {v.date} {v.time}</p>
        <p><b>Location:</b> {v.site || "—"}</p>
        {(() => {
          const job = findJob(state, v.jobId);
          if (!job) return <p><b>Job:</b> Not linked to a job</p>;
          return (
            <p><b>Job:</b> {jobLabel(job)}{openJob && <> · <a onClick={() => { onClose(); openJob(job.id); }} style={{ color: "var(--lime)", cursor: "pointer", fontWeight: 600 }}>open ›</a></>}</p>
          );
        })()}
        {people && <p><b>Person(s):</b> {people}</p>}
        {v.injuryDetails && <p style={{ marginTop: 8 }}><b>Injury:</b> {v.injuryDetails}</p>}
        <p style={{ marginTop: 8 }}><b>What happened:</b> {v.description}</p>
        {v.immediateActions && <p style={{ marginTop: 8 }}><b>Immediate actions:</b> {v.immediateActions}</p>}
        {witnesses && <p style={{ marginTop: 8 }}><b>Witnesses:</b> {witnesses}</p>}
        <p style={{ marginTop: 8 }}><b>Reported by:</b> {v.reportedBy || "—"} {v.signed ? "✅ signed" : ""}</p>
        <div className="tm-flex" style={{ gap: 8, marginTop: 14 }}>
          {v.status !== "closed"
            ? <button className="tm-btn tm-btn-primary tm-btn-sm" onClick={() => setStatus("closed")}>✅ Mark Closed</button>
            : <button className="tm-btn tm-btn-outline tm-btn-sm" onClick={() => setStatus("open")}>Re-open</button>}
          {onEdit && <button className="tm-btn tm-btn-outline tm-btn-sm" onClick={() => onEdit(v)}>✏️ Edit</button>}
        </div>
      </div>
      <div className="tm-sheet-actions">
        <button className="tm-btn tm-btn-danger" onClick={onDelete}>Delete</button>
        <button className="tm-btn tm-btn-outline" onClick={onClose}>Close</button>
      </div>
    </Sheet>
  );
}

// ══════════════════════════════════════════════════════════════
//  HAZARD — form + view (used inside a Job). Crew can sign.
// ══════════════════════════════════════════════════════════════
function HazardForm({ state, setState, toast, jobId, job, onClose, onSaved }) {
  const [site, setSite] = useState(job?.site || "");
  const [date, setDate] = useState(today);
  const [jobType, setJobType] = useState(job?.jobType || "");
  const [lead, setLead] = useState("");
  const [checked, setChecked] = useState([]);
  const [otherHazards, setOtherHazards] = useState("");
  const [risk, setRisk] = useState("");
  const [controls, setControls] = useState("");
  // Pre-seed signers from the job's assigned crew so they can sign on the spot
  const [signers, setSigners] = useState(() => (job?.crewIds || []).map((id) => {
    const c = findCrew(state, id);
    return { crewId: id, name: c ? crewName(c) : "", role: c ? c.role : "", signed: false };
  }));

  const toggleHazard = (h) => setChecked((c) => c.includes(h) ? c.filter((x) => x !== h) : [...c, h]);
  const addSigner = () => setSigners((s) => [...s, { name: "", role: "", signed: false }]);
  const updateSigner = (i, patch) => setSigners((s) => s.map((sg, idx) => idx === i ? { ...sg, ...patch } : sg));
  const removeSigner = (i) => setSigners((s) => s.filter((_, idx) => idx !== i));

  const save = () => {
    if (!site.trim()) { toast("⚠️ Enter a site address"); return; }
    if (!risk) { toast("⚠️ Select a risk level"); return; }
    const record = {
      id: uid(), ts: Date.now(), jobId, site, date, jobType, lead,
      hazards: checked, otherHazards, risk, controls,
      signers: signers.map((s) => ({ name: s.name, role: s.role, signed: s.signed })),
      status: "open",
    };
    setState((st) => ({ ...st, hazards: [record, ...st.hazards] }));
    toast("✅ Hazard sheet saved");
    onSaved();
  };

  return (
    <Sheet open onClose={onClose} title="⚠️ New Hazard Sheet">
      <label className="tm-label">Site / Job Address</label>
      <input className="tm-input" value={site} onChange={(e) => setSite(e.target.value)} placeholder="e.g. 12 Smith Rd, Pukekohe" />
      <label className="tm-label">Date</label>
      <input className="tm-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <PeoplePicker state={state} value={lead} onChange={setLead} single label="Team Lead" placeholder="Lead's name…" />

      <hr className="tm-hr" />
      <div className="tm-section-head">Identified Hazards</div>
      <div className="tm-checkbox-grid">
        {state.settings.hazardTypes.map((h) => (
          <div key={h} className={"tm-chk-item" + (checked.includes(h) ? " checked" : "")} onClick={() => toggleHazard(h)}>
            <div className="tm-chk-box">{checked.includes(h) ? "✓" : ""}</div>
            <span>{h}</span>
          </div>
        ))}
      </div>
      <label className="tm-label">Other Hazards</label>
      <textarea className="tm-textarea" value={otherHazards} onChange={(e) => setOtherHazards(e.target.value)} placeholder="Any additional hazards..." />

      <hr className="tm-hr" />
      <div className="tm-section-head">Overall Risk Level</div>
      <div className="tm-hazard-level">
        <div className={"tm-hl-btn low" + (risk === "low" ? " sel" : "")} onClick={() => setRisk("low")}>🟢 Low</div>
        <div className={"tm-hl-btn med" + (risk === "med" ? " sel" : "")} onClick={() => setRisk("med")}>🟡 Med</div>
        <div className={"tm-hl-btn high" + (risk === "high" ? " sel" : "")} onClick={() => setRisk("high")}>🔴 High</div>
      </div>
      <label className="tm-label">Control Measures / Actions</label>
      <textarea className="tm-textarea" value={controls} onChange={(e) => setControls(e.target.value)} placeholder="PPE required, exclusion zones, rigging plan, comms..." />

      <hr className="tm-hr" />
      <div className="tm-section-head">Team Sign-Off</div>
      {!!(job?.crewIds || []).length && <p className="tm-text-mid" style={{ fontSize: 12, marginBottom: 10 }}>Assigned crew are pre-loaded below — hand the phone round for each to sign.</p>}
      {/* Quick-add any crew member not already listed as a signer */}
      {state.crew.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {state.crew.filter((c) => !signers.some((s) => s.crewId === c.id || s.name === crewName(c))).map((c) => (
            <button
              key={c.id} type="button" className="tm-chip"
              onClick={() => setSigners((s) => [...s, { crewId: c.id, name: crewName(c), role: c.role || "", signed: false }])}
            >
              + {crewName(c)}
            </button>
          ))}
        </div>
      )}
      {signers.map((s, i) => (
        <div className="tm-card" style={{ padding: 12, marginBottom: 10, background: "var(--surface-2)" }} key={i}>
          <div className="tm-row">
            <div><label className="tm-label">Name</label><input className="tm-input" value={s.name} onChange={(e) => updateSigner(i, { name: e.target.value })} placeholder="Name" /></div>
            <div><label className="tm-label">Role</label><input className="tm-input" value={s.role} onChange={(e) => updateSigner(i, { role: e.target.value })} placeholder="e.g. Climber" /></div>
          </div>
          <label className="tm-label">Signature</label>
          <SignaturePad signed={s.signed} onSign={(data) => updateSigner(i, { signed: !!data })} />
          <button className="tm-btn tm-btn-outline tm-btn-sm tm-mt-8" onClick={() => removeSigner(i)}>Remove</button>
        </div>
      ))}
      <button className="tm-btn tm-btn-outline tm-btn-sm" onClick={addSigner}>+ Add Person Manually</button>

      <div className="tm-sheet-actions">
        <button className="tm-btn tm-btn-outline" onClick={onClose}>Cancel</button>
        <button className="tm-btn tm-btn-primary" onClick={save}>✅ Save Sheet</button>
      </div>
    </Sheet>
  );
}

function HazardView({ state, rec, onClose, onDelete }) {
  return (
    <Sheet open onClose={onClose} title={"⚠️ " + (rec.site || "Hazard sheet")}>
      <div style={{ fontSize: 14, lineHeight: 1.7 }}>
        <p><b>Date:</b> {rec.date} · <b>Job type:</b> {rec.jobType || "—"}</p>
        <p><b>Lead:</b> {rec.lead || "—"} · <b>Risk:</b> {rec.risk === "high" ? "🔴 High" : rec.risk === "med" ? "🟡 Medium" : "🟢 Low"}</p>
        <p style={{ marginTop: 10 }}><b>Hazards:</b></p>
        <ul style={{ paddingLeft: 20 }}>{rec.hazards.map((h, i) => <li key={i}>{h}</li>)}</ul>
        {rec.otherHazards && <p><b>Other:</b> {rec.otherHazards}</p>}
        <p style={{ marginTop: 10 }}><b>Controls:</b> {rec.controls || "—"}</p>
        <p style={{ marginTop: 10 }}><b>Sign-off:</b></p>
        <ul style={{ paddingLeft: 20 }}>{rec.signers.map((s, i) => <li key={i}>{s.name} ({s.role || "Crew"}) — {s.signed ? "SIGNED ✅" : "NOT SIGNED"}</li>)}</ul>
      </div>
      <div className="tm-sheet-actions">
        <button className="tm-btn tm-btn-danger" onClick={onDelete}>Delete</button>
        <button className="tm-btn tm-btn-outline" onClick={onClose}>Close</button>
      </div>
    </Sheet>
  );
}


// ══════════════════════════════════════════════════════════════
//  GEAR PANEL
// ══════════════════════════════════════════════════════════════
function GearPanel({ state, setState, toast, setFabAction }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [crew, setCrew] = useState("");
  const [date, setDate] = useState(today);
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState("");

  const openLog = useCallback(() => {
    setCrew(""); setDate(today()); setItems([]); setNotes("");
    setSheetOpen(true);
  }, []);

  useEffect(() => {
    setFabAction({ label: "Log PPE use", onClick: openLog });
    return () => setFabAction(null);
  }, [setFabAction, openLog]);

  const toggle = (id) => setItems((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const save = () => {
    if (!crew.trim()) { toast("⚠️ Enter crew member name"); return; }
    if (!items.length) { toast("⚠️ Select at least one item"); return; }
    setState((st) => ({ ...st, gearLog: [{ ts: Date.now(), crew, date, items, notes }, ...st.gearLog] }));
    setSheetOpen(false);
    toast("✅ Gear usage logged");
  };

  return (
    <div className="tm-panel">
      <img className="tm-section-photo" src="https://thetreeman.co.nz/wp-content/uploads/2021/01/camr.jpg" alt="PPE and gear" loading="lazy" />
      <div className="tm-section-head">PPE & Gear Tracker</div>

      <div className="tm-gear-grid">
        {state.settings.gearItems.map((g) => {
          const count = state.gearLog.filter((l) => l.items.includes(g.id)).length;
          return (
            <div className="tm-gear-card" key={g.id}>
              <div className="gi">{g.icon}</div>
              <div className="gn">{g.name}</div>
              <div className="gc">{count}× logged</div>
            </div>
          );
        })}
      </div>

      <div className="tm-card">
        <div className="tm-card-title"><span>📊</span> Usage Log</div>
        {!state.gearLog.length
          ? <p className="tm-text-mid">No gear usage logged yet. Tap + to log today's PPE.</p>
          : state.gearLog.map((g, i) => {
            const names = g.items.map((id) => (state.settings.gearItems.find((x) => x.id === id) || {}).name || id).join(", ");
            return (
              <div className="tm-record-item" key={i}>
                <div className="tm-record-icon">🧤</div>
                <div className="tm-record-body">
                  <div className="tm-record-title">{g.crew}</div>
                  <div className="tm-record-meta">{g.date} · {names}</div>
                  {g.notes && <div className="tm-record-meta" style={{ fontStyle: "italic", marginTop: 2 }}>{g.notes}</div>}
                </div>
              </div>
            );
          })}
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="🧤 Log PPE / Gear Use">
        <label className="tm-label">Crew Member</label>
        <input className="tm-input" value={crew} onChange={(e) => setCrew(e.target.value)} placeholder="Name" />
        <label className="tm-label">Date</label>
        <input className="tm-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="tm-section-head" style={{ marginTop: 6 }}>Items Used Today</div>
        <div className="tm-checkbox-grid">
          {state.settings.gearItems.map((g) => (
            <div key={g.id} className={"tm-chk-item" + (items.includes(g.id) ? " checked" : "")} onClick={() => toggle(g.id)}>
              <div className="tm-chk-box">{items.includes(g.id) ? "✓" : ""}</div>
              <span>{g.icon} {g.name}</span>
            </div>
          ))}
        </div>
        <label className="tm-label">Notes / Condition</label>
        <textarea className="tm-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any damage, wear, or concerns..." />
        <div className="tm-sheet-actions">
          <button className="tm-btn tm-btn-outline" onClick={() => setSheetOpen(false)}>Cancel</button>
          <button className="tm-btn tm-btn-primary" onClick={save}>Save</button>
        </div>
      </Sheet>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAINTENANCE PANEL
// ══════════════════════════════════════════════════════════════
function MaintenancePanel({ state, setState, toast, setFabAction }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [equip, setEquip] = useState("");
  const [date, setDate] = useState(today);
  const [by, setBy] = useState("");
  const [work, setWork] = useState("");
  const [nextDue, setNextDue] = useState("");
  const [status, setStatus] = useState("good");

  const openLog = useCallback(() => {
    setEquip(""); setDate(today()); setBy(""); setWork(""); setNextDue(""); setStatus("good");
    setSheetOpen(true);
  }, []);

  useEffect(() => {
    setFabAction({ label: "Log maintenance", onClick: openLog });
    return () => setFabAction(null);
  }, [setFabAction, openLog]);

  const save = () => {
    if (!equip) { toast("⚠️ Select equipment"); return; }
    setState((st) => ({ ...st, maintenance: [{ ts: Date.now(), equip, date, by, work, nextDue, status }, ...st.maintenance] }));
    setSheetOpen(false);
    toast("✅ Maintenance logged");
  };

  return (
    <div className="tm-panel">
      <img className="tm-section-photo" src="https://thetreeman.co.nz/wp-content/uploads/2021/01/kaxXLGhw-1.jpg" alt="Equipment maintenance" loading="lazy" />
      <div className="tm-section-head">Equipment Maintenance</div>

      <div className="tm-card">
        <div className="tm-card-title"><span>📉</span> Equipment Health</div>
        {state.settings.equipmentList.map((eq) => {
          const logs = state.maintenance.filter((m) => m.equip === eq).sort((a, b) => b.ts - a.ts);
          const last = logs[0];
          const s = (last || {}).status || "unknown";
          const color = s === "good" ? "var(--lime)" : s === "watch" ? "var(--warn)" : s === "out" ? "var(--danger)" : "var(--border)";
          const daysSince = last ? Math.floor((Date.now() - last.ts) / 86400000) : 999;
          const pct = Math.max(10, Math.min(100, 100 - daysSince));
          return (
            <div className="tm-maint-item" key={eq}>
              <div style={{ flex: "0 0 118px", fontSize: 12, fontWeight: 700 }}>{eq}</div>
              <div style={{ flex: 1 }}>
                <div className="tm-maint-bar-bg"><div className="tm-maint-bar-fill" style={{ width: pct + "%", background: color }} /></div>
                <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                  {last ? "Serviced " + new Date(last.ts).toLocaleDateString("en-NZ") : "No record"}
                </div>
              </div>
              <span className={"tm-badge " + (s === "good" ? "tm-badge-green" : s === "watch" ? "tm-badge-amber" : s === "out" ? "tm-badge-red" : "tm-badge-grey")}>
                {s === "good" ? "✅" : s === "watch" ? "⚠️" : s === "out" ? "🔴" : "—"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="tm-card">
        <div className="tm-card-title"><span>🔧</span> Service History</div>
        {!state.maintenance.length
          ? <p className="tm-text-mid">No maintenance logged yet. Tap + to log a service.</p>
          : state.maintenance.map((m, i) => (
            <div className="tm-record-item" key={i}>
              <div className="tm-record-icon">🔧</div>
              <div className="tm-record-body">
                <div className="tm-record-title">{m.equip}</div>
                <div className="tm-record-meta">{m.date} · By {m.by || "—"}</div>
                <div className="tm-record-meta" style={{ marginTop: 2 }}>{m.work}</div>
              </div>
              <span className={"tm-badge " + (m.status === "good" ? "tm-badge-green" : m.status === "watch" ? "tm-badge-amber" : "tm-badge-red")}>
                {m.status === "good" ? "✅" : m.status === "watch" ? "⚠️" : "🔴"}
              </span>
            </div>
          ))}
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="🔧 Log Maintenance">
        <label className="tm-label">Equipment</label>
        <select className="tm-select" value={equip} onChange={(e) => setEquip(e.target.value)}>
          <option value="">Select...</option>
          {state.settings.equipmentList.map((e) => <option key={e}>{e}</option>)}
        </select>
        <div className="tm-row">
          <div><label className="tm-label">Date Serviced</label><input className="tm-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div><label className="tm-label">Next Due</label><input className="tm-input" type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} /></div>
        </div>
        <label className="tm-label">Serviced By</label>
        <input className="tm-input" value={by} onChange={(e) => setBy(e.target.value)} placeholder="Name" />
        <label className="tm-label">Work Performed</label>
        <textarea className="tm-textarea" value={work} onChange={(e) => setWork(e.target.value)} placeholder="Inspected / repaired / replaced..." />
        <label className="tm-label">Status After Service</label>
        <select className="tm-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="good">✅ Good — ready to use</option>
          <option value="watch">⚠️ Monitor — minor issues</option>
          <option value="out">🔴 Out of service — do not use</option>
        </select>
        <div className="tm-sheet-actions">
          <button className="tm-btn tm-btn-outline" onClick={() => setSheetOpen(false)}>Cancel</button>
          <button className="tm-btn tm-btn-primary" onClick={save}>Save</button>
        </div>
      </Sheet>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  CREW PANEL
// ══════════════════════════════════════════════════════════════
function CrewPanel({ state, setState, toast, confirm, setFabAction, openJob }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailId, setDetailId] = useState(null); // crew detail view
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [role, setRole] = useState("Arborist");
  const [quals, setQuals] = useState("");
  const [emerg, setEmerg] = useState("");

  const openAdd = useCallback(() => {
    setEditingId(null);
    setFirst(""); setLast(""); setRole("Arborist"); setQuals(""); setEmerg("");
    setSheetOpen(true);
  }, []);

  const openEdit = (c) => {
    setEditingId(c.id);
    setFirst(c.first); setLast(c.last); setRole(c.role); setQuals(c.quals || ""); setEmerg(c.emerg || "");
    setSheetOpen(true);
  };

  useEffect(() => {
    if (!detailId) setFabAction({ label: "Add crew member", onClick: openAdd });
    else setFabAction(null);
    return () => setFabAction(null);
  }, [setFabAction, openAdd, detailId]);

  const save = () => {
    if (!first.trim() || !last.trim()) { toast("⚠️ Enter first and last name"); return; }
    if (editingId) {
      setState((st) => ({ ...st, crew: st.crew.map((c) => c.id === editingId ? { ...c, first, last, role, quals, emerg } : c) }));
      toast("✅ Crew member updated");
    } else {
      setState((st) => ({ ...st, crew: [...st.crew, { id: uid(), first, last, role, quals, emerg }] }));
      toast("✅ Crew member added");
    }
    setSheetOpen(false);
  };

  const remove = (c) => {
    const jobs = jobsForCrew(state, c.id);
    confirm({
      title: "Remove crew member?",
      message: jobs.length ? `${crewName(c)} is assigned to ${jobs.length} job(s) and will be unassigned from them.` : `${crewName(c)} will be removed.`,
      danger: true, confirmLabel: "Remove",
      onYes: () => {
        setState((st) => ({
          ...st,
          crew: st.crew.filter((x) => x.id !== c.id),
          jobs: st.jobs.map((j) => (j.crewIds || []).includes(c.id) ? { ...j, crewIds: j.crewIds.filter((id) => id !== c.id) } : j),
        }));
        setDetailId(null);
        toast("Crew member removed");
      },
    });
  };

  // ── Crew detail: job history ──
  const detail = findCrew(state, detailId);
  if (detail) {
    const myJobs = jobsForCrew(state, detail.id).sort((a, b) => b.ts - a.ts);
    return (
      <div className="tm-panel">
        <button className="tm-btn tm-btn-outline tm-btn-sm" onClick={() => setDetailId(null)} style={{ marginBottom: 14 }}>‹ All Crew</button>
        <div className="tm-card">
          <div className="tm-flex" style={{ gap: 14 }}>
            <div className="tm-crew-avatar" style={{ width: 56, height: 56, fontSize: 22 }}>{initials(crewName(detail))}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{crewName(detail)}</div>
              <div className="tm-text-mid">{detail.role}</div>
            </div>
          </div>
          <div className="tm-text-mid" style={{ marginTop: 12, lineHeight: 1.7, fontSize: 13 }}>
            {detail.quals && <div>📜 {detail.quals}</div>}
            {detail.emerg && <div>🆘 {detail.emerg}</div>}
          </div>
          <div className="tm-flex" style={{ gap: 8, marginTop: 14 }}>
            <button className="tm-btn tm-btn-outline tm-btn-sm" onClick={() => openEdit(detail)}>Edit</button>
            <button className="tm-btn tm-btn-danger tm-btn-sm" onClick={() => remove(detail)}>Remove</button>
          </div>
        </div>

        <div className="tm-card">
          <div className="tm-card-title"><span>🌲</span> Jobs Involved In ({myJobs.length})</div>
          {!myJobs.length ? <p className="tm-text-mid">Not assigned to any jobs yet.</p> : myJobs.map((j) => {
            const sm = statusMeta(j.status);
            return (
              <div className="tm-record-item" key={j.id} onClick={() => openJob(j.id)} style={{ cursor: "pointer" }}>
                <div className="tm-record-icon">🌲</div>
                <div className="tm-record-body">
                  <div className="tm-record-title">{jobLabel(j)}</div>
                  <div className="tm-record-meta">{j.site || j.client || "—"}</div>
                  <div style={{ marginTop: 5 }}><span className={"tm-badge " + sm.badge}>{sm.icon} {sm.label}</span></div>
                </div>
                <span style={{ color: "var(--text-dim)", alignSelf: "center" }}>›</span>
              </div>
            );
          })}
        </div>

        <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={editingId ? "👷 Edit Crew Member" : "👷 Add Crew Member"}>
          <CrewFormFields {...{ first, setFirst, last, setLast, role, setRole, quals, setQuals, emerg, setEmerg, save, onClose: () => setSheetOpen(false), editingId }} />
        </Sheet>
      </div>
    );
  }

  // ── Crew list ──
  return (
    <div className="tm-panel">
      <img className="tm-section-photo" src="https://thetreeman.co.nz/wp-content/uploads/2021/01/brian-01.jpg" alt="The Treeman crew" loading="lazy" />
      <div className="tm-section-head">Crew Management</div>

      <div className="tm-card">
        <div className="tm-card-title"><span>👷</span> The Team</div>
        {!state.crew.length
          ? <p className="tm-text-mid">No crew members yet — tap + to add the team!</p>
          : state.crew.map((c) => {
            const jobCount = jobsForCrew(state, c.id).length;
            return (
              <div className="tm-record-item" key={c.id} onClick={() => setDetailId(c.id)} style={{ cursor: "pointer" }}>
                <div className="tm-crew-avatar">{initials(crewName(c))}</div>
                <div className="tm-record-body">
                  <div className="tm-record-title">{crewName(c)}</div>
                  <div className="tm-record-meta">{c.role} · {jobCount} job{jobCount === 1 ? "" : "s"}</div>
                  {c.quals && <div className="tm-record-meta" style={{ marginTop: 2 }}>📜 {c.quals}</div>}
                </div>
                <span style={{ color: "var(--text-dim)", alignSelf: "center" }}>›</span>
              </div>
            );
          })}
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={editingId ? "👷 Edit Crew Member" : "👷 Add Crew Member"}>
        <CrewFormFields {...{ first, setFirst, last, setLast, role, setRole, quals, setQuals, emerg, setEmerg, save, onClose: () => setSheetOpen(false), editingId }} />
      </Sheet>
    </div>
  );
}

function CrewFormFields({ first, setFirst, last, setLast, role, setRole, quals, setQuals, emerg, setEmerg, save, onClose, editingId }) {
  return (
    <>
      <div className="tm-row">
        <div><label className="tm-label">First Name</label><input className="tm-input" value={first} onChange={(e) => setFirst(e.target.value)} placeholder="e.g. Dave" /></div>
        <div><label className="tm-label">Last Name</label><input className="tm-input" value={last} onChange={(e) => setLast(e.target.value)} placeholder="e.g. Smith" /></div>
      </div>
      <label className="tm-label">Role</label>
      <select className="tm-select" value={role} onChange={(e) => setRole(e.target.value)}>
        {["Lead Arborist", "Arborist", "Apprentice Arborist", "Ground Worker", "Climber", "Supervisor"].map((r) => <option key={r}>{r}</option>)}
      </select>
      <label className="tm-label">Qualifications</label>
      <input className="tm-input" value={quals} onChange={(e) => setQuals(e.target.value)} placeholder="e.g. Level 3 Arboriculture, First Aid" />
      <label className="tm-label">Emergency Contact</label>
      <input className="tm-input" value={emerg} onChange={(e) => setEmerg(e.target.value)} placeholder="Name & phone number" />
      <div className="tm-sheet-actions">
        <button className="tm-btn tm-btn-outline" onClick={onClose}>Cancel</button>
        <button className="tm-btn tm-btn-primary" onClick={save}>{editingId ? "Save Changes" : "Add Member"}</button>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
//  TOOLBOX PANEL
// ══════════════════════════════════════════════════════════════
function ToolboxPanel({ state, setState, toast, setFabAction }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentTalk, setCurrentTalk] = useState(null);
  const [date, setDate] = useState(today);
  const [presenter, setPresenter] = useState("");
  const [attendees, setAttendees] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => { setFabAction(null); return () => setFabAction(null); }, [setFabAction]);

  const startTalk = (t) => {
    setCurrentTalk(t);
    setDate(today()); setPresenter(""); setAttendees(""); setNotes("");
    setSheetOpen(true);
  };

  const save = () => {
    if (!attendees.trim()) { toast("⚠️ Enter attendees"); return; }
    setState((st) => ({ ...st, talks: [{ ts: Date.now(), title: currentTalk.title, date, presenter, attendees, notes }, ...st.talks] }));
    setSheetOpen(false);
    toast("✅ Toolbox talk recorded");
  };

  return (
    <div className="tm-panel">
      <img className="tm-section-photo" src="https://thetreeman.co.nz/wp-content/uploads/2021/01/y9VsRxDw-scaled-01.jpg" alt="Team briefing" loading="lazy" />
      <div className="tm-section-head">Toolbox Talks</div>

      <div className="tm-card">
        <div className="tm-card-title"><span>📚</span> Topic Library</div>
        <p className="tm-text-mid" style={{ marginBottom: 12, fontSize: 12 }}>Tap a topic to run today's briefing and record attendance.</p>
        {state.settings.talkTopics.map((t, i) => (
          <div className="tm-talk-card" onClick={() => startTalk(t)} key={i}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>{t.icon}</div>
            <div style={{ minWidth: 0 }}>
              <h4>{t.title}</h4>
              <p>{t.points.slice(0, 70)}...</p>
            </div>
            <span style={{ marginLeft: "auto", color: "var(--text-dim)" }}>›</span>
          </div>
        ))}
      </div>

      <div className="tm-card">
        <div className="tm-card-title"><span>✅</span> Completed Talks</div>
        {!state.talks.length
          ? <p className="tm-text-mid">No toolbox talks recorded yet.</p>
          : state.talks.map((t, i) => (
            <div className="tm-record-item" key={i}>
              <div className="tm-record-icon">📋</div>
              <div className="tm-record-body">
                <div className="tm-record-title">{t.title}</div>
                <div className="tm-record-meta">{t.date} · Presenter: {t.presenter || "—"}</div>
                <div className="tm-record-meta" style={{ marginTop: 2 }}>Attendees: {t.attendees}</div>
              </div>
            </div>
          ))}
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={currentTalk ? "📋 " + currentTalk.title : ""}>
        {currentTalk && (
          <div style={{ fontSize: 14, color: "var(--text-mid)", marginBottom: 14, lineHeight: 1.65, background: "var(--surface-2)", borderRadius: 14, padding: 14, border: "1px solid var(--border)" }}>
            {currentTalk.points.split(". ").filter(Boolean).map((p, i) => (
              <div style={{ marginBottom: 6 }} key={i}>• {p.trim()}{p.trim().endsWith(".") ? "" : "."}</div>
            ))}
          </div>
        )}
        <div className="tm-row">
          <div><label className="tm-label">Date</label><input className="tm-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div><label className="tm-label">Presenter</label><input className="tm-input" value={presenter} onChange={(e) => setPresenter(e.target.value)} placeholder="Name" /></div>
        </div>
        <label className="tm-label">Attendees (comma separated)</label>
        <textarea className="tm-textarea" value={attendees} onChange={(e) => setAttendees(e.target.value)} placeholder="Dave, Brody, Vince, Troy..." />
        <label className="tm-label">Notes / Discussion Points</label>
        <textarea className="tm-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Concerns raised on site..." />
        <div className="tm-sheet-actions">
          <button className="tm-btn tm-btn-outline" onClick={() => setSheetOpen(false)}>Cancel</button>
          <button className="tm-btn tm-btn-primary" onClick={save}>✅ Record Talk</button>
        </div>
      </Sheet>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  QUOTE — form + view (used inside a Job)
// ══════════════════════════════════════════════════════════════
function blankLine(services) {
  return { service: (services[0] || {}).name || "", qty: 1, rate: (services[0] || {}).rate || 0 };
}

function QuoteForm({ state, setState, toast, jobId, job, onClose, onSaved }) {
  const services = state.settings.quoteServices;
  const gstRate = state.settings.companyInfo.gstRate || 15;

  const [validDays, setValidDays] = useState(30);
  const [date, setDate] = useState(today);
  const [lines, setLines] = useState([blankLine(services)]);
  const [notes, setNotes] = useState("Price includes all labour, equipment, and green waste removal unless otherwise stated.");

  const addLine = () => setLines((l) => [...l, blankLine(services)]);
  const removeLine = (i) => setLines((l) => l.filter((_, idx) => idx !== i));
  const updateLine = (i, patch) => setLines((l) => l.map((ln, idx) => idx === i ? { ...ln, ...patch } : ln));
  const onServiceChange = (i, name) => {
    const svc = services.find((s) => s.name === name);
    updateLine(i, { service: name, rate: svc ? svc.rate : 0 });
  };

  const subtotal = lines.reduce((sum, l) => sum + (Number(l.qty) || 0) * (Number(l.rate) || 0), 0);
  const gst = subtotal * (gstRate / 100);
  const total = subtotal + gst;

  const save = () => {
    const record = {
      id: uid(), ts: Date.now(), jobId,
      client: job?.client || "", siteAddr: job?.site || "", phone: job?.phone || "", email: "",
      date, validDays, lines, notes, subtotal, gst, gstRate, total, status: "draft",
    };
    setState((st) => ({ ...st, quotes: [record, ...st.quotes] }));
    toast("✅ Quote saved");
    onSaved();
  };

  return (
    <Sheet open onClose={onClose} title="💷 New Quote">
      <p className="tm-text-mid" style={{ fontSize: 13, marginBottom: 12 }}>For <b>{jobLabel(job)}</b>{job?.site ? " · " + job.site : ""}</p>
      <div className="tm-row">
        <div><label className="tm-label">Quote Date</label><input className="tm-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div><label className="tm-label">Valid (days)</label><input className="tm-input" type="number" value={validDays} onChange={(e) => setValidDays(e.target.value)} /></div>
      </div>

      <hr className="tm-hr" />
      <div className="tm-section-head">Line Items</div>
      {lines.map((l, i) => (
        <div className="tm-quote-line" key={i}>
          <select className="tm-select" value={l.service} onChange={(e) => onServiceChange(i, e.target.value)}>
            {services.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
          <div className="tm-quote-line-grid">
            <div><label className="tm-label">Qty</label><input className="tm-input" type="number" min="0" value={l.qty} onChange={(e) => updateLine(i, { qty: e.target.value })} /></div>
            <div><label className="tm-label">Rate $</label><input className="tm-input" type="number" min="0" step="0.01" value={l.rate} onChange={(e) => updateLine(i, { rate: e.target.value })} /></div>
          </div>
          <div className="tm-flex-between">
            <span style={{ fontWeight: 800, fontSize: 15 }}>{fmtMoney((Number(l.qty) || 0) * (Number(l.rate) || 0))}</span>
            <button className="tm-btn tm-btn-danger tm-btn-sm" onClick={() => removeLine(i)}>✕ Remove</button>
          </div>
        </div>
      ))}
      <button className="tm-btn tm-btn-outline tm-btn-sm tm-btn-block" onClick={addLine}>+ Add Line Item</button>

      <div className="tm-quote-totals">
        <div className="tm-quote-totals-row"><span>Subtotal</span><span>{fmtMoney(subtotal)}</span></div>
        <div className="tm-quote-totals-row"><span>GST ({gstRate}%)</span><span>{fmtMoney(gst)}</span></div>
        <div className="tm-quote-totals-row grand"><span>Total</span><span>{fmtMoney(total)}</span></div>
      </div>

      <label className="tm-label" style={{ marginTop: 14 }}>Notes / Terms</label>
      <textarea className="tm-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />

      <div className="tm-sheet-actions">
        <button className="tm-btn tm-btn-outline" onClick={onClose}>Cancel</button>
        <button className="tm-btn tm-btn-primary" onClick={save}>✅ Save Quote</button>
      </div>
    </Sheet>
  );
}

function QuoteView({ state, setState, rec, onClose, onDelete }) {
  const [v, setV] = useState(rec);
  const ci = state.settings.companyInfo;
  const setStatus = (status) => {
    setState((st) => ({ ...st, quotes: st.quotes.map((q) => q.id === v.id ? { ...q, status } : q) }));
    setV((p) => ({ ...p, status }));
  };
  return (
    <Sheet open onClose={onClose} title={"💷 " + (v.client || "Quote")}>
      <div style={{ fontSize: 14, lineHeight: 1.7 }}>
        <p style={{ fontSize: 12, color: "var(--text-mid)" }}>
          <b>{ci.name}</b><br />{ci.address}<br />{ci.phone} · {ci.email}
          {ci.gstNumber && <><br />GST: {ci.gstNumber}</>}
        </p>
        <hr className="tm-hr" />
        <p><b>Site:</b> {v.siteAddr || "—"}</p>
        <p><b>Contact:</b> {v.phone || "—"} {v.email && "· " + v.email}</p>
        <p><b>Date:</b> {v.date} · valid {v.validDays} days</p>
        <hr className="tm-hr" />
        {v.lines.map((l, i) => (
          <div className="tm-flex-between" style={{ padding: "5px 0", fontSize: 13 }} key={i}>
            <span>{l.service} × {l.qty}</span>
            <span style={{ fontWeight: 700 }}>{fmtMoney((Number(l.qty) || 0) * (Number(l.rate) || 0))}</span>
          </div>
        ))}
        <div className="tm-quote-totals">
          <div className="tm-quote-totals-row"><span>Subtotal</span><span>{fmtMoney(v.subtotal)}</span></div>
          <div className="tm-quote-totals-row"><span>GST ({v.gstRate}%)</span><span>{fmtMoney(v.gst)}</span></div>
          <div className="tm-quote-totals-row grand"><span>Total</span><span>{fmtMoney(v.total)}</span></div>
        </div>
        {v.notes && <p style={{ marginTop: 10, fontSize: 12, color: "var(--text-mid)" }}>{v.notes}</p>}
        <div className="tm-flex" style={{ gap: 8, flexWrap: "wrap", marginTop: 14 }}>
          <button className="tm-btn tm-btn-outline tm-btn-sm" onClick={() => setStatus("sent")}>📤 Sent</button>
          <button className="tm-btn tm-btn-primary tm-btn-sm" onClick={() => setStatus("accepted")}>✅ Accepted</button>
          <button className="tm-btn tm-btn-danger tm-btn-sm" onClick={() => setStatus("declined")}>❌ Declined</button>
        </div>
      </div>
      <div className="tm-sheet-actions">
        <button className="tm-btn tm-btn-danger" onClick={onDelete}>Delete</button>
        <button className="tm-btn tm-btn-outline" onClick={onClose}>Close</button>
      </div>
    </Sheet>
  );
}


// ══════════════════════════════════════════════════════════════
//  SETTINGS PANEL
// ══════════════════════════════════════════════════════════════
function NavSettings({ settings, updateSettings, toast }) {
  const DEF = ["dashboard", "crew", "jobs", "toolbox", "more"];
  const slots = (settings.navSlots && settings.navSlots.length === 5) ? settings.navSlots : DEF;
  // options: any NAV_SECTION plus Jobs
  const options = [{ id: "jobs", icon: "🌲", label: "Jobs" }, ...NAV_SECTIONS];
  const metaOf = (id) => options.find((o) => o.id === id) || { icon: "•", label: id };
  const setSlot = (i, id) => {
    const next = [...slots];
    next[i] = id;
    updateSettings({ navSlots: next });
  };
  const slotLabels = ["Far left", "Left", "Centre (raised)", "Right", "Far right"];
  return (
    <div className="tm-card">
      <div className="tm-card-title"><span>🧭</span> Bottom Navigation</div>
      <p className="tm-text-mid" style={{ marginBottom: 14, fontSize: 12 }}>Choose all five buttons, including the raised centre one. Anything you don't place here is still reachable under "More". Tip: keep "More" in a slot so nothing gets hidden.</p>

      {/* live preview */}
      <div style={{ display: "flex", justifyContent: "space-around", background: "var(--surface-2)", borderRadius: 14, padding: "10px 4px", marginBottom: 16, border: "1px solid var(--border)" }}>
        {slots.map((id, i) => {
          const meta = metaOf(id);
          const centre = i === 2;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontSize: 9, fontWeight: 600, color: "var(--text-mid)" }}>
              <span style={{ fontSize: centre ? 22 : 18, background: centre ? "linear-gradient(140deg,var(--lime),var(--green-mid))" : "transparent", width: centre ? 40 : "auto", height: centre ? 40 : "auto", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginTop: centre ? -10 : 0 }}>{meta.icon}</span>
              {meta.label}
            </div>
          );
        })}
      </div>

      {slots.map((slotId, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <label className="tm-label">{slotLabels[i]}</label>
          <select className="tm-select" style={{ marginBottom: 0 }} value={slotId} onChange={(e) => setSlot(i, e.target.value)}>
            {options.map((o) => <option key={o.id} value={o.id}>{o.icon} {o.label}</option>)}
          </select>
        </div>
      ))}
      <button className="tm-btn tm-btn-outline tm-btn-sm tm-mt-8" onClick={() => { updateSettings({ navSlots: DEF }); toast("Reset to default"); }}>Reset to default</button>
    </div>
  );
}


function SettingsPanel({ settings, updateSettings, toast }) {
  const [section, setSection] = useState("navigation");

  const SECTIONS = [
    { id: "navigation", label: "Bottom Nav" },
    { id: "hazards", label: "Hazard Types" },
    { id: "incidents", label: "Incident Types" },
    { id: "gear", label: "Gear / PPE" },
    { id: "equipment", label: "Equipment" },
    { id: "talks", label: "Toolbox Topics" },
    { id: "services", label: "Quote Services" },
    { id: "company", label: "Company" },
  ];

  return (
    <div className="tm-panel">
      <div className="tm-section-head">Settings</div>
      <p className="tm-text-mid" style={{ marginBottom: 14 }}>Customise the checklists, dropdowns, and templates used across the app.</p>

      <div className="tm-settings-nav">
        {SECTIONS.map((s) => (
          <button key={s.id} className={"tm-settings-pill" + (section === s.id ? " active" : "")} onClick={() => setSection(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      {section === "navigation" && <NavSettings settings={settings} updateSettings={updateSettings} toast={toast} />}
      {section === "hazards" && <ListEditor
        title="⚠️ Hazard Checklist Items"
        sub="These appear as tick-boxes on every new Hazard ID sheet."
        list={settings.hazardTypes}
        onChange={(l) => updateSettings({ hazardTypes: l })}
        placeholder="e.g. 🐜 Termite damage"
        toast={toast}
      />}
      {section === "incidents" && <ListEditor
        title="🚨 Incident Types"
        sub="Categories available when reporting an incident."
        list={settings.incidentTypes}
        onChange={(l) => updateSettings({ incidentTypes: l })}
        placeholder="e.g. 🪜 Fall from height"
        toast={toast}
      />}
      {section === "equipment" && <ListEditor
        title="🔧 Maintenance — Equipment List"
        sub="All plant, tools, and vehicles tracked in the Maintenance tab."
        list={settings.equipmentList}
        onChange={(l) => updateSettings({ equipmentList: l })}
        placeholder="e.g. Wood Chipper — Bandit 150XP"
        toast={toast}
      />}
      {section === "gear" && <GearItemsSettings settings={settings} updateSettings={updateSettings} toast={toast} />}
      {section === "talks" && <TalkTopicsSettings settings={settings} updateSettings={updateSettings} toast={toast} />}
      {section === "services" && <QuoteServicesSettings settings={settings} updateSettings={updateSettings} toast={toast} />}
      {section === "company" && <CompanyInfoSettings settings={settings} updateSettings={updateSettings} toast={toast} />}
    </div>
  );
}

function ListEditor({ title, sub, list, onChange, placeholder, toast }) {
  const [newItem, setNewItem] = useState("");
  const add = () => {
    if (!newItem.trim()) return;
    onChange([...list, newItem.trim()]);
    setNewItem("");
    toast("✅ Added");
  };
  return (
    <div className="tm-card">
      <div className="tm-card-title">{title}</div>
      <p className="tm-text-mid" style={{ marginBottom: 12, fontSize: 12 }}>{sub}</p>
      {list.map((item, i) => (
        <div className="tm-editable-row" key={i}>
          <input className="tm-input" value={item} onChange={(e) => onChange(list.map((x, idx) => idx === i ? e.target.value : x))} />
          <button className="tm-btn tm-btn-danger tm-btn-sm" onClick={() => onChange(list.filter((_, idx) => idx !== i))}>✕</button>
        </div>
      ))}
      <div className="tm-flex tm-mt-8" style={{ gap: 8 }}>
        <input className="tm-input" style={{ marginBottom: 0 }} value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder={placeholder} onKeyDown={(e) => e.key === "Enter" && add()} />
        <button className="tm-btn tm-btn-primary tm-btn-sm" onClick={add}>+</button>
      </div>
    </div>
  );
}

function GearItemsSettings({ settings, updateSettings, toast }) {
  const [icon, setIcon] = useState("🧰");
  const [name, setName] = useState("");
  const list = settings.gearItems;

  const add = () => {
    if (!name.trim()) return;
    const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    updateSettings({ gearItems: [...list, { id, icon, name: name.trim() }] });
    setName(""); setIcon("🧰");
    toast("✅ Gear item added");
  };
  const remove = (i) => updateSettings({ gearItems: list.filter((_, idx) => idx !== i) });
  const change = (i, patch) => updateSettings({ gearItems: list.map((x, idx) => idx === i ? { ...x, ...patch } : x) });

  return (
    <div className="tm-card">
      <div className="tm-card-title"><span>🧤</span> PPE / Gear Items</div>
      <p className="tm-text-mid" style={{ marginBottom: 12, fontSize: 12 }}>Shown on the PPE tracker and gear usage log.</p>
      {list.map((g, i) => (
        <div className="tm-editable-row" key={g.id}>
          <input className="tm-input" style={{ width: 56, textAlign: "center" }} value={g.icon} onChange={(e) => change(i, { icon: e.target.value })} />
          <input className="tm-input" value={g.name} onChange={(e) => change(i, { name: e.target.value })} />
          <button className="tm-btn tm-btn-danger tm-btn-sm" onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <div className="tm-flex tm-mt-8" style={{ gap: 8 }}>
        <input className="tm-input" style={{ width: 56, marginBottom: 0, textAlign: "center" }} value={icon} onChange={(e) => setIcon(e.target.value)} />
        <input className="tm-input" style={{ marginBottom: 0 }} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Safety Glasses" onKeyDown={(e) => e.key === "Enter" && add()} />
        <button className="tm-btn tm-btn-primary tm-btn-sm" onClick={add}>+</button>
      </div>
    </div>
  );
}

function TalkTopicsSettings({ settings, updateSettings, toast }) {
  const [icon, setIcon] = useState("📋");
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState("");
  const list = settings.talkTopics;

  const add = () => {
    if (!title.trim() || !points.trim()) { toast("⚠️ Enter a title and talking points"); return; }
    updateSettings({ talkTopics: [...list, { icon, title: title.trim(), points: points.trim() }] });
    setIcon("📋"); setTitle(""); setPoints("");
    toast("✅ Topic added");
  };
  const remove = (i) => updateSettings({ talkTopics: list.filter((_, idx) => idx !== i) });
  const change = (i, patch) => updateSettings({ talkTopics: list.map((x, idx) => idx === i ? { ...x, ...patch } : x) });

  return (
    <div className="tm-card">
      <div className="tm-card-title"><span>📋</span> Toolbox Talk Topics</div>
      {list.map((t, i) => (
        <div key={i} style={{ border: "1px solid var(--border)", borderRadius: 16, padding: 12, marginBottom: 10 }}>
          <div className="tm-flex" style={{ gap: 8, marginBottom: 8 }}>
            <input className="tm-input" style={{ width: 56, marginBottom: 0, textAlign: "center" }} value={t.icon} onChange={(e) => change(i, { icon: e.target.value })} />
            <input className="tm-input" style={{ marginBottom: 0, flex: 1 }} value={t.title} onChange={(e) => change(i, { title: e.target.value })} />
            <button className="tm-btn tm-btn-danger tm-btn-sm" onClick={() => remove(i)}>✕</button>
          </div>
          <textarea className="tm-textarea" style={{ marginBottom: 0 }} value={t.points} onChange={(e) => change(i, { points: e.target.value })} />
        </div>
      ))}
      <div style={{ border: "1.5px dashed var(--border)", borderRadius: 16, padding: 12 }}>
        <div className="tm-flex" style={{ gap: 8, marginBottom: 8 }}>
          <input className="tm-input" style={{ width: 56, marginBottom: 0, textAlign: "center" }} value={icon} onChange={(e) => setIcon(e.target.value)} />
          <input className="tm-input" style={{ marginBottom: 0, flex: 1 }} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New topic title" />
        </div>
        <textarea className="tm-textarea" value={points} onChange={(e) => setPoints(e.target.value)} placeholder="Talking points, separated by sentences..." />
        <button className="tm-btn tm-btn-primary tm-btn-sm" onClick={add}>+ Add Topic</button>
      </div>
    </div>
  );
}

function QuoteServicesSettings({ settings, updateSettings, toast }) {
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const list = settings.quoteServices;

  const add = () => {
    if (!name.trim()) return;
    updateSettings({ quoteServices: [...list, { name: name.trim(), rate: Number(rate) || 0 }] });
    setName(""); setRate("");
    toast("✅ Service added");
  };
  const remove = (i) => updateSettings({ quoteServices: list.filter((_, idx) => idx !== i) });
  const change = (i, patch) => updateSettings({ quoteServices: list.map((x, idx) => idx === i ? { ...x, ...patch } : x) });

  return (
    <div className="tm-card">
      <div className="tm-card-title"><span>💷</span> Quote Services & Default Rates</div>
      <p className="tm-text-mid" style={{ marginBottom: 12, fontSize: 12 }}>Default rate auto-fills when building a quote (editable per quote).</p>
      {list.map((s, i) => (
        <div className="tm-editable-row" key={i}>
          <input className="tm-input" style={{ flex: 1 }} value={s.name} onChange={(e) => change(i, { name: e.target.value })} />
          <input className="tm-input" style={{ width: 92 }} type="number" step="0.01" value={s.rate} onChange={(e) => change(i, { rate: Number(e.target.value) })} placeholder="$" />
          <button className="tm-btn tm-btn-danger tm-btn-sm" onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <div className="tm-flex tm-mt-8" style={{ gap: 8 }}>
        <input className="tm-input" style={{ marginBottom: 0, flex: 1 }} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Root Barrier Install" onKeyDown={(e) => e.key === "Enter" && add()} />
        <input className="tm-input" style={{ marginBottom: 0, width: 92 }} type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="$" />
        <button className="tm-btn tm-btn-primary tm-btn-sm" onClick={add}>+</button>
      </div>
    </div>
  );
}

function CompanyInfoSettings({ settings, updateSettings, toast }) {
  const info = settings.companyInfo;
  const change = (patch) => updateSettings({ companyInfo: { ...info, ...patch } });

  return (
    <div className="tm-card">
      <div className="tm-card-title"><span>🏢</span> Company Info</div>
      <p className="tm-text-mid" style={{ marginBottom: 12, fontSize: 12 }}>Used on quote documents.</p>
      <label className="tm-label">Company Name</label>
      <input className="tm-input" value={info.name} onChange={(e) => change({ name: e.target.value })} />
      <label className="tm-label">Address</label>
      <input className="tm-input" value={info.address} onChange={(e) => change({ address: e.target.value })} />
      <div className="tm-row">
        <div><label className="tm-label">Phone</label><input className="tm-input" value={info.phone} onChange={(e) => change({ phone: e.target.value })} /></div>
        <div><label className="tm-label">Email</label><input className="tm-input" value={info.email} onChange={(e) => change({ email: e.target.value })} /></div>
      </div>
      <div className="tm-row">
        <div><label className="tm-label">GST Number</label><input className="tm-input" value={info.gstNumber} onChange={(e) => change({ gstNumber: e.target.value })} placeholder="Optional" /></div>
        <div><label className="tm-label">GST Rate (%)</label><input className="tm-input" type="number" value={info.gstRate} onChange={(e) => change({ gstRate: Number(e.target.value) })} /></div>
      </div>
      <button className="tm-btn tm-btn-primary tm-btn-block" onClick={() => toast("✅ Company info saved")}>Save</button>
    </div>
  );
}
