import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut, User, ShoppingBag, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useThemeMode } from "@/hooks/useThemeMode";
import finalogo from "@/assets/finalogo.png";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { isLuxe } = useThemeMode();

  const isCreator = profile?.role === "creator";

  const links = [
    { to: "/", label: "Home" },
    ...(isCreator
      ? [{ to: "/my-products", label: "My Products" }]
      : [{ to: "/auctions", label: "Shop" }]),
    { to: "/about", label: "About" },
    { to: "/rate-us", label: "Rate Us" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-colors duration-500">
      <div className="container mx-auto px-6 h-[100px] flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={finalogo}
            alt="Artevia logo"
            className="h-[140px] w-auto object-contain"
          />
          {isLuxe && (
            <span className="text-primary font-normal text-xs tracking-[0.2em] uppercase">Luxe</span>
          )}
        </Link>

        {/* Desktop nav links — centered */}
        <div className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={
                "text-xs tracking-[0.15em] uppercase transition-colors " +
                (location.pathname === l.to
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right-side actions */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          {user ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground max-w-[96px] truncate">
                  {profile?.full_name || user.email?.split("@")[0]}
                </span>
                {profile?.twoFactorEnabled && (
                  <ShieldCheck size={12} className="text-primary shrink-0" title="2FA enabled" />
                )}
              </div>
              <Link to="/account" title="Account" className="text-muted-foreground hover:text-foreground transition-colors">
                <User size={16} />
              </Link>
              <button onClick={signOut} title="Sign out" className="text-muted-foreground hover:text-foreground transition-colors">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link to="/login" className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
          )}
          <ShoppingBag size={16} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground p-1">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-t border-border px-6 py-3 space-y-0.5">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={
                "block px-2 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors " +
                (location.pathname === l.to ? "text-foreground font-medium" : "text-muted-foreground")
              }
            >
              {l.label}
            </Link>
          ))}
          <div className="border-t border-border mt-2 pt-2 space-y-0.5">
            {user ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setOpen(false)}
                  className="block px-2 py-2.5 text-xs tracking-[0.15em] uppercase text-muted-foreground"
                >
                  Account
                </Link>
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className="block w-full text-left px-2 py-2.5 text-xs tracking-[0.15em] uppercase text-destructive"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block px-2 py-2.5 text-xs tracking-[0.15em] uppercase text-muted-foreground"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
