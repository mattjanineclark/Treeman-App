# The Treeman — Field Ops

A mobile-first PWA for The Treeman arborist crew: jobs, quotes, hazard sheets,
incident reports, crew management, PPE, equipment maintenance and toolbox talks.

Built with **Vite + React**, data shared across the crew via **Supabase**, installable
as a **PWA** (works offline, add-to-home-screen).

---

## How data works

The whole app state is stored as a single shared JSON document in a Supabase table
(`workspace`, one row). Every device that opens the app reads and writes that same
document, so the crew all see the same jobs/quotes/etc. Changes sync live via Supabase
Realtime, and a local cache keeps it working offline (syncs on reconnect).

> This is a single shared workspace with no login (uses the public anon key). That's
> fine for a small private crew tool shared by link. If it ever needs to hold sensitive
> client data or separate companies, add Supabase Auth — see `supabase/schema.sql`.

---

## 1. Set up Supabase

1. Create a project at https://supabase.com (free tier is plenty).
2. In the dashboard: **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and **Run**.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 2. Run locally

```bash
npm install
cp .env.example .env      # then paste your Supabase URL + anon key into .env
npm run dev
```

Open the printed local URL. Without a `.env` it still runs in local-only (offline) mode.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "The Treeman Field Ops PWA"
git branch -M main
git remote add origin https://github.com/<your-username>/treeman-fieldops.git
git push -u origin main
```

(Create the empty repo first at https://github.com/new — don't add a README/gitignore
there, this project already has them.)

## 4. Deploy (same as your other apps)

**Vercel or Netlify** — import the GitHub repo, then add the two env vars in the host's
dashboard (Settings → Environment Variables):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Build command: `npm run build` · Output dir: `dist`

That's it — the deployed URL is installable on phones (Share → Add to Home Screen on
iOS; install prompt on Android/Chrome).

---

## Project structure

```
index.html            App shell + PWA meta tags
vite.config.js        Vite + PWA (manifest, service worker, offline caching)
.env.example          Copy to .env with your Supabase keys
supabase/schema.sql   Database schema — run once in Supabase
public/               App icons (from the Treeman logo)
src/
  main.jsx            React entry
  App.jsx             Boots state from Supabase, wires realtime + persistence
  sync.js             Shared-workspace sync layer (remote + local cache + realtime)
  supabase.js         Supabase client (reads env vars)
  TreemanApp.jsx      The whole app UI (jobs, quotes, hazards, incidents, crew, ...)
```

## Notes / next steps

- **Backups:** Supabase → Database → Backups (or periodically export the `workspace` row).
- **Auth:** if you add logins, swap the RLS policy in `schema.sql` to the authenticated
  version and add a Supabase Auth flow in `App.jsx`.
- **Splitting the JSON into real tables** (one row per job/quote/etc.) would scale better
  and enable finer realtime + querying, but the single-document model is simplest and
  works well for one crew. The `sync.js` layer is where you'd change this.
