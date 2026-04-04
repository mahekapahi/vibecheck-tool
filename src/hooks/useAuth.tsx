import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MockUser {
  id: string;
  email: string;
}

interface Profile {
  full_name: string;
  avatar_url: string | null;
  role: string;
}

interface AuthContextType {
  user: MockUser | null;
  session: { user: MockUser } | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

// ─── Mock credentials ─────────────────────────────────────────────────────────
// Demo accounts that always work — no backend needed.

interface StoredAccount {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: "buyer" | "creator";
}

const MOCK_ACCOUNTS_KEY = "artevia_mock_accounts";
const MOCK_SESSION_KEY  = "artevia_mock_session";

const DEMO_ACCOUNT: StoredAccount = {
  id: "demo-001",
  email: "demo@artevia.com",
  password: "demo1234",
  full_name: "Demo User",
};

const getAccounts = (): StoredAccount[] => {
  try {
    const raw = localStorage.getItem(MOCK_ACCOUNTS_KEY);
    const saved: StoredAccount[] = raw ? JSON.parse(raw) : [];
    // Always include the built-in demo account
    if (!saved.find(a => a.email === DEMO_ACCOUNT.email)) {
      saved.push(DEMO_ACCOUNT);
    }
    return saved;
  } catch {
    return [DEMO_ACCOUNT];
  }
};

const saveAccounts = (accounts: StoredAccount[]) => {
  localStorage.setItem(MOCK_ACCOUNTS_KEY, JSON.stringify(accounts));
};

const getSession = (): StoredAccount | null => {
  try {
    const raw = localStorage.getItem(MOCK_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveSession = (account: StoredAccount | null) => {
  if (account) {
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(account));
  } else {
    localStorage.removeItem(MOCK_SESSION_KEY);
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]       = useState<MockUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session on mount
  useEffect(() => {
    const stored = getSession();
    if (stored) {
      setUser({ id: stored.id, email: stored.email });
      setProfile({ full_name: stored.full_name, avatar_url: null, role: "buyer" });
    }
    setLoading(false);
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error: string | null }> => {
    await new Promise(r => setTimeout(r, 600)); // simulate network
    const accounts = getAccounts();
    if (accounts.find(a => a.email.toLowerCase() === email.toLowerCase())) {
      return { error: "An account with this email already exists." };
    }
    const newAccount: StoredAccount = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      password,
      full_name: fullName,
    };
    saveAccounts([...accounts, newAccount]);
    // Auto sign-in after signup
    saveSession(newAccount);
    setUser({ id: newAccount.id, email: newAccount.email });
    setProfile({ full_name: newAccount.full_name, avatar_url: null, role: "buyer" });
    return { error: null };
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    await new Promise(r => setTimeout(r, 600));
    const accounts = getAccounts();
    const account = accounts.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!account) {
      return { error: "Incorrect email or password. Try demo@artevia.com / demo1234" };
    }
    saveSession(account);
    setUser({ id: account.id, email: account.email });
    setProfile({ full_name: account.full_name, avatar_url: null, role: "buyer" });
    return { error: null };
  };

  const signOut = async () => {
    saveSession(null);
    setUser(null);
    setProfile(null);
  };

  const session = user ? { user } : null;

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
