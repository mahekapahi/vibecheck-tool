import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTabs from "@/components/SectionTabs";
import { luxeAuctions, normalAuctions } from "@/data/auctions";
import { useThemeMode } from "@/hooks/useThemeMode";

const Home = () => {
  const { isLuxe } = useThemeMode();
  const items = isLuxe ? luxeAuctions : normalAuctions;
  const hero = items[0];

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[85vh] overflow-hidden">
        <img src={hero.img} alt={hero.title} className="w-full h-full object-cover" />
        <div className={`absolute inset-0 ${
          isLuxe
            ? "bg-gradient-to-r from-black/80 via-black/50 to-transparent"
            : "bg-gradient-to-r from-secondary/60 via-secondary/30 to-transparent"
        }`} />
        <div className="absolute inset-0 flex items-end pb-16 lg:pb-24">
          <div className="container mx-auto px-6">
            {isLuxe && (
              <div className="inline-block mb-4 px-4 py-1.5 text-[0.65rem] font-bold tracking-[4px] uppercase border border-primary/40 text-primary">
                Exclusive Collection
              </div>
            )}
            <h1
              className="font-display text-primary-foreground font-normal italic leading-tight mb-6"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
            >
              {isLuxe ? "The Luxe Edit" : "New Collection"}
            </h1>
            <Link to="/auctions" className="btn-accent">
              {isLuxe ? "Shop Luxe" : "Shop Now"}
            </Link>
          </div>
        </div>
      </section>

      {/* Tagline + 3 images */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <h2 className="font-display text-foreground font-normal leading-tight" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
              {isLuxe ? "Premium artworks\nfor discerning collectors." : "Handcrafted artworks\nfor every space."}
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {items.slice(1, 4).map((item) => (
                <Link key={item.id} to={"/auction/" + item.id} className="block overflow-hidden group">
                  <img src={item.img} alt={item.title} className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <SectionTabs />

      {/* Full-width banner */}
      <section className="relative h-[50vh] overflow-hidden">
        <img src={items[4]?.img} alt="Collection" className="w-full h-full object-cover" />
        <div className={`absolute inset-0 flex items-center justify-center text-center ${
          isLuxe ? "bg-black/60" : "bg-secondary/40"
        }`}>
          <div>
            <div className="hero-eyebrow text-primary-foreground/80 mb-4">
              {isLuxe ? "Curated Selection" : "Limited Editions"}
            </div>
            <h2 className="font-display text-primary-foreground font-normal italic mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              {isLuxe ? "Investment-grade art" : "One of a kind pieces"}
            </h2>
            <Link to="/auctions" className="btn-accent">Explore Collection</Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 lg:py-24 bg-muted/40">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="hero-eyebrow mb-6">Our Story</div>
              <h2 className="section-title">A marketplace built for creative exchange</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {isLuxe
                  ? "Artevia Luxe is an exclusive tier for investment-grade artworks and premium collectibles above ₹50,000. Every piece is vetted for quality, provenance, and artistic significance."
                  : "Artevia is designed to give creators full control over their work's value while giving buyers access to genuinely unique, collectible creative pieces."}
              </p>
              <Link to="/about" className="btn-outline-accent">Learn More</Link>
            </div>
            <div className="overflow-hidden">
              <img src={items[5]?.img} alt="About Artevia" className="w-full aspect-square object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Register as Buyer / Creator */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="hero-eyebrow mb-3">Get Started</div>
            <h2 className="section-title">Join Artevia Today</h2>
            <p className="section-sub max-w-md mx-auto">Whether you're here to collect or create, there's a place for you.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Buyer */}
            <div className="bg-card rounded-3xl p-10 border border-primary/[0.08] shadow-md flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="text-5xl mb-5">🛍️</div>
              <h3 className="font-display text-foreground text-xl mb-3">Join as a Buyer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                Browse and bid on original artworks from verified creators. Build your collection, track live auctions, and own one-of-a-kind pieces.
              </p>
              <Link to="/login" className="btn-accent w-full py-3.5 text-center">
                Register as Buyer
              </Link>
            </div>
            {/* Creator */}
            <div className="bg-card rounded-3xl p-10 border border-primary/[0.08] shadow-md flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="text-5xl mb-5">🎨</div>
              <h3 className="font-display text-foreground text-xl mb-3">Join as a Creator</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                List your artwork, set your reserve price, and reach thousands of collectors. Keep full control over your creative work and earnings.
              </p>
              <Link to="/login" className="btn-accent w-full py-3.5 text-center">
                Register as Creator
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
