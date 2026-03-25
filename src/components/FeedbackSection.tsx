import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const FeedbackSection = () => {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) { toast.error("Please write your feedback"); return; }
    setSubmitted(true);
    toast.success("Thank you! Your feedback helps us improve.");
    setTimeout(() => {
      setName("");
      setFeedback("");
      setSubmitted(false);
    }, 3000);
  };

  const inputClass = "w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-4 py-3 bg-background/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition font-body text-sm";

  return (
    <section className="py-20 bg-dark-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,hsl(170_75%_39%/0.08),transparent_70%)] pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary text-xs font-bold tracking-[2px] uppercase px-4 py-1.5 rounded-full border border-primary/30 mb-5">
            <MessageSquare size={14} /> Your Voice Matters
          </div>
          <h2 className="font-display text-primary-foreground text-3xl mb-3">
            Please tell us how we can improve
          </h2>
          <p className="text-primary-foreground/50 mb-10 leading-relaxed">
            We're always looking to make Artevia better for creators and collectors. Share your thoughts, suggestions, or anything you'd like to see changed.
          </p>

          {submitted ? (
            <div className="bg-primary/20 rounded-2xl p-10 border border-primary/30">
              <div className="text-5xl mb-4">💚</div>
              <h3 className="font-display text-primary-foreground text-xl mb-2">Thank you for your feedback!</h3>
              <p className="text-primary-foreground/60 text-sm">We read every response and it helps shape the future of Artevia.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="text-left space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary-foreground/80 mb-1.5">Your Name (optional)</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="How should we address you?" className={`${inputClass} bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30 focus:border-primary`} maxLength={100} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-foreground/80 mb-1.5">Your Feedback</label>
                <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={5} placeholder="What can we do better? Any features you'd love to see? Things that frustrated you? We want to hear it all…" className={`${inputClass} bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30 focus:border-primary resize-none`} maxLength={1000} />
              </div>
              <button type="submit" className="btn-accent w-full py-3.5 text-base flex items-center justify-center gap-2">
                <Send size={16} /> Send Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
