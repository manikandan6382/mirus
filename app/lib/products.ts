export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  collection: string;
  tags: string[];
  image: string;
  gallery: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
  material: string;
  care: string;
  description: string;
  details: string[];
  sizes: string[];
  colors: { name: string; value: string }[];
};

export const ownerPhone = "+919876543210";
export const ownerDisplayPhone = "+91 98765 43210";
export const whatsappLink = `https://wa.me/${ownerPhone.replace("+", "")}`;

export const formatINR = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export const products: Product[] = [
  {
    id: "banaras-silk-drape",
    name: "Banaras Silk Drape Dress",
    price: 2999,
    category: "Women",
    collection: "Atelier Evening",
    tags: ["Ethnic", "Premium Wear", "New Arrivals"],
    image:
      "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=1200&auto=format&fit=crop",
    ],
    isNew: true,
    isFeatured: true,
    isTrending: true,
    stock: 8,
    rating: 4.9,
    reviewCount: 42,
    material: "Premium silk blend",
    care: "Dry clean recommended. Steam gently on reverse.",
    description:
      "A sculpted silk dress inspired by Indian festive evenings, built with a soft drape, fluid fall, and a refined occasion silhouette.",
    details: ["Premium silk blend", "Draped waist detail", "Concealed side zip", "Dry clean recommended"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Saffron Noir", value: "#b75a24" },
      { name: "Ivory Gold", value: "#e7dac0" },
      { name: "Black", value: "#111111" },
    ],
  },
  {
    id: "merash-nehru-jacket",
    name: "MERASH Nehru Jacket",
    price: 2499,
    category: "Men",
    collection: "Modern Heritage",
    tags: ["Ethnic", "Premium Wear", "Festive Edit"],
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?q=80&w=1200&auto=format&fit=crop",
    ],
    isFeatured: true,
    isTrending: true,
    stock: 11,
    rating: 4.8,
    reviewCount: 31,
    material: "Textured suiting fabric with soft lining",
    care: "Dry clean only. Hang on a broad hanger.",
    description:
      "A sharply tailored Nehru jacket with a clean band collar, structured shoulder, and versatile finish for weddings, dinners, and elevated daily wear.",
    details: ["Textured suiting fabric", "Band collar", "Horn-style buttons", "Lined interior"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Charcoal", value: "#333333" },
      { name: "Oat", value: "#c9b89c" },
      { name: "Midnight", value: "#0f1a2d" },
    ],
  },
  {
    id: "linen-resort-kurta",
    name: "Linen Resort Kurta",
    price: 1499,
    category: "Unisex",
    collection: "Resort India",
    tags: ["Casual", "Premium Wear", "Ethnic"],
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
    ],
    isNew: true,
    stock: 16,
    rating: 4.7,
    reviewCount: 28,
    material: "Washed linen blend",
    care: "Machine wash cold. Dry in shade.",
    description:
      "A breathable linen kurta cut with a relaxed luxury proportion, finished for warm-weather rituals, holidays, and refined city dressing.",
    details: ["Washed linen blend", "Side pockets", "Relaxed straight fit", "Machine wash cold"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "White", value: "#f8f8f2" },
      { name: "Sage", value: "#8e9a83" },
      { name: "Ink", value: "#1f2732" },
    ],
  },
  {
    id: "organza-festive-saree",
    name: "Organza Festive Saree",
    price: 2999,
    category: "Women",
    collection: "Celebration Edit",
    tags: ["Ethnic", "Premium Wear", "Festive Edit"],
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-24c7e20edc9d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
    ],
    isFeatured: true,
    stock: 6,
    rating: 4.9,
    reviewCount: 37,
    material: "Lightweight organza with fine zari border",
    care: "Steam gently. Store folded in a muslin bag.",
    description:
      "A luminous organza saree with a soft translucent body and fine festive border, selected for evening ceremonies and intimate celebrations.",
    details: ["Lightweight organza", "Includes blouse fabric", "Fine zari border", "Steam gently"],
    sizes: ["Free Size"],
    colors: [
      { name: "Rose Gold", value: "#d7a293" },
      { name: "Pearl", value: "#f0ebe2" },
      { name: "Teal", value: "#1c6766" },
    ],
  },
  {
    id: "tailored-coord-set",
    name: "Tailored Co-Ord Set",
    price: 1999,
    category: "Women",
    collection: "City Uniform",
    tags: ["Workwear", "Casual", "Premium Wear"],
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop",
    ],
    isTrending: true,
    stock: 14,
    rating: 4.8,
    reviewCount: 24,
    material: "Structured viscose blend",
    care: "Dry clean preferred. Iron on low heat.",
    description:
      "A precise co-ord set with architectural lines and day-to-evening polish, designed for wardrobes that move between office, lounge, and dinner.",
    details: ["Structured fabric", "Wide-leg trouser", "Relaxed blazer top", "Two-piece set"],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Stone", value: "#c9c1b3" },
      { name: "Black", value: "#111111" },
      { name: "Olive", value: "#6f7356" },
    ],
  },
  {
    id: "handwoven-dupatta",
    name: "Handwoven Statement Dupatta",
    price: 999,
    category: "Accessories",
    collection: "Finishing Notes",
    tags: ["Ethnic", "Premium Wear"],
    image:
      "https://images.unsplash.com/photo-1601924638867-3ec6bbcb27ab?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1601924638867-3ec6bbcb27ab?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618677603544-51162346e165?q=80&w=1200&auto=format&fit=crop",
    ],
    isNew: true,
    stock: 22,
    rating: 4.6,
    reviewCount: 19,
    material: "Handwoven soft-touch fabric with zari accent",
    care: "Store folded. Avoid direct perfume contact.",
    description:
      "A handwoven dupatta with a rich border and tactile finish, made to transform simple kurtas, sarees, and evening separates.",
    details: ["Handwoven texture", "Soft zari accent", "Lightweight fall", "Store folded"],
    sizes: ["Free Size"],
    colors: [
      { name: "Marigold", value: "#d97706" },
      { name: "Wine", value: "#6d1f2a" },
      { name: "Emerald", value: "#0f5c4a" },
    ],
  },
  {
    id: "premium-oxford-shirt",
    name: "Premium Oxford Shirt",
    price: 1299,
    category: "Men",
    collection: "Premium Shirts",
    tags: ["Shirts", "Workwear", "Premium Wear"],
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1200&auto=format&fit=crop",
    ],
    isFeatured: true,
    stock: 20,
    rating: 4.7,
    reviewCount: 35,
    material: "Cotton oxford weave",
    care: "Machine wash cold. Iron while slightly damp.",
    description:
      "A crisp oxford shirt with premium structure, cut for polished workdays, dinners, and smart casual layering.",
    details: ["Cotton oxford", "Button-down collar", "Curved hem", "Regular fit"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", value: "#f8f8f8" },
      { name: "Sky", value: "#b9d5ea" },
      { name: "Graphite", value: "#424242" },
    ],
  },
  {
    id: "elevated-cotton-tshirt",
    name: "Elevated Cotton T-Shirt",
    price: 799,
    category: "Unisex",
    collection: "Urban Essentials",
    tags: ["T-Shirts", "Casual", "New Arrivals"],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=1200&auto=format&fit=crop",
    ],
    isNew: true,
    isTrending: true,
    stock: 30,
    rating: 4.6,
    reviewCount: 51,
    material: "Heavyweight combed cotton",
    care: "Machine wash inside out. Do not bleach.",
    description:
      "A dense, soft T-shirt with a refined neckline and premium hand feel, designed as a wardrobe base layer.",
    details: ["Combed cotton", "Ribbed neck", "Relaxed fit", "Pre-shrunk finish"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Black", value: "#111111" },
      { name: "Ivory", value: "#f3efe7" },
      { name: "Mocha", value: "#7b6254" },
    ],
  },
];

