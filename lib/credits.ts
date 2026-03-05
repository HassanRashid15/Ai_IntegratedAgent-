import { getServerSupabase } from "./supabaseServer";
import { getOrInitBilling, setBilling } from "./memoryStore";
import type { User } from "./auth";

export interface BillingResult {
  ok: boolean;
  reason?: string;
  mode?: string;
  remaining?: number;
  remainingToday?: number;
  resetAt?: string;
}

function startOfNextMonthUTC(now: Date = new Date()): string {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const next = new Date(Date.UTC(y, m + 1, 1, 0, 0, 0));
  return next.toISOString();
}

function todayUTC(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export async function ensureAndConsumeCredit({ user, units = 1 }: { user: User | null; units?: number }): Promise<BillingResult> {
  const freePerDay = Number(process.env.FREE_CREDITS_PER_DAY || 5);
  const proPerMonth = Number(process.env.PRO_CREDITS_PER_MONTH || 500);
  
  // No user: deny (force demo or login)
  if (!user) {
    return { ok: false, reason: "Not logged in. Use Demo Mode or login to run the agent." };
  }

  // Demo mode billing (in-memory)
  if (user.isDemo) {
    const b = getOrInitBilling(user.id);
    const today = todayUTC();
    if (b.freeCreditsDate !== today) {
      // reset daily counter
      setBilling(user.id, { freeCreditsDate: today, freeCreditsUsedToday: 0 });
    }
    const bb = getOrInitBilling(user.id);

    if (bb.isPro) {
      // Pro in demo mode: monthly-like credits
      const now = new Date();
      if (!bb.creditsResetAt || new Date(bb.creditsResetAt) <= now) {
        setBilling(user.id, { creditsRemaining: proPerMonth, creditsResetAt: startOfNextMonthUTC(now) });
      }
      const b2 = getOrInitBilling(user.id);
      if (b2.creditsRemaining < units) return { ok: false, reason: "No credits remaining (demo pro)." };
      setBilling(user.id, { creditsRemaining: b2.creditsRemaining - units });
      return { ok: true, mode: "demo-pro", remaining: getOrInitBilling(user.id).creditsRemaining };
    } else {
      if (bb.freeCreditsUsedToday + units > freePerDay) return { ok: false, reason: "Daily free limit reached (demo)." };
      setBilling(user.id, { freeCreditsUsedToday: bb.freeCreditsUsedToday + units });
      return { ok: true, mode: "demo-free", remainingToday: freePerDay - getOrInitBilling(user.id).freeCreditsUsedToday };
    }
  }

  // Supabase mode
  const sb = getServerSupabase();
  if (!sb) return { ok: false, reason: "Server billing store not configured." };

  // Load profile
  const { data: prof, error } = await sb.from("profiles").select("is_pro,credits_remaining,credits_reset_at").eq("id", user.id).maybeSingle();
  if (error) return { ok: false, reason: "Could not load profile." };

  const now = new Date();
  let isPro = !!prof?.is_pro;
  let credits = Number(prof?.credits_remaining || 0);
  let resetAt = prof?.credits_reset_at ? new Date(prof.credits_reset_at) : null;

  // Auto reset for pro users when past reset date
  if (isPro) {
    if (!resetAt || resetAt <= now) {
      credits = proPerMonth;
      resetAt = new Date(startOfNextMonthUTC(now));
      await sb.from("profiles").update({ credits_remaining: credits, credits_reset_at: resetAt.toISOString() }).eq("id", user.id);
    }
    if (credits < units) return { ok: false, reason: "No credits remaining." };
    await sb.from("profiles").update({ credits_remaining: credits - units }).eq("id", user.id);
    return { ok: true, mode: "pro", remaining: credits - units, resetAt: resetAt.toISOString() };
  }

  // Non-pro: simple daily cap stored client-side in demo only; for Supabase free tier we enforce a small fixed cap using reports count in last 24h.
  // This keeps schema minimal.
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await sb
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", since);

  if ((count || 0) + units > freePerDay) return { ok: false, reason: "Daily free limit reached. Upgrade to Pro." };
  return { ok: true, mode: "free", remainingToday: freePerDay - ((count || 0) + units) };
}
