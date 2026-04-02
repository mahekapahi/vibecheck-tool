import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { normalAuctions, luxeAuctions } from "@/data/auctions";
import { useThemeMode } from "@/hooks/useThemeMode";
import { Star } from "lucide-react";

const inputClass = "w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-3 py-2.5 bg-background/30 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition font-body text-sm";

const Auctions = () => {
  const { isLuxe } = useThemeMode();
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
          <div className="hero-eyebrow mb-3.5">{isLuxe ? "Premium Auctions" : "Live & Upcoming"}</div>
          <h1 className="font-display text-foreground mb-3" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
            {isLuxe ? "Luxe Collection" : "Browse Auctions"}
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {isLuxe
              ? "Investment-grade artworks above ₹50,000 from acclaimed creators."
              : "Discover original works from verified creators around the world."}
          </p>
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
                <Link key={a.id} to={`/auction/${a.id}`} className="card-artevia block no-underline">
                  <div className="relative overflow-hidden h-52">
                    <img src={a.img} alt={a.title} loading="lazy" width={800} height={600} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    {a.badge && (
                      <span className={`absolute top-3 left-3 ${a.badgeColor || "bg-primary"} text-primary-foreground text-[0.7rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full`}>
                        {a.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h5 className="font-display text-foreground text-base mb-1">{a.title}</h5>
                    <div className="text-xs text-muted-foreground mb-2">by <strong>{a.creator}</strong></div>
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} className={s <= Math.round(a.avgRating) ? "fill-star text-star" : "text-muted-foreground/30"} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{a.avgRating} ({a.reviews.length})</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[0.7rem] text-muted-foreground/60">Current Bid</div>
                        <div className="font-display text-lg font-bold text-primary">{a.bidLabel}</div>
                      </div>
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-3.5 py-1.5 rounded-full">
                        View & Bid
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
