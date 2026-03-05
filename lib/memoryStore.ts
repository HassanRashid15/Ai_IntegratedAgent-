// Minimal in-memory fallback when Supabase isn't configured.
// NOTE: Memory resets on redeploy/serverless cold start; use Supabase for real persistence.

export interface Report {
  type: string;
  title: string;
  output: any;
}

export interface UserReport {
  id: string;
  type: string;
  createdAt: string;
  shareId: string;
  title: string;
}

export interface Billing {
  isPro: boolean;
  creditsRemaining: number;
  creditsResetAt: string | null;
  freeCreditsUsedToday: number;
  freeCreditsDate: string | null;
}

const store = {
  reports: new Map<string, Report>(), // shareId -> data
  userReports: new Map<string, UserReport[]>(), // userKey -> [{id, type, createdAt, shareId, title}]
  userBilling: new Map<string, Billing>(), // userKey -> { isPro, creditsRemaining, creditsResetAt, freeCreditsUsedToday, freeCreditsDate }
};

export function saveUserReport(userKey: string, item: UserReport): UserReport {
  const arr = store.userReports.get(userKey) || [];
  arr.unshift(item);
  store.userReports.set(userKey, arr);
  return item;
}

export function listUserReports(userKey: string): UserReport[] {
  return store.userReports.get(userKey) || [];
}

export function saveSharedReport(shareId: string, data: Report): string {
  store.reports.set(shareId, data);
  return shareId;
}

export function getSharedReport(shareId: string): Report | null {
  return store.reports.get(shareId) || null;
}

export function getOrInitBilling(userKey: string): Billing {
  if (!store.userBilling.has(userKey)) {
    store.userBilling.set(userKey, {
      isPro: false,
      creditsRemaining: 0,
      creditsResetAt: null,
      freeCreditsUsedToday: 0,
      freeCreditsDate: null
    });
  }
  return store.userBilling.get(userKey)!;
}

export function setBilling(userKey: string, partial: Partial<Billing>): Billing {
  const cur = getOrInitBilling(userKey);
  const next = { ...cur, ...partial };
  store.userBilling.set(userKey, next);
  return next;
}
