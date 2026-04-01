import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Truck, Shield, RotateCcw, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allAuctions } from "@/data/auctions";

const categories = [
  { name: "Paintings", slug: "painting", emoji: "🎨" },
  { name: "Photography", slug: "photography", emoji: "📷" },
  { name: "Sculpture", slug: "sculpture", emoji: "🏺" },
  { name: "Digital Art", slug: "digital", emoji: "💻" },
  { name: "Textile Art", slug: "textile", emoji: "🧵" },
];

const perks = [
  { icon: Truck, title: "Free Shipping", desc: "On orders above ₹50,000" },
  { icon: Shield, title: "Authenticity Guaranteed", desc: "Certificate with every piece" },
  { icon: RotateCcw, title: "Easy Returns", desc: "14-day return policy" },
  { icon: Clock, title: "Live Auctions", desc: "Bid in real-time" },
];

const Home = () => {
  const featured = allAuctions.slice(0, 4);
  const newArrivals = allAuctions.slice(2, 8);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_50%,hsl(170_75%_39%/0.2),transparent_60%)] pointer-events-none" />
        <div className="container mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-primary/30 mb-5">
                ✦ New Season Collection
              </span>
              <h1
                className="font-display text-primary-foreground leading-tight mb-5"
                style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}
              >
                Discover Original<br />
                <span className="text-primary">Creative Works</span>
              </h1>
              <p className="text-primary-foreground/60 text-lg max-w-md leading-relaxed mb-8">
                Shop one-of-a-kind artworks from independent creators. Every piece tells a story.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link to="/auctions" className="btn-accent inline-flex items-center gap-2">
                  <ShoppingBag size={18} /> Shop Now
                </Link>
                <Link to="/about" className="btn-outline-accent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {featured.slice(0, 4).map((item, i) => (
                <Link
                  key={item.id}
                  to={"/auction/" + item.id}
                  className={"block rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.03] " + (i === 0 ? "row-span-2" : "")}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className={"w-full object-cover " + (i === 0 ? "h-full" : "h-48")}
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Perks Bar */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <perk.icon size={18} className="text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{perk.title}</div>
                <div className="text-xs text-muted-foreground">{perk.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="text-muted-foreground text-sm">Browse curated collections</p>
            </div>
            <Link to="/auctions" className="text-primary text-sm font-semibold hover:underline inline-flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to="/auctions"
                className="group bg-card rounded-2xl p-6 text-center border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-primary text-xs font-bold tracking-widest uppercase">Trending Now</span>
              <h2 className="section-title">Featured Auctions</h2>
            </div>
            <Link to="/auctions" className="text-primary text-sm font-semibold hover:underline inline-flex items-center gap-1">
              See All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((item) => (
              <Link key={item.id} to={"/auction/" + item.id} className="group block bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {item.badge && (
                    <span className={"absolute top-3 left-3 text-primary-foreground text-[0.7rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full " + (item.badgeColor || "bg-primary")}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">{item.category}</div>
                  <h3 className="font-display text-foreground text-sm font-bold mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                  <div className="text-xs text-muted-foreground mb-2">by {item.creator}</div>
                  <div className="flex items-center justify-between">
                    <div className="font-display text-lg font-bold text-primary">{item.bidLabel}</div>
                    <div className="text-[0.7rem] text-muted-foreground">⏱ {item.time}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals - Full Product Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-primary text-xs font-bold tracking-widest uppercase">Just Listed</span>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <Link to="/auctions" className="text-primary text-sm font-semibold hover:underline inline-flex items-center gap-1">
              Browse All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {newArrivals.map((item) => (
              <Link key={item.id} to={"/auction/" + item.id} className="group block bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">{item.category}</div>
                  <h3 className="font-display text-foreground text-sm font-bold mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                  <div className="text-xs text-muted-foreground mb-2">by {item.creator}</div>
                  <div className="font-display text-base font-bold text-primary">{item.bidLabel}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_50%,hsl(170_75%_39%/0.15),transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="font-display text-primary-foreground text-3xl lg:text-4xl mb-4">
            Start Your Collection Today
          </h2>
          <p className="text-primary-foreground/50 max-w-lg mx-auto mb-8 leading-relaxed">
            Join thousands of collectors and creators on Artevia. Every piece is original, authenticated, and ready to be yours.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/auctions" className="btn-accent inline-flex items-center gap-2">
              <ShoppingBag size={18} /> Shop Auctions
            </Link>
            <Link to="/login" className="btn-outline-accent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
