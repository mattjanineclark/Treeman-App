import { supabase, hasSupabase } from "./supabase";
import { DEFAULT_STATE } from "./TreemanApp.jsx";

/**
 * Sync strategy
 * -------------
 * The whole app state is a single JSON document shared by everyone in the crew.
 * It lives in one row of the `workspace` table (id = WORKSPACE_ID) in a JSONB column.
 *
 * - On load: read the row from Supabase. If offline or not configured, fall back to
 *   the local cache (localStorage). If neither exists, seed DEFAULT_STATE.
 * - On change: write-through to localStorage immediately (instant + offline), then
 *   debounce-push to Supabase.
 * - Realtime: subscribe to row changes so other devices update live.
 *
 * This keeps the whole existing component untouched (same state shape) while making
 * the data shared + cloud-backed. Single shared workspace = simplest model for one crew.
 * (If you later want per-company separation or auth, this is the layer to extend.)
 */

const WORKSPACE_ID = "treeman-fieldops"; // single shared doc for the whole crew
const CACHE_KEY = "treeman_ws_cache";
const REV_KEY = "treeman_ws_rev";

function clone(o) { return JSON.parse(JSON.stringify(o)); }

// ---- local cache ----
export function loadLocal() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...clone(DEFAULT_STATE), ...parsed, settings: { ...clone(DEFAULT_STATE.settings), ...(parsed.settings || {}) } };
  } catch (e) {
    return null;
  }
}

function saveLocal(state) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(state)); } catch (e) {}
}

// ---- remote load ----
export async function loadRemote() {
  if (!hasSupabase) return null;
  try {
    const { data, error } = await supabase
      .from("workspace")
      .select("data, updated_at")
      .eq("id", WORKSPACE_ID)
      .maybeSingle();
    if (error) { console.warn("[Treeman] load error", error.message); return null; }
    if (!data) {
      // Seed the shared doc on first ever run.
      const seed = clone(DEFAULT_STATE);
      await supabase.from("workspace").insert({ id: WORKSPACE_ID, data: seed });
      return seed;
    }
    return { ...clone(DEFAULT_STATE), ...data.data, settings: { ...clone(DEFAULT_STATE.settings), ...((data.data || {}).settings || {}) } };
  } catch (e) {
    console.warn("[Treeman] load exception", e);
    return null;
  }
}

/**
 * Resolve the initial state used to boot the app.
 * Order: remote (source of truth) -> local cache -> DEFAULT_STATE.
 */
export async function loadInitial() {
  const remote = await loadRemote();
  if (remote) { saveLocal(remote); return remote; }
  const local = loadLocal();
  if (local) return local;
  return clone(DEFAULT_STATE);
}

// ---- push (debounced) ----
let pushTimer = null;
let pending = null;

export function persist(state) {
  // Always write local first — instant + offline safe.
  saveLocal(state);
  pending = state;
  if (!hasSupabase) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(flush, 600); // debounce rapid edits
}

async function flush() {
  if (!hasSupabase || !pending) return;
  const toSend = pending;
  pending = null;
  try {
    const { error } = await supabase
      .from("workspace")
      .upsert({ id: WORKSPACE_ID, data: toSend, updated_at: new Date().toISOString() });
    if (error) console.warn("[Treeman] push error", error.message);
  } catch (e) {
    console.warn("[Treeman] push exception", e);
  }
}

// Flush any pending write when the tab is hidden/closed.
if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", () => { if (document.hidden) flush(); });
  window.addEventListener("beforeunload", () => { flush(); });
}

// ---- realtime subscribe ----
export function subscribe(onRemoteChange) {
  if (!hasSupabase) return () => {};
  const channel = supabase
    .channel("workspace-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "workspace", filter: `id=eq.${WORKSPACE_ID}` },
      (payload) => {
        const next = payload.new && payload.new.data;
        if (next) { saveLocal(next); onRemoteChange(next); }
      }
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}
