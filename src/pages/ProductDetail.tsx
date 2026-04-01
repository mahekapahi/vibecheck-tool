import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allAuctions } from "@/data/auctions";

const ProductDetail = () => {
  const { id } = useParams();
  const auction = allAuctions.find((a) => a.id === Number(id));

  if (!auction) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Auction Not Found</h1>
          <Link to="/auctions" className="btn-accent">Back to Auctions</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = allAuctions.filter((a) => a.id !== auction.id && a.categorySlug === auction.categorySlug).slice(0, 4);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <Link to="/auctions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Auctions
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Product Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img src={auction.img} alt={auction.title} className="w-full h-[500px] object-cover" />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            {auction.badge && (
              <span className={"inline-block w-fit text-primary-foreground text-[0.7rem] font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-4 " + (auction.badgeColor || "bg-primary")}>
                {auction.badge}
              </span>
            )}
            <div className="text-sm text-muted-foreground mb-2">{auction.category}</div>
            <h1 className="font-display text-foreground text-3xl lg:text-4xl mb-3">{auction.title}</h1>

            <div className="flex items-center gap-3 mb-6">
              <img src={auction.creatorAvatar} alt={auction.creator} className="w-9 h-9 rounded-full object-cover border-2 border-primary/25" />
              <span className="text-sm text-muted-foreground">
                by <strong className="text-foreground">{auction.creator}</strong>
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">{auction.description}</p>

            <div className="bg-muted/30 rounded-2xl p-6 mb-6">
              <div className="text-xs text-muted-foreground mb-1">Current Bid</div>
              <div className="font-display text-4xl font-bold text-primary mb-1">{auction.bidLabel}</div>
              <div className="text-sm text-muted-foreground">⏱ {auction.time}</div>
            </div>

            <div className="flex gap-3 mb-8">
              <Link to="/login" className="btn-accent flex-1 text-center inline-flex items-center justify-center gap-2">
                <ShoppingBag size={18} /> Place Bid
              </Link>
              <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-colors">
                <Heart size={18} className="text-muted-foreground" />
              </button>
              <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-colors">
                <Share2 size={18} className="text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-3 border-t border-border pt-6">
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

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mb-12">
            <h2 className="section-title mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((item) => (
                <Link key={item.id} to={"/auction/" + item.id} className="group block bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden aspect-square">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-foreground text-sm font-bold mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                    <div className="text-xs text-muted-foreground mb-2">by {item.creator}</div>
                    <div className="font-display text-base font-bold text-primary">{item.bidLabel}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
