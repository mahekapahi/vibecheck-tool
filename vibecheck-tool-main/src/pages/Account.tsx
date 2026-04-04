import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { generateTOTP, msUntilNextTOTP, TOTP_WINDOW_MS } from "@/services/twoFactor";
import { isValidAadhaarFormat, sendAadhaarOtp, verifyAadhaarOtp } from "@/services/aadhaarAuth";
import { toast } from "sonner";
import {
  ShieldCheck, ShieldOff, ShieldAlert,
  Fingerprint, CheckCircle2, AlertCircle,
  Eye, EyeOff, User, Mail, Crown,
} from "lucide-react";

// ─── Shared input style ───────────────────────────────────────────────────────

const inputCls =
  "w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-4 py-3 " +
  "bg-background/30 text-foreground placeholder:text-muted-foreground/50 " +
  "focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition font-body text-sm";

// ─── TOTP live display ────────────────────────────────────────────────────────

const TotpLive = ({ userId }: { userId: string }) => {
  const [code,      setCode]      = useState(() => generateTOTP(userId));
  const [remainMs,  setRemainMs]  = useState(() => msUntilNextTOTP());

  useEffect(() => {
    const tick = () => {
      setRemainMs(msUntilNextTOTP());
      setCode(generateTOTP(userId));
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [userId]);

  const pct  = remainMs / TOTP_WINDOW_MS;
  const secs = Math.ceil(remainMs / 1_000);
  const r    = 20;
  const circ = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-5 bg-primary/[0.06] border border-primary/[0.15] rounded-2xl px-5 py-4">
      {/* Countdown ring */}
      <div className="relative w-14 h-14 shrink-0">
        <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
          <circle cx="24" cy="24" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="3.5" />
          <circle
            cx="24" cy="24" r={r} fill="none"
            stroke="hsl(var(--primary))" strokeWidth="3.5"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct)}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary">
          {secs}s
        </span>
      </div>

      <div>
        <p className="text-[0.65rem] font-bold tracking-widest uppercase text-muted-foreground mb-1">
          Current code
        </p>
        <p className="font-mono text-2xl font-black tracking-[0.25em] text-foreground select-all">
          {code}
        </p>
        <p className="text-[0.65rem] text-muted-foreground mt-0.5">Refreshes every 30 seconds</p>
      </div>
    </div>
  );
};

// ─── Section card wrapper ─────────────────────────────────────────────────────

