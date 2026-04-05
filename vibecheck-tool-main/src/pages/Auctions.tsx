import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { normalAuctions, luxeAuctions } from "@/data/auctions";
import { useThemeMode } from "@/hooks/useThemeMode";
import { Star, ShoppingBag, Sparkles, Crown } from "lucide-react";

const inputClass = "w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-3 py-2.5 bg-background/30 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition font-body text-sm";

const Auctions = () => {
  const { isLuxe, mode, setMode } = useThemeMode();
  const sourceItems = isLuxe ? luxeAuctions : normalAuctions;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    let result = sourceItems.filter((a) => {
      const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.creator.toLowerCase().includes(search.toLowerCase());
      const matchCat = !category || a.categorySlug === category;
      const matchStatus = status === "all" || a.status === status;
      return matchSearch && matchCat && matchStatus;
    });
    if (sort === "highest") result = [...result].sort((a, b) => b.bid - a.bid);
    else if (sort === "lowest") result = [...result].sort((a, b) => a.bid - b.bid);
    else result = [...result].sort((a, b) => b.id - a.id);
    return result;
  }, [search, category, status, sort, sourceItems]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <Navbar />

      <div className="py-16 text-center">
        <div className="container mx-auto px-6">
          {isLuxe ? (
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 border border-primary/40 text-primary text-[0.6rem] font-bold tracking-[4px] uppercase">
              <Crown size={10} />
              Exclusive Collection
            </div>
          ) : (
            <div className="hero-eyebrow mb-3.5">Live & Upcoming</div>
          )}
          <h1 className={`font-display text-foreground mb-3 ${isLuxe ? "italic" : ""}`} style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
            {isLuxe ? "The Luxe Edit" : "Browse Auctions"}
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {isLuxe
              ? "Investment-grade artworks above ₹50,000 from acclaimed creators."
              : "Discover original works from verified creators around the world."}
          </p>
          {isLuxe && (
            <div className="flex items-center justify-center gap-6 mt-4 text-[0.65rem] tracking-widest uppercase text-muted-foreground">
              <span>Vetted Works</span>
              <span className="text-primary/40">◆</span>
              <span>Certificate of Authenticity</span>
              <span className="text-primary/40">◆</span>
              <span>White Glove Delivery</span>
            </div>
          )}

          {/* Shop / Luxe tab switcher */}
          <div className="inline-flex items-center border border-border rounded-full p-1 mt-8 bg-card shadow-sm">
            <button
              onClick={() => setMode("shop")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-[0.7rem] font-bold tracking-[2.5px] uppercase transition-all duration-300 ${
                !isLuxe
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShoppingBag size={12} />
              Shop
            </button>
            <button
              onClick={() => setMode("luxe")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-[0.7rem] font-bold tracking-[2.5px] uppercase transition-all duration-300 ${
                isLuxe
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Crown size={12} />
              Luxe
            </button>
          </div>
        </div>
      </div>

      <section className="pb-20">
        <div className="container mx-auto px-6">
          {/* Filters */}
          <div className="bg-card rounded-[var(--radius)] p-6 shadow-md border border-primary/[0.08] mb-10">
            <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground/50 mb-4">Filter & Search</div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <input type="text" placeholder="Title or creator…" value={search} onChange={(e) => setSearch(e.target.value)} className={inputClass} />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                <option value="">All Categories</option>
                <option value="painting">Painting</option>
                <option value="photography">Photography</option>
                <option value="digital">Digital Art</option>
                <option value="sculpture">Sculpture</option>
                <option value="textile">Textile Art</option>
                <option value="printmaking">Printmaking</option>
                <option value="jewelry">Jewelry</option>
                <option value="decor">Home Décor</option>
              </select>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                <option value="all">All Auctions</option>
                <option value="ending-soon">Ending Soon 🔥</option>
                <option value="new">New Listings</option>
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputClass}>
                <option value="newest">Newest First</option>
                <option value="highest">Highest Bid</option>
                <option value="lowest">Lowest Bid</option>
              </select>
              <button onClick={() => { setSearch(""); setCategory(""); setStatus("all"); setSort("newest"); }} className="text-sm font-semibold text-primary hover:underline">
                Clear All
              </button>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🎨</div>
              <h4 className="font-display text-foreground text-xl mb-2">No auctions match your filters</h4>
              <p className="text-muted-foreground">Try adjusting your search or clearing some filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((a) => (
                <Link
                  key={a.id}
                  to={`/auction/${a.id}`}
                  className={`card-artevia block no-underline group ${isLuxe ? "card-luxe" : ""}`}
                >
                  <div className={`relative overflow-hidden ${isLuxe ? "h-60" : "h-52"}`}>
                    <img
                      src={a.img}
                      alt={a.title}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Luxe image overlay */}
                    {isLuxe && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-400" />
                    )}
                    {/* LUXE badge */}
                    {isLuxe && (
                      <span className="luxe-badge absolute top-3 right-3">LUXE</span>
                    )}
                    {a.badge && (
                      <span className={`absolute top-3 left-3 ${a.badgeColor || "bg-primary"} text-primary-foreground text-[0.7rem] font-bold tracking-wider uppercase px-2.5 py-1 ${isLuxe ? "" : "rounded-full"}`}>
                        {a.badge}
                      </span>
                    )}
                  </div>

                  {/* Luxe gold accent line */}
                  {isLuxe && (
                    <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  )}

                  <div className={isLuxe ? "p-5 pt-4" : "p-5"}>
                    <h5 className={`font-display text-foreground text-base mb-1 ${isLuxe ? "tracking-wide leading-snug" : ""}`}>
                      {a.title}
                    </h5>
                    <div className={`text-xs text-muted-foreground mb-2 ${isLuxe ? "tracking-wide" : ""}`}>
                      by <strong>{a.creator}</strong>
                    </div>
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} className={s <= Math.round(a.avgRating) ? "fill-star text-star" : "text-muted-foreground/30"} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{a.avgRating.toFixed(1)} ({a.reviews.length})</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className={`text-[0.7rem] text-muted-foreground/60 ${isLuxe ? "tracking-widest uppercase" : ""}`}>
                          {isLuxe ? "Opening Bid" : "Current Bid"}
                        </div>
                        <div className={`font-display font-bold text-primary ${isLuxe ? "text-xl tracking-wide" : "text-lg"}`}>
                          {a.bidLabel}
                        </div>
                      </div>
                      <span className={`bg-primary text-primary-foreground text-xs font-bold px-3.5 py-1.5 ${isLuxe ? "tracking-widest uppercase" : "rounded-full"}`}>
                        {isLuxe ? "Enquire" : "View & Bid"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">⏱ {a.time}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Auctions;