export const categories = ["All", "Men", "Women", "Shirts", "T-Shirts", "Ethnic", "Casual", "Premium Wear", "New Arrivals"];

export const collections = [
  {
    id: "urban-essentials",
    name: "Urban Essentials",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop",
    description: "Clean daily pieces with premium shape, fabric, and finish.",
  },
  {
    id: "festive-edit",
    name: "Festive Edit",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop",
    description: "Occasionwear, zari, silk, and refined Indian celebration silhouettes.",
  },
  {
    id: "workwear",
    name: "Workwear",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1600&auto=format&fit=crop",
    description: "Sharp weekday dressing for meetings, travel, and dinner after work.",
  },
  {
    id: "weekend-casuals",
    name: "Weekend Casuals",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
    description: "Relaxed, breathable, and polished pieces for slower days.",
  },
  {
    id: "premium-shirts",
    name: "Premium Shirts",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1600&auto=format&fit=crop",
    description: "Crisp shirting with clean collars, premium weaves, and lasting structure.",
  },
];

export const getProduct = (id: string, productList: Product[] = products) =>
  productList.find((product) => product.id === id);

export const matchesCategory = (product: Product, category: string) =>
  category === "All" ||
  product.category === category ||
  product.tags.includes(category) ||
  (category === "New Arrivals" && Boolean(product.isNew));

export const getWhatsAppOrderUrl = (
  product: Product,
  size: string,
  color: string,
  phone: string = ownerPhone,
) => {
  const cleanPhone = phone.replace(/[^\d]/g, "");
  const message = `Hi, I want to order this MERASH product:\nProduct: ${product.name}\nSize: ${size}\nColor: ${color}\nPrice: ${formatINR(product.price)}\nPlease share delivery details.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

