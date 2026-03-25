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

export const allAuctions: AuctionItem[] = [
  {
    id: 8, img: artAbstractCanvas, title: "Abstract Canvas No. 7", creator: "Maya Chen",
    creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    category: "Painting & Mixed Media", categorySlug: "painting",
    bid: 200000, bidLabel: "₹2,00,000", time: "Ends 11:42 PM IST",
    badge: "🔥 Ending Soon", status: "ending-soon",
    description: "A bold exploration of colour and emotion. Acrylic on canvas, 90×120cm. Ships with certificate of authenticity.",
    avgRating: 4.8,
    reviews: [
      { id: 1, name: "Rohit K.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", rating: 5, date: "2 days ago", text: "Absolutely stunning piece. The colors are even more vibrant in person!" },
      { id: 2, name: "Sneha M.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80", rating: 5, date: "5 days ago", text: "Maya's work is always exceptional. This one is a masterpiece." },
      { id: 3, name: "Arjun P.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80", rating: 4, date: "1 week ago", text: "Beautiful composition. Would love to see more from this series." },
    ],
  },
  {
    id: 7, img: artUrbanGeometry, title: "Urban Geometry — Series II", creator: "Liam Torres",
    creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
    category: "Photography", categorySlug: "photography",
    bid: 46500, bidLabel: "₹46,500", time: "Ends Sun 3:30 AM IST",
    badge: "New", status: "new",
    description: "Fine art print on archival paper, limited edition 1 of 10. Signed and framed. Mumbai cityscape at golden hour.",
    avgRating: 4.5,
    reviews: [
      { id: 1, name: "Priya S.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80", rating: 5, date: "3 days ago", text: "The golden hour light in this shot is breathtaking. Incredible eye for geometry." },
      { id: 2, name: "Vikram R.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", rating: 4, date: "1 week ago", text: "Print quality is superb. Framing is gallery-level." },
    ],
  },
  {
    id: 6, img: artCeramicForm, title: "Ceramic Form III", creator: "Suki Amore",
    creatorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80",
    category: "Sculpture & Ceramics", categorySlug: "sculpture",
    bid: 145000, bidLabel: "₹1,45,000", time: "Ends 2:10 AM IST",
    badge: "Exclusive", badgeColor: "bg-secondary", status: "ending-soon",
    description: "Hand-thrown stoneware with natural ash glaze. One of a kind. Height 28cm, fired at 1280°C.",
    avgRating: 4.9,
    reviews: [
      { id: 1, name: "Meera J.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80", rating: 5, date: "1 day ago", text: "Suki's ceramics are museum-quality. The glaze work is mesmerizing." },
      { id: 2, name: "Ananya R.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80", rating: 5, date: "4 days ago", text: "One of the most beautiful ceramic pieces I've ever seen. Worth every rupee." },
      { id: 3, name: "Dev T.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80", rating: 5, date: "1 week ago", text: "Organic and elegant. A real conversation starter in any room." },
    ],
  },
  {
    id: 5, img: artSolitudePrint, title: "Solitude — Fine Art Print", creator: "Nadia Osei",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80",
    category: "Photography", categorySlug: "photography",
    bid: 74000, bidLabel: "₹74,000", time: "Ends Sat 11:00 PM IST",
    badge: "", status: "new",
    description: "Moody long-exposure photograph from the Sahyadri hills. Edition 3 of 5. Printed on Hahnemühle paper.",
    avgRating: 4.6,
    reviews: [
      { id: 1, name: "Kiran L.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", rating: 5, date: "2 days ago", text: "The mood in this photograph is hauntingly beautiful. A real collector's piece." },
      { id: 2, name: "Neha P.", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80", rating: 4, date: "6 days ago", text: "Stunning atmospheric quality. The paper choice is perfect." },
    ],
  },
  {
    id: 4, img: artNeonGarden, title: "Neon Garden — Digital", creator: "Remy Blaze",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
    category: "Digital Art & Illustration", categorySlug: "digital",
    bid: 265000, bidLabel: "₹2,65,000", time: "Ends Sat 6:30 AM IST",
    badge: "🔥 Hot", status: "ending-soon",
    description: "High resolution digital artwork, printed on brushed aluminium. 60×80cm. Comes with NFT certificate.",
    avgRating: 4.7,
    reviews: [
      { id: 1, name: "Aisha K.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80", rating: 5, date: "1 day ago", text: "The neon colors pop like nothing else. This piece transforms a room." },
      { id: 2, name: "Sameer D.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80", rating: 4, date: "3 days ago", text: "Great digital art on a premium aluminium print. Very modern." },
    ],
  },
  {
    id: 3, img: artWovenMemory, title: "Woven Memory Piece", creator: "Suki Amore",
    creatorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80",
    category: "Textile & Fiber Art", categorySlug: "textile",
    bid: 35000, bidLabel: "₹35,000", time: "Ends 4 days",
    badge: "", status: "new",
    description: "Hand-woven textile using natural dyes and silk thread. Framed under UV glass. 50×70cm.",
    avgRating: 4.4,
    reviews: [
      { id: 1, name: "Tara N.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80", rating: 5, date: "5 days ago", text: "The craftsmanship is extraordinary. You can feel the hours of dedication." },
      { id: 2, name: "Raj V.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", rating: 4, date: "1 week ago", text: "Beautiful earthy tones. The natural dyes give it such warmth." },
    ],
  },
  {
    id: 2, img: artCoastalReverie, title: "Coastal Reverie — Oil", creator: "Maya Chen",
    creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
    category: "Painting & Mixed Media", categorySlug: "painting",
    bid: 120000, bidLabel: "₹1,20,000", time: "Ends Tomorrow",
    badge: "New", status: "new",
    description: "Impressionist oil painting of a dramatic coastline. Bold brushwork captures crashing waves. 80×100cm on stretched canvas.",
    avgRating: 4.7,
    reviews: [
      { id: 1, name: "Lakshmi G.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80", rating: 5, date: "2 days ago", text: "Maya's brushwork in this is incredible. You can almost hear the waves." },
      { id: 2, name: "Amit S.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80", rating: 4, date: "4 days ago", text: "Warm and evocative. The golden tones are mesmerizing." },
    ],
  },
  {
    id: 1, img: artBronzeHorizon, title: "Bronze Horizon Sculpture", creator: "Liam Torres",
    creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
    category: "Sculpture & Ceramics", categorySlug: "sculpture",
    bid: 88000, bidLabel: "₹88,000", time: "Ends 3 days",
    badge: "", status: "new",
    description: "Modern abstract bronze sculpture on marble base. Polished with natural patina. 35cm height.",
    avgRating: 4.5,
    reviews: [
      { id: 1, name: "Diya R.", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80", rating: 5, date: "3 days ago", text: "The curves of this sculpture are absolutely elegant. A standout piece." },
      { id: 2, name: "Rohan M.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", rating: 4, date: "1 week ago", text: "Beautiful craftsmanship. The marble base adds a premium touch." },
    ],
  },
];
