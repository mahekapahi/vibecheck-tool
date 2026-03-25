import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ArrowLeft, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allAuctions } from "@/data/auctions";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface DbReview {
  id: string;
  rating: number;
  text: string;
  created_at: string;
  user_id: string;
  profiles?: { full_name: string; avatar_url: string | null } | null;
}

const Stars = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={size} className={s <= rating ? "fill-star text-star" : "text-muted-foreground/30"} />
    ))}
  </div>
);

const ClickableStars = ({ rating, onRate }: { rating: number; onRate: (r: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button key={s} onClick={() => onRate(s)} className="transition-transform hover:scale-110">
        <Star size={24} className={s <= rating ? "fill-star text-star" : "text-muted-foreground/30 hover:text-star/50"} />
      </button>
    ))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const auction = allAuctions.find((a) => a.id === Number(id));
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState("");

  // Fetch reviews from DB, fallback to hardcoded
  const { data: dbReviews } = useQuery({
    queryKey: ["product-reviews", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles!reviews_user_id_fkey(full_name, avatar_url)")
        .eq("auction_id", Number(id))
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbReview[];
    },
    enabled: !!id,
  });

  const submitMutation = useMutation({
    mutationFn: async ({ rating, text }: { rating: number; text: string }) => {
      const { error } = await supabase.from("reviews").insert({
        auction_id: Number(id),
        user_id: user!.id,
        rating,
        text,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", id] });
      setNewRating(0);
      setNewText("");
      toast.success("Review submitted!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (!auction) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Auction Not Found</h1>
          <Link to="/auctions" className="btn-accent">Back to Auctions</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Merge hardcoded + DB reviews
  const hardcodedReviews = auction.reviews.map((r) => ({
    id: String(r.id),
    rating: r.rating,
    text: r.text,
    created_at: r.date,
    user_id: "",
    profiles: { full_name: r.name, avatar_url: r.avatar },
  }));
  const allReviews = [...(dbReviews || []), ...hardcodedReviews];

  const avgRating = allReviews.length > 0
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : "0";

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: allReviews.filter((r) => r.rating === star).length,
    pct: allReviews.length > 0 ? (allReviews.filter((r) => r.rating === star).length / allReviews.length) * 100 : 0,
  }));

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) { toast.error("Please select a rating"); return; }
    if (!newText.trim()) { toast.error("Please write a review"); return; }
    submitMutation.mutate({ rating: newRating, text: newText.trim() });
  };

  const inputClass = "w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-4 py-3 bg-background/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition font-body text-sm";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <Link to="/auctions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Auctions
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden mb-6 shadow-lg">
              <img src={auction.img} alt={auction.title} className="w-full h-[400px] object-cover" width={800} height={600} />
            </div>
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                {auction.badge && (
                  <span className={`${auction.badgeColor || "bg-primary"} text-primary-foreground text-[0.7rem] font-bold tracking-wider uppercase px-3 py-1 rounded-full inline-block mb-3`}>{auction.badge}</span>
                )}
                <h1 className="font-display text-foreground text-3xl mb-2">{auction.title}</h1>
                <div className="flex items-center gap-3 mb-3">
                  <img src={auction.creatorAvatar} alt={auction.creator} className="w-8 h-8 rounded-full object-cover border-2 border-primary/25" />
                  <span className="text-sm text-muted-foreground">by <strong className="text-foreground">{auction.creator}</strong> · {auction.category}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Stars rating={Math.round(Number(avgRating))} />
                  <span className="text-sm font-semibold text-foreground">{avgRating}</span>
                  <span className="text-xs text-muted-foreground">({allReviews.length} reviews)</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground/60">Current Bid</div>
                <div className="font-display text-3xl font-bold text-primary">{auction.bidLabel}</div>
                <div className="text-xs text-muted-foreground mt-1">⏱ {auction.time}</div>
                <Link to="/login" className="btn-accent mt-3 text-sm px-6 py-2">Bid Now</Link>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">{auction.description}</p>
          </div>

          <div>
            <div className="bg-card rounded-[var(--radius)] p-6 shadow-md border border-primary/[0.08] sticky top-24">
              <h3 className="font-display text-lg text-foreground mb-4">Ratings & Reviews</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <div className="font-display text-4xl font-black text-primary">{avgRating}</div>
                  <Stars rating={Math.round(Number(avgRating))} size={14} />
                  <div className="text-xs text-muted-foreground mt-1">{allReviews.length} reviews</div>
                </div>
                <div className="flex-1 space-y-1.5">
                  {ratingCounts.map((r) => (
                    <div key={r.star} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-3">{r.star}</span>
                      <Star size={10} className="fill-star text-star" />
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-star rounded-full transition-all" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-4">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <hr className="border-primary/10 mb-5" />
              <div className="space-y-3 mb-5">
                {[["Quality", "Excellent"], ["Authenticity", "✓ Verified"], ["Packaging", "Premium"], ["Value", "Fair Market"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{k}</span>
                    <span className={`font-semibold ${k === "Authenticity" ? "text-primary" : "text-foreground"}`}>{v}</span>
                  </div>
                ))}
              </div>
              <hr className="border-primary/10 mb-5" />
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-2">Trusted by collectors worldwide</div>
                <div className="flex justify-center gap-1">{"🛡️✅⭐".split("").filter(c => c.trim()).map((e, i) => <span key={i} className="text-lg">{e}</span>)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl text-foreground mb-6">Product Reviews ({allReviews.length})</h2>
            <div className="space-y-4">
              {allReviews.map((review) => (
                <div key={review.id} className="bg-card rounded-[var(--radius)] p-5 border border-primary/[0.08] shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    {review.profiles?.avatar_url && (
                      <img src={review.profiles.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-foreground">{review.profiles?.full_name || "Anonymous"}</div>
                      <div className="text-xs text-muted-foreground">{review.user_id ? new Date(review.created_at).toLocaleDateString() : review.created_at}</div>
                    </div>
                    <Stars rating={review.rating} size={14} />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-card rounded-[var(--radius)] p-6 shadow-md border border-primary/[0.08] sticky top-24">
              <h3 className="font-display text-lg text-foreground mb-1">Write a Review</h3>
              <p className="text-xs text-muted-foreground mb-5">Share your experience with this artwork</p>
              {!user ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">Sign in to leave a review</p>
                  <Link to="/login" className="btn-accent text-sm px-6 py-2">Sign In</Link>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Your Rating</label>
                    <ClickableStars rating={newRating} onRate={setNewRating} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Your Review</label>
                    <textarea value={newText} onChange={(e) => setNewText(e.target.value)} rows={4} placeholder="Tell us about this artwork…" className={`${inputClass} resize-none`} maxLength={500} />
                  </div>
                  <button type="submit" disabled={submitMutation.isPending} className="btn-accent w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                    <Send size={16} /> {submitMutation.isPending ? "Submitting…" : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
