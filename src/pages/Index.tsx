import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewsSection from "@/components/ReviewsSection";
import FeedbackSection from "@/components/FeedbackSection";
import { allAuctions } from "@/data/auctions";

const featuredAuctions = allAuctions.slice(0, 3);

const howItWorks = [
  { icon: "🎨", title: "Creator Uploads", desc: "List original works with a starting price and duration." },
  { icon: "💡", title: "Buyers Discover", desc: "Browse, filter, and save works that match your taste." },
  { icon: "🔨", title: "Competitive Bidding", desc: "Real-time bids determine the true market value." },
  { icon: "📦", title: "Secure Transfer", desc: "Winner receives their piece safely and legally." },
];

const StatCounter = ({ target, suffix, label }: { target: string; suffix: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const num = parseInt(target);
    let start = 0;
    const step = Math.ceil(num / (1500 / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { start = num; clearInterval(timer); }
      el.textContent = (start >= 1000 ? Math.round(start / 1000) + "K" : String(start)) + suffix;
    }, 16);
    return () => clearInterval(timer);
  }, [target, suffix]);
  return (
    <div className="text-center px-5 py-5">
      <div ref={ref} className="font-display text-5xl font-black text-primary leading-none mb-2">{target}{suffix}</div>
      <div className="text-primary-foreground/60 text-sm font-medium tracking-wide">{label}</div>
    </div>
  );
};

const Home = () => (
  <div className="min-h-screen">
    <Navbar />

    {/* Hero */}
    <section className="relative min-h-[90vh] flex items-center overflow-hidden py-20">
      <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full bg-primary/[0.18] blur-3xl animate-pulse pointer-events-none" />
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="hero-eyebrow mb-5">✦ Premium Creative Auctions</div>
            <h1 className="font-display text-foreground leading-[1.12] mb-5" style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)", animation: "fadeUp 0.9s ease forwards 0.2s", opacity: 0, transform: "translateY(30px)" }}>
              Bid on <em className="not-italic text-primary">Creativity.</em><br />Own Original Power.
            </h1>
            <p className="text-muted-foreground text-lg max-w-[460px] leading-relaxed mb-9" style={{ animation: "fadeUp 0.9s ease forwards 0.45s", opacity: 0, transform: "translateY(20px)" }}>
              Artevia connects visionary buyers with exceptional creators. Discover one-of-a-kind works, place your bid, and own something truly irreplaceable.
            </p>
            <div className="flex gap-3.5 flex-wrap" style={{ animation: "fadeUp 0.9s ease forwards 0.65s", opacity: 0, transform: "translateY(20px)" }}>
              <Link to="/login" className="btn-accent">Login to Bid</Link>
              <Link to="/login" className="btn-outline-accent">Become a Creator</Link>
            </div>
          </div>
          <div className="hidden lg:block relative" style={{ animation: "fadeUp 1.2s ease forwards 0.5s", opacity: 0 }}>
            <div className="space-y-4">
              {featuredAuctions.map((c, i) => (
                <Link key={i} to={`/auction/${c.id}`} className="bg-card rounded-xl p-3 flex gap-4 items-center shadow-lg border border-primary/[0.08] no-underline hover:shadow-xl transition-shadow" style={{ transform: `translateX(${i * 20}px)` }}>
                  <img src={c.img} alt={c.title} className="w-20 h-20 rounded-lg object-cover" />
                  <div>
                    <div className="font-display font-bold text-sm text-foreground">{c.title}</div>
                    <div className="text-xs text-muted-foreground">{c.bidLabel} · {c.time}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="bg-dark-bg py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_50%,hsl(170_75%_39%/0.1),transparent_70%)] pointer-events-none" />
      <div className="container mx-auto px-6 grid grid-cols-3 relative z-10">
        <StatCounter target="12000" suffix="+" label="Active Users" />
        <StatCounter target="3000" suffix="+" label="Creators" />
        <StatCounter target="9000" suffix="+" label="Auctions" />
      </div>
    </section>

    {/* Featured Auctions */}
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-2">
          <div className="hero-eyebrow text-xs">Curated Picks</div>
        </div>
        <h2 className="section-title text-center">Featured Auctions</h2>
        <p className="section-sub text-center">Hand-picked works closing soon</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAuctions.map((c) => (
            <Link key={c.id} to={`/auction/${c.id}`} className="card-artevia block no-underline">
              <div className="relative overflow-hidden h-56">
                <img src={c.img} alt={c.title} loading="lazy" width={800} height={600} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                <span className={`absolute top-3 left-3 ${c.badgeColor || "bg-primary"} text-primary-foreground text-[0.72rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full`}>
                  {c.badge}
                </span>
              </div>
              <div className="p-5">
                <h5 className="font-display text-foreground text-lg mb-1">{c.title}</h5>
                <div className="text-sm text-muted-foreground mb-2">by <strong>{c.creator}</strong> · {c.category}</div>
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} className={s <= Math.round(c.avgRating) ? "fill-star text-star" : "text-muted-foreground/30"} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{c.avgRating} ({c.reviews.length} reviews)</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-muted-foreground/70">Current Bid</div>
                    <div className="font-display text-xl font-bold text-primary">{c.bidLabel}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">⏱ {c.time}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/auctions" className="btn-accent">View All Auctions</Link>
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="py-20 bg-primary/[0.06]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="hero-eyebrow mb-4">How It Works</div>
            <h2 className="section-title">A marketplace built<br />for creative exchange</h2>
            <p className="text-muted-foreground leading-relaxed mb-7">
              Artevia is designed to give creators full control over their work's value while giving buyers access to genuinely unique, collectible creative pieces.
            </p>
            <Link to="/about" className="btn-outline-accent">Learn More About Us</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {howItWorks.map((item, i) => (
              <div key={i} className="bg-card rounded-[var(--radius)] p-6 shadow-md border border-primary/[0.08]">
                <div className="text-3xl mb-2.5">{item.icon}</div>
                <h6 className="font-display text-sm font-bold text-foreground mb-1.5">{item.title}</h6>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Customer Reviews */}
    <ReviewsSection />

    {/* Feedback / How can we improve */}
    <FeedbackSection />

    <Footer />
  </div>
);

export default Home;
