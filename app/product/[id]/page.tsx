"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, MessageCircle, Phone, Ruler, ShieldCheck, Star, Truck, X } from "lucide-react";
import ProductCard from "../../components/product-card";
import { formatINR, getWhatsAppOrderUrl, type Product } from "../../lib/products";
import { useAppStore } from "../../lib/store";
import { cn } from "../../lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const products = useAppStore((state) => state.products);
  const hiddenProductIds = useAppStore((state) => state.hiddenProductIds);
  const settings = useAppStore((state) => state.settings);
  const addRecentlyViewed = useAppStore((state) => state.addRecentlyViewed);

  const product = useMemo(
    () => products.find((p) => p.id === id) || products[0],
    [products, id]
  );

  const [activeImage, setActiveImage] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("fabric");
  const [selection, setSelection] = useState({
    productId: product.id,
    size: product.sizes[0] || "Standard",
    color: product.colors[0]?.name || "Default",
  });
  const [loading, setLoading] = useState(true);

  const selectedSize = selection.productId === product.id ? selection.size : product.sizes[0] || "Standard";
  const selectedColor = selection.productId === product.id ? selection.color : product.colors[0]?.name || "Default";

  useEffect(() => {
    addRecentlyViewed(product.id);
    const timer = window.setTimeout(() => setLoading(false), 300);
    return () => window.clearTimeout(timer);
  }, [addRecentlyViewed, product]);

  const related = useMemo(
    () => products.filter((item) => !hiddenProductIds.includes(item.id) && item.id !== product.id && (item.category === product.category || item.tags.some((tag) => product.tags.includes(tag)))).slice(0, 4),
    [products, hiddenProductIds, product],
  );

  const orderUrl = getWhatsAppOrderUrl(product, selectedSize, selectedColor, settings.whatsappPhone);

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
      <div className="mx-auto max-w-[1500px]">
        <Link href="/shop" className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-full border bg-card px-5 text-xs uppercase tracking-[0.22em] text-muted-foreground hover:border-accent transition-colors font-medium">
          <ArrowLeft size={15} />
          Back to Shop
        </Link>

        <section className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14">
          {/* Gallery View */}
          <div>
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) goImage(1);
                if (info.offset.x > 80) goImage(-1);
              }}
              onClick={() => setPreviewOpen(true)}
              className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-[36px] bg-muted border shadow-lg"
            >
              <AnimatePresence mode="wait">
                <motion.div key={product.gallery[activeImage] || product.image} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.45 }} className="absolute inset-0">
                  <Image src={product.gallery[activeImage] || product.image} alt={product.name} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
              
              {/* Pagination Dots */}
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                {product.gallery.map((image, index) => (
                  <button
                    key={image}
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveImage(index);
                    }}
                    aria-label={`Show image ${index + 1}`}
                    className={cn("h-2 rounded-full bg-white/50 transition-all", activeImage === index ? "w-8 bg-white" : "w-2")}
                  />
                ))}
              </div>
              <button onClick={(event) => { event.stopPropagation(); goImage(-1); }} className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black md:flex shadow-md" aria-label="Previous image">
                <ChevronLeft size={18} />
              </button>
              <button onClick={(event) => { event.stopPropagation(); goImage(1); }} className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black md:flex shadow-md" aria-label="Next image">
                <ChevronRight size={18} />
              </button>
            </motion.div>

            {/* Thumbnail Carousel */}
            <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto">
              {product.gallery.map((image, index) => (
                <button key={image} onClick={() => setActiveImage(index)} className={cn("relative h-24 min-w-20 overflow-hidden rounded-2xl border bg-muted opacity-55 transition-opacity", activeImage === index && "opacity-100 ring-2 ring-accent")}>
                  <Image src={image} alt="" fill sizes="72px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Ordering */}
          <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-accent font-semibold">{product.collection}</p>
              <h1 className="mt-2 font-serif text-5xl leading-[0.94] md:text-7xl">{product.name}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <p className="text-3xl font-medium">{formatINR(product.price)}</p>
                <span className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${product.stock > 0 ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Sold Out"}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star size={15} fill="currentColor" className="text-accent" />
                  {product.rating} ({product.reviewCount} client reviews)
                </span>
              </div>
              <p className="mt-5 leading-8 text-muted-foreground text-sm md:text-base">{product.description}</p>
            </div>

            {/* Size & Color Selection Box */}
            <div className="luxury-card p-6 space-y-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.24em] font-semibold">Select Size</p>
                  <button onClick={() => setSizeGuideOpen(true)} className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-accent font-medium hover:underline">
                    <Ruler size={14} />
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelection((current) => ({ ...current, productId: product.id, size }))} className={cn("min-h-11 rounded-full border px-5 text-xs font-medium transition-all", selectedSize === size && "border-accent bg-accent text-accent-foreground font-semibold shadow-md")}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.24em] font-semibold">Select Colour</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button key={color.name} onClick={() => setSelection((current) => ({ ...current, productId: product.id, color: color.name }))} className={cn("flex min-h-11 items-center gap-2 rounded-full border px-4 text-xs font-medium transition-all", selectedColor === color.name && "border-accent text-accent font-semibold")}>
                      <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: color.value }} />
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden grid-cols-2 gap-3 sm:grid">
              <a href={orderUrl} target="_blank" className="magnetic-button flex min-h-14 items-center justify-center gap-2 rounded-full bg-accent px-6 text-[11px] uppercase tracking-[0.22em] text-accent-foreground font-semibold shadow-lg">
                <MessageCircle size={16} />
                Order on WhatsApp
              </a>
              <a href={`tel:${settings.ownerPhone}`} className="flex min-h-14 items-center justify-center gap-2 rounded-full border px-6 text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-muted">
                <Phone size={16} />
                Call Store ({settings.ownerDisplayPhone})
              </a>
            </div>

            {/* Accordion Policy Sections */}
            <div className="luxury-card overflow-hidden divide-y text-sm">
              {[
                { id: "fabric", title: "Fabric & Material", body: product.material },
                { id: "care", title: "Care Instructions", body: product.care },
                { id: "shipping", title: "Door Delivery & Orders", body: "MERASH manual door delivery service is arranged after phone/WhatsApp confirmation. No credit card checkout or payment gateway required." },
              ].map((acc) => (
                <div key={acc.id} className="p-5">
                  <button onClick={() => setActiveAccordion(activeAccordion === acc.id ? null : acc.id)} className="flex w-full items-center justify-between font-serif text-xl">
                    {acc.title}
                    <ChevronDown size={18} className={cn("transition-transform", activeAccordion === acc.id && "rotate-180")} />
                  </button>
                  {activeAccordion === acc.id && (
                    <p className="mt-3 text-xs leading-6 text-muted-foreground">{acc.body}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Similar Products */}
        <section className="mt-20 border-t pt-16">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-accent font-semibold">Similar Pieces</p>
              <h2 className="font-serif text-4xl md:text-6xl">Complete the wardrobe.</h2>
            </div>
            <Link href="/shop" className="hidden text-[10px] uppercase tracking-[0.24em] text-muted-foreground hover:text-accent md:block font-medium">View Catalog →</Link>
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

      {/* Mobile Fixed CTA Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-2 gap-3">
          <a href={orderUrl} target="_blank" className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-accent text-xs uppercase tracking-[0.2em] text-accent-foreground font-semibold">
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <a href={`tel:${settings.ownerPhone}`} className="flex min-h-14 items-center justify-center gap-2 rounded-full border text-xs uppercase tracking-[0.2em] font-medium">
            <Phone size={16} />
            Call Store
          </a>
        </div>
      </div>

      <ImagePreview open={previewOpen} onClose={() => setPreviewOpen(false)} image={product.gallery[activeImage] || product.image} alt={product.name} />
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
        <motion.div className="fixed inset-0 z-[88] flex items-end bg-black/50 backdrop-blur-sm md:items-center md:justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="w-full rounded-t-[36px] bg-background p-6 md:max-w-lg md:rounded-[36px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-foreground/15 md:hidden" />
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-3xl">Size Measurement Guide</h2>
              <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border" aria-label="Close size guide">
                <X size={17} />
              </button>
            </div>
            <div className="mt-6 overflow-hidden rounded-3xl border">
              {[
                ["Size", "Chest (in)", "Waist (in)"],
                ["S", "36 - 38", "30 - 32"],
                ["M", "38 - 40", "32 - 34"],
                ["L", "40 - 42", "34 - 36"],
                ["XL", "42 - 44", "36 - 38"],
                ["XXL", "44 - 46", "38 - 40"],
              ].map((row, idx) => (
                <div key={row.join("-")} className={`grid grid-cols-3 border-b last:border-b-0 ${idx === 0 ? "bg-muted font-semibold text-xs uppercase" : "text-sm"}`}>
                  {row.map((cell) => (
                    <span key={cell} className="p-4">
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
