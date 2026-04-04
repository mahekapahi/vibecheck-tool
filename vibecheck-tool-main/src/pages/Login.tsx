import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, getLockoutInfo, MAX_LOGIN_ATTEMPTS } from "@/hooks/useAuth";
import { isValidAadhaarFormat, sendAadhaarOtp, verifyAadhaarOtp } from "@/services/aadhaarAuth";
import { generateTOTP, msUntilNextTOTP, TOTP_WINDOW_MS } from "@/services/twoFactor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle2, XCircle, ShieldCheck, Lock, AlertTriangle } from "lucide-react";

// ─── Validation helpers ───────────────────────────────────────────────────────

const validateName = (v: string) => {
  if (!v.trim()) return "Full name is required";
  if (v.trim().length < 2) return "Name must be at least 2 characters";
  if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return "Letters, spaces, hyphens or apostrophes only";
  return "";
};

const validateEmail = (v: string) => {
  if (!v.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
  return "";
};

const validatePassword = (v: string) => {
  if (!v) return "Password is required";
  if (v.length < 8) return "At least 8 characters";
  if (!/[A-Z]/.test(v)) return "Include at least one uppercase letter";
  if (!/[0-9]/.test(v)) return "Include at least one number";
  return "";
};

const PASSWORD_CRITERIA = [
  { label: "At least 8 characters",  test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter",   test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number",             test: (v: string) => /[0-9]/.test(v) },
  { label: "One special character",  test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;

const passwordStrength = (v: string): { label: string; color: string } => {
  const met = PASSWORD_CRITERIA.filter(c => c.test(v)).length;
  if (met <= 1) return { label: "Weak",   color: "bg-destructive" };
  if (met === 2) return { label: "Fair",   color: "bg-yellow-400"  };
  if (met === 3) return { label: "Good",   color: "bg-primary/70"  };
  return             { label: "Strong", color: "bg-primary"      };
};

// ─── Reusable Field ───────────────────────────────────────────────────────────

const Field = ({
  label, value, onChange, onBlur, error, touched,
  type = "text", placeholder, children,
}: {
  label: string; value: string; onChange: (v: string) => void; onBlur: () => void;
  error: string; touched: boolean; type?: string; placeholder?: string;
  children?: React.ReactNode;
}) => {
  const hasError = touched && !!error;
  const isOk     = touched && !error && value.length > 0;
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={type} value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full border-[1.5px] rounded-lg px-4 py-3 bg-background/30 text-foreground
            placeholder:text-muted-foreground/50 outline-none transition font-body text-sm pr-10
            ${hasError ? "border-destructive focus:ring-2 focus:ring-destructive/20"
              : isOk   ? "border-primary/60 focus:ring-2 focus:ring-primary/15"
              :           "border-foreground/[0.18] focus:border-primary focus:ring-2 focus:ring-primary/15"}`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {children}
          {isOk     && <CheckCircle2 size={15} className="text-primary shrink-0" />}
          {hasError && <XCircle      size={15} className="text-destructive shrink-0" />}
        </div>
      </div>
      {hasError && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};

// ─── Types ────────────────────────────────────────────────────────────────────

type SignupStep = "details" | "aadhaar" | "otp";
type LoginStep  = "credentials" | "2fa";

// ─── TOTP countdown ring ──────────────────────────────────────────────────────

const TotpDisplay = ({ userId }: { userId: string }) => {
  const [code,    setCode]    = useState(() => generateTOTP(userId));
  const [remainMs, setRemainMs] = useState(() => msUntilNextTOTP());

  useEffect(() => {
    const tick = () => {
      setRemainMs(msUntilNextTOTP());
      setCode(generateTOTP(userId));
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [userId]);

  const pct = remainMs / TOTP_WINDOW_MS;
  const secs = Math.ceil(remainMs / 1_000);
  const r = 20;
  const circ = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      {/* Countdown ring */}
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
          <circle cx="24" cy="24" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
          <circle
            cx="24" cy="24" r={r} fill="none"
            stroke="hsl(var(--primary))" strokeWidth="3"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct)}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary">
          {secs}s
        </span>
      </div>

      {/* Code display */}
      <div className="font-mono text-3xl font-black tracking-[0.3em] text-foreground select-all">
        {code}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        This is your demo authenticator code.
        <br />Copy it into the field below.
      </p>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const Login = () => {
  const {
    signIn, signUp,
    verify2FA, cancelPending2FA,
    pending2FA, pendingUserId,
    user,
  } = useAuth();
  const navigate = useNavigate();

  // Redirect already-authenticated users inside an effect.
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  // ── Mode / step ──
  const [mode,       setMode]      = useState<"login" | "signup">("login");
  const [loginStep,  setLoginStep] = useState<LoginStep>("credentials");

  // ── Login fields ──
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw,   setShowLoginPw]   = useState(false);
  const [loginLoading,  setLoginLoading]  = useState(false);
  const [loginTouched,  setLoginTouched]  = useState({ email: false, password: false });

  // ── 2FA fields ──
  const [tfaCode,    setTfaCode]    = useState("");
  const [tfaLoading, setTfaLoading] = useState(false);

  // ── Lockout polling ──
  const [lockout, setLockout] = useState({ locked: false, remainingMs: 0, attemptsLeft: MAX_LOGIN_ATTEMPTS });
  useEffect(() => {
    if (!loginEmail) return;
    const update = () => setLockout(getLockoutInfo(loginEmail));
    update();
    const id = setInterval(update, 1_000);
    return () => clearInterval(id);
  }, [loginEmail]);

  // ── Signup step 1 ──
  const [fullName,       setFullName]       = useState("");
  const [signupEmail,    setSignupEmail]    = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPw,   setShowSignupPw]   = useState(false);
  const [signupRole,     setSignupRole]     = useState<"buyer" | "creator">("buyer");
  const [signupTouched,  setSignupTouched]  = useState({ name: false, email: false, password: false });
  const [signupStep,     setSignupStep]     = useState<SignupStep>("details");

  // ── Signup step 2: Aadhaar ──
  const [aadhaarNumber,  setAadhaarNumber]  = useState("");
  const [aadhaarLoading, setAadhaarLoading] = useState(false);
  const [aadhaarTouched, setAadhaarTouched] = useState(false);
  const [txnId,          setTxnId]          = useState<string | null>(null);

  // ── Signup step 3: OTP ──
  const [otp,        setOtp]        = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  if (user) return null;

  // ── Derived errors ────────────────────────────────────────────────────────

  const loginErrors = {
    email:    validateEmail(loginEmail),
    password: loginPassword ? "" : "Password is required",
  };
  const signupErrors = {
    name:     validateName(fullName),
    email:    validateEmail(signupEmail),
    password: validatePassword(signupPassword),
  };
  const aadhaarError =
    aadhaarTouched && !isValidAadhaarFormat(aadhaarNumber)
      ? "Enter a valid 12-digit Aadhaar number"
      : "";

  const pwStrength = passwordStrength(signupPassword);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginTouched({ email: true, password: true });
    if (loginErrors.email || loginErrors.password) return;
    if (lockout.locked) return;
    setLoginLoading(true);
    const { error, needs2FA } = await signIn(loginEmail, loginPassword);
    setLoginLoading(false);
    if (error) {
      toast.error(error);
    } else if (needs2FA) {
      setLoginStep("2fa");
      setTfaCode("");
    } else {
      toast.success("Welcome back!");
      navigate("/");
    }
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tfaCode.length !== 6) { toast.error("Enter the 6-digit code"); return; }
    setTfaLoading(true);
    const { error } = await verify2FA(tfaCode);
    setTfaLoading(false);
    if (error) {
      toast.error(error);
      setTfaCode("");
    } else {
      toast.success("Welcome back!");
      navigate("/");
    }
  };

  const handleCancel2FA = () => {
    cancelPending2FA();
    setLoginStep("credentials");
    setTfaCode("");
  };

  const handleDetailsNext = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupTouched({ name: true, email: true, password: true });
    if (signupErrors.name || signupErrors.email || signupErrors.password) return;
    setSignupStep("aadhaar");
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAadhaarTouched(true);
    if (!isValidAadhaarFormat(aadhaarNumber)) return;
    setAadhaarLoading(true);
    const result = await sendAadhaarOtp(aadhaarNumber.replace(/\s/g, ""));
    setAadhaarLoading(false);
    if (result.success && result.txnId) {
      setTxnId(result.txnId);
      setSignupStep("otp");
      toast.success("OTP sent to your Aadhaar-linked mobile");
    } else {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error("Enter the 6-digit OTP"); return; }
    if (!txnId) { toast.error("Session expired — please re-enter your Aadhaar."); setSignupStep("aadhaar"); return; }
    setOtpLoading(true);
    const verify = await verifyAadhaarOtp(txnId, otp);
    if (!verify.success) { setOtpLoading(false); toast.error(verify.error ?? "OTP incorrect"); return; }
    // Pass aadhaarVerified: true and the chosen role into signUp.
    const { error } = await signUp(signupEmail, signupPassword, fullName, signupRole, true);
    setOtpLoading(false);
    if (error) { toast.error(error); }
    else { toast.success("Account created! You're signed in. 🎉"); navigate("/"); }
  };

  const handleResendOtp = async () => {
    setAadhaarLoading(true);
    const result = await sendAadhaarOtp(aadhaarNumber.replace(/\s/g, ""));
    setAadhaarLoading(false);
    if (result.success && result.txnId) { setTxnId(result.txnId); toast.success("OTP resent"); }
    else toast.error("Could not resend OTP.");
  };

  const resetAll = () => {
    setFullName(""); setSignupEmail(""); setSignupPassword(""); setSignupRole("buyer");
    setAadhaarNumber(""); setOtp(""); setTxnId(null);
    setSignupTouched({ name: false, email: false, password: false });
    setAadhaarTouched(false);
    setSignupStep("details");
  };

  const switchMode = (next: "login" | "signup") => {
    setMode(next);
    setLoginStep("credentials");
    resetAll();
  };

  const handleAadhaarInput = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 12);
    setAadhaarNumber(digits.replace(/(\d{4})(?=\d)/g, "$1 "));
  };

  // ── Step meta ─────────────────────────────────────────────────────────────

  const steps: SignupStep[] = ["details", "aadhaar", "otp"];
  const currentIdx = steps.indexOf(signupStep);

  // ── Render ────────────────────────────────────────────────────────────────

  // When 2FA is required, show the 2FA panel regardless of mode.
  const show2FA = mode === "login" && (loginStep === "2fa" || pending2FA);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="min-h-[80vh] flex items-center justify-center py-16">
        <div className="w-full max-w-md mx-auto px-6">

          {/* Demo credentials hint */}
          <div className="mb-4 bg-primary/[0.08] border border-primary/20 rounded-2xl px-5 py-4 text-center space-y-1.5">
            <p className="text-xs font-semibold text-foreground">🧪 Demo Accounts</p>
            <p className="text-xs text-muted-foreground font-mono">🛍️ Buyer: buyer@artevia.com / Buyer@123</p>
            <p className="text-xs text-muted-foreground font-mono">🎨 Creator: creator@artevia.com / Creator@123</p>
          </div>

          <div className="bg-card rounded-3xl p-10 shadow-lg border border-primary/[0.08]">

            {/* ══ HEADER ══ */}
            <div className="text-center mb-8">
              <div className="hero-eyebrow mb-3">
                {show2FA ? "Two-Factor Auth"
                  : mode === "login" ? "Welcome Back"
                  : signupStep === "details" ? "Join Artevia"
                  : signupStep === "aadhaar" ? "Verify Identity"
                  : "Confirm Your ID"}
              </div>
              <h1 className="font-display text-foreground text-2xl mb-1">
                {show2FA ? "Enter Your Code"
                  : mode === "login" ? "Sign In"
                  : signupStep === "details" ? "Create Account"
                  : signupStep === "aadhaar" ? "Aadhaar KYC"
                  : "Enter OTP"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {show2FA ? "Open your authenticator app and enter the current code"
                  : mode === "login" ? "Enter your credentials to continue"
                  : signupStep === "details" ? "Sign up to bid, review, and collect"
                  : signupStep === "aadhaar" ? "Your data stays private — never stored"
                  : "Sent to your Aadhaar-linked mobile"}
              </p>

              {/* Signup step dots */}
              {mode === "signup" && !show2FA && (
                <div className="flex items-center justify-center gap-2 mt-5">
                  {steps.map((_, idx) => {
                    const done   = idx < currentIdx;
                    const active = idx === currentIdx;
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                          ${active ? "bg-primary text-primary-foreground scale-110"
                            : done  ? "bg-primary/60 text-primary-foreground"
                            :         "bg-muted text-muted-foreground"}`}>
                          {done ? "✓" : idx + 1}
                        </div>
                        {idx < 2 && (
                          <div className={`w-8 h-0.5 rounded transition-all duration-300 ${done ? "bg-primary/60" : "bg-muted"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ══ 2FA STEP ══ */}
            {show2FA && (pendingUserId || true) && (
              <form onSubmit={handle2FA} className="space-y-5" noValidate>
                <div className="bg-primary/[0.06] border border-primary/[0.14] rounded-2xl px-5 py-5">
                  <div className="flex items-center gap-2 mb-4 justify-center">
                    <ShieldCheck size={16} className="text-primary" />
                    <span className="text-xs font-bold tracking-wider uppercase text-primary">Demo Authenticator</span>
                  </div>
                  {pendingUserId && <TotpDisplay userId={pendingUserId} />}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5 text-center">
                    6-Digit Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={tfaCode}
                    onChange={e => setTfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="• • • • • •"
                    maxLength={6}
                    autoFocus
                    className="w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-4 py-3
                      bg-background/30 text-foreground outline-none transition font-mono
                      text-2xl text-center tracking-[0.6em]
                      focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancel2FA}
                    className="flex-1 py-3.5 rounded-xl border border-foreground/20 text-sm font-semibold text-foreground hover:bg-foreground/5 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={tfaLoading || tfaCode.length !== 6}
                    className="flex-[2] btn-accent py-3.5 text-base disabled:opacity-60"
                  >
                    {tfaLoading ? "Verifying…" : "Verify & Sign In"}
                  </button>
                </div>
              </form>
            )}

            {/* ══ LOGIN: CREDENTIALS ══ */}
            {mode === "login" && !show2FA && (
              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                {/* Lockout banner */}
                {lockout.locked && (
                  <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3">
                    <Lock size={15} className="text-destructive mt-0.5 shrink-0" />
                    <p className="text-xs text-destructive leading-relaxed">
                      Account locked.{" "}
                      <span className="font-semibold">
                        Try again in {Math.ceil(lockout.remainingMs / 60_000)} min{" "}
                        {Math.ceil((lockout.remainingMs % 60_000) / 1_000)}s.
                      </span>
                    </p>
                  </div>
                )}

                {/* Attempts warning (show when ≤2 attempts left but not yet locked) */}
                {!lockout.locked && lockout.attemptsLeft <= 2 && lockout.attemptsLeft < MAX_LOGIN_ATTEMPTS && (
                  <div className="flex items-start gap-3 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-3">
                    <AlertTriangle size={15} className="text-yellow-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-yellow-700 dark:text-yellow-400 leading-relaxed">
                      {lockout.attemptsLeft} attempt{lockout.attemptsLeft !== 1 ? "s" : ""} remaining before lockout.
                    </p>
                  </div>
                )}

                <Field
                  label="Email" type="email" placeholder="you@example.com"
                  value={loginEmail} onChange={setLoginEmail}
                  onBlur={() => setLoginTouched(t => ({ ...t, email: true }))}
                  error={loginErrors.email} touched={loginTouched.email}
                />
                <Field
                  label="Password" type={showLoginPw ? "text" : "password"} placeholder="Your password"
                  value={loginPassword} onChange={setLoginPassword}
                  onBlur={() => setLoginTouched(t => ({ ...t, password: true }))}
                  error={loginErrors.password} touched={loginTouched.password}
                >
                  <button type="button" onClick={() => setShowLoginPw(v => !v)}
                    className="text-muted-foreground hover:text-foreground transition">
                    {showLoginPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </Field>

                <button
                  type="submit"
                  disabled={loginLoading || lockout.locked}
                  className="btn-accent w-full py-3.5 text-base disabled:opacity-60"
                >
                  {loginLoading ? "Signing in…" : "Sign In"}
                </button>
              </form>
            )}

            {/* ══ SIGNUP STEP 1: DETAILS ══ */}
            {mode === "signup" && signupStep === "details" && (
              <form onSubmit={handleDetailsNext} className="space-y-4" noValidate>
                {/* Role selector */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">I want to</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["buyer", "creator"] as const).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSignupRole(r)}
                        className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                          signupRole === r
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-foreground/20 text-muted-foreground hover:bg-foreground/5"
                        }`}
                      >
                        {r === "buyer" ? "🛍️ Buy Art" : "🎨 Sell Art"}
                      </button>
                    ))}
                  </div>
                </div>

                <Field
                  label="Full Name" placeholder="As on your Aadhaar card"
                  value={fullName} onChange={setFullName}
                  onBlur={() => setSignupTouched(t => ({ ...t, name: true }))}
                  error={signupErrors.name} touched={signupTouched.name}
                />
                <Field
                  label="Email" type="email" placeholder="you@example.com"
                  value={signupEmail} onChange={setSignupEmail}
                  onBlur={() => setSignupTouched(t => ({ ...t, email: true }))}
                  error={signupErrors.email} touched={signupTouched.email}
                />

                <div>
                  <Field
                    label="Password" type={showSignupPw ? "text" : "password"}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    value={signupPassword} onChange={setSignupPassword}
                    onBlur={() => setSignupTouched(t => ({ ...t, password: true }))}
                    error={signupErrors.password} touched={signupTouched.password}
                  >
                    <button type="button" onClick={() => setShowSignupPw(v => !v)}
                      className="text-muted-foreground hover:text-foreground transition">
                      {showSignupPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </Field>

                  {signupPassword.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {/* Segmented strength bar */}
                      <div className="flex gap-1">
                        {PASSWORD_CRITERIA.map((_, i) => {
                          const met = PASSWORD_CRITERIA.filter(c => c.test(signupPassword)).length;
                          return (
                            <div key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i < met ? pwStrength.color : "bg-muted"
                              }`}
                            />
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground">{pwStrength.label} password</p>

                      {/* Per-criterion checklist */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1">
                        {PASSWORD_CRITERIA.map(criterion => {
                          const met = criterion.test(signupPassword);
                          return (
                            <div key={criterion.label} className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-bold ${met ? "text-primary" : "text-muted-foreground/50"}`}>
                                {met ? "✓" : "·"}
                              </span>
                              <span className={`text-[11px] transition-colors ${met ? "text-foreground" : "text-muted-foreground/60"}`}>
                                {criterion.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-accent w-full py-3.5 text-base">
                  Continue →
                </button>
              </form>
            )}

            {/* ══ SIGNUP STEP 2: AADHAAR ══ */}
            {mode === "signup" && signupStep === "aadhaar" && (
              <form onSubmit={handleSendOtp} className="space-y-5" noValidate>
                <div className="flex gap-3 bg-primary/[0.07] border border-primary/[0.13] rounded-xl px-4 py-3.5">
                  <span className="text-lg mt-0.5 shrink-0">🔒</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Used <strong className="text-foreground">only for identity verification</strong> and never stored on our servers.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Aadhaar Number</label>
                  <input
                    type="text" inputMode="numeric"
                    value={aadhaarNumber}
                    onChange={e => handleAadhaarInput(e.target.value)}
                    onBlur={() => setAadhaarTouched(true)}
                    placeholder="XXXX  XXXX  XXXX"
                    maxLength={14}
                    className={`w-full border-[1.5px] rounded-lg px-4 py-3 bg-background/30
                      text-foreground outline-none transition font-mono text-base tracking-widest
                      ${aadhaarError
                        ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                        : "border-foreground/[0.18] focus:border-primary focus:ring-2 focus:ring-primary/15"}`}
                  />
                  {aadhaarError && <p className="text-xs text-destructive mt-1">{aadhaarError}</p>}
                  <p className="text-xs text-muted-foreground mt-1.5">OTP will be sent to your Aadhaar-linked mobile.</p>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setSignupStep("details")}
                    className="flex-1 py-3.5 rounded-xl border border-foreground/20 text-sm font-semibold text-foreground hover:bg-foreground/5 transition">
                    ← Back
                  </button>
                  <button type="submit" disabled={aadhaarLoading}
                    className="flex-[2] btn-accent py-3.5 text-base disabled:opacity-60">
                    {aadhaarLoading ? "Sending OTP…" : "Send OTP"}
                  </button>
                </div>
              </form>
            )}

            {/* ══ SIGNUP STEP 3: AADHAAR OTP ══ */}
            {mode === "signup" && signupStep === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
                <div className="text-center py-2">
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-sm text-muted-foreground">OTP sent to the mobile linked with</p>
                  <p className="font-mono font-semibold text-foreground tracking-widest mt-0.5">
                    XXXX XXXX {aadhaarNumber.replace(/\s/g, "").slice(-4)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5 text-center">6-Digit OTP</label>
                  <input
                    type="text" inputMode="numeric"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="• • • • • •"
                    maxLength={6}
                    className="w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-4 py-3
                      bg-background/30 text-foreground outline-none transition font-mono
                      text-2xl text-center tracking-[0.6em]
                      focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  <p className="text-xs text-center text-muted-foreground/60 mt-1.5 italic">
                    Demo — use OTP <strong className="not-italic text-muted-foreground">123456</strong>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => { setSignupStep("aadhaar"); setOtp(""); }}
                    className="flex-1 py-3.5 rounded-xl border border-foreground/20 text-sm font-semibold text-foreground hover:bg-foreground/5 transition">
                    ← Back
                  </button>
                  <button type="submit" disabled={otpLoading || otp.length !== 6}
                    className="flex-[2] btn-accent py-3.5 text-base disabled:opacity-60">
                    {otpLoading ? "Verifying…" : "Verify & Sign Up"}
                  </button>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  Didn't receive it?{" "}
                  <button type="button" disabled={aadhaarLoading} onClick={handleResendOtp}
                    className="text-primary font-semibold hover:underline disabled:opacity-50">
                    {aadhaarLoading ? "Sending…" : "Resend OTP"}
                  </button>
                </p>
              </form>
            )}

            {/* Mode toggle */}
            {!show2FA && (
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                    className="text-primary font-semibold hover:underline"
                  >
                    {mode === "login" ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Login;
