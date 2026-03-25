import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const links = [
    { to: "/", label: "Home" },
    { to: "/auctions", label: "Auctions" },
    { to: "/about", label: "About" },
    { to: "/rate-us", label: "Rate Us" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-primary/[0.18] py-3.5">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="font-display text-[1.7rem] font-black text-foreground tracking-tight">
          Arte<span className="text-primary">via</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3.5 py-1.5 rounded-lg text-[0.95rem] font-medium transition-colors ${
                location.pathname === l.to
                  ? "text-primary font-semibold"
                  : "text-foreground hover:bg-primary/[0.12] hover:text-primary"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <div className="ml-2 flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <User size={14} className="text-primary" />
                <span className="text-xs font-semibold text-foreground max-w-[100px] truncate">
                  {profile?.full_name || user.email?.split("@")[0]}
                </span>
              </div>
              <button onClick={signOut} className="p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Sign out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="ml-2 bg-primary text-primary-foreground rounded-full px-5 py-2 text-sm font-semibold hover:bg-primary-dark transition-all">
              Login
            </Link>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-primary/10 px-6 pb-4 pt-2 space-y-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === l.to ? "text-primary font-semibold" : "text-foreground"}`}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={() => { signOut(); setOpen(false); }} className="block w-full text-center bg-destructive/10 text-destructive rounded-full px-5 py-2 text-sm font-semibold mt-2">
              Sign Out
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="block text-center bg-primary text-primary-foreground rounded-full px-5 py-2 text-sm font-semibold mt-2">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
