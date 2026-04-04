import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { verifyTOTP } from "@/services/twoFactor";

// ─── Public types ─────────────────────────────────────────────────────────────

export interface MockUser {
  id: string;
  email: string;
}

export interface Profile {
  full_name: string;
  avatar_url: string | null;
  role: "buyer" | "creator";
  aadhaarVerified: boolean;
  twoFactorEnabled: boolean;
}

interface AuthContextType {
  user: MockUser | null;
  session: { user: MockUser } | null;
  profile: Profile | null;
  loading: boolean;
  /** True while the user has passed credentials but still needs to complete 2FA. */
  pending2FA: boolean;
  /** The user-id of the account waiting for 2FA — exposed so the UI can generate the demo code. */
  pendingUserId: string | null;

  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: "buyer" | "creator",
    aadhaarVerified?: boolean,
  ) => Promise<{ error: string | null }>;

  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null; needs2FA?: boolean }>;

  verify2FA: (code: string) => Promise<{ error: string | null }>;
  cancelPending2FA: () => void;

  enable2FA: (confirmCode: string) => Promise<{ error: string | null }>;
  disable2FA: (confirmCode: string) => Promise<{ error: string | null }>;
  markAadhaarVerified: () => void;

  signOut: () => Promise<void>;
}

// ─── Lockout ──────────────────────────────────────────────────────────────────

export const MAX_LOGIN_ATTEMPTS  = 5;
export const LOCKOUT_DURATION_MS = 5 * 60 * 1_000; // 5 minutes

interface LockoutRecord {
  attempts: number;
  lockedUntil: number | null;
}

const LOCKOUT_KEY = "artevia_lockouts";

function readLockouts(): Record<string, LockoutRecord> {
  try { return JSON.parse(localStorage.getItem(LOCKOUT_KEY) ?? "{}"); }
  catch { return {}; }
}
function writeLockouts(data: Record<string, LockoutRecord>) {
  try { localStorage.setItem(LOCKOUT_KEY, JSON.stringify(data)); } catch {}
}

/** Returns the current lockout state for an email. Safe to call frequently. */
export function getLockoutInfo(email: string): {
  locked: boolean;
  remainingMs: number;
  attemptsLeft: number;
} {
  const key = email.trim().toLowerCase();
  const rec = readLockouts()[key] ?? { attempts: 0, lockedUntil: null };
  const now = Date.now();

  if (rec.lockedUntil && rec.lockedUntil > now) {
    return { locked: true, remainingMs: rec.lockedUntil - now, attemptsLeft: 0 };
  }
  // Expired lock → treat as clean slate
  if (rec.lockedUntil && rec.lockedUntil <= now) {
    return { locked: false, remainingMs: 0, attemptsLeft: MAX_LOGIN_ATTEMPTS };
  }
  return {
    locked: false,
    remainingMs: 0,
    attemptsLeft: Math.max(0, MAX_LOGIN_ATTEMPTS - rec.attempts),
  };
}

function recordFailedAttempt(email: string): LockoutRecord {
  const all = readLockouts();
  const key = email.trim().toLowerCase();
  const rec = all[key] ?? { attempts: 0, lockedUntil: null };

  // Reset if a previous lock has since expired
  if (rec.lockedUntil && rec.lockedUntil <= Date.now()) {
    rec.attempts = 0;
    rec.lockedUntil = null;
  }

  rec.attempts += 1;
  if (rec.attempts >= MAX_LOGIN_ATTEMPTS) {
    rec.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
  }

  all[key] = rec;
  writeLockouts(all);
  return rec;
}

function clearLockout(email: string) {
  const all = readLockouts();
  delete all[email.trim().toLowerCase()];
  writeLockouts(all);
}

// ─── Stored accounts ──────────────────────────────────────────────────────────

interface StoredAccount {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: "buyer" | "creator";
  aadhaarVerified: boolean;
  twoFactorEnabled: boolean;
}

type SessionData = Omit<StoredAccount, "password">;

const MOCK_ACCOUNTS_KEY = "artevia_mock_accounts";
const MOCK_SESSION_KEY  = "artevia_mock_session";

