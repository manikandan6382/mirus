"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, Heart, MessageCircle } from "lucide-react";
import { formatINR, whatsappLink } from "../lib/products";
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
  priority?: boolean;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  collection,
  isNew,
}: ProductCardProps) {
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const isWishlisted = useAppStore((state) => state.isWishlisted(id));
  const openQuickView = useAppStore((state) => state.openQuickView);

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
      <div className="relative mb-4 aspect-[3/4.25] overflow-hidden rounded-[28px] bg-muted shadow-[0_22px_60px_-44px_rgba(0,0,0,0.5)]">
        <Link href={`/product/${id}`} aria-label={`View ${name}`} className="absolute inset-0 z-10" />
        <div className="image-sheen absolute inset-0">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            loading="lazy"
            className="object-cover transition duration-1000 ease-out group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute left-3 top-3 z-20 flex items-center gap-2">
          {isNew && (
            <span className="rounded-full bg-white px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-black">
              New
            </span>
          )}
          <span className="rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-white backdrop-blur-md">
            {category}
          </span>
        </div>
        <button
          aria-label={`Save ${name}`}
          onClick={() => toggleWishlist(id)}
          className={cn(
            "absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-105",
            isWishlisted && "border-accent bg-accent text-accent-foreground",
          )}
        >
          <motion.span animate={isWishlisted ? { scale: [1, 1.28, 1] } : { scale: 1 }} transition={{ duration: 0.35 }}>
            <Heart size={17} strokeWidth={1.5} fill={isWishlisted ? "currentColor" : "none"} />
          </motion.span>
        </button>
        <div className="absolute inset-x-3 bottom-3 z-20 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => openQuickView(id)}
              className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-black"
            >
              <Eye size={14} />
              Quick
            </button>
            <a
              href={`${whatsappLink}?text=I%20want%20to%20order%20${encodeURIComponent(name)}`}
              className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/30 bg-black/35 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-md"
            >
              <MessageCircle size={14} />
              Order
            </a>
          </div>
        </div>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{collection}</p>
          <Link href={`/product/${id}`} className="font-serif text-lg leading-tight transition-colors hover:text-accent md:text-xl">
            {name}
          </Link>
        </div>
        <p className="whitespace-nowrap text-sm tracking-wide">{formatINR(price)}</p>
      </div>
    </motion.article>
  );
}
