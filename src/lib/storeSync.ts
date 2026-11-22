import { useBankingStore } from '../store/useBankingStore';
import type { BankingState } from '../store/useBankingStore';

// Base URL of the Worker. Empty => same origin (web). For the packaged app set
// VITE_API_BASE=https://your-worker.workers.dev at build time.
const API_BASE: string = (import.meta as any).env?.VITE_API_BASE || '';

// Shared (cloud) keys. Per-device keys (currentUser, isAdmin, pendingUser,
// theme, isBalanceHidden) are intentionally NOT synced.
export const SHARED_KEYS: (keyof BankingState)[] = [
  'users',
  'transactions',
  'systemLogs',
  'paymentOptions',
  'withdrawalOptions',
  'giftCards',
  'processingFeedbackMessage',
  'withdrawalDisclaimer',
  'notifications',
  'resetPasswordPin',
  'globalNotification',
  'budgetCategories',
  'supportThreads',
  'installCount',
  'accessCodes',
  'enrollmentSettings',
];

export function pickShared(state: Partial<BankingState>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of SHARED_KEYS) {
    if (k in state) out[k as string] = (state as Record<string, unknown>)[k as string];
  }
  return out;
}

async function pull(): Promise<{ updatedAt: number; data: any } | null> {
  try {
    const res = await fetch(`${API_BASE}/api/state`, { method: 'GET' });
    if (!res.ok) return null;
    const j = await res.json();
    return j && j.synced ? { updatedAt: j.updatedAt || 0, data: j.data } : null;
  } catch {
    return null;
  }
}

async function push(data: unknown): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/state`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

let started = false;
let applyingRemote = false;
let lastPushed = '';
let lastRemoteUpdatedAt = 0;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;

function applyRemote(data: any) {
  if (!data || typeof data !== 'object') return;
  applyingRemote = true;
  try {
    useBankingStore.setState((s: BankingState) => {
      const merged: Record<string, unknown> = { ...(s as unknown as Record<string, unknown>), ...data };
      const cid = s.currentUser?.id;
      if (cid && Array.isArray((data as any).users)) {
        const updated = (data as any).users.find((u: any) => u.id === cid);
        if (updated) merged.currentUser = updated;
      }
      return merged as unknown as BankingState;
    });
  } finally {
    applyingRemote = false;
  }
}

/** Start two-way sync with the Worker (no-op if already started). */
export function startCloudSync(): void {
  if (started) return;
  started = true;

  // Initial pull (cloud is source of truth for shared data).
  pull().then((remote) => {
    if (remote && remote.data) {
      lastRemoteUpdatedAt = remote.updatedAt;
      applyRemote(remote.data);
    }
    lastPushed = JSON.stringify(pickShared(useBankingStore.getState()));
  });

  // Push local shared changes (debounced).
  useBankingStore.subscribe((state: BankingState) => {
    if (applyingRemote) return;
    const shared = pickShared(state);
    const serialized = JSON.stringify(shared);
    if (serialized === lastPushed) return;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(async () => {
      const ok = await push(shared).catch(() => false);
      // Only remember success; a failed push will retry on the next change/wake.
      lastPushed = ok ? serialized : '';
    }, 700);
  });

  // Poll for admin updates from other devices.
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(async () => {
    const remote = await pull();
    if (remote && remote.data && remote.updatedAt !== lastRemoteUpdatedAt) {
      lastRemoteUpdatedAt = remote.updatedAt;
      applyRemote(remote.data);
      lastPushed = JSON.stringify(pickShared(useBankingStore.getState()));
    }
  }, 15000);
}

/** Force an immediate pull (e.g., when the tab regains focus). */
export function refreshFromCloud(): void {
  if (!started) return;
  pull().then((remote) => {
    if (remote && remote.data && remote.updatedAt !== lastRemoteUpdatedAt) {
      lastRemoteUpdatedAt = remote.updatedAt;
      applyRemote(remote.data);
      lastPushed = JSON.stringify(pickShared(useBankingStore.getState()));
    }
  });
}