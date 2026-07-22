"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HeartHandshake,
  MessageCircle,
  Phone,
  Shirt,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import Hero from "./components/hero";
import ProductCard from "./components/product-card";
import { categories, collections, formatINR } from "./lib/products";
import { useAppStore } from "./lib/store";

const trustCards = [
  { title: "Door Delivery", body: "Manual owner confirmation before dispatch.", icon: Truck },
  { title: "Curated Luxury Fabrics", body: "Handpicked silks, organza, linen, and suiting.", icon: Shirt },
  { title: "Direct Owner Consultation", body: "Speak directly with MERASH before ordering.", icon: HeartHandshake },
  { title: "Personal WhatsApp Ordering", body: "Confirm size, colour, and delivery in one message.", icon: MessageCircle },
  { title: "Editorial Drops", body: "Focused seasonal edits without endless noise.", icon: Sparkles },
];

const reviews = [
  ["Aarohi Mehta", "The concierged ordering flow feels incredibly personal. I confirmed sizing on WhatsApp in minutes and received my drape dress right at my door."],
  ["Rohan Kapoor", "The Nehru jacket craftsmanship was superb. MERASH feels curated like an exclusive private atelier, not crowded."],
  ["Naina Rao", "Loved the festive edit and direct owner assistance. No checkout forms, no hassle."],
];

function ProductSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="skeleton aspect-[3/4.25] rounded-[28px]" />
          <div className="skeleton h-3 w-24 rounded-full" />
          <div className="skeleton h-5 w-36 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [loadingProducts, setLoadingProducts] = useState(true);
  const products = useAppStore((state) => state.products);
  const hiddenProductIds = useAppStore((state) => state.hiddenProductIds);
  const settings = useAppStore((state) => state.settings);

  const visibleProducts = products.filter((p) => !hiddenProductIds.includes(p.id));
  const arrivals = visibleProducts.filter((product) => product.isNew).slice(0, 4);
  const trending = visibleProducts.filter((product) => product.isTrending);

  const cleanPhone = settings.ownerPhone.replace(/[^\d]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}`;

  useEffect(() => {
    const timer = window.setTimeout(() => setLoadingProducts(false), 300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="app-screen overflow-hidden bg-background">
      <Hero />

      {/* Category Pills Bar */}
      <section className="px-5 pt-7 md:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-3">
            {categories.slice(1).map((category, index) => (
              <Link
                key={category}
                href={`/shop?category=${encodeURIComponent(category)}`}
                className={`snap-start rounded-full border px-6 py-3 text-xs uppercase tracking-[0.22em] transition-all font-medium active:scale-95 ${
                  index === 0 ? "border-accent bg-accent text-accent-foreground shadow-md" : "bg-card hover:border-accent hover:text-accent"
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections Section */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div data-reveal className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-accent font-semibold">Featured Collections</p>
              <h2 className="font-serif text-4xl leading-none md:text-7xl">Curated seasonal edits.</h2>
            </div>
            <Link href="/collections" className="hidden text-[10px] uppercase tracking-[0.24em] text-muted-foreground hover:text-accent md:block font-medium">
              View All Collections →
            </Link>
          </div>
          <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-4">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections#${collection.id}`}
                className="group relative min-h-[440px] min-w-[82vw] snap-start overflow-hidden rounded-[36px] bg-muted sm:min-w-[420px] lg:min-w-[31%] border shadow-lg"
              >
                <Image src={collection.image} alt={collection.name} fill sizes="(min-width: 1024px) 31vw, 82vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-accent font-semibold">MERASH Edit</span>
                  <h3 className="font-serif text-4xl mt-1">{collection.name}</h3>
                  <p className="mt-3 text-xs leading-6 text-white/75">{collection.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="bg-surface px-5 py-16 md:px-8 md:py-24 border-y">
        <div className="mx-auto max-w-[1500px]">
          <div data-reveal className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-accent font-semibold">Trending Creations</p>
              <h2 className="font-serif text-4xl leading-none md:text-7xl">Most requested this week.</h2>
            </div>
            <Link href="/shop" className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground hover:text-accent font-medium">
              Shop Catalog →
            </Link>
          </div>
          <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-4">
            {trending.map((product) => (
              <div key={product.id} className="min-w-[74vw] snap-start sm:min-w-[340px] lg:min-w-[310px]">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div data-reveal className="mb-8">
            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-accent font-semibold">New Arrivals</p>
            <h2 className="font-serif text-4xl leading-none md:text-7xl">Fresh Atelier drops.</h2>
          </div>
          {loadingProducts ? (
            <ProductSkeletonGrid />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {arrivals.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp Banner */}
      <section className="px-5 py-6 md:px-8">
        <div data-reveal className="mx-auto max-w-[1500px] overflow-hidden rounded-[36px] bg-primary text-primary-foreground shadow-2xl">
          <div className="grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-accent font-semibold">{settings.bannerText}</p>
              <h2 className="font-serif text-4xl leading-tight md:text-6xl">Order directly with MERASH. No payment checkout.</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={whatsappUrl} target="_blank" className="magnetic-button flex min-h-14 items-center justify-center gap-2 rounded-full bg-accent px-7 text-[11px] uppercase tracking-[0.24em] text-accent-foreground font-semibold">
                <MessageCircle size={16} />
                WhatsApp Order
              </a>
              <a href={`tel:${settings.ownerPhone}`} className="flex min-h-14 items-center justify-center gap-2 rounded-full border border-primary-foreground/30 px-7 text-[11px] uppercase tracking-[0.24em] font-medium hover:bg-white/10">
                <Phone size={16} />
                Call Store ({settings.ownerDisplayPhone})
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div data-reveal className="mb-8">
            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-accent font-semibold">Why Choose MERASH</p>
            <h2 className="font-serif text-4xl leading-none md:text-7xl">Luxury with personal trust.</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {trustCards.map((item) => (
              <motion.div key={item.title} data-reveal whileHover={{ y: -6 }} whileTap={{ scale: 0.98 }} className="luxury-card p-6">
                <item.icon className="mb-8 text-accent" size={26} strokeWidth={1.4} />
                <h3 className="font-serif text-2xl">{item.title}</h3>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lookbook Section */}
      <section className="bg-surface px-5 py-16 md:px-8 md:py-24 border-t">
        <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div data-reveal>
            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-accent font-semibold">Atelier Lookbook</p>
            <h2 className="font-serif text-5xl leading-none md:text-7xl">Editorial perfection.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">
              MERASH uses haute-couture fashion imagery and thumb-friendly discovery to make shopping feel like an exclusive fashion magazine on mobile.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1100&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1100&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1100&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1100&auto=format&fit=crop",
            ].map((image, index) => (
              <div key={image} data-reveal className={`relative overflow-hidden rounded-[30px] bg-muted border ${index % 2 ? "mt-8 aspect-[3/4]" : "aspect-[3/4]"}`}>
                <Image data-parallax src={image} alt="MERASH lookbook editorial" fill sizes="(min-width: 1024px) 28vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div data-reveal className="mb-8">
            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-accent font-semibold">Client Reviews</p>
            <h2 className="font-serif text-4xl leading-none md:text-7xl">Reviewed like a luxury house.</h2>
          </div>
          <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-4">
            {reviews.map(([name, review]) => (
              <div key={name} className="min-w-[82vw] snap-start luxury-card p-7 sm:min-w-[380px]">
                <div className="mb-6 flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="font-serif text-xl leading-8">&ldquo;{review}&rdquo;</p>
                <p className="mt-8 text-[10px] uppercase tracking-[0.24em] text-muted-foreground font-medium">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-5 py-14 md:px-8 bg-card">
        <div className="mx-auto grid max-w-[1500px] gap-10 md:grid-cols-[1fr_auto_auto]">
          <div>
            <h2 className="font-serif text-4xl tracking-[0.26em]">MERASH</h2>
            <p className="mt-4 max-w-md text-xs leading-6 text-muted-foreground">
              Premium Indian clothing with app-like browsing, WhatsApp ordering, call confirmation, and door delivery.
            </p>
          </div>
          <div className="space-y-3 text-xs text-muted-foreground">
            <p className="text-[10px] uppercase tracking-[0.24em] text-foreground font-semibold">Contact</p>
            <a href={`tel:${settings.ownerPhone}`} className="block hover:text-accent">{settings.ownerDisplayPhone}</a>
            <a href={whatsappUrl} target="_blank" className="block hover:text-accent">WhatsApp MERASH</a>
          </div>
          <div className="space-y-3 text-xs text-muted-foreground">
            <p className="text-[10px] uppercase tracking-[0.24em] text-foreground font-semibold">Navigation</p>
            <Link href="/shop" className="block hover:text-accent">Browse Catalog</Link>
            <Link href="/contact" className="block hover:text-accent">Store Enquiry</Link>
            <Link href="/admin" className="block hover:text-accent text-accent font-medium">Admin Portal</Link>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-[1500px] border-t pt-6 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          MERASH 2026. INR pricing only. Door delivery after owner confirmation.
        </div>
      </footer>
    </div>
  );
}
