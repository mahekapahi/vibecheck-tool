import { Link } from "react-router-dom";
import { Package, TrendingUp, Users, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface CreatorAuction {
  id: number;
  title: string;
  category: string;
  starting_price: number;
  current_bid: number | null;
  bid_label: string | null;
  image_url: string | null;
  badge: string | null;
  status: string | null;
  bid_count: number;
  highest_bid: number;
}

const CreatorDashboard = () => {
  const { user, profile, loading } = useAuth();

  const { data: auctions = [], isLoading } = useQuery({
    queryKey: ["creator-auctions", user?.id],
    queryFn: async () => {
      // Get creator's auctions
      const { data: auctionData, error } = await supabase
        .from("auctions")
        .select("*")
        .eq("creator_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Get bids for each auction
      const auctionIds = (auctionData || []).map((a) => a.id);
      if (auctionIds.length === 0) return [];

      const { data: bidsData } = await supabase
        .from("bids")
        .select("auction_id, amount")
        .in("auction_id", auctionIds);

      const bidsByAuction = new Map<number, { count: number; highest: number }>();
      (bidsData || []).forEach((b) => {
        const curr = bidsByAuction.get(b.auction_id) || { count: 0, highest: 0 };
        curr.count++;
        curr.highest = Math.max(curr.highest, Number(b.amount));
        bidsByAuction.set(b.auction_id, curr);
      });

      return (auctionData || []).map((a) => {
        const stats = bidsByAuction.get(a.id) || { count: 0, highest: 0 };
        return {
          ...a,
          bid_count: stats.count,
          highest_bid: stats.highest || Number(a.current_bid) || Number(a.starting_price),
        } as CreatorAuction;
      });
    },
    enabled: !!user,
  });

  if (loading) return <div className="min-h-screen"><Navbar /><div className="flex items-center justify-center py-32 text-muted-foreground">Loading…</div></div>;

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Sign in to view your dashboard</h1>
          <Link to="/login" className="btn-accent">Sign In</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const totalBids = auctions.reduce((s, a) => s + a.bid_count, 0);
  const totalValue = auctions.reduce((s, a) => s + a.highest_bid, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="py-12 text-center">
        <div className="container mx-auto px-6">
          <div className="hero-eyebrow mb-3">Creator Dashboard</div>
          <h1 className="font-display text-foreground mb-2" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
            Welcome, {profile?.full_name || "Creator"}
          </h1>
          <p className="text-muted-foreground">Manage your listings and track bids</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-6 mb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Package, label: "Listed Products", value: auctions.length, color: "text-primary" },
            { icon: Users, label: "Total Bids", value: totalBids, color: "text-primary" },
            { icon: TrendingUp, label: "Total Value", value: `₹${totalValue.toLocaleString("en-IN")}`, color: "text-primary" },
            { icon: Eye, label: "Active", value: auctions.filter((a) => a.status !== "ended").length, color: "text-primary" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl p-6 border border-primary/[0.08] text-center">
              <s.icon size={24} className={`${s.color} mx-auto mb-2`} />
              <div className="font-display text-2xl font-bold text-foreground mb-1">{s.value}</div>
              <div className="text-xs text-muted-foreground tracking-wider uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="container mx-auto px-6 pb-20">
        <h2 className="section-title mb-6">Your Listings</h2>
        {isLoading ? (
          <p className="text-center text-muted-foreground py-12">Loading your products…</p>
        ) : auctions.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-primary/[0.08]">
            <Package size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-display text-xl text-foreground mb-2">No listings yet</h3>
            <p className="text-muted-foreground">Your auction listings will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {auctions.map((a) => (
              <div key={a.id} className="bg-card rounded-2xl border border-primary/[0.08] p-5 flex flex-col md:flex-row gap-5 items-start md:items-center transition-all hover:shadow-md">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={a.image_url || "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&q=60"}
                    alt={a.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-foreground text-base truncate">{a.title}</h3>
                    {a.badge && (
                      <span className="text-[0.6rem] font-bold tracking-wider uppercase bg-primary/20 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">
                        {a.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{a.category}</div>
                </div>
                <div className="flex gap-6 md:gap-10 items-center">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Highest Bid</div>
                    <div className="font-display text-lg font-bold text-primary">
                      ₹{a.highest_bid.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Total Bids</div>
                    <div className="font-display text-lg font-bold text-foreground">{a.bid_count}</div>
                  </div>
                  <div className={`text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full ${
                    a.status === "ended" ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary"
                  }`}>
                    {a.status === "ended" ? "Ended" : "Live"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CreatorDashboard;
