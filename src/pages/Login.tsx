import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const Login = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) { toast.error(error); }
      else { toast.success("Welcome back!"); navigate("/"); }
    } else {
      if (!fullName.trim()) { toast.error("Please enter your name"); setLoading(false); return; }
      const { error } = await signUp(email, password, fullName);
      if (error) { toast.error(error); }
      else { toast.success("Account created! Please check your email to verify."); }
    }
    setLoading(false);
  };

  const inputClass = "w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-4 py-3 bg-background/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition font-body text-sm";

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="min-h-[80vh] flex items-center justify-center py-16">
        <div className="w-full max-w-md mx-auto px-6">
          <div className="bg-card rounded-3xl p-10 shadow-lg border border-primary/[0.08]">
            <div className="text-center mb-8">
              <div className="hero-eyebrow mb-3">{mode === "login" ? "Welcome Back" : "Join Artevia"}</div>
              <h1 className="font-display text-foreground text-2xl mb-1">
                {mode === "login" ? "Sign In" : "Create Account"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mode === "login" ? "Enter your credentials to continue" : "Sign up to bid, review, and collect"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className={inputClass} maxLength={100} />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className={inputClass} />
              </div>
              <button type="submit" disabled={loading} className="btn-accent w-full py-3.5 text-base disabled:opacity-60">
                {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary font-semibold hover:underline">
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
