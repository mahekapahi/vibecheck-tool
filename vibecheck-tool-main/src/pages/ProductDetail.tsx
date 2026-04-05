import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allAuctions } from "@/data/auctions";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { openRazorpayCheckout } from "@/hooks/useRazorpay";

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);
  const auction = allAuctions.find((a) => a.id === Number(id));

  if (!auction) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Auction Not Found</h1>
          <Link to="/auctions" className="btn-accent">Back to Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = allAuctions.filter((a) => a.id !== auction.id).slice(0, 4);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <Link to="/auctions" className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="overflow-hidden">
            <img src={auction.img} alt={auction.title} className="w-full aspect-[4/5] object-cover" />
          </div>

          <div className="flex flex-col justify-center">
            <div className="text-xs text-muted-foreground tracking-wider uppercase mb-3">{auction.category}</div>
            <h1 className="font-display text-foreground text-3xl lg:text-4xl font-normal mb-4">{auction.title}</h1>

            <div className="flex items-center gap-3 mb-6">
              <img src={auction.creatorAvatar} alt={auction.creator} className="w-8 h-8 rounded-full object-cover" />
              <span className="text-sm text-muted-foreground">by {auction.creator}</span>
            </div>

            <div className="font-display text-3xl text-primary mb-2">{auction.bidLabel}</div>
            <div className="text-sm text-muted-foreground mb-8">⏱ {auction.time}</div>

            <p className="text-muted-foreground leading-relaxed mb-8">{auction.description}</p>

            {user ? (
              <div className="flex flex-col gap-3 mb-8">
                <button
                  className="btn-accent w-full text-center"
                  onClick={() => toast.success("Bid placed! (Demo)")}
                >
                  Place Bid
                </button>
                <button
                  className="w-full py-3 px-6 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm tracking-wide transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={paying}
                  onClick={async () => {
                    setPaying(true);
                    try {
                      await openRazorpayCheckout({
                        auctionId: auction.id,
                        amount: auction.bid,
                        title: auction.title,
                        description: `Purchase: ${auction.title}`,
                        userName: user.user_metadata?.full_name ?? "",
                        userEmail: user.email ?? "",
                      });
                    } finally {
                      setPaying(false);
                    }
                  }}
                >
                  {paying ? "Opening Payment..." : `Buy Now — ${auction.bidLabel}`}
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-accent block text-center mb-8">
                Sign In to Bid
              </Link>
            )}

            <div className="space-y-4 border-t border-border pt-6">
              {[
                { icon: Truck, text: "Free shipping on orders above ₹50,000" },
                { icon: Shield, text: "Certificate of authenticity included" },
                { icon: RotateCcw, text: "14-day return policy" },
              ].map((perk) => (
                <div key={perk.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <perk.icon size={16} className="text-primary shrink-0" />
                  {perk.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mb-16">
          <h2 className="section-title mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {related.map((item) => (
              <Link key={item.id} to={"/auction/" + item.id} className="block group">
                <div className="overflow-hidden mb-3">
                  <img src={item.img} alt={item.title} className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="text-xs text-muted-foreground tracking-wider uppercase mb-1">{item.creator}</div>
                <h3 className="font-display text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                <div className="text-sm text-foreground font-medium">{item.bidLabel}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
