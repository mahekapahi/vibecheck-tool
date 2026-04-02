import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTabs from "@/components/SectionTabs";
import { luxeAuctions, normalAuctions } from "@/data/auctions";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const hero = luxeAuctions[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[85vh] overflow-hidden">
        <img src={hero.img} alt={hero.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-secondary/30 to-transparent" />
        <div className="absolute inset-0 flex items-end pb-16 lg:pb-24">
          <div className="container mx-auto px-6">
            <h1
              className="font-display text-primary-foreground font-normal italic leading-tight mb-6"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
            >
              New Collection
            </h1>
            <Link to="/auctions" className="btn-accent">Shop Now</Link>
          </div>
        </div>
      </section>

      {/* Tagline + 3 images */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <h2 className="font-display text-foreground font-normal leading-tight" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
              Handcrafted artworks<br />for every space.
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {normalAuctions.slice(0, 3).map((item) => (
                <Link key={item.id} to={"/auction/" + item.id} className="block overflow-hidden group">
                  <img src={item.img} alt={item.title} className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SHOP / LUXE TABS ===== */}
      <SectionTabs />

      {/* Full-width banner */}
      <section className="relative h-[50vh] overflow-hidden">
        <img src={luxeAuctions[1]?.img} alt="Collection" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-secondary/40 flex items-center justify-center text-center">
          <div>
            <div className="hero-eyebrow text-primary-foreground/80 mb-4">Limited Editions</div>
            <h2 className="font-display text-primary-foreground font-normal italic mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              One of a kind pieces
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
                Artevia is designed to give creators full control over their work's value while giving buyers access to genuinely unique, collectible creative pieces.
              </p>
              <Link to="/about" className="btn-outline-accent">Learn More</Link>
            </div>
            <div className="overflow-hidden">
              <img src={luxeAuctions[5]?.img} alt="About Artevia" className="w-full aspect-square object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
