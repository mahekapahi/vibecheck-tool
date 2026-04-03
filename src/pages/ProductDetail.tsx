import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Truck, Shield, RotateCcw, Star, Send, MessageCircle, Gavel } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allAuctions } from "@/data/auctions";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Bid {
  id: string;
  amount: number;
  created_at: string;
  profiles?: { full_name: string } | null;
}

interface Comment {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
  profiles?: { full_name: string } | null;
}

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const auction = allAuctions.find((a) => a.id === Number(id));
  const [activeTab, setActiveTab] = useState<"bid" | "comments">("bid");
  const [bidAmount, setBidAmount] = useState("");
  const [commentText, setCommentText] = useState("");

  // Fetch bids
  const { data: bids = [] } = useQuery({
    queryKey: ["bids", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bids")
        .select("*")
        .eq("auction_id", Number(id))
        .order("amount", { ascending: false });
      if (error) throw error;
      const userIds = [...new Set((data || []).map((b) => b.user_id))];
      if (userIds.length === 0) return [];
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
      const pMap = new Map((profiles || []).map((p) => [p.user_id, p]));
      return (data || []).map((b) => ({ ...b, profiles: pMap.get(b.user_id) })) as Bid[];
    },
    enabled: !!id,
  });

  // Fetch comments
  const { data: comments = [] } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("auction_id", Number(id))
        .order("created_at", { ascending: false });
      if (error) throw error;
      const userIds = [...new Set((data || []).map((c) => c.user_id))];
      if (userIds.length === 0) return [];
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
      const pMap = new Map((profiles || []).map((p) => [p.user_id, p]));
      return (data || []).map((c) => ({ ...c, profiles: pMap.get(c.user_id) })) as Comment[];
    },
    enabled: !!id,
  });

  const bidMutation = useMutation({
    mutationFn: async (amount: number) => {
      const { error } = await supabase.from("bids").insert({ auction_id: Number(id), user_id: user!.id, amount });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bids", id] });
      setBidAmount("");
      toast.success("Bid placed successfully! 🎉");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const commentMutation = useMutation({
    mutationFn: async (text: string) => {
      const { error } = await supabase.from("comments").insert({ auction_id: Number(id), user_id: user!.id, text });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setCommentText("");
      toast.success("Comment added!");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!auction) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Auction Not Found</h1>
          <Link to="/auctions" className="btn-accent">Back to Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const highestBid = bids.length > 0 ? bids[0] : null;
  const related = allAuctions.filter((a) => a.id !== auction.id).slice(0, 4);
  const inputClass = "w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-4 py-3 bg-background/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition font-body text-sm";

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(bidAmount);
    if (!amount || amount <= 0) { toast.error("Enter a valid bid amount"); return; }
    if (highestBid && amount <= highestBid.amount) { toast.error(`Bid must be higher than ₹${highestBid.amount.toLocaleString("en-IN")}`); return; }
    bidMutation.mutate(amount);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) { toast.error("Please write a comment"); return; }
    commentMutation.mutate(commentText.trim());
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <Link to="/auctions" className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Image */}
          <div className="overflow-hidden rounded-lg">
            <img src={auction.img} alt={auction.title} className="w-full aspect-[4/5] object-cover" />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <div className="text-xs text-muted-foreground tracking-wider uppercase mb-3">{auction.category}</div>
            <h1 className="font-display text-foreground text-3xl lg:text-4xl font-normal mb-4">{auction.title}</h1>

            <div className="flex items-center gap-3 mb-6">
              <img src={auction.creatorAvatar} alt={auction.creator} className="w-8 h-8 rounded-full object-cover" />
              <span className="text-sm text-muted-foreground">by {auction.creator}</span>
            </div>

            {/* Highest Bid Display */}
            <div className="bg-primary/10 rounded-xl p-5 mb-6 border border-primary/20">
              <div className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Highest Bid</div>
              <div className="font-display text-3xl text-primary font-bold">
                {highestBid ? `₹${highestBid.amount.toLocaleString("en-IN")}` : auction.bidLabel}
              </div>
              {highestBid && (
                <div className="text-xs text-muted-foreground mt-1">
                  by {highestBid.profiles?.full_name || "Anonymous"} · {bids.length} total bid{bids.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground mb-6">⏱ {auction.time}</div>
            <p className="text-muted-foreground leading-relaxed mb-6">{auction.description}</p>

            <div className="space-y-4 border-t border-border pt-6">
              {[
                { icon: Truck, text: "Free shipping on orders above ₹50,000" },
                { icon: Shield, text: "Certificate of authenticity included" },
                { icon: RotateCcw, text: "14-day return policy" },
              ].map((perk) => (
                <div key={perk.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <perk.icon size={16} className="text-primary shrink-0" />
                  {perk.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Bid / Comments */}
        <div className="mb-20">
          <div className="flex border-b border-border mb-6">
            <button
              onClick={() => setActiveTab("bid")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold tracking-wider uppercase transition-colors border-b-2 ${
                activeTab === "bid" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Gavel size={16} /> Place Bid
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold tracking-wider uppercase transition-colors border-b-2 ${
                activeTab === "comments" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageCircle size={16} /> Comments ({comments.length})
            </button>
          </div>

          {activeTab === "bid" && (
            <div className="max-w-xl">
              {!user ? (
                <div className="bg-card rounded-2xl p-8 border border-primary/[0.08] text-center">
                  <p className="text-muted-foreground mb-4">Please sign in to place a bid</p>
                  <Link to="/login" className="btn-accent">Sign In</Link>
                </div>
              ) : (
                <div className="bg-card rounded-2xl p-8 border border-primary/[0.08]">
                  <h3 className="font-display text-lg text-foreground mb-4">Enter Your Bid</h3>
                  <form onSubmit={handleBid} className="flex gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={highestBid ? `Min ₹${(highestBid.amount + 1).toLocaleString("en-IN")}` : "Enter amount"}
                        className={`${inputClass} pl-8`}
                        min={1}
                      />
                    </div>
                    <button type="submit" disabled={bidMutation.isPending} className="btn-accent px-6 flex items-center gap-2 disabled:opacity-60">
                      <Gavel size={16} /> {bidMutation.isPending ? "Placing…" : "Bid"}
                    </button>
                  </form>

                  {/* Recent Bids */}
                  {bids.length > 0 && (
                    <div className="mt-6 border-t border-border pt-4">
                      <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3">Recent Bids</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {bids.slice(0, 10).map((b) => (
                          <div key={b.id} className="flex items-center justify-between text-sm py-2 border-b border-border/50 last:border-0">
                            <span className="text-foreground">{b.profiles?.full_name || "Anonymous"}</span>
                            <span className="font-bold text-primary">₹{b.amount.toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "comments" && (
            <div className="max-w-2xl">
              {user && (
                <form onSubmit={handleComment} className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment…"
                    className={`${inputClass} flex-1`}
                    maxLength={500}
                  />
                  <button type="submit" disabled={commentMutation.isPending} className="btn-accent px-5 flex items-center gap-2 disabled:opacity-60">
                    <Send size={16} /> {commentMutation.isPending ? "…" : "Post"}
                  </button>
                </form>
              )}
              {!user && (
                <div className="bg-card rounded-2xl p-6 border border-primary/[0.08] text-center mb-6">
                  <p className="text-muted-foreground mb-3">Sign in to comment</p>
                  <Link to="/login" className="btn-accent text-sm">Sign In</Link>
                </div>
              )}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No comments yet. Be the first!</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="bg-card rounded-xl p-5 border border-primary/[0.08]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-foreground">{c.profiles?.full_name || "Anonymous"}</span>
                        <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related */}
        <div className="mb-16">
          <h2 className="section-title mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {related.map((item) => (
              <Link key={item.id} to={"/auction/" + item.id} className="block group">
                <div className="overflow-hidden mb-3">
                  <img src={item.img} alt={item.title} className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="text-xs text-muted-foreground tracking-wider uppercase mb-1">{item.creator}</div>
                <h3 className="font-display text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                <div className="text-sm text-foreground font-medium">{item.bidLabel}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
