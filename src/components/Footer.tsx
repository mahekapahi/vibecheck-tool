import { Link } from "react-router-dom";
import { Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => (
  <footer className="bg-dark-bg text-primary-foreground/80 pt-16 pb-8">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <div>
          <div className="font-display text-2xl font-black text-primary-foreground mb-3">
            Arte<span className="text-primary">via</span>
          </div>
          <p className="text-sm leading-relaxed text-primary-foreground/60">
            A premium marketplace where creativity meets commerce. Own original. Support creators.
          </p>
        </div>
        <div>
          <div className="text-xs font-bold tracking-widest uppercase text-primary-foreground/40 mb-4">Platform</div>
          {[{ to: "/", label: "Home" }, { to: "/auctions", label: "Auctions" }, { to: "/about", label: "About" }, { to: "/contact", label: "Contact" }].map((l) => (
            <Link key={l.to} to={l.to} className="block text-sm text-primary-foreground/60 hover:text-primary transition-colors mb-2">{l.label}</Link>
          ))}
        </div>
        <div>
          <div className="text-xs font-bold tracking-widest uppercase text-primary-foreground/40 mb-4">Account</div>
          <Link to="/login" className="block text-sm text-primary-foreground/60 hover:text-primary transition-colors mb-2">Login</Link>
          <Link to="/login" className="block text-sm text-primary-foreground/60 hover:text-primary transition-colors mb-2">Register Buyer</Link>
          <Link to="/login" className="block text-sm text-primary-foreground/60 hover:text-primary transition-colors mb-2">Register Creator</Link>
        </div>
        <div>
          <div className="text-xs font-bold tracking-widest uppercase text-primary-foreground/40 mb-4">Follow Us</div>
          <div className="flex gap-3">
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <hr className="border-primary-foreground/10 mb-6" />
      <p className="text-center text-xs text-primary-foreground/40">© 2025 Artevia Inc. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
