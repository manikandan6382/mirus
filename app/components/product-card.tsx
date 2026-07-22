"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, Heart, MessageCircle } from "lucide-react";
import { formatINR, getWhatsAppOrderUrl } from "../lib/products";
import { useAppStore } from "../lib/store";
import { cn } from "../lib/utils";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  collection: string;
  isNew?: boolean;
  stock?: number;
  sizes?: string[];
  colors?: { name: string; value: string }[];
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  collection,
  isNew,
  stock = 10,
  sizes = ["S", "M", "L"],
  colors = [{ name: "Default", value: "#111111" }],
}: ProductCardProps) {
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const isWishlisted = useAppStore((state) => state.isWishlisted(id));
  const openQuickView = useAppStore((state) => state.openQuickView);
  const settings = useAppStore((state) => state.settings);

  const isOutOfStock = stock <= 0;
  const orderUrl = getWhatsAppOrderUrl(
    { id, name, price, image, gallery: [image], tags: [category], category, collection, stock, rating: 5, reviewCount: 1, material: "", care: "", description: "", details: [], sizes, colors },
    sizes[0] || "Standard",
    colors[0]?.name || "Default",
    settings.whatsappPhone
  );

  return (
    <motion.article
      data-reveal
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="group relative"
    >
      <div className="relative mb-4 aspect-[3/4.25] overflow-hidden rounded-[30px] bg-muted shadow-[0_22px_60px_-44px_rgba(0,0,0,0.4)] border">
        <Link href={`/product/${id}`} aria-label={`View ${name}`} className="absolute inset-0 z-10" />
        <div className="image-sheen absolute inset-0">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading="lazy"
            className={cn("object-cover transition duration-1000 ease-out group-hover:scale-105", isOutOfStock && "grayscale opacity-75")}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* Badges */}
        <div className="absolute left-3 top-3 z-20 flex flex-wrap items-center gap-1.5">
          {isNew && (
            <span className="rounded-full bg-white px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-black font-semibold shadow-sm">
              New
            </span>
          )}
          {isOutOfStock ? (
            <span className="rounded-full bg-red-600 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-white font-semibold">
              Sold Out
            </span>
          ) : (
            <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-white backdrop-blur-md">
              {category}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          aria-label={`Save ${name}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(id);
          }}
          className={cn(
            "absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-105",
            isWishlisted && "border-accent bg-accent text-accent-foreground",
          )}
        >
          <motion.span animate={isWishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }} transition={{ duration: 0.35 }}>
            <Heart size={16} strokeWidth={1.5} fill={isWishlisted ? "currentColor" : "none"} />
          </motion.span>
        </button>

        {/* Hover Actions */}
        <div className="absolute inset-x-3 bottom-3 z-20 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openQuickView(id);
              }}
              className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-black font-medium shadow-md"
            >
              <Eye size={14} />
              Quick View
            </button>
            <a
              href={orderUrl}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-accent/40 bg-accent px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-accent-foreground font-semibold shadow-md"
            >
              <MessageCircle size={14} />
              Order
            </a>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium">{collection}</p>
          <Link href={`/product/${id}`} className="font-serif text-lg leading-tight transition-colors hover:text-accent md:text-xl">
            {name}
          </Link>
        </div>
        <p className="whitespace-nowrap text-sm font-semibold tracking-wide">{formatINR(price)}</p>
      </div>
    </motion.article>
  );
}
