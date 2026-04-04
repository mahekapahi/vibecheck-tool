import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { allAuctions } from "@/data/auctions";
import { TrendingUp, Package, Users, Eye, Crown } from "lucide-react";

// Simulate creator's products — items whose creator name matches
const CreatorDashboard = () => {
  const { profile } = useAuth();
  const creatorName = profile?.full_name || "Maya Chen";

  // Get creator's products (match by creator name, fallback to first 4)
  let myProducts = allAuctions.filter(
    (a) => a.creator.toLowerCase() === creatorName.toLowerCase()
  );
  if (myProducts.length === 0) myProducts = allAuctions.slice(0, 4);

  // Simulated bid data per product
  const bidData = myProducts.map((p, i) => ({
    ...p,
    totalBids: 8 + ((i * 7 + 3) % 20),
    highestBid: p.bid + Math.floor(p.bid * 0.15 * ((i % 3) + 1)),
    highestBidder: ["Rohit Verma", "Sneha Patel", "Arjun Nair", "Diya Kapoor"][i % 4],
    bidderAvatar: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80",
    ][i % 4],
    views: 120 + ((i * 43) % 500),
    recentBids: [
      { name: "Rohit V.", amount: p.bid + Math.floor(p.bid * 0.1), time: "2h ago" },
      { name: "Sneha P.", amount: p.bid + Math.floor(p.bid * 0.05), time: "5h ago" },
      { name: "Arjun N.", amount: p.bid, time: "1d ago" },
    ],
  }));

  const totalBids = bidData.reduce((s, p) => s + p.totalBids, 0);
  const totalValue = bidData.reduce((s, p) => s + p.highestBid, 0);
  const totalViews = bidData.reduce((s, p) => s + p.views, 0);

  const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <Navbar />

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="hero-eyebrow mb-2">Creator Dashboard</div>
          <h1 className="font-display text-foreground text-3xl lg:text-4xl mb-2">My Products</h1>
          <p className="text-muted-foreground">Track your listings, bids, and earnings in real time.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Package, label: "Listed Products", value: myProducts.length.toString(), color: "text-primary" },
            { icon: TrendingUp, label: "Total Bids", value: totalBids.toString(), color: "text-primary" },
            { icon: Crown, label: "Total Value", value: formatINR(totalValue), color: "text-primary" },
            { icon: Eye, label: "Total Views", value: totalViews.toLocaleString(), color: "text-primary" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl p-6 border border-primary/[0.08] shadow-sm">
              <stat.icon size={20} className={`${stat.color} mb-3`} />
              <div className="text-2xl font-display font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground tracking-wider uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Products List */}
        <div className="space-y-6">
          {bidData.map((product) => (
            <div key={product.id} className="bg-card rounded-2xl border border-primary/[0.08] shadow-sm overflow-hidden">
              <div className="grid lg:grid-cols-[240px_1fr_300px] gap-0">
                {/* Image */}
                <Link to={`/auction/${product.id}`} className="block">
                  <img src={product.img} alt={product.title} className="w-full h-48 lg:h-full object-cover" />
                </Link>

                {/* Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs text-muted-foreground tracking-wider uppercase">{product.category}</span>
                      <h3 className="font-display text-foreground text-xl mt-1">
                        <Link to={`/auction/${product.id}`} className="hover:text-primary transition-colors">{product.title}</Link>
                      </h3>
                    </div>
                    {product.badge && (
                      <span className={`${product.badgeColor || "bg-primary"} text-primary-foreground text-[0.65rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shrink-0`}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <div className="text-[0.65rem] text-muted-foreground tracking-wider uppercase">Starting Price</div>
                      <div className="font-display text-foreground font-bold mt-0.5">{product.bidLabel}</div>
                    </div>
                    <div>
                      <div className="text-[0.65rem] text-muted-foreground tracking-wider uppercase">Total Bids</div>
                      <div className="font-display text-foreground font-bold mt-0.5 flex items-center gap-1.5">
                        <Users size={14} className="text-primary" /> {product.totalBids}
                      </div>
                    </div>
                    <div>
                      <div className="text-[0.65rem] text-muted-foreground tracking-wider uppercase">Views</div>
                      <div className="font-display text-foreground font-bold mt-0.5 flex items-center gap-1.5">
                        <Eye size={14} className="text-muted-foreground" /> {product.views}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mt-3">⏱ {product.time}</div>
                </div>

                {/* Highest Bid Panel */}
                <div className="bg-primary/[0.05] p-6 border-t lg:border-t-0 lg:border-l border-primary/10">
                  <div className="text-[0.65rem] text-muted-foreground tracking-wider uppercase mb-2">Highest Bid</div>
                  <div className="font-display text-2xl font-bold text-primary">{formatINR(product.highestBid)}</div>
                  <div className="flex items-center gap-2 mt-3">
                    <img src={product.bidderAvatar} alt={product.highestBidder} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <div className="text-sm font-semibold text-foreground">{product.highestBidder}</div>
                      <div className="text-[0.6rem] text-muted-foreground">Top Bidder</div>
                    </div>
                  </div>

                  {/* Recent bids */}
                  <div className="mt-4 pt-3 border-t border-primary/10 space-y-2">
                    <div className="text-[0.6rem] text-muted-foreground tracking-widest uppercase font-bold">Recent Bids</div>
                    {product.recentBids.map((bid, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-foreground">{bid.name}</span>
                        <span className="text-muted-foreground">{bid.time}</span>
                        <span className="font-bold text-primary">{formatINR(bid.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreatorDashboard;
