"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2200&auto=format&fit=crop",
    title: "MERASH",
    line: "Premium fashion, ordered like a private app.",
  },
  {
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2200&auto=format&fit=crop",
    title: "New Season Drop",
    line: "Curated Indian clothing with door delivery.",
  },
  {
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2200&auto=format&fit=crop",
    title: "Festive Edit",
    line: "Silk, organza, linen, and tailoring for modern occasions.",
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 4800);
    return () => window.clearInterval(id);
  }, []);

  const slide = slides[active];

  return (
    <section className="relative min-h-[92svh] overflow-hidden rounded-b-[36px] bg-[#090909] text-white md:min-h-screen md:rounded-b-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image src={slide.image} alt={slide.title} fill priority sizes="100vw" className="object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/28 to-black/30" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-[1500px] flex-col justify-end px-5 pb-14 pt-32 md:min-h-screen md:px-8 md:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-balance font-serif text-[20vw] leading-[0.82] tracking-[-0.02em] md:text-[11rem]">
              {slide.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 md:text-2xl md:leading-10">
              {slide.line}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href="/shop?category=New%20Arrivals"
            className="magnetic-button flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 text-[11px] uppercase tracking-[0.24em] text-black"
          >
            Shop New Arrivals
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/collections"
            className="flex min-h-14 items-center justify-center rounded-full border border-white/30 px-7 text-[11px] uppercase tracking-[0.24em] text-white backdrop-blur-md"
          >
            Explore Collections
          </Link>
        </motion.div>

        <div className="mt-10 flex items-center gap-2">
          {slides.map((item, index) => (
            <button
              key={item.title}
              onClick={() => setActive(index)}
              aria-label={`Show ${item.title}`}
              className="relative h-2.5 w-10 overflow-hidden rounded-full bg-white/24"
            >
              {index === active && (
                <motion.span
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 4.6, ease: "linear" }}
                  className="absolute inset-0 rounded-full bg-white"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
