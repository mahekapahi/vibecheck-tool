import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allAuctions } from "@/data/auctions";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const hero = allAuctions[0];
  const featured = allAuctions.slice(0, 3);
  const collection = allAuctions.slice(3, 7);
  const grid = allAuctions;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — Full-width image with overlay text, Loom style */}
      <section className="relative h-[85vh] overflow-hidden">
        <img
          src={hero.img}
          alt={hero.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-secondary/30 to-transparent" />
        <div className="absolute inset-0 flex items-end pb-16 lg:pb-24">
          <div className="container mx-auto px-6">
            <h1
              className="font-display text-primary-foreground font-normal italic leading-tight mb-6"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
            >
              New Collection
            </h1>
            <Link to="/auctions" className="btn-accent">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Tagline + 3 product images row */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="font-display text-foreground font-normal leading-tight"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
              >
                Handcrafted artworks<br />
                for every space.
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {featured.map((item) => (
                <Link
                  key={item.id}
                  to={"/auction/" + item.id}
                  className="block overflow-hidden group"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection — Large left image + product grid right */}
      <section className="py-16 lg:py-24 bg-muted/40">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title mb-0">Featured Auctions</h2>
            <Link
              to="/auctions"
              className="text-foreground text-sm font-medium tracking-wider uppercase hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Large featured item */}
            <Link
              to={"/auction/" + collection[0]?.id}
              className="block group"
            >
              <div className="overflow-hidden mb-4">
                <img
                  src={collection[0]?.img}
                  alt={collection[0]?.title}
                  className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="text-xs text-muted-foreground tracking-wider uppercase mb-1">
                {collection[0]?.category}
              </div>
              <h3 className="font-display text-foreground text-xl mb-1">
                {collection[0]?.title}
              </h3>
              <div className="text-sm text-foreground font-medium">
                {collection[0]?.bidLabel}
              </div>
            </Link>

            {/* 2x2 smaller grid */}
            <div className="grid grid-cols-2 gap-6">
              {collection.slice(1, 5).map((item) => (
                <Link
                  key={item.id}
                  to={"/auction/" + item.id}
                  className="block group"
                >
                  <div className="overflow-hidden mb-3">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground tracking-wider uppercase mb-1">
                    {item.category}
                  </div>
                  <h3 className="font-display text-foreground text-sm mb-1">
                    {item.title}
                  </h3>
                  <div className="text-sm text-foreground font-medium">
                    {item.bidLabel}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full-width banner */}
      <section className="relative h-[50vh] overflow-hidden">
        <img
          src={allAuctions[1]?.img}
          alt="Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/40 flex items-center justify-center text-center">
          <div>
            <div className="hero-eyebrow text-primary-foreground/80 mb-4">
              Limited Editions
            </div>
            <h2
              className="font-display text-primary-foreground font-normal italic mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              One of a kind pieces
            </h2>
            <Link to="/auctions" className="btn-accent">
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* All Products Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">Shop All Auctions</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Browse our curated selection of original artworks from independent creators
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {grid.map((item) => (
              <Link
                key={item.id}
                to={"/auction/" + item.id}
                className="block group"
              >
                <div className="overflow-hidden mb-3">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="text-xs text-muted-foreground tracking-wider uppercase mb-1">
                  {item.creator}
                </div>
                <h3 className="font-display text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <div className="text-sm text-foreground font-medium">
                  {item.bidLabel}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About / Story section */}
      <section className="py-16 lg:py-24 bg-muted/40">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="hero-eyebrow mb-6">Our Story</div>
              <h2 className="section-title">
                A marketplace built for creative exchange
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Artevia is designed to give creators full control over their work's
                value while giving buyers access to genuinely unique, collectible
                creative pieces. Every auction is a chance to own something
                irreplaceable.
              </p>
              <Link to="/about" className="btn-outline-accent">
                Learn More
              </Link>
            </div>
            <div className="overflow-hidden">
              <img
                src={allAuctions[5]?.img}
                alt="About Artevia"
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
