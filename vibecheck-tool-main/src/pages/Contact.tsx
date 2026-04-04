import { useState } from "react";
import { Instagram, Twitter, Linkedin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const Contact = () => {
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! We'll get back to you shortly.");
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="py-16 text-center">
        <div className="container mx-auto px-6">
          <div className="hero-eyebrow mb-3.5">Get In Touch</div>
          <h1 className="font-display text-foreground mb-3" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>Contact Artevia</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">We'd love to hear from you — whether you're a creator, collector, or just curious.</p>
        </div>
      </div>

      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Info */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl text-foreground mb-4">Let's Talk</h2>
              <p className="text-muted-foreground leading-relaxed mb-9">
                Our team is here to support creators, buyers, and everyone in between. We typically respond within 24 hours.
              </p>
              {[
                { icon: "✉️", title: "Email", text: "hello@artevia.io" },
                { icon: "📞", title: "Phone", text: "+91 98200 47381" },
                { icon: "📍", title: "Headquarters", text: "42 Linking Road, Bandra West, Mumbai 400050" },
                { icon: "🕐", title: "Support Hours", text: "Mon–Fri, 9:30 AM – 6:30 PM IST" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 mb-5">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <h6 className="font-display text-sm font-bold text-foreground">{item.title}</h6>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
              <div className="mt-6">
                <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground/50 mb-3">Follow Our Journey</div>
                <div className="flex gap-3">
                  {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                    <a key={i} href="#" className="w-9 h-9 rounded-full bg-foreground/[0.08] flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-3xl p-10 shadow-lg border border-primary/[0.08]">
                <h4 className="font-display text-xl text-foreground mb-1">Send us a Message</h4>
                <p className="text-sm text-muted-foreground mb-7">Fill in the form below and we'll get back to you shortly.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Your Name</label>
                    <input type="text" required placeholder="Full name" className="w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-4 py-3 bg-background/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition font-body text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address</label>
                    <input type="email" required placeholder="you@example.com" className="w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-4 py-3 bg-background/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition font-body text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Subject</label>
                    <select required defaultValue="" className="w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-4 py-3 bg-background/30 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition font-body text-sm">
                      <option value="" disabled>What's this about?</option>
                      <option>Creator Application</option>
                      <option>Buyer Support</option>
                      <option>Technical Issue</option>
                      <option>Partnership Inquiry</option>
                      <option>Press & Media</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Message</label>
                    <textarea required rows={5} placeholder="Tell us what's on your mind..." className="w-full border-[1.5px] border-foreground/[0.18] rounded-lg px-4 py-3 bg-background/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition font-body text-sm resize-none" />
                  </div>
                  <button type="submit" disabled={sending} className="btn-accent w-full py-3.5 text-base disabled:opacity-60">
                    {sending ? "Sending…" : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
