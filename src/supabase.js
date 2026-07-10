import { createClient } from "@supabase/supabase-js";

// Vite exposes env vars prefixed with VITE_ on import.meta.env
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Helpful console message during setup; the app still boots in local-only mode.
  console.warn(
    "[Treeman] Supabase env vars missing. Create a .env file with VITE_SUPABASE_URL and " +
    "VITE_SUPABASE_ANON_KEY. Running in local-only (offline) mode until then."
  );
}

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const hasSupabase = !!supabase;
