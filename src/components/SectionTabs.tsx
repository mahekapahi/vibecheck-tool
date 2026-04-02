import { useState } from "react";
import { Link } from "react-router-dom";
import { normalAuctions, luxeAuctions, AuctionItem } from "@/data/auctions";
import { ArrowRight, Sparkles, ShoppingBag } from "lucide-react";

const SectionTabs = () => {
  const [tab, setTab] = useState<"normal" | "luxe">("normal");
  const items = tab === "normal" ? normalAuctions : luxeAuctions;
  const featured = items.slice(0, 4);
  const grid = items.slice(0, 25);

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6">
        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-2 mb-14">
          <button
            onClick={() => setTab("normal")}
            className={`flex items-center gap-2 px-8 py-3 text-sm font-semibold tracking-widest uppercase transition-all duration-300 border ${
              tab === "normal"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-foreground border-border hover:border-foreground"
            }`}
          >
            <ShoppingBag size={16} />
            Shop
          </button>
          <button
            onClick={() => setTab("luxe")}
            className={`flex items-center gap-2 px-8 py-3 text-sm font-semibold tracking-widest uppercase transition-all duration-300 border ${
              tab === "luxe"
                ? "luxe-tab-active"
                : "bg-transparent text-foreground border-border hover:border-foreground"
            }`}
          >
            <Sparkles size={16} />
            Luxe
          </button>
        </div>

        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            {tab === "luxe" && (
              <div className="inline-block mb-3 px-3 py-1 text-[0.65rem] font-bold tracking-[4px] uppercase luxe-badge">
                Premium Collection
              </div>
            )}
            <h2 className={`section-title mb-1 ${tab === "luxe" ? "luxe-heading" : ""}`}>
              {tab === "normal" ? "Curated Finds" : "The Luxe Edit"}
            </h2>
            <p className="text-muted-foreground text-sm max-w-md">
              {tab === "normal"
                ? "Discover original works under ₹50,000 — perfect for new collectors."
                : "Investment-grade pieces above ₹50,000 from acclaimed artists."}
            </p>
          </div>
          <Link
            to="/auctions"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium tracking-wider uppercase text-foreground hover:text-primary transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Featured Row */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14 ${tab === "luxe" ? "luxe-grid" : ""}`}>
          {featured.map((item) => (
            <ProductCard key={item.id} item={item} isLuxe={tab === "luxe"} size="featured" />
          ))}
        </div>

        {/* Full Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10 ${tab === "luxe" ? "luxe-grid" : ""}`}>
          {grid.slice(4).map((item) => (
            <ProductCard key={item.id} item={item} isLuxe={tab === "luxe"} size="grid" />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({
  item,
  isLuxe,
  size,
}: {
  item: AuctionItem;
  isLuxe: boolean;
  size: "featured" | "grid";
}) => {
  const isFeatured = size === "featured";

  return (
    <Link
      to={"/auction/" + item.id}
      className={`block group relative ${isLuxe ? "luxe-card" : ""}`}
    >
      <div className={`overflow-hidden ${isFeatured ? "mb-4" : "mb-3"} relative`}>
        <img
          src={item.img}
          alt={item.title}
          className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            isFeatured ? "aspect-[3/4]" : "aspect-[3/4]"
          }`}
          loading="lazy"
        />
        {isLuxe && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
        {item.badge && (
          <span
            className={`absolute top-3 left-3 px-2 py-1 text-[0.6rem] font-bold tracking-wider uppercase ${
              isLuxe
                ? "bg-secondary text-secondary-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {item.badge}
          </span>
        )}
      </div>
      <div className="text-[0.65rem] text-muted-foreground tracking-wider uppercase mb-1">
        {item.category}
      </div>
      <h3
        className={`font-display mb-1 group-hover:text-primary transition-colors ${
          isFeatured ? "text-base" : "text-sm"
        } ${isLuxe ? "luxe-title" : "text-foreground"}`}
      >
        {item.title}
      </h3>
      <div className={`text-sm font-medium ${isLuxe ? "luxe-price" : "text-foreground"}`}>
        {item.bidLabel}
      </div>
      {isLuxe && (
        <div className="text-[0.6rem] text-muted-foreground mt-1 tracking-wide">
          by {item.creator}
        </div>
      )}
    </Link>
  );
};

export default SectionTabs;