const DEMO_BUYER: StoredAccount = {
  id: "demo-buyer-001",
  email: "buyer@artevia.com",
  password: "Buyer@123",
  full_name: "Ananya Sharma",
  role: "buyer",
  aadhaarVerified: true,
  twoFactorEnabled: false,
};

const DEMO_CREATOR: StoredAccount = {
  id: "demo-creator-001",
  email: "creator@artevia.com",
  password: "Creator@123",
  full_name: "Maya Chen",
  role: "creator",
  aadhaarVerified: true,
  twoFactorEnabled: false,
};

const DEMO_ACCOUNTS: StoredAccount[] = [DEMO_BUYER, DEMO_CREATOR];

/** Reads all accounts, migrating missing fields with defaults. */
function getAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(MOCK_ACCOUNTS_KEY);
    const saved: StoredAccount[] = raw ? JSON.parse(raw) : [];
    const migrated = saved.map(a => ({
      aadhaarVerified: false,
      twoFactorEnabled: false,
      ...a,
    }));
    for (const demo of DEMO_ACCOUNTS) {
      if (!migrated.find(a => a.email === demo.email)) migrated.push(demo);
    }
    return migrated;
  } catch {
    return [...DEMO_ACCOUNTS];
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(MOCK_ACCOUNTS_KEY, JSON.stringify(accounts));
}

/** Applies a partial update to a single account and persists. Returns the updated record. */
function patchAccount(id: string, patch: Partial<StoredAccount>): StoredAccount | null {
  const accounts = getAccounts();
  const idx = accounts.findIndex(a => a.id === id);
  if (idx === -1) return null;
  accounts[idx] = { ...accounts[idx], ...patch };
  saveAccounts(accounts);
  return accounts[idx];
}

function getSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(MOCK_SESSION_KEY);
    if (!raw) return null;
    // Apply defaults for fields added after the session was first saved.
    return { aadhaarVerified: false, twoFactorEnabled: false, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

function saveSession(account: StoredAccount | null) {
  if (account) {
    // Never persist the password.
    const { password: _pw, ...sessionData } = account;
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(sessionData));
  } else {
    localStorage.removeItem(MOCK_SESSION_KEY);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function accountToProfile(a: StoredAccount | SessionData): Profile {
  return {
    full_name: a.full_name,
    avatar_url: null,
    role: a.role ?? "buyer",
    aadhaarVerified: a.aadhaarVerified ?? false,
    twoFactorEnabled: a.twoFactorEnabled ?? false,
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,     setUser]     = useState<MockUser | null>(null);
  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [pending2FA, setPending2FA]   = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const pendingAccountRef = useRef<StoredAccount | null>(null);

  // Rehydrate session on mount.
  useEffect(() => {
    const stored = getSession();
    if (stored) {
      setUser({ id: stored.id, email: stored.email });
      setProfile(accountToProfile(stored));
    }
    setLoading(false);
  }, []);

  // ── signUp ─────────────────────────────────────────────────────────────────

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: "buyer" | "creator" = "buyer",
    aadhaarVerified = false,
  ): Promise<{ error: string | null }> => {
    await delay(600);
    const accounts = getAccounts();
    if (accounts.find(a => a.email.toLowerCase() === email.toLowerCase())) {
      return { error: "An account with this email already exists." };
    }
    const newAccount: StoredAccount = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      password,
      full_name: fullName,
      role,
      aadhaarVerified,
      twoFactorEnabled: false,
    };
    saveAccounts([...accounts, newAccount]);
    saveSession(newAccount);
    setUser({ id: newAccount.id, email: newAccount.email });
    setProfile(accountToProfile(newAccount));
    return { error: null };
  };

  // ── signIn ─────────────────────────────────────────────────────────────────

  const signIn = async (
    email: string,
    password: string,
  ): Promise<{ error: string | null; needs2FA?: boolean }> => {
    await delay(600);

    // Lockout check first — no password comparison if locked.
    const lockout = getLockoutInfo(email);
    if (lockout.locked) {
      const mins = Math.ceil(lockout.remainingMs / 60_000);
      return {
        error: `Account locked. Try again in ${mins} minute${mins !== 1 ? "s" : ""}.`,
      };
    }

    const accounts = getAccounts();
    const account = accounts.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password,
    );

    if (!account) {
      const rec = recordFailedAttempt(email);
      const left = Math.max(0, MAX_LOGIN_ATTEMPTS - rec.attempts);
      if (left === 0) {
        return { error: "Too many failed attempts. Account locked for 5 minutes." };
      }
      return {
        error: `Incorrect email or password. ${left} attempt${left !== 1 ? "s" : ""} remaining.`,
      };
    }

    // Credentials correct — clear any stale lockout record.
    clearLockout(email);

    // If 2FA is enabled, hold the account in a ref and wait for the code.
    if (account.twoFactorEnabled) {
      pendingAccountRef.current = account;
      setPendingUserId(account.id);
      setPending2FA(true);
      return { error: null, needs2FA: true };
    }

    // No 2FA — complete sign-in immediately.
    commitSignIn(account);
    return { error: null };
  };

  // ── verify2FA ──────────────────────────────────────────────────────────────

  const verify2FA = async (code: string): Promise<{ error: string | null }> => {
    const account = pendingAccountRef.current;
    if (!account) return { error: "Session expired. Please sign in again." };

    await delay(400);

    if (!verifyTOTP(account.id, code)) {
      return { error: "Invalid code. Please try again." };
    }

    pendingAccountRef.current = null;
    setPendingUserId(null);
    setPending2FA(false);
    commitSignIn(account);
    return { error: null };
  };

  const cancelPending2FA = () => {
    pendingAccountRef.current = null;
    setPendingUserId(null);
    setPending2FA(false);
  };

  // ── enable2FA / disable2FA ─────────────────────────────────────────────────

  const enable2FA = async (confirmCode: string): Promise<{ error: string | null }> => {
    if (!user) return { error: "Not signed in." };
    await delay(400);
    if (!verifyTOTP(user.id, confirmCode)) {
      return { error: "Invalid code. Enter the 6-digit code shown in your authenticator." };
    }
    const updated = patchAccount(user.id, { twoFactorEnabled: true });
    if (updated) {
      saveSession(updated);
      setProfile(prev => prev ? { ...prev, twoFactorEnabled: true } : prev);
    }
    return { error: null };
  };

  const disable2FA = async (confirmCode: string): Promise<{ error: string | null }> => {
    if (!user) return { error: "Not signed in." };
    await delay(400);
    if (!verifyTOTP(user.id, confirmCode)) {
      return { error: "Invalid code. Enter your current authenticator code to confirm." };
    }
    const updated = patchAccount(user.id, { twoFactorEnabled: false });
    if (updated) {
      saveSession(updated);
      setProfile(prev => prev ? { ...prev, twoFactorEnabled: false } : prev);
    }
    return { error: null };
  };

  // ── markAadhaarVerified ────────────────────────────────────────────────────

  const markAadhaarVerified = () => {
    if (!user) return;
    const updated = patchAccount(user.id, { aadhaarVerified: true });
    if (updated) {
      saveSession(updated);
      setProfile(prev => prev ? { ...prev, aadhaarVerified: true } : prev);
    }
  };

  // ── signOut ────────────────────────────────────────────────────────────────

  const signOut = async () => {
    saveSession(null);
    pendingAccountRef.current = null;
    setPendingUserId(null);
    setPending2FA(false);
    setUser(null);
    setProfile(null);
  };

  // ── helpers ────────────────────────────────────────────────────────────────

  function commitSignIn(account: StoredAccount) {
    saveSession(account);
    setUser({ id: account.id, email: account.email });
    setProfile(accountToProfile(account));
  }

  const session = user ? { user } : null;

  return (
    <AuthContext.Provider value={{
      user, session, profile, loading,
      pending2FA, pendingUserId,
      signUp, signIn,
      verify2FA, cancelPending2FA,
      enable2FA, disable2FA,
      markAadhaarVerified,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// ─── Utilities ────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
