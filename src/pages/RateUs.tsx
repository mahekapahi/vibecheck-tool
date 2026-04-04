import { useState, useRef, useEffect, useCallback } from "react";
import { Send, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface SiteReview {
  id: string;
  user_id: string;
  rating: number;
  text: string;
  created_at: string;
  profiles?: { full_name: string; avatar_url: string | null } | null;
}

// ─── 20 seed reviews ─────────────────────────────────────────────────────────
const SEED_REVIEWS: SiteReview[] = [
  { id: "s1",  user_id: "seed", rating: 9,  text: "Absolutely love the curation here. Every piece feels intentional and the bidding experience is so smooth.",         created_at: "2025-03-01T10:00:00Z", profiles: { full_name: "Priya Sharma",    avatar_url: null } },
  { id: "s2",  user_id: "seed", rating: 3,  text: "Found the mobile experience a bit clunky. Hard to compare multiple artworks side by side.",                        created_at: "2025-03-03T11:30:00Z", profiles: { full_name: "Rahul Menon",     avatar_url: null } },
  { id: "s3",  user_id: "seed", rating: 10, text: "Artevia is hands-down the best art marketplace I've used. The Luxe section is a game changer for serious collectors.", created_at: "2025-03-05T09:15:00Z", profiles: { full_name: "Ananya Iyer",     avatar_url: null } },
  { id: "s4",  user_id: "seed", rating: 7,  text: "Great selection and trustworthy creators. Would love more filtering options on the search page.",                    created_at: "2025-03-07T14:00:00Z", profiles: { full_name: "Kabir Nair",      avatar_url: null } },
  { id: "s5",  user_id: "seed", rating: 2,  text: "Payment flow is confusing. I wasn't sure if my bid was placed or not. Needs clearer confirmation screens.",          created_at: "2025-03-09T16:45:00Z", profiles: { full_name: "Sneha Patel",     avatar_url: null } },
  { id: "s6",  user_id: "seed", rating: 8,  text: "Love the aesthetic of the platform — feels premium without being intimidating. The product detail pages are gorgeous.", created_at: "2025-03-11T10:30:00Z", profiles: { full_name: "Arjun Verma",     avatar_url: null } },
  { id: "s7",  user_id: "seed", rating: 6,  text: "Decent experience overall. The auctions are exciting but I wish there was a watchlist feature.",                     created_at: "2025-03-13T13:00:00Z", profiles: { full_name: "Meera Krishnan",  avatar_url: null } },
  { id: "s8",  user_id: "seed", rating: 9,  text: "Bought my first original painting here and the whole process from bidding to delivery was flawless. Highly recommend.", created_at: "2025-03-15T08:00:00Z", profiles: { full_name: "Vikram Singh",    avatar_url: null } },
  { id: "s9",  user_id: "seed", rating: 4,  text: "Customer support took 3 days to get back to me. The platform itself is fine but responsiveness needs improvement.",    created_at: "2025-03-17T11:00:00Z", profiles: { full_name: "Divya Rao",       avatar_url: null } },
  { id: "s10", user_id: "seed", rating: 10, text: "I'm a creator here and the experience has been phenomenal. Real buyers, fair bidding, and great visibility for my work.", created_at: "2025-03-19T09:45:00Z", profiles: { full_name: "Rohan Desai",     avatar_url: null } },
  { id: "s11", user_id: "seed", rating: 7,  text: "Nice platform. The dark Luxe mode is beautiful. Wish there were more sculptures and 3D works listed.",                created_at: "2025-03-21T15:30:00Z", profiles: { full_name: "Tanvi Joshi",     avatar_url: null } },
  { id: "s12", user_id: "seed", rating: 3,  text: "Signup process has too many steps. I almost gave up before getting in. Simplify onboarding please.",                 created_at: "2025-03-23T10:00:00Z", profiles: { full_name: "Aditya Kumar",    avatar_url: null } },
  { id: "s13", user_id: "seed", rating: 8,  text: "The creator profiles are detailed and trustworthy. I always know exactly who made what I'm bidding on.",             created_at: "2025-03-25T12:30:00Z", profiles: { full_name: "Nisha Pillai",    avatar_url: null } },
  { id: "s14", user_id: "seed", rating: 9,  text: "Bid on three pieces and won two. The countdown timer makes it exciting without feeling manipulative. Love it.",       created_at: "2025-03-27T17:00:00Z", profiles: { full_name: "Siddharth Bose",  avatar_url: null } },
  { id: "s15", user_id: "seed", rating: 5,  text: "Average experience so far. Nothing broken but nothing that really wowed me either. Potential is clearly there though.", created_at: "2025-03-29T09:00:00Z", profiles: { full_name: "Pooja Ghosh",     avatar_url: null } },
  { id: "s16", user_id: "seed", rating: 10, text: "This is what art collecting should feel like in 2025 — digital-first, transparent pricing, and beautiful presentation.", created_at: "2025-03-31T14:00:00Z", profiles: { full_name: "Aakash Tiwari",   avatar_url: null } },
  { id: "s17", user_id: "seed", rating: 6,  text: "Good variety of art styles. Would be great to filter by medium — oil, watercolour, digital etc.",                     created_at: "2025-04-01T10:30:00Z", profiles: { full_name: "Lakshmi Subramanian", avatar_url: null } },
  { id: "s18", user_id: "seed", rating: 2,  text: "Shipping was delayed by two weeks and I had no tracking updates. The art itself was beautiful but the logistics let it down.", created_at: "2025-04-02T11:00:00Z", profiles: { full_name: "Gaurav Mehta",    avatar_url: null } },
  { id: "s19", user_id: "seed", rating: 8,  text: "Really enjoy the Rate Us section — it's clear this team actually listens to feedback. Keep building!",               created_at: "2025-04-03T13:45:00Z", profiles: { full_name: "Ishaan Chopra",   avatar_url: null } },
  { id: "s20", user_id: "seed", rating: 9,  text: "Gifted a piece to my partner and they were blown away. Artevia made it easy to find something truly unique.",         created_at: "2025-04-04T16:00:00Z", profiles: { full_name: "Ritu Aggarwal",   avatar_url: null } },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const starCount = (rating: number) => Math.round((rating / 10) * 5);

const StarDisplay = ({ rating, size = 14 }: { rating: number; size?: number }) => {
  const stars = starCount(rating);
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size} className={s <= stars ? "fill-star text-star" : "text-muted-foreground/25"} />
      ))}
    </div>
  );
};

