import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

// ─── Aadhaar helpers ──────────────────────────────────────────────────────────

const isValidAadhaarFormat = (v: string) => /^[1-9][0-9]{11}$/.test(v.replace(/\s/g, ""));

const sendAadhaarOtp = async (_n: string) => {
  await new Promise(r => setTimeout(r, 900));
  return { success: true, txnId: `TXN-${Date.now()}` };
};

const verifyAadhaarOtp = async (_txn: string, otp: string) => {
  await new Promise(r => setTimeout(r, 900));
  if (otp === "123456") return { success: true };
  return { success: false, error: "Invalid OTP. (Demo: use 123456)" };
};

// ─── Validation helpers ───────────────────────────────────────────────────────

const validateName = (v: string) => {
  if (!v.trim()) return "Full name is required";
  if (v.trim().length < 2) return "Name must be at least 2 characters";
  if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return "Name can only contain letters, spaces, hyphens or apostrophes";
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

const passwordStrength = (v: string): { label: string; color: string; width: string } => {
  let score = 0;
  if (v.length >= 8) score++;
  if (v.length >= 12) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  if (score <= 1) return { label: "Weak",   color: "bg-destructive", width: "w-1/4" };
  if (score <= 2) return { label: "Fair",   color: "bg-yellow-400",  width: "w-2/4" };
  if (score <= 3) return { label: "Good",   color: "bg-primary/70",  width: "w-3/4" };
  return             { label: "Strong", color: "bg-primary",      width: "w-full" };
};

// ─── Field component ──────────────────────────────────────────────────────────

const Field = ({
  label, value, onChange, onBlur, error, touched, type = "text", placeholder, children,
}: {
  label: string; value: string; onChange: (v: string) => void; onBlur: () => void;
  error: string; touched: boolean; type?: string; placeholder?: string;
  children?: React.ReactNode;
}) => {
  const hasError = touched && error;
  const isOk     = touched && !error && value.length > 0;
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full border-[1.5px] rounded-lg px-4 py-3 bg-background/30 text-foreground placeholder:text-muted-foreground/50 outline-none transition font-body text-sm pr-10
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

// ─── Component ────────────────────────────────────────────────────────────────

const Login = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");

  // ── Login fields ──
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw,   setShowLoginPw]   = useState(false);
  const [loginLoading,  setLoginLoading]  = useState(false);
  const [loginTouched,  setLoginTouched]  = useState({ email: false, password: false });

  // ── Signup step 1 ──
  const [fullName,        setFullName]        = useState("");
  const [signupEmail,     setSignupEmail]     = useState("");
  const [signupPassword,  setSignupPassword]  = useState("");
  const [showSignupPw,    setShowSignupPw]    = useState(false);
  const [signupTouched,   setSignupTouched]   = useState({ name: false, email: false, password: false });
  const [signupStep,      setSignupStep]      = useState<SignupStep>("details");

  // ── Signup step 2 ──
  const [aadhaarNumber,  setAadhaarNumber]  = useState("");
  const [aadhaarLoading, setAadhaarLoading] = useState(false);
  const [aadhaarTouched, setAadhaarTouched] = useState(false);
  const [txnId,          setTxnId]          = useState<string | null>(null);

  // ── Signup step 3 ──
  const [otp,        setOtp]        = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  if (user) { navigate("/"); return null; }

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
  const aadhaarError = aadhaarTouched && !isValidAadhaarFormat(aadhaarNumber)
    ? "Enter a valid 12-digit Aadhaar number"
    : "";

  const pwStrength = passwordStrength(signupPassword);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginTouched({ email: true, password: true });
    if (loginErrors.email || loginErrors.password) return;
    setLoginLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setLoginLoading(false);
    if (error) toast.error(error);
    else { toast.success("Welcome back!"); navigate("/"); }
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
    const { error } = await signUp(signupEmail, signupPassword, fullName);
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
    setFullName(""); setSignupEmail(""); setSignupPassword("");
    setAadhaarNumber(""); setOtp(""); setTxnId(null);
    setSignupTouched({ name: false, email: false, password: false });
    setAadhaarTouched(false);
    setSignupStep("details");
  };

  const switchMode = (next: "login" | "signup") => { setMode(next); resetAll(); };

  const handleAadhaarInput = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 12);
    setAadhaarNumber(digits.replace(/(\d{4})(?=\d)/g, "$1 "));
  };

  // ── Step meta ─────────────────────────────────────────────────────────────

  const steps: SignupStep[] = ["details", "aadhaar", "otp"];
  const currentIdx = steps.indexOf(signupStep);
  const stepLabels = ["Details", "Aadhaar", "OTP"];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="min-h-[80vh] flex items-center justify-center py-16">
        <div className="w-full max-w-md mx-auto px-6">

          {/* Mock credentials hint */}
          <div className="mb-4 bg-primary/[0.08] border border-primary/20 rounded-2xl px-5 py-4 text-center space-y-1.5">
            <p className="text-xs font-semibold text-foreground">🧪 Demo Accounts</p>
            <p className="text-xs text-muted-foreground font-mono">🛍️ Buyer: buyer@artevia.com / Buyer@123</p>
            <p className="text-xs text-muted-foreground font-mono">🎨 Creator: creator@artevia.com / Creator@123</p>
          </div>

          <div className="bg-card rounded-3xl p-10 shadow-lg border border-primary/[0.08]">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="hero-eyebrow mb-3">
                {mode === "login" ? "Welcome Back" : steps[currentIdx] === "details" ? "Join Artevia" : steps[currentIdx] === "aadhaar" ? "Verify Identity" : "Confirm Your ID"}
              </div>
              <h1 className="font-display text-foreground text-2xl mb-1">
                {mode === "login" ? "Sign In" : steps[currentIdx] === "details" ? "Create Account" : steps[currentIdx] === "aadhaar" ? "Aadhaar KYC" : "Enter OTP"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {mode === "login" ? "Enter your credentials to continue" : steps[currentIdx] === "details" ? "Sign up to bid, review, and collect" : steps[currentIdx] === "aadhaar" ? "Your data stays private — never stored" : "Sent to your Aadhaar-linked mobile"}
              </p>

              {/* Step dots — signup only */}
              {mode === "signup" && (
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
                        {idx < 2 && <div className={`w-8 h-0.5 rounded transition-all duration-300 ${done ? "bg-primary/60" : "bg-muted"}`} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ══ LOGIN ══ */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4" noValidate>
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
                  <button type="button" onClick={() => setShowLoginPw(v => !v)} className="text-muted-foreground hover:text-foreground transition">
                    {showLoginPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </Field>
                <button type="submit" disabled={loginLoading} className="btn-accent w-full py-3.5 text-base disabled:opacity-60">
                  {loginLoading ? "Signing in…" : "Sign In"}
                </button>
              </form>
            )}

            {/* ══ SIGNUP STEP 1 ══ */}
            {mode === "signup" && signupStep === "details" && (
              <form onSubmit={handleDetailsNext} className="space-y-4" noValidate>
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
                    label="Password" type={showSignupPw ? "text" : "password"} placeholder="Min 8 chars, 1 uppercase, 1 number"
                    value={signupPassword} onChange={setSignupPassword}
                    onBlur={() => setSignupTouched(t => ({ ...t, password: true }))}
                    error={signupErrors.password} touched={signupTouched.password}
                  >
                    <button type="button" onClick={() => setShowSignupPw(v => !v)} className="text-muted-foreground hover:text-foreground transition">
                      {showSignupPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </Field>
                  {/* Password strength bar */}
                  {signupPassword.length > 0 && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${pwStrength.color} ${pwStrength.width}`} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{pwStrength.label} password</p>
                    </div>
                  )}
                </div>
                <button type="submit" className="btn-accent w-full py-3.5 text-base">Continue →</button>
              </form>
            )}

            {/* ══ SIGNUP STEP 2: Aadhaar ══ */}
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
                    className={`w-full border-[1.5px] rounded-lg px-4 py-3 bg-background/30 text-foreground outline-none transition font-mono text-base tracking-widest
                      ${aadhaarError ? "border-destructive focus:ring-2 focus:ring-destructive/20" : "border-foreground/[0.18] focus:border-primary focus:ring-2 focus:ring-primary/15"}`}
                  />
                  {aadhaarError && <p className="text-xs text-destructive mt-1">{aadhaarError}</p>}
                  <p className="text-xs text-muted-foreground mt-1.5">OTP will be sent to your Aadhaar-linked mobile.</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setSignupStep("details")} className="flex-1 py-3.5 rounded-xl border border-foreground/20 text-sm font-semibold text-foreground hover:bg-foreground/5 transition">← Back</button>
                  <button type="submit" disabled={aadhaarLoading} className="flex-[2] btn-accent py-3.5 text-base disabled:opacity-60">
                    {aadhaarLoading ? "Sending OTP…" : "Send OTP"}
                  </button>
                </div>
              </form>
            )}

            {/* ══ SIGNUP STEP 3: OTP ══ */}
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
                    className="w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-4 py-3 bg-background/30 text-foreground outline-none transition font-mono text-2xl text-center tracking-[0.6em] focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  <p className="text-xs text-center text-muted-foreground/60 mt-1.5 italic">
                    Demo — use OTP <strong className="not-italic text-muted-foreground">123456</strong>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setSignupStep("aadhaar"); setOtp(""); }} className="flex-1 py-3.5 rounded-xl border border-foreground/20 text-sm font-semibold text-foreground hover:bg-foreground/5 transition">← Back</button>
                  <button type="submit" disabled={otpLoading || otp.length !== 6} className="flex-[2] btn-accent py-3.5 text-base disabled:opacity-60">
                    {otpLoading ? "Verifying…" : "Verify & Sign Up"}
                  </button>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Didn't receive it?{" "}
                  <button type="button" disabled={aadhaarLoading} onClick={handleResendOtp} className="text-primary font-semibold hover:underline disabled:opacity-50">
                    {aadhaarLoading ? "Sending…" : "Resend OTP"}
                  </button>
                </p>
              </form>
            )}

            {/* Mode toggle */}
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => switchMode(mode === "login" ? "signup" : "login")} className="text-primary font-semibold hover:underline">
                  {mode === "login" ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Login;
