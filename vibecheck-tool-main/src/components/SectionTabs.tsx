import { Link } from "react-router-dom";
import { normalAuctions, luxeAuctions, AuctionItem } from "@/data/auctions";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ArrowRight } from "lucide-react";

const SectionTabs = () => {
  const { isLuxe } = useThemeMode();
  const items = isLuxe ? luxeAuctions : normalAuctions;
  const featured = items.slice(0, 4);
  const grid = items.slice(4, 25);

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            {isLuxe && (
              <div className="inline-block mb-3 px-3 py-1 text-[0.65rem] font-bold tracking-[4px] uppercase bg-primary/20 text-primary border border-primary/30">
                Premium Collection
              </div>
            )}
            <h2 className="section-title mb-1">
              {isLuxe ? "The Luxe Edit" : "Curated Finds"}
            </h2>
            <p className="text-muted-foreground text-sm max-w-md">
              {isLuxe
                ? "Investment-grade pieces above ₹50,000 from acclaimed artists."
                : "Discover original works under ₹50,000 — perfect for new collectors."}
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {featured.map((item) => (
            <ProductCard key={item.id} item={item} isLuxe={isLuxe} size="featured" />
          ))}
        </div>

        {/* Full Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
          {grid.map((item) => (
            <ProductCard key={item.id} item={item} isLuxe={isLuxe} size="grid" />
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
      className="block group relative"
    >
      <div className={`overflow-hidden ${isFeatured ? "mb-4" : "mb-3"} relative`}>
        <img
          src={item.img}
          alt={item.title}
          className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {isLuxe && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
        {item.badge && (
          <span className="absolute top-3 left-3 px-2 py-1 text-[0.6rem] font-bold tracking-wider uppercase bg-primary text-primary-foreground">
            {item.badge}
          </span>
        )}
      </div>
      <div className="text-[0.65rem] text-muted-foreground tracking-wider uppercase mb-1">
        {item.category}
      </div>
      <h3 className={`font-display text-foreground mb-1 group-hover:text-primary transition-colors ${isFeatured ? "text-base" : "text-sm"}`}>
        {item.title}
      </h3>
      <div className={`text-sm font-medium ${isLuxe ? "text-primary font-bold" : "text-foreground"}`}>
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
