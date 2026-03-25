const reviews = [
  {
    stars: 5,
    text: "Artevia completely changed how I sell my art. The auction format lets buyers decide the true value of my work. I've earned 3x more than on other platforms.",
    name: "Ananya R.",
    role: "Creator · Painting",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  },
  {
    stars: 5,
    text: "I've collected three original pieces through Artevia. The bidding process is exciting, and every artwork arrived beautifully packaged with a certificate of authenticity.",
    name: "Rohan M.",
    role: "Buyer · Art Collector",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
  },
  {
    stars: 4,
    text: "The platform is beautifully designed and super easy to use. I love the transparency — you can see every bid in real time. Found some amazing ceramic pieces here!",
    name: "Sneha K.",
    role: "Buyer · Interior Designer",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
  },
  {
    stars: 5,
    text: "As a photographer, Artevia gave me a platform where my limited edition prints are valued properly. The community here truly appreciates creative work.",
    name: "Vikram S.",
    role: "Creator · Photography",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
  },
  {
    stars: 5,
    text: "Bought a stunning abstract piece for my office. The escrow payment system made me feel safe, and the artist even included a personal note. Wonderful experience!",
    name: "Meera J.",
    role: "Buyer · Tech Entrepreneur",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80",
  },
  {
    stars: 4,
    text: "I've been selling my textile art on Artevia for 6 months now. The 8% commission is fair, and the exposure to serious collectors has been invaluable for my career.",
    name: "Priya D.",
    role: "Creator · Textile Art",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80",
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="text-star text-lg tracking-wider mb-3">
    {"★".repeat(count)}{"☆".repeat(5 - count)}
  </div>
);

const ReviewsSection = () => (
  <section className="py-20 bg-gradient-to-b from-primary/[0.04] to-muted/30">
    <div className="container mx-auto px-6">
      <div className="text-center mb-2">
        <div className="hero-eyebrow text-xs">What People Say</div>
      </div>
      <h2 className="section-title text-center">Customer Reviews</h2>
      <p className="section-sub text-center">Hear from our community of creators and collectors</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div key={i} className="bg-card rounded-[var(--radius)] p-7 border border-primary/[0.08] flex flex-col h-full transition-all duration-300 hover:-translate-y-1.5" style={{ boxShadow: "0 8px 32px hsl(186 76% 21% / 0.12)" }}>
            <Stars count={r.stars} />
            <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5 italic">"{r.text}"</p>
            <div className="flex items-center gap-3 border-t border-primary/[0.12] pt-4">
              <img src={r.img} alt={r.name} className="w-11 h-11 rounded-full object-cover border-2 border-primary/25" />
              <div>
                <div className="font-semibold text-sm text-foreground">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ReviewsSection;