const SectionCard = ({
  icon: Icon, title, badge, badgeColor = "bg-primary/10 text-primary", children,
}: {
  icon: React.ElementType;
  title: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
}) => (
  <div className="bg-card rounded-2xl border border-primary/[0.08] shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-primary" />
        <h2 className="font-display text-foreground text-base">{title}</h2>
      </div>
      {badge && (
        <span className={`text-[0.65rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

// ─── Two-Factor Authentication card ──────────────────────────────────────────

type TfaPanel = "idle" | "setup" | "disable";

const TwoFactorCard = () => {
  const { user, profile, enable2FA, disable2FA } = useAuth();
  const [panel,       setPanel]       = useState<TfaPanel>("idle");
  const [code,        setCode]        = useState("");
  const [showCode,    setShowCode]    = useState(false);
  const [submitting,  setSubmitting]  = useState(false);

  const enabled = profile?.twoFactorEnabled ?? false;

  const reset = useCallback(() => { setPanel("idle"); setCode(""); }, []);

  const handleEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) { toast.error("Enter the 6-digit code"); return; }
    setSubmitting(true);
    const { error } = await enable2FA(code);
    setSubmitting(false);
    if (error) { toast.error(error); setCode(""); }
    else { toast.success("Two-factor authentication enabled!"); reset(); }
  };

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) { toast.error("Enter the 6-digit code"); return; }
    setSubmitting(true);
    const { error } = await disable2FA(code);
    setSubmitting(false);
    if (error) { toast.error(error); setCode(""); }
    else { toast.success("Two-factor authentication disabled."); reset(); }
  };

  const badge = enabled ? "Enabled" : "Disabled";
  const badgeColor = enabled
    ? "bg-primary/10 text-primary"
    : "bg-muted text-muted-foreground";

  return (
    <SectionCard
      icon={enabled ? ShieldCheck : ShieldOff}
      title="Two-Factor Authentication"
      badge={badge}
      badgeColor={badgeColor}
    >
      {panel === "idle" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {enabled
              ? "Your account is protected with a time-based one-time password (TOTP). You'll need your authenticator app on every sign-in."
              : "Add an extra layer of security. After enabling, you'll enter a 6-digit code from your authenticator app each time you sign in."}
          </p>
          {enabled ? (
            <button
              onClick={() => setPanel("disable")}
              className="text-sm font-semibold text-destructive hover:underline"
            >
              Disable 2FA
            </button>
          ) : (
            <button
              onClick={() => setPanel("setup")}
              className="btn-accent py-2.5 px-6 text-sm"
            >
              Enable 2FA
            </button>
          )}
        </div>
      )}

      {panel === "setup" && user && (
        <form onSubmit={handleEnable} className="space-y-4" noValidate>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In a real app you'd scan a QR code with Google Authenticator or Authy.
            In demo mode your codes are generated below — enter the current one to confirm setup.
          </p>

          <TotpLive userId={user.id} />

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Confirm with current code
            </label>
            <div className="relative">
              <input
                type={showCode ? "text" : "password"}
                inputMode="numeric"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit code"
                maxLength={6}
                className={`${inputCls} pr-10 font-mono text-lg tracking-widest`}
              />
              <button
                type="button"
                onClick={() => setShowCode(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCode ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={reset}
              className="flex-1 py-2.5 rounded-xl border border-foreground/20 text-sm font-semibold text-foreground hover:bg-foreground/5 transition">
              Cancel
            </button>
            <button type="submit" disabled={submitting || code.length !== 6}
              className="flex-[2] btn-accent py-2.5 text-sm disabled:opacity-60">
              {submitting ? "Confirming…" : "Confirm & Enable"}
            </button>
          </div>
        </form>
      )}

      {panel === "disable" && user && (
        <form onSubmit={handleDisable} className="space-y-4" noValidate>
          <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
            <ShieldAlert size={15} className="text-destructive mt-0.5 shrink-0" />
            <p className="text-xs text-destructive leading-relaxed">
              Disabling 2FA reduces your account security. Enter your current authenticator code to confirm.
            </p>
          </div>

          <TotpLive userId={user.id} />

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Current authenticator code
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit code"
              maxLength={6}
              className={`${inputCls} font-mono text-lg tracking-widest`}
            />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={reset}
              className="flex-1 py-2.5 rounded-xl border border-foreground/20 text-sm font-semibold text-foreground hover:bg-foreground/5 transition">
              Cancel
            </button>
            <button type="submit" disabled={submitting || code.length !== 6}
              className="flex-[2] py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold disabled:opacity-60 transition hover:opacity-90">
              {submitting ? "Disabling…" : "Disable 2FA"}
            </button>
          </div>
        </form>
      )}
    </SectionCard>
  );
};

// ─── Aadhaar Verification card ────────────────────────────────────────────────

type AadhaarPanel = "idle" | "input" | "otp";

const AadhaarCard = () => {
  const { profile, markAadhaarVerified } = useAuth();
  const [panel,         setPanel]         = useState<AadhaarPanel>("idle");
  const [aadhaarNum,    setAadhaarNum]    = useState("");
  const [touched,       setTouched]       = useState(false);
  const [otp,           setOtp]           = useState("");
  const [txnId,         setTxnId]         = useState<string | null>(null);
  const [aadhaarLoading, setAadhaarLoading] = useState(false);

  const verified = profile?.aadhaarVerified ?? false;

  const handleAadhaarInput = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 12);
    setAadhaarNum(digits.replace(/(\d{4})(?=\d)/g, "$1 "));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValidAadhaarFormat(aadhaarNum)) return;
    setAadhaarLoading(true);
    const result = await sendAadhaarOtp(aadhaarNum.replace(/\s/g, ""));
    setAadhaarLoading(false);
    if (result.success && result.txnId) {
      setTxnId(result.txnId);
      setPanel("otp");
      toast.success("OTP sent to your Aadhaar-linked mobile");
    } else {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error("Enter the 6-digit OTP"); return; }
    if (!txnId) { toast.error("Session expired. Please re-enter your Aadhaar."); setPanel("input"); return; }
    setAadhaarLoading(true);
    const result = await verifyAadhaarOtp(txnId, otp);
    setAadhaarLoading(false);
    if (!result.success) { toast.error(result.error ?? "Invalid OTP"); return; }
    markAadhaarVerified();
    toast.success("Aadhaar verified successfully! 🎉");
    setPanel("idle");
    setAadhaarNum(""); setOtp(""); setTxnId(null); setTouched(false);
  };

  const reset = () => {
    setPanel("idle");
    setAadhaarNum(""); setOtp(""); setTxnId(null); setTouched(false);
  };

  const aadhaarError = touched && !isValidAadhaarFormat(aadhaarNum)
    ? "Enter a valid 12-digit Aadhaar number" : "";

  const badge      = verified ? "Verified" : "Not Verified";
  const badgeColor = verified
    ? "bg-primary/10 text-primary"
    : "bg-yellow-400/15 text-yellow-700 dark:text-yellow-400";

  return (
    <SectionCard
      icon={Fingerprint}
      title="Aadhaar Verification"
      badge={badge}
      badgeColor={badgeColor}
    >
      {panel === "idle" && (
        <div className="space-y-4">
          {verified ? (
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">
                Your identity has been verified via Aadhaar OTP. This adds credibility to your profile.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your identity has not been verified. Verifying your Aadhaar unlocks higher bid limits and builds trust with sellers.
              </p>
            </div>
          )}

          <button
            onClick={() => setPanel("input")}
            className={verified ? "text-sm font-semibold text-primary hover:underline" : "btn-accent py-2.5 px-6 text-sm"}
          >
            {verified ? "Re-verify Aadhaar" : "Verify Now"}
          </button>
        </div>
      )}

      {panel === "input" && (
        <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
          <div className="flex gap-3 bg-primary/[0.07] border border-primary/[0.13] rounded-xl px-4 py-3">
            <span className="text-base mt-0.5 shrink-0">🔒</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Used <strong className="text-foreground">only for identity verification</strong> and never stored on our servers.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Aadhaar Number</label>
            <input
              type="text" inputMode="numeric"
              value={aadhaarNum}
              onChange={e => handleAadhaarInput(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="XXXX  XXXX  XXXX"
              maxLength={14}
              className={`w-full border-[1.5px] rounded-lg px-4 py-3 bg-background/30
                text-foreground outline-none transition font-mono text-base tracking-widest
                ${aadhaarError
                  ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                  : "border-foreground/[0.18] focus:border-primary focus:ring-2 focus:ring-primary/15"}`}
            />
            {aadhaarError && <p className="text-xs text-destructive mt-1">{aadhaarError}</p>}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={reset}
              className="flex-1 py-2.5 rounded-xl border border-foreground/20 text-sm font-semibold text-foreground hover:bg-foreground/5 transition">
              Cancel
            </button>
            <button type="submit" disabled={aadhaarLoading}
              className="flex-[2] btn-accent py-2.5 text-sm disabled:opacity-60">
              {aadhaarLoading ? "Sending OTP…" : "Send OTP"}
            </button>
          </div>
        </form>
      )}

      {panel === "otp" && (
        <form onSubmit={handleVerifyOtp} className="space-y-4" noValidate>
          <div className="text-center py-2">
            <div className="text-3xl mb-2">📱</div>
            <p className="text-sm text-muted-foreground">OTP sent to the mobile linked with</p>
            <p className="font-mono font-semibold text-foreground tracking-widest mt-0.5 text-sm">
              XXXX XXXX {aadhaarNum.replace(/\s/g, "").slice(-4)}
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
                text-xl text-center tracking-[0.5em]
                focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <p className="text-xs text-center text-muted-foreground/60 mt-1.5 italic">
              Demo — use OTP <strong className="not-italic text-muted-foreground">123456</strong>
            </p>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => { setPanel("input"); setOtp(""); }}
              className="flex-1 py-2.5 rounded-xl border border-foreground/20 text-sm font-semibold text-foreground hover:bg-foreground/5 transition">
              ← Back
            </button>
            <button type="submit" disabled={aadhaarLoading || otp.length !== 6}
              className="flex-[2] btn-accent py-2.5 text-sm disabled:opacity-60">
              {aadhaarLoading ? "Verifying…" : "Verify OTP"}
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Didn't receive it?{" "}
            <button type="button" disabled={aadhaarLoading}
              onClick={async () => {
                setAadhaarLoading(true);
                const r = await sendAadhaarOtp(aadhaarNum.replace(/\s/g, ""));
                setAadhaarLoading(false);
                if (r.success && r.txnId) { setTxnId(r.txnId); toast.success("OTP resent"); }
                else toast.error("Could not resend OTP.");
              }}
              className="text-primary font-semibold hover:underline disabled:opacity-50"
            >
              {aadhaarLoading ? "Sending…" : "Resend OTP"}
            </button>
          </p>
        </form>
      )}
    </SectionCard>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const Account = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [loading, user, navigate]);

  if (loading || !user || !profile) return null;

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <Navbar />

      {/* Page header */}
      <div className="py-12 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="hero-eyebrow mb-2">Settings</div>
          <h1 className="font-display text-foreground text-3xl">Account &amp; Security</h1>
          <p className="text-muted-foreground mt-2">Manage your identity verification and authentication settings.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* ── Profile ── */}
          <SectionCard icon={User} title="Profile">
            <div className="space-y-3">
              <Row icon={User}  label="Name"  value={profile.full_name} />
              <Row icon={Mail}  label="Email" value={user.email} />
              <Row icon={Crown} label="Role"  value={profile.role === "creator" ? "Creator" : "Buyer"} />
            </div>
          </SectionCard>

          {/* ── Aadhaar ── */}
          <AadhaarCard />

          {/* ── 2FA ── */}
          <TwoFactorCard />

        </div>
      </div>

      <Footer />
    </div>
  );
};

// ─── Profile row ──────────────────────────────────────────────────────────────

const Row = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-center gap-3">
    <Icon size={15} className="text-muted-foreground shrink-0" />
    <span className="text-xs text-muted-foreground w-12 shrink-0">{label}</span>
    <span className="text-sm text-foreground font-medium">{value}</span>
  </div>
);

export default Account;
