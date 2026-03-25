import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  { icon: "🎯", title: "Transparency", desc: "Real bids from real people. No hidden fees. No artificial price inflation. Just honest markets." },
  { icon: "🤝", title: "Creator-First", desc: "Creators set their terms. We provide the stage — they own the spotlight and the earnings." },
  { icon: "🔒", title: "Trust & Safety", desc: "Every creator is verified. Every transaction is escrowed. Every buyer is protected." },
  { icon: "🌍", title: "Global Reach", desc: "Our marketplace connects creators and collectors across 60+ countries with no geographic barriers." },
];

const About = () => (
  <div className="min-h-screen">
    <Navbar />

    {/* Header */}
    <div className="py-16 text-center">
      <div className="container mx-auto px-6">
        <div className="hero-eyebrow mb-3.5">Our Story</div>
        <h1 className="font-display text-foreground mb-3" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>Built for Creative Exchange</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">Where art finds its true market value — and creators get what they deserve.</p>
      </div>
    </div>

    <section className="pb-20">
      <div className="container mx-auto px-6">
        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="font-display text-foreground text-2xl lg:text-3xl leading-snug mb-5">
              Artevia was built on a single belief: <em className="not-italic text-primary">original work deserves an original marketplace.</em>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded in 2022 by a team of artists, technologists, and collectors, Artevia emerged from a shared frustration with platforms that undervalued creators and reduced art to a commodity.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We built something different. A platform where creators control their pricing, where buyers engage directly with the work, and where the auction format reveals true market enthusiasm.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80" alt="team" className="w-full h-[380px] object-cover" />
          </div>
        </div>

        {/* Mission */}
        <div className="bg-card rounded-[var(--radius)] p-8 shadow-md border border-primary/[0.08] mb-8">
          <h4 className="font-display text-lg text-foreground mb-2">Our Mission</h4>
          <p className="text-muted-foreground leading-relaxed">
            To democratize access to original creative work by building transparent, fair, and inspiring marketplace infrastructure. We believe the highest expression of a creative economy is one where artists thrive financially, buyers build meaningful collections, and authenticity is never diluted.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-16">
          <div className="bg-card rounded-[var(--radius)] p-8 shadow-md border border-primary/[0.08]">
            <h4 className="font-display text-lg text-foreground mb-2">For Creators</h4>
            <p className="text-muted-foreground leading-relaxed">
              Market exposure, verified buyer networks, real-time pricing discovery, and secure payment infrastructure. We take a flat 8% commission on completed sales and zero upfront fees.
            </p>
          </div>
          <div className="bg-card rounded-[var(--radius)] p-8 shadow-md border border-primary/[0.08]">
            <h4 className="font-display text-lg text-foreground mb-2">For Buyers</h4>
            <p className="text-muted-foreground leading-relaxed">
              Every piece is one-of-a-kind and creator-verified. Our escrow payment system protects buyers until delivery. We also provide provenance documentation for every auction.
            </p>
          </div>
        </div>

        {/* Values */}
        <h2 className="section-title text-center">Our Values</h2>
        <p className="section-sub text-center">The principles behind every decision we make</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {values.map((v, i) => (
            <div key={i} className="bg-card rounded-[var(--radius)] p-7 text-center shadow-md border border-primary/[0.08] hover:-translate-y-1 transition-transform">
              <div className="text-4xl mb-4">{v.icon}</div>
              <h5 className="font-display text-foreground mb-2">{v.title}</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="section-title mb-4">Ready to Join?</h3>
          <p className="text-muted-foreground mb-7">Whether you create or collect — your place is here.</p>
          <div className="flex gap-3.5 justify-center flex-wrap">
            <Link to="/login" className="btn-accent">Join as Creator</Link>
            <Link to="/login" className="btn-outline-accent">Register as Buyer</Link>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
