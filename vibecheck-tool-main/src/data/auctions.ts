import artAbstractCanvas from "@/assets/art-abstract-canvas.jpg";
import artUrbanGeometry from "@/assets/art-urban-geometry.jpg";
import artCeramicForm from "@/assets/art-ceramic-form.jpg";
import artNeonGarden from "@/assets/art-neon-garden.jpg";
import artSolitudePrint from "@/assets/art-solitude-print.jpg";
import artWovenMemory from "@/assets/art-woven-memory.jpg";
import artCoastalReverie from "@/assets/art-coastal-reverie.jpg";
import artBronzeHorizon from "@/assets/art-bronze-horizon.jpg";

export interface ProductReview {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

export interface AuctionItem {
  id: number;
  img: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  category: string;
  categorySlug: string;
  bid: number;
  bidLabel: string;
  time: string;
  badge: string;
  badgeColor?: string;
  status: string;
  description: string;
  reviews: ProductReview[];
  avgRating: number;
}

const imgs = [artAbstractCanvas, artUrbanGeometry, artCeramicForm, artNeonGarden, artSolitudePrint, artWovenMemory, artCoastalReverie, artBronzeHorizon];
const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
];

const categories = [
  { name: "Painting & Mixed Media", slug: "painting" },
  { name: "Photography", slug: "photography" },
  { name: "Sculpture & Ceramics", slug: "sculpture" },
  { name: "Digital Art & Illustration", slug: "digital" },
  { name: "Textile & Fiber Art", slug: "textile" },
  { name: "Printmaking", slug: "printmaking" },
  { name: "Jewelry & Accessories", slug: "jewelry" },
  { name: "Home Décor", slug: "decor" },
];

const creators = ["Maya Chen", "Liam Torres", "Suki Amore", "Nadia Osei", "Remy Blaze", "Priya Sharma", "Arjun Kapoor", "Diya Rao"];

function makeReviews(seed: number): ProductReview[] {
  return [
    { id: 1, name: "Rohit K.", avatar: avatars[seed % 6], rating: 5, date: "2 days ago", text: "Absolutely stunning piece!" },
    { id: 2, name: "Sneha M.", avatar: avatars[(seed + 1) % 6], rating: 4, date: "5 days ago", text: "Beautiful craftsmanship." },
  ];
}

// ===== NORMAL products (under ₹50,000) =====
const normalTitles = [
  "Amber Sketch Folio", "Still Life — Pencil", "Garden Bloom Print", "Clay Whisper Pot",
  "Night Sky Illustration", "Silk Thread Wall Piece", "Mono Lino Study", "Copper Leaf Ring",
  "Jute Table Runner", "Charcoal Portrait Set", "Botanical Press", "Ink Wash Series",
  "Woven Coaster Set", "Ceramic Pinch Bowl", "Driftwood Frame", "Paper Mache Vase",
  "Block Print Cushion", "Macramé Hanging", "Handmade Journal", "Enamel Pin Set",
  "Pastel Cityscape", "Resin Bookmark", "Canvas Tote — Art Ed.", "Stoneware Mug Pair",
  "Wire Sculpture Mini", "Origami Light Shade", "Terracotta Planter", "Batik Scarf",
  "Wooden Pendant", "Calligraphy Set",
];

const normalPrices = [
  4500, 3200, 8900, 12000, 6500, 15000, 9800, 7200, 4800, 18000,
  22000, 11500, 3500, 9500, 14000, 7800, 6200, 19000, 5500, 2800,
  28000, 3900, 4200, 16000, 21000, 13500, 8500, 25000, 6800, 11000,
];

// ===== LUXE products (₹50,000 and above) =====
const luxeTitles = [
  "Abstract Canvas No. 7", "Urban Geometry — Series II", "Ceramic Form III", "Neon Garden — Digital",
  "Solitude — Fine Art Print", "Coastal Reverie — Oil", "Bronze Horizon Sculpture", "Gilded Peony — Oil on Linen",
  "Sapphire Depths — Resin", "Midnight Bloom Tapestry", "Obsidian Throne — Bronze", "Golden Hour — Archival",
  "Eternal Spiral — Marble", "Velvet Dusk Triptych", "Crystal Lattice Installation", "Platinum Weave Panel",
  "Aurora Crown — 22k Gold", "Grand Format — Landscape", "Floating Form — Aluminium", "Heritage Loom Piece",
  "Diamond Dust Canvas", "Royal Indigo Series", "Monolith — Black Granite", "Chrome Iris — Digital",
  "Pearl Cascade Necklace", "Rosewood Console Art", "Titanium Bloom Sculpture", "Celestial Map — Gold Leaf",
  "Emerald Echo — Glass", "Ivory Tower — Bone China",
];

const luxePrices = [
  200000, 65000, 145000, 265000, 74000, 120000, 88000, 350000,
  180000, 95000, 420000, 78000, 550000, 155000, 290000, 110000,
  480000, 62000, 175000, 85000, 310000, 92000, 600000, 135000,
  220000, 160000, 380000, 250000, 195000, 145000,
];

function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

const badges = ["", "New", "🔥 Ending Soon", "Exclusive", "🔥 Hot", "Limited"];
const statuses = ["new", "ending-soon", "new", "ending-soon", "new", "new"];
const times = ["Ends 11:42 PM IST", "Ends Sun 3:30 AM IST", "Ends Tomorrow", "Ends Sat 6:30 AM IST", "Ends 4 days", "Ends 3 days"];

function buildItems(titles: string[], prices: number[], idOffset: number): AuctionItem[] {
  return titles.map((title, i) => {
    const cat = categories[i % categories.length];
    return {
      id: idOffset + i + 1,
      img: imgs[i % imgs.length],
      title,
      creator: creators[i % creators.length],
      creatorAvatar: avatars[i % avatars.length],
      category: cat.name,
      categorySlug: cat.slug,
      bid: prices[i],
      bidLabel: formatINR(prices[i]),
      time: times[i % times.length],
      badge: badges[i % badges.length],
      status: statuses[i % statuses.length],
      description: `A stunning ${cat.name.toLowerCase()} piece by ${creators[i % creators.length]}. Original, hand-finished work with certificate of authenticity.`,
      reviews: makeReviews(i),
      avgRating: parseFloat((4.3 + (i % 7) * 0.1).toFixed(1)),
    };
  });
}

export const normalAuctions: AuctionItem[] = buildItems(normalTitles, normalPrices, 100);
export const luxeAuctions: AuctionItem[] = buildItems(luxeTitles, luxePrices, 200);
export const allAuctions: AuctionItem[] = [...luxeAuctions, ...normalAuctions];
