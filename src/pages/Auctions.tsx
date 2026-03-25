import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const allAuctions = [
  { id: 8, img: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80", title: "Abstract Canvas No. 7", creator: "Maya Chen", category: "painting", bid: 200000, bidLabel: "₹2,00,000", time: "Ends 11:42 PM IST", badge: "🔥 Ending Soon", status: "ending-soon" },
  { id: 7, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", title: "Urban Geometry — Series II", creator: "Liam Torres", category: "photography", bid: 46500, bidLabel: "₹46,500", time: "Ends Sun 3:30 AM IST", badge: "New", status: "new" },
  { id: 6, img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", title: "Ceramic Form III", creator: "Suki Amore", category: "sculpture", bid: 145000, bidLabel: "₹1,45,000", time: "Ends 2:10 AM IST", badge: "Exclusive", badgeColor: "bg-secondary", status: "ending-soon" },
  { id: 5, img: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80", title: "Solitude — Fine Art Print", creator: "Nadia Osei", category: "photography", bid: 74000, bidLabel: "₹74,000", time: "Ends Sat 11:00 PM IST", badge: "", status: "new" },
  { id: 4, img: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80", title: "Neon Garden — Digital", creator: "Remy Blaze", category: "digital", bid: 265000, bidLabel: "₹2,65,000", time: "Ends Sat 6:30 AM IST", badge: "🔥 Hot", status: "ending-soon" },
  { id: 3, img: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=600&q=80", title: "Woven Memory Piece", creator: "Suki Amore", category: "textile", bid: 35000, bidLabel: "₹35,000", time: "Ends 4 days", badge: "", status: "new" },
  { id: 2, img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80", title: "Coastal Reverie — Oil", creator: "Maya Chen", category: "painting", bid: 120000, bidLabel: "₹1,20,000", time: "Ends Tomorrow", badge: "New", status: "new" },
  { id: 1, img: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80", title: "Bronze Horizon Sculpture", creator: "Liam Torres", category: "sculpture", bid: 88000, bidLabel: "₹88,000", time: "Ends 3 days", badge: "", status: "new" },
];

const inputClass = "w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-3 py-2.5 bg-background/30 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition font-body text-sm";

const Auctions = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    let result = allAuctions.filter((a) => {
      const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.creator.toLowerCase().includes(search.toLowerCase());
      const matchCat = !category || a.category === category;
      const matchStatus = status === "all" || a.status === status;
      return matchSearch && matchCat && matchStatus;
    });
    if (sort === "highest") result.sort((a, b) => b.bid - a.bid);
    else if (sort === "lowest") result.sort((a, b) => a.bid - b.bid);
    else result.sort((a, b) => b.id - a.id);
    return result;
  }, [search, category, status, sort]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="py-16 text-center">
        <div className="container mx-auto px-6">
          <div className="hero-eyebrow mb-3.5">Live & Upcoming</div>
          <h1 className="font-display text-foreground mb-3" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>Browse Auctions</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Discover original works from verified creators around the world.</p>
        </div>
      </div>

      <section className="pb-20">
        <div className="container mx-auto px-6">
          {/* Filters */}
          <div className="bg-card rounded-[var(--radius)] p-6 shadow-md border border-primary/[0.08] mb-10">
            <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground/50 mb-4">Filter & Search Auctions</div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <input type="text" placeholder="Title or creator…" value={search} onChange={(e) => setSearch(e.target.value)} className={inputClass} />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                <option value="">All Categories</option>
                <option value="painting">Painting</option>
                <option value="photography">Photography</option>
                <option value="digital">Digital Art</option>
                <option value="sculpture">Sculpture</option>
                <option value="textile">Textile Art</option>
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
                <div key={a.id} className="card-artevia">
                  <div className="relative overflow-hidden h-52">
                    <img src={a.img} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    {a.badge && (
                      <span className={`absolute top-3 left-3 ${a.badgeColor || "bg-primary"} text-primary-foreground text-[0.7rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full`}>
                        {a.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h5 className="font-display text-foreground text-base mb-1">{a.title}</h5>
                    <div className="text-xs text-muted-foreground mb-3">by <strong>{a.creator}</strong></div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[0.7rem] text-muted-foreground/60">Current Bid</div>
                        <div className="font-display text-lg font-bold text-primary">{a.bidLabel}</div>
                      </div>
                      <Link to="/login" className="bg-primary text-primary-foreground text-xs font-bold px-3.5 py-1.5 rounded-full hover:bg-primary-dark transition-colors">
                        Bid Now
                      </Link>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">⏱ {a.time}</div>
                  </div>
                </div>
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