// ─── Slider component ─────────────────────────────────────────────────────────

const RatingSlider = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  const pct = ((value - 1) / 9) * 100;
  const color = value === 0 ? "hsl(var(--muted))" : value <= 4 ? "hsl(var(--destructive))" : value <= 6 ? "hsl(38 90% 55%)" : "hsl(var(--primary))";

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-3 px-0.5">
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <span key={n} className={`transition-all duration-200 ${value === n ? "text-foreground font-bold scale-125" : ""}`}>{n}</span>
        ))}
      </div>
      <div className="relative">
        <input
          type="range" min={1} max={10} step={1} value={value || 1}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: value === 0
              ? "hsl(var(--muted))"
              : `linear-gradient(to right, ${color} ${pct}%, hsl(var(--muted)) ${pct}%)`,
          }}
        />
      </div>
      {value > 0 && (
        <div className="text-center mt-4">
          <span
            className="inline-block font-display text-5xl font-black transition-all duration-300"
            style={{ color }}
          >
            {value}
          </span>
          <span className="text-muted-foreground text-sm"> / 10</span>
          <div className="text-sm mt-1" style={{ color }}>
            {value <= 2 ? "😞 Very disappointed" :
             value <= 4 ? "😕 Not great" :
             value <= 6 ? "😐 It was okay" :
             value <= 8 ? "😊 Really enjoyed it" :
                          "🤩 Absolutely loved it!"}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Review slider ────────────────────────────────────────────────────────────

const ReviewSlider = ({ reviews }: { reviews: SiteReview[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll);
    return () => el?.removeEventListener("scroll", checkScroll);
  }, [checkScroll, reviews]);

  const scroll = (dir: number) => scrollRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  return (
    <div className="relative">
      {canScrollLeft && (
        <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-card shadow-lg border border-primary/10 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
          <ChevronLeft size={20} />
        </button>
      )}
      {canScrollRight && (
        <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-card shadow-lg border border-primary/10 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
          <ChevronRight size={20} />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-4 px-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {reviews.map((r) => (
          <div key={r.id} className="flex-shrink-0 w-[310px] snap-start bg-card rounded-[var(--radius)] p-6 border border-primary/[0.08] flex flex-col transition-all duration-300 hover:-translate-y-1" style={{ boxShadow: "0 8px 32px hsl(186 76% 21% / 0.1)" }}>
            <Quote size={24} className="text-primary/20 mb-3" />
            <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4 italic">"{r.text}"</p>
            <div className="border-t border-primary/10 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-foreground">{r.profiles?.full_name || "Anonymous"}</span>
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <StarDisplay rating={r.rating} size={13} />
                <span className="text-xs font-bold text-primary">{r.rating}/10</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const RateUs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [step, setStep] = useState<"rate" | "feedback">("rate");

  const { data: dbReviews = [] } = useQuery({
    queryKey: ["site-reviews"],
    queryFn: async () => {
      const { data: reviewsData, error } = await supabase
        .from("site_reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const userIds = [...new Set((reviewsData || []).map(r => r.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", userIds);
      const profileMap = new Map((profilesData || []).map(p => [p.user_id, p]));
      return (reviewsData || []).map(r => ({
        ...r,
        profiles: profileMap.get(r.user_id) || null,
      })) as SiteReview[];
    },
  });

  // Merge seed + real reviews (real reviews first)
  const reviews = [...dbReviews, ...SEED_REVIEWS];

  const submitMutation = useMutation({
    mutationFn: async ({ rating, text }: { rating: number; text: string }) => {
      const { error } = await supabase.from("site_reviews").insert({ user_id: user!.id, rating, text });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-reviews"] });
      setRating(0); setText(""); setStep("rate");
      toast.success("Thank you for your review! 🎉");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const isLowRating = rating > 0 && rating < 5;
  const feedbackPrompt = isLowRating
    ? "We're sorry to hear that. What didn't work for you?"
    : "Amazing! What did you love about Artevia?";
  const feedbackPlaceholder = isLowRating
    ? "Tell us what went wrong — we read every word and take it seriously…"
    : "Share what made your experience great — the design, the auctions, the community…";

  const handleRatingCommit = () => { if (rating > 0) setStep("feedback"); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) { toast.error("Please write your feedback"); return; }
    submitMutation.mutate({ rating, text: text.trim() });
  };

  const allRatings = reviews.map(r => r.rating);
  const avgRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : "0";
  const happyCount = reviews.filter(r => r.rating >= 7).length;

  const inputClass = "w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-4 py-3 bg-background/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition font-body text-sm";

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="py-16 text-center">
        <div className="container mx-auto px-6">
          <div className="hero-eyebrow mb-3.5">We Value Your Feedback</div>
          <h1 className="font-display text-foreground mb-3" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>Rate Your Experience</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Your feedback helps us build a better marketplace for creators and collectors worldwide.</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-dark-bg py-10 mb-16">
        <div className="container mx-auto px-6 grid grid-cols-3 text-center">
          <div>
            <div className="font-display text-4xl font-black text-primary mb-1">{avgRating}</div>
            <div className="flex justify-center mb-1">
              <StarDisplay rating={Math.round(Number(avgRating))} size={16} />
            </div>
            <div className="text-xs text-primary-foreground/50">Average Rating</div>
          </div>
          <div>
            <div className="font-display text-4xl font-black text-primary mb-1">{reviews.length}</div>
            <div className="text-xs text-primary-foreground/50 mt-2">Total Reviews</div>
          </div>
          <div>
            <div className="font-display text-4xl font-black text-primary mb-1">{happyCount}</div>
            <div className="text-xs text-primary-foreground/50 mt-2">Happy Customers</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-20">
        {/* Review carousel */}
        <div className="mb-16">
          <h2 className="section-title text-center">What People Are Saying</h2>
          <p className="section-sub text-center">Slide through reviews from our community</p>
          <ReviewSlider reviews={reviews} />
        </div>

        {/* Leave a review */}
        <div className="max-w-xl mx-auto">
          <div className="bg-card rounded-3xl p-10 shadow-lg border border-primary/[0.08]">
            <h3 className="font-display text-2xl text-foreground text-center mb-2">Leave Your Review</h3>
            <p className="text-sm text-muted-foreground text-center mb-8">Drag the slider to rate, then tell us more</p>

            {!user ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">Please sign in to leave a review</p>
                <Link to="/login" className="btn-accent">Sign In</Link>
              </div>
            ) : step === "rate" ? (
              <div className="space-y-6">
                <RatingSlider value={rating} onChange={setRating} />
                <button
                  onClick={handleRatingCommit}
                  disabled={rating === 0}
                  className="btn-accent w-full py-3.5 text-base disabled:opacity-40"
                >
                  Continue →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Mini score recap */}
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span
                    className="font-display text-3xl font-black"
                    style={{ color: rating < 5 ? "hsl(var(--destructive))" : "hsl(var(--primary))" }}
                  >
                    {rating}/10
                  </span>
                  <StarDisplay rating={rating} size={18} />
                </div>

                {/* Prompt banner */}
                <div className={`rounded-xl p-4 text-center text-sm font-medium ${
                  isLowRating ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                }`}>
                  {isLowRating ? "😔 " : "😊 "}{feedbackPrompt}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    {isLowRating ? "What didn't you like?" : "What did you love?"}
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    placeholder={feedbackPlaceholder}
                    className={`${inputClass} resize-none`}
                    maxLength={500}
                  />
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => { setStep("rate"); }} className="btn-outline-accent flex-1 py-3 text-sm">← Back</button>
                  <button type="submit" disabled={submitMutation.isPending} className="btn-accent flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                    <Send size={16} /> {submitMutation.isPending ? "Submitting…" : "Submit Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RateUs;
