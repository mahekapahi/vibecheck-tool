import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTabs from "@/components/SectionTabs";
import { luxeAuctions, normalAuctions, allAuctions } from "@/data/auctions";
import { useThemeMode } from "@/hooks/useThemeMode";
import { Trophy, Crown, TrendingUp, Star } from "lucide-react";

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

      {/* ═══ Leaderboard Section ═══ */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="hero-eyebrow mb-3">🏆 Weekly Leaderboard</div>
            <h2 className="section-title">Top Picks This Week</h2>
            <p className="section-sub max-w-lg mx-auto">Trending products and top creators on Artevia right now.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Best Selling Products */}
            <div className="bg-card rounded-2xl p-6 border border-primary/[0.08] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp size={18} className="text-primary" />
                <h3 className="font-display text-foreground text-lg">Trending Products</h3>
              </div>
              <div className="space-y-3">
                {allAuctions
                  .sort((a, b) => b.bid - a.bid)
                  .slice(0, 5)
                  .map((item, idx) => (
                    <Link key={item.id} to={`/auction/${item.id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors group">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        idx === 0 ? "bg-yellow-400/20 text-yellow-600" :
                        idx === 1 ? "bg-gray-300/30 text-gray-500" :
                        idx === 2 ? "bg-orange-300/20 text-orange-500" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {idx + 1}
                      </span>
                      <img src={item.img} alt={item.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.creator}</div>
                      </div>
                      <span className="text-sm font-bold text-primary shrink-0">{item.bidLabel}</span>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Top Creators */}
            <div className="bg-card rounded-2xl p-6 border border-primary/[0.08] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Crown size={18} className="text-primary" />
                <h3 className="font-display text-foreground text-lg">Top Creators</h3>
              </div>
              <div className="space-y-3">
                {(() => {
                  const creatorMap = new Map<string, { name: string; avatar: string; items: number; totalBid: number }>();
                  allAuctions.forEach((a) => {
                    const existing = creatorMap.get(a.creator);
                    if (existing) {
                      existing.items++;
                      existing.totalBid += a.bid;
                    } else {
                      creatorMap.set(a.creator, { name: a.creator, avatar: a.creatorAvatar, items: 1, totalBid: a.bid });
                    }
                  });
                  return [...creatorMap.values()]
                    .sort((a, b) => b.totalBid - a.totalBid)
                    .slice(0, 5)
                    .map((creator, idx) => (
                      <div key={creator.name} className="flex items-center gap-3 p-2 rounded-xl">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          idx === 0 ? "bg-yellow-400/20 text-yellow-600" :
                          idx === 1 ? "bg-gray-300/30 text-gray-500" :
                          idx === 2 ? "bg-orange-300/20 text-orange-500" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {idx + 1}
                        </span>
                        <img src={creator.avatar} alt={creator.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground">{creator.name}</div>
                          <div className="text-xs text-muted-foreground">{creator.items} listings</div>
                        </div>
                        <span className="text-xs font-bold text-primary shrink-0">₹{(creator.totalBid / 1000).toFixed(0)}K+</span>
                      </div>
                    ));
                })()}
              </div>
            </div>

            {/* Highest Rated */}
            <div className="bg-card rounded-2xl p-6 border border-primary/[0.08] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Star size={18} className="text-primary" />
                <h3 className="font-display text-foreground text-lg">Highest Rated</h3>
              </div>
              <div className="space-y-3">
                {allAuctions
                  .sort((a, b) => b.avgRating - a.avgRating)
                  .slice(0, 5)
                  .map((item, idx) => (
                    <Link key={item.id} to={`/auction/${item.id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors group">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        idx === 0 ? "bg-yellow-400/20 text-yellow-600" :
                        idx === 1 ? "bg-gray-300/30 text-gray-500" :
                        idx === 2 ? "bg-orange-300/20 text-orange-500" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {idx + 1}
                      </span>
                      <img src={item.img} alt={item.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.creator}</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star size={12} className="fill-star text-star" />
                        <span className="text-sm font-bold text-foreground">{item.avgRating.toFixed(1)}</span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
