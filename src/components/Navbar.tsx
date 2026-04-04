import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut, User, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useThemeMode } from "@/hooks/useThemeMode";

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
    <nav className="sticky top-0 z-50 backdrop-blur-sm border-b py-0 bg-background/95 border-border transition-colors duration-500">
      {/* Main nav */}
      <div className="container mx-auto px-6 flex items-center justify-between py-4">
        <Link to="/" className="font-display text-2xl text-foreground tracking-tight">
          {isLuxe ? (
            <span>
              Artevia <span className="text-primary font-normal text-lg">LUXE</span>
            </span>
          ) : (
            "Artevia"
          )}
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={"text-sm tracking-wider uppercase transition-colors " +
                ((l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to))
                  ? "text-primary font-semibold"
                  : "text-foreground hover:text-primary"
                )
              }
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User size={14} className="text-muted-foreground" />
                <span className="text-xs text-foreground max-w-[100px] truncate">
                  {profile?.full_name || user.email?.split("@")[0]}
                </span>
              </div>
              <button onClick={signOut} className="text-muted-foreground hover:text-primary transition-colors" title="Sign out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm tracking-wider uppercase text-foreground hover:text-primary transition-colors">
              Login
            </Link>
          )}
          <ShoppingBag size={18} className="text-foreground cursor-pointer hover:text-primary transition-colors" />
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-t border-border px-6 pb-4 pt-2 space-y-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={"block px-3 py-2 text-sm tracking-wider uppercase " +
                ((l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to)) ? "text-primary font-semibold" : "text-foreground")
              }
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <button onClick={() => { signOut(); setOpen(false); }}
              className="block w-full text-center text-sm tracking-wider uppercase text-destructive mt-2 py-2"
            >
              Sign Out
            </button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}
              className="block text-center text-sm tracking-wider uppercase text-foreground mt-2 py-2"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
