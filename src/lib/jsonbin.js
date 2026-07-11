/**
 * db.js — Supabase REST client for LynxX
 *
 * Uses the free Supabase tier as a real shared database so every visitor
 * (any device, any browser) sees the same feedback and interaction data.
 *
 * HOW TO SET UP (takes ~3 minutes):
 * ─────────────────────────────────
 * 1. Go to https://supabase.com → "Start your project" → sign in with GitHub
 * 2. Create a new project (pick any name, any region, set a DB password)
 * 3. Once the project is ready, go to Settings → API
 * 4. Copy "Project URL" and "anon / public" key
 * 5. In Vercel dashboard → your project → Settings → Environment Variables, add:
 *      NEXT_PUBLIC_SUPABASE_URL   = (your Project URL)
 *      NEXT_PUBLIC_SUPABASE_KEY   = (your anon/public key)
 * 6. In Supabase → SQL Editor, run this SQL once:
 *
 *    create table if not exists feedback (
 *      id          uuid default gen_random_uuid() primary key,
 *      name        text,
 *      wallet      text,
 *      rating      int,
 *      comment     text,
 *      created_at  timestamptz default now()
 *    );
 *
 *    create table if not exists interactions (
 *      id          uuid default gen_random_uuid() primary key,
 *      address     text,
 *      action      text,
 *      amount      text,
 *      hash        text,
 *      created_at  timestamptz default now()
 *    );
 *
 *    -- Allow public read + insert (fine for a testnet demo)
 *    alter table feedback     enable row level security;
 *    alter table interactions enable row level security;
 *
 *    create policy "public read"   on feedback     for select using (true);
 *    create policy "public insert" on feedback     for insert with check (true);
 *    create policy "public read"   on interactions for select using (true);
 *    create policy "public insert" on interactions for insert with check (true);
 *
 * 7. Redeploy on Vercel (or `pnpm dev` locally with a .env.local file)
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL  || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY  || "";

const isConfigured = () => !!(SUPABASE_URL && SUPABASE_KEY);

function headers() {
  return {
    "Content-Type": "application/json",
    "apikey":        SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Prefer":        "return=minimal",
  };
}

function endpoint(table, params = "") {
  return `${SUPABASE_URL}/rest/v1/${table}${params}`;
}

/* ── Feedback ──────────────────────────────────────────────────────────────── */

/**
 * Fetch all feedback entries, newest first.
 * Returns [] if Supabase is not configured or the request fails.
 */
export async function getFeedback() {
  if (!isConfigured()) return [];
  try {
    const res = await fetch(
      endpoint("feedback", "?select=*&order=created_at.desc&limit=100"),
      { headers: headers() }
    );
    if (!res.ok) throw new Error(`Supabase GET feedback failed: ${res.status}`);
    const rows = await res.json();
    // Normalise to the shape the component expects
    return rows.map(r => ({
      name:      r.name      || "Anonymous",
      wallet:    r.wallet    || "",
      rating:    r.rating    || 5,
      comment:   r.comment   || "",
      timestamp: r.created_at,
    }));
  } catch (e) {
    console.warn("getFeedback:", e.message);
    return [];
  }
}

/**
 * Insert a new feedback entry.
 * @param {{ name:string, wallet:string, rating:number, comment:string }} entry
 */
export async function submitFeedback(entry) {
  if (!isConfigured()) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY to your environment variables."
    );
  }
  const wallet = entry.wallet
    ? `${entry.wallet.slice(0, 6)}...${entry.wallet.slice(-4)}`
    : "";

  const res = await fetch(endpoint("feedback"), {
    method:  "POST",
    headers: headers(),
    body: JSON.stringify({
      name:    entry.name?.trim() || "Anonymous",
      wallet,
      rating:  entry.rating,
      comment: entry.comment?.trim(),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`submitFeedback failed: ${res.status} — ${text}`);
  }
  // Return freshest data
  return getFeedback();
}

/* ── Interactions ──────────────────────────────────────────────────────────── */

/**
 * Fetch all wallet interactions, newest first.
 * Returns [] if Supabase is not configured or the request fails.
 */
export async function getInteractions() {
  if (!isConfigured()) return [];
  try {
    const res = await fetch(
      endpoint("interactions", "?select=*&order=created_at.desc&limit=200"),
      { headers: headers() }
    );
    if (!res.ok) throw new Error(`Supabase GET interactions failed: ${res.status}`);
    const rows = await res.json();
    return rows.map(r => ({
      address:   r.address   || "Unknown",
      action:    r.action    || "connect",
      amount:    r.amount    || null,
      hash:      r.hash      || null,
      timestamp: r.created_at,
    }));
  } catch (e) {
    console.warn("getInteractions:", e.message);
    return [];
  }
}

/**
 * Insert a new wallet interaction.
 * @param {string} address   full wallet address
 * @param {string} action    "connect" | "send" | "donate"
 * @param {string|null} amount
 * @param {string|null} hash
 */
export async function recordInteraction(address, action, amount = null, hash = null) {
  if (!isConfigured()) return; // silently skip if not configured
  try {
    const shortAddress = address
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : "Unknown";
    const shortHash = hash ? hash.slice(0, 12) + "..." : null;

    await fetch(endpoint("interactions"), {
      method:  "POST",
      headers: headers(),
      body: JSON.stringify({
        address: shortAddress,
        action,
        amount:  amount ? String(amount) : null,
        hash:    shortHash,
      }),
    });
  } catch (e) {
    console.warn("recordInteraction:", e.message);
  }
}

/** Whether Supabase credentials are present in the environment */
export { isConfigured };
