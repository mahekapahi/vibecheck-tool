import { useState, useRef, useEffect, useCallback } from "react";
import { Star, Send, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

interface UserReview {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
}

const initialReviews: UserReview[] = [
  { id: 1, name: "Ananya R.", rating: 5, text: "Artevia completely changed how I sell my art. The auction format lets buyers decide the true value of my work!", date: "2 days ago" },
  { id: 2, name: "Rohan M.", rating: 5, text: "I've collected three original pieces through Artevia. The bidding process is exciting and every artwork arrived perfectly.", date: "3 days ago" },
  { id: 3, name: "Sneha K.", rating: 4, text: "The platform is beautifully designed and super easy to use. Found some amazing ceramic pieces here!", date: "5 days ago" },
  { id: 4, name: "Vikram S.", rating: 5, text: "As a photographer, Artevia gave me a platform where my limited edition prints are valued properly.", date: "1 week ago" },
  { id: 5, name: "Meera J.", rating: 4, text: "Bought a stunning abstract piece for my office. The escrow payment system made me feel very safe.", date: "1 week ago" },
  { id: 6, name: "Priya D.", rating: 5, text: "The 8% commission is fair, and the exposure to serious collectors has been invaluable for my career.", date: "2 weeks ago" },
  { id: 7, name: "Arjun P.", rating: 3, text: "Good platform overall but the search filters could be improved. Would love more category options.", date: "2 weeks ago" },
  { id: 8, name: "Lakshmi G.", rating: 5, text: "Museum-quality curation. Every piece I've purchased has exceeded my expectations. Highly recommended!", date: "3 weeks ago" },
];

const StarRating = ({ rating, size = 20, interactive = false, onRate }: { rating: number; size?: number; interactive?: boolean; onRate?: (r: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => interactive && onRate?.(s)}
        className={`transition-transform ${interactive ? "hover:scale-125 cursor-pointer" : "cursor-default"}`}
      >
        <Star size={size} className={s <= rating ? "fill-star text-star" : "text-muted-foreground/25"} />
      </button>
    ))}
  </div>
);

const ReviewSlider = ({ reviews }: { reviews: UserReview[] }) => {
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

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Arrows */}
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

      <div ref={scrollRef} className="flex gap-5 overflow-x-auto scroll-smooth pb-4 px-1 snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {reviews.map((r) => (
          <div key={r.id} className="flex-shrink-0 w-[310px] snap-start bg-card rounded-[var(--radius)] p-6 border border-primary/[0.08] flex flex-col transition-all duration-300 hover:-translate-y-1" style={{ boxShadow: "0 8px 32px hsl(186 76% 21% / 0.1)" }}>
            <Quote size={24} className="text-primary/20 mb-3" />
            <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4 italic">"{r.text}"</p>
            <div className="border-t border-primary/10 pt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-foreground">{r.name}</span>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <StarRating rating={r.rating} size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RateUs = () => {
  const [reviews, setReviews] = useState<UserReview[]>(initialReviews);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [step, setStep] = useState<"rate" | "feedback">("rate");

  const isLowRating = rating > 0 && rating <= 3;
  const feedbackPrompt = isLowRating
    ? "How can we improve? We'd love to know what went wrong."
    : "What did you like about Artevia? Tell us what made your experience great!";
  const feedbackPlaceholder = isLowRating
    ? "Tell us what we can do better — more features, better UI, faster support…"
    : "Share what you loved — the design, the auctions, the community…";

  const handleRatingSelect = (r: number) => {
    setRating(r);
    setStep("feedback");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Please enter your name"); return; }
    if (!text.trim()) { toast.error("Please write your feedback"); return; }

    const newReview: UserReview = {
      id: Date.now(),
      name: name.trim(),
      rating,
      text: text.trim(),
      date: "Just now",
    };
    setReviews([newReview, ...reviews]);
    setRating(0);
    setName("");
    setText("");
    setStep("rate");
    toast.success("Thank you for your review! 🎉");
  };

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const inputClass = "w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-4 py-3 bg-background/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition font-body text-sm";

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="py-16 text-center">
        <div className="container mx-auto px-6">
          <div className="hero-eyebrow mb-3.5">We Value Your Feedback</div>
          <h1 className="font-display text-foreground mb-3" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>Rate Your Experience</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Your feedback helps us build a better marketplace for creators and collectors worldwide.</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-dark-bg py-10 mb-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-3 text-center">
            <div>
              <div className="font-display text-4xl font-black text-primary mb-1">{avgRating}</div>
              <div className="flex justify-center mb-1"><StarRating rating={Math.round(Number(avgRating))} size={16} /></div>
              <div className="text-xs text-primary-foreground/50">Average Rating</div>
            </div>
            <div>
              <div className="font-display text-4xl font-black text-primary mb-1">{reviews.length}</div>
              <div className="text-xs text-primary-foreground/50 mt-2">Total Reviews</div>
            </div>
            <div>
              <div className="font-display text-4xl font-black text-primary mb-1">{reviews.filter(r => r.rating >= 4).length}</div>
              <div className="text-xs text-primary-foreground/50 mt-2">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-20">
        {/* Review Slider */}
        <div className="mb-16">
          <h2 className="section-title text-center">What People Are Saying</h2>
          <p className="section-sub text-center">Slide through reviews from our community</p>
          <ReviewSlider reviews={reviews} />
        </div>

        {/* Rate Us Form */}
        <div className="max-w-xl mx-auto">
          <div className="bg-card rounded-3xl p-10 shadow-lg border border-primary/[0.08]">
            <h3 className="font-display text-2xl text-foreground text-center mb-2">Leave Your Review</h3>
            <p className="text-sm text-muted-foreground text-center mb-8">Tap a star to begin</p>

            {step === "rate" ? (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">How would you rate your Artevia experience?</p>
                <div className="flex justify-center mb-4">
                  <StarRating rating={rating} size={40} interactive onRate={handleRatingSelect} />
                </div>
                {rating === 0 && (
                  <p className="text-xs text-muted-foreground/50 mt-2">Select 1 to 5 stars</p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Show selected rating */}
                <div className="text-center mb-2">
                  <div className="flex justify-center mb-2">
                    <StarRating rating={rating} size={28} interactive onRate={handleRatingSelect} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {rating <= 3 ? "😔 We're sorry to hear that" : "😊 Glad you're enjoying Artevia!"}
                  </p>
                </div>

                {/* Conditional prompt */}
                <div className={`rounded-xl p-4 text-center text-sm font-medium ${isLowRating ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                  {feedbackPrompt}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Your Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="How should we address you?" className={inputClass} maxLength={100} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    {isLowRating ? "How can we improve?" : "What did you like?"}
                  </label>
                  <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder={feedbackPlaceholder} className={`${inputClass} resize-none`} maxLength={500} />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setStep("rate"); setRating(0); }} className="btn-outline-accent flex-1 py-3 text-sm">
                    Back
                  </button>
                  <button type="submit" className="btn-accent flex-1 py-3 flex items-center justify-center gap-2">
                    <Send size={16} /> Submit Review
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
