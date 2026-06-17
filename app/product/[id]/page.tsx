"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, Phone, Ruler, ShieldCheck, Star, Truck, X } from "lucide-react";
import ProductCard from "../../components/product-card";
import { formatINR, getProduct, getWhatsAppOrderUrl, ownerPhone, products } from "../../lib/products";
import { useAppStore } from "../../lib/store";
import { cn } from "../../lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProduct(id) ?? products[0];
  const addRecentlyViewed = useAppStore((state) => state.addRecentlyViewed);
  const [activeImage, setActiveImage] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [selection, setSelection] = useState({
    productId: product.id,
    size: product.sizes[0],
    color: product.colors[0].name,
  });
  const [loading, setLoading] = useState(true);
  const selectedSize = selection.productId === product.id ? selection.size : product.sizes[0];
  const selectedColor = selection.productId === product.id ? selection.color : product.colors[0].name;

  useEffect(() => {
    addRecentlyViewed(product.id);
    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, [addRecentlyViewed, product]);

  const related = useMemo(
    () => products.filter((item) => item.id !== product.id && (item.category === product.category || item.tags.some((tag) => product.tags.includes(tag)))).slice(0, 4),
    [product],
  );

  const orderUrl = getWhatsAppOrderUrl(product, selectedSize, selectedColor);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.gallery,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "MIRUS",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  const goImage = (direction: number) => {
    setActiveImage((current) => (current + direction + product.gallery.length) % product.gallery.length);
  };

  if (loading) {
    return (
      <div className="app-screen min-h-screen bg-background px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-2">
          <div className="skeleton aspect-[4/5] rounded-[32px]" />
          <div className="space-y-5">
            <div className="skeleton h-5 w-32 rounded-full" />
            <div className="skeleton h-16 w-3/4 rounded-3xl" />
            <div className="skeleton h-6 w-28 rounded-full" />
            <div className="skeleton h-28 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-screen min-h-screen bg-background px-5 pb-28 pt-28 md:px-8 md:pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="mx-auto max-w-[1500px]">
        <Link href="/shop" className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-full border bg-card px-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          <ArrowLeft size={15} />
          Shop
        </Link>

        <section className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14">
          <div>
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) goImage(1);
                if (info.offset.x > 80) goImage(-1);
              }}
              onClick={() => setPreviewOpen(true)}
              className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-[34px] bg-muted"
            >
              <AnimatePresence mode="wait">
                <motion.div key={product.gallery[activeImage]} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.45 }} className="absolute inset-0">
                  <Image src={product.gallery[activeImage]} alt={product.name} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                {product.gallery.map((image, index) => (
                  <button
                    key={image}
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveImage(index);
                    }}
                    aria-label={`Show product image ${index + 1}`}
                    className={cn("h-2.5 rounded-full bg-white/50 transition-all", activeImage === index ? "w-9 bg-white" : "w-2.5")}
                  />
                ))}
              </div>
              <button onClick={(event) => { event.stopPropagation(); goImage(-1); }} className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black md:flex" aria-label="Previous image">
                <ChevronLeft size={18} />
              </button>
              <button onClick={(event) => { event.stopPropagation(); goImage(1); }} className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black md:flex" aria-label="Next image">
                <ChevronRight size={18} />
              </button>
            </motion.div>
            <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto">
              {product.gallery.map((image, index) => (
                <button key={image} onClick={() => setActiveImage(index)} className={cn("relative h-24 min-w-20 overflow-hidden rounded-2xl border bg-muted opacity-55", activeImage === index && "opacity-100 ring-2 ring-accent")}>
                  <Image src={image} alt="" fill sizes="72px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-accent">{product.collection}</p>
            <h1 className="font-serif text-5xl leading-[0.92] md:text-7xl">{product.name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <p className="text-2xl">{formatINR(product.price)}</p>
              <span className="rounded-full bg-accent/12 px-4 py-2 text-sm text-accent">{product.stock > 0 ? `${product.stock} in stock` : "Unavailable"}</span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star size={15} fill="currentColor" className="text-accent" />
                {product.rating} ({product.reviewCount})
              </span>
            </div>
            <p className="mt-6 leading-8 text-muted-foreground">{product.description}</p>

            <div className="mt-8 space-y-7 rounded-[32px] border bg-card p-5 md:p-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.24em]">Size</p>
                  <button onClick={() => setSizeGuideOpen(true)} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <Ruler size={14} />
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelection((current) => ({ ...current, productId: product.id, size }))} className={cn("min-h-11 rounded-full border px-5 text-sm", selectedSize === size && "border-accent bg-accent text-accent-foreground")}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.24em]">Color</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button key={color.name} onClick={() => setSelection((current) => ({ ...current, productId: product.id, color: color.name }))} className={cn("flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm", selectedColor === color.name && "border-accent text-accent")}>
                      <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: color.value }} />
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a href={orderUrl} className="hidden min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[11px] uppercase tracking-[0.22em] text-primary-foreground md:flex">
                <MessageCircle size={16} />
                Order on WhatsApp
              </a>
              <a href={`tel:${ownerPhone}`} className="hidden min-h-14 items-center justify-center gap-2 rounded-full border px-6 text-[11px] uppercase tracking-[0.22em] md:flex">
                <Phone size={16} />
                Call to Order
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { title: "Delivery Information", body: "Door delivery after manual confirmation.", icon: Truck },
                { title: "No Online Payment", body: "No UPI, card, or checkout gateway in this flow.", icon: ShieldCheck },
                { title: "Fabric", body: product.material, icon: Ruler },
                { title: "Care", body: product.care, icon: SparkIcon },
              ].map((item) => (
                <div key={item.title} className="rounded-[24px] border bg-card p-5">
                  <item.icon className="mb-5 text-accent" size={20} strokeWidth={1.4} />
                  <p className="text-[10px] uppercase tracking-[0.22em]">{item.title}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-accent">Reviews</p>
            <h2 className="font-serif text-4xl">Rating breakdown</h2>
          </div>
          <div className="rounded-[32px] border bg-card p-6">
            {[5, 4, 3].map((stars, index) => (
              <div key={stars} className="mb-4 grid grid-cols-[40px_1fr_40px] items-center gap-3 text-sm">
                <span>{stars}★</span>
                <span className="h-2 overflow-hidden rounded-full bg-muted">
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${84 - index * 20}%` }} />
                </span>
                <span className="text-muted-foreground">{84 - index * 20}%</span>
              </div>
            ))}
            <p className="mt-6 font-serif text-2xl">&ldquo;Premium quality and very easy to confirm over WhatsApp.&rdquo;</p>
            <p className="mt-3 text-sm text-muted-foreground">Verified MIRUS client</p>
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-accent">Similar Products</p>
              <h2 className="font-serif text-4xl md:text-6xl">Continue browsing.</h2>
            </div>
            <Link href="/shop" className="hidden text-[10px] uppercase tracking-[0.24em] text-muted-foreground md:block">View all</Link>
          </div>
          <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-4">
            {related.map((item) => (
              <div key={item.id} className="min-w-[74vw] snap-start sm:min-w-[330px] lg:min-w-[300px]">
                <ProductCard {...item} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/94 p-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-2 gap-3">
          <a href={orderUrl} className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary text-xs uppercase tracking-[0.2em] text-primary-foreground">
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <a href={`tel:${ownerPhone}`} className="flex min-h-14 items-center justify-center gap-2 rounded-full border text-xs uppercase tracking-[0.2em]">
            <Phone size={16} />
            Call
          </a>
        </div>
      </div>

      <ImagePreview open={previewOpen} onClose={() => setPreviewOpen(false)} image={product.gallery[activeImage]} alt={product.name} />
      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}

function ImagePreview({ open, onClose, image, alt }: { open: boolean; onClose: () => void; image: string; alt: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-black p-4" onClick={onClose}>
          <button aria-label="Close image preview" className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur" onClick={onClose}>
            <X size={20} />
          </button>
          <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} className="relative h-full w-full cursor-zoom-out">
            <Image src={image} alt={alt} fill sizes="100vw" className="object-contain" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SizeGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[88] flex items-end bg-black/45 backdrop-blur-sm md:items-center md:justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="w-full rounded-t-[32px] bg-background p-6 md:max-w-lg md:rounded-[32px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-foreground/15 md:hidden" />
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-3xl">Size guide</h2>
              <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full border" aria-label="Close size guide">
                <X size={17} />
              </button>
            </div>
            <div className="mt-6 overflow-hidden rounded-3xl border">
              {[
                ["Size", "Chest", "Waist"],
                ["S", "36-38", "30-32"],
                ["M", "38-40", "32-34"],
                ["L", "40-42", "34-36"],
                ["XL", "42-44", "36-38"],
              ].map((row) => (
                <div key={row.join("-")} className="grid grid-cols-3 border-b last:border-b-0">
                  {row.map((cell) => (
                    <span key={cell} className="p-4 text-sm">
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SparkIcon(props: { className?: string; size?: number; strokeWidth?: number }) {
  return <Star {...props} />;
}
