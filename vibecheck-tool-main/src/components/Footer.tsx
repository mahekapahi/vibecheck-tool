import { Link } from "react-router-dom";
import { Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => (
  <footer className="bg-secondary text-primary-foreground pt-16 pb-8">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="font-display text-2xl text-primary-foreground mb-4">
            Artevia
          </div>
          <p className="text-sm leading-relaxed text-primary-foreground/60">
            A curated marketplace where creativity meets commerce. Own original. Support creators.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase text-primary-foreground/40 mb-4">Shop</div>
          {[
            { to: "/auctions", label: "All Auctions" },
            { to: "/auctions", label: "Paintings" },
            { to: "/auctions", label: "Photography" },
            { to: "/auctions", label: "Sculpture" },
          ].map((l) => (
            <Link key={l.label} to={l.to} className="block text-sm text-primary-foreground/60 hover:text-primary transition-colors mb-2">
              {l.label}
            </Link>
          ))}
        </div>
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase text-primary-foreground/40 mb-4">Company</div>
          {[
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" },
            { to: "/rate-us", label: "Rate Us" },
            { to: "/login", label: "Account" },
          ].map((l) => (
            <Link key={l.label} to={l.to} className="block text-sm text-primary-foreground/60 hover:text-primary transition-colors mb-2">
              {l.label}
            </Link>
          ))}
        </div>
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase text-primary-foreground/40 mb-4">Follow Us</div>
          <div className="flex gap-3">
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-primary-foreground/60">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <hr className="border-primary-foreground/10 mb-6" />
      <p className="text-center text-xs text-primary-foreground/40">© 2025 Artevia. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
