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
import { categories, collections, ownerDisplayPhone, ownerPhone, products, whatsappLink } from "./lib/products";

const trustCards = [
  { title: "Door Delivery", body: "Manual confirmation before dispatch.", icon: Truck },
  { title: "Quality Fabric", body: "Curated silks, linens, cottons, and tailoring.", icon: Shirt },
  { title: "Direct Owner Support", body: "Speak to MIRUS before ordering.", icon: HeartHandshake },
  { title: "Easy WhatsApp Ordering", body: "Size, colour, and delivery in one message.", icon: MessageCircle },
  { title: "Fresh Collections", body: "Premium edits without clutter.", icon: Sparkles },
];

const reviews = [
  ["Aarohi Mehta", "The app-like ordering flow feels premium and personal. I confirmed sizing on WhatsApp in minutes."],
  ["Rohan Kapoor", "The Nehru jacket quality was excellent. MIRUS feels curated, not crowded."],
  ["Naina Rao", "Loved the festive edit and direct owner support. Door delivery made it effortless."],
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
  const arrivals = products.filter((product) => product.isNew).slice(0, 4);
  const trending = products.filter((product) => product.isTrending);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoadingProducts(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="app-screen overflow-hidden bg-background">
      <Hero />

      <section className="px-5 pt-7 md:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-3">
            {categories.slice(1).map((category, index) => (
              <Link
                key={category}
                href={`/shop?category=${encodeURIComponent(category)}`}
                className={`snap-start rounded-full border px-5 py-3 text-sm transition-transform active:scale-95 ${
                  index === 0 ? "border-accent bg-accent text-accent-foreground" : "bg-card"
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div data-reveal className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-accent">Featured Collections</p>
              <h2 className="font-serif text-4xl leading-none md:text-7xl">Swipe through the edits.</h2>
            </div>
            <Link href="/collections" className="hidden text-[10px] uppercase tracking-[0.24em] text-muted-foreground md:block">
              View all
            </Link>
          </div>
          <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-4">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections#${collection.id}`}
                className="group relative min-h-[430px] min-w-[82vw] snap-start overflow-hidden rounded-[32px] bg-muted sm:min-w-[420px] lg:min-w-[31%]"
              >
                <Image src={collection.image} alt={collection.name} fill sizes="(min-width: 1024px) 31vw, 82vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-serif text-4xl">{collection.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/72">{collection.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div data-reveal className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-accent">Trending Products</p>
              <h2 className="font-serif text-4xl leading-none md:text-7xl">Most requested this week.</h2>
            </div>
            <Link href="/shop" className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Shop all
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

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div data-reveal className="mb-8">
            <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-accent">New Arrivals</p>
            <h2 className="font-serif text-4xl leading-none md:text-7xl">Fresh pieces, fast discovery.</h2>
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

      <section className="px-5 py-6 md:px-8">
        <div data-reveal className="mx-auto max-w-[1500px] overflow-hidden rounded-[32px] bg-primary text-primary-foreground">
          <div className="grid gap-8 p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.28em] opacity-60">Door Delivery Available</p>
              <h2 className="font-serif text-4xl leading-tight md:text-6xl">Order directly on WhatsApp. No payment checkout.</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={whatsappLink} className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-background px-6 text-[11px] uppercase tracking-[0.22em] text-foreground">
                <MessageCircle size={15} />
                WhatsApp
              </a>
              <a href={`tel:${ownerPhone}`} className="flex min-h-14 items-center justify-center gap-2 rounded-full border border-primary-foreground/24 px-6 text-[11px] uppercase tracking-[0.22em]">
                <Phone size={15} />
                Call
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div data-reveal className="mb-8">
            <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-accent">Why Choose MIRUS</p>
            <h2 className="font-serif text-4xl leading-none md:text-7xl">Trust signals without noise.</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {trustCards.map((item) => (
              <motion.div key={item.title} data-reveal whileHover={{ y: -6 }} whileTap={{ scale: 0.98 }} className="rounded-[28px] border bg-card p-6 shadow-[0_18px_60px_-48px_rgba(0,0,0,0.8)]">
                <item.icon className="mb-8 text-accent" size={25} strokeWidth={1.4} />
                <h3 className="font-serif text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[1500px] gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div data-reveal>
            <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-accent">Lookbook</p>
            <h2 className="font-serif text-5xl leading-none md:text-7xl">Editorial, not endless.</h2>
            <p className="mt-6 max-w-md leading-8 text-muted-foreground">
              MIRUS uses fashion photography, quiet cards, and thumb-friendly discovery to make shopping feel polished on mobile.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-5">
            {[
              "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1100&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1100&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1100&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1100&auto=format&fit=crop",
            ].map((image, index) => (
              <div key={image} data-reveal className={`relative overflow-hidden rounded-[28px] bg-muted ${index % 2 ? "mt-10 aspect-[3/4]" : "aspect-[3/4]"}`}>
                <Image data-parallax src={image} alt="MIRUS lookbook editorial" fill sizes="(min-width: 1024px) 28vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1500px]">
          <div data-reveal className="mb-8">
            <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-accent">Testimonials</p>
            <h2 className="font-serif text-4xl leading-none md:text-7xl">Reviewed like a premium app.</h2>
          </div>
          <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-4">
            {reviews.map(([name, review]) => (
              <div key={name} className="min-w-[82vw] snap-start rounded-[28px] border bg-card p-6 sm:min-w-[360px]">
                <div className="mb-8 flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={17} fill="currentColor" />
                  ))}
                </div>
                <p className="font-serif text-2xl leading-9">&ldquo;{review}&rdquo;</p>
                <p className="mt-8 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t px-5 py-12 md:px-8">
        <div className="mx-auto grid max-w-[1500px] gap-10 md:grid-cols-[1fr_auto_auto]">
          <div>
            <h2 className="font-serif text-4xl tracking-[0.26em]">MIRUS</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              Premium Indian clothing with app-like browsing, WhatsApp ordering, call confirmation, and door delivery.
            </p>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="text-[10px] uppercase tracking-[0.24em] text-foreground">Contact</p>
            <a href={`tel:${ownerPhone}`} className="block hover:text-accent">{ownerDisplayPhone}</a>
            <a href={whatsappLink} className="block hover:text-accent">WhatsApp MIRUS</a>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="text-[10px] uppercase tracking-[0.24em] text-foreground">Links</p>
            <Link href="/contact" className="block hover:text-accent">Store Enquiry</Link>
            <Link href="/about" className="block hover:text-accent">Privacy Policy</Link>
            <Link href="/about" className="block hover:text-accent">Terms</Link>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-[1500px] border-t pt-6 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          MIRUS 2026. INR pricing only. No online payment gateway.
        </div>
      </footer>
    </div>
  );
}
