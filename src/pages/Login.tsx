import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Login = () => (
  <div className="min-h-screen">
    <Navbar />

    <section className="min-h-[80vh] flex items-center justify-center py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="hero-eyebrow mb-4">Welcome Back</div>
          <h1 className="font-display text-foreground mb-2" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>Choose Who You Are</h1>
          <p className="text-muted-foreground">Select your account type to continue to your dashboard.</p>
        </div>
        <div className="grid md:grid-cols-2 max-w-3xl mx-auto gap-6">
          {[
            { icon: "🎨", title: "Creator", desc: "You're an artist, designer, or maker. List your work, set your price, and let the world bid on your creativity.", label: "Enter as Creator" },
            { icon: "🔍", title: "Buyer", desc: "You're a collector, enthusiast, or investor. Discover extraordinary works and bid to own something exceptional.", label: "Enter as Buyer" },
          ].map((role, i) => (
            <div key={i} className="bg-card rounded-3xl p-12 text-center shadow-lg border-2 border-transparent hover:border-primary hover:-translate-y-2.5 hover:scale-[1.02] transition-all duration-300 cursor-pointer" style={{ boxShadow: "0 8px 32px hsl(186 76% 21% / 0.12)" }}>
              <span className="text-6xl block mb-5">{role.icon}</span>
              <h3 className="font-display text-2xl text-foreground mb-3">{role.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{role.desc}</p>
              <span className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors">
                {role.label} →
              </span>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <span className="text-primary font-semibold cursor-pointer">Register as Buyer</span> or{" "}
            <span className="text-primary font-semibold cursor-pointer">Register as Creator</span>
          </p>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Login;
