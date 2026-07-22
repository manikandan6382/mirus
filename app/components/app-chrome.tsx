"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  Home,
  MessageCircle,
  Mic,
  Phone,
  Search,
  UserRound,
  X,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import { getProduct, getWhatsAppOrderUrl, type Product } from "../lib/products";
import { useAppStore } from "../lib/store";
import { cn } from "../lib/utils";

const bottomItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Enquiry", href: "/contact", icon: MessageCircle },
  { label: "Profile", href: "/profile", icon: UserRound },
];

export default function AppChrome() {
  return (
    <>
      <OfflineBanner />
      <PullRefreshIndicator />
      <SearchOverlay />
      <QuickViewModal />
      <MobileBottomNav />
    </>
  );
}

function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          className="fixed inset-x-4 top-4 z-[90] mx-auto flex max-w-md items-center justify-between rounded-3xl border bg-background/95 p-3 pl-5 text-sm shadow-2xl backdrop-blur-xl"
        >
          <span>You&apos;re offline. Cached pages remain usable.</span>
          <button onClick={() => window.location.reload()} className="flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-xs text-primary-foreground font-medium">
            <RotateCcw size={14} />
            Retry
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PullRefreshIndicator() {
  const [pull, setPull] = useState(0);
  const [startY, setStartY] = useState<number | null>(null);

  useEffect(() => {
    const onStart = (event: TouchEvent) => {
      if (window.scrollY <= 0) setStartY(event.touches[0].clientY);
    };
    const onMove = (event: TouchEvent) => {
      if (startY === null || window.scrollY > 0) return;
      setPull(Math.min(1, Math.max(0, (event.touches[0].clientY - startY) / 96)));
    };
    const onEnd = () => {
      setPull(0);
      setStartY(null);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [startY]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-1/2 top-3 z-[80] flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border bg-background/85 shadow-xl backdrop-blur-xl transition-opacity md:hidden"
      style={{ opacity: pull, transform: `translate(-50%, ${pull * 18}px) scale(${0.75 + pull * 0.25})` }}
    >
      <RotateCcw size={16} className="text-accent" />
    </div>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();
  const wishlistCount = useAppStore((state) => state.wishlist.length);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 md:hidden">
      <div className="luxury-blur grid grid-cols-5 rounded-[28px] border px-2 py-2 shadow-2xl">
        {bottomItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] text-muted-foreground font-medium"
            >
              {active && (
                <motion.span
                  layoutId="mobile-bottom-active"
                  className="absolute inset-1 rounded-2xl bg-accent/15"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <motion.span whileTap={{ scale: 0.86 }} className={cn("relative", active && "text-accent")}>
                <item.icon size={20} strokeWidth={active ? 2 : 1.5} fill={item.label === "Wishlist" && active ? "currentColor" : "none"} />
              </motion.span>
              <span className={cn("relative", active && "text-foreground font-semibold")}>{item.label}</span>
              {item.label === "Wishlist" && wishlistCount > 0 && (
                <span className="absolute right-4 top-2 min-w-5 rounded-full bg-accent px-1 text-center text-[9px] leading-5 text-accent-foreground font-semibold">
                  {wishlistCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function SearchOverlay() {
  const open = useAppStore((state) => state.searchOpen);
  const closeSearch = useAppStore((state) => state.closeSearch);
  const addRecentSearch = useAppStore((state) => state.addRecentSearch);
  const recentSearches = useAppStore((state) => state.recentSearches);
  const products = useAppStore((state) => state.products);
  const hiddenProductIds = useAppStore((state) => state.hiddenProductIds);
  const [query, setQuery] = useState("");

  const visibleProducts = useMemo(
    () => products.filter((p) => !hiddenProductIds.includes(p.id)),
    [products, hiddenProductIds]
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const normalized = query.toLowerCase();
    return visibleProducts
      .filter((product) => `${product.name} ${product.category} ${product.collection} ${product.tags.join(" ")}`.toLowerCase().includes(normalized))
      .slice(0, 5);
  }, [query, visibleProducts]);

  const popularSearches = ["Premium Shirts", "Ethnic", "T-Shirts", "Festive Edit", "New Arrivals"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] bg-background/96 p-5 backdrop-blur-2xl md:p-8"
        >
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <label className="flex min-h-14 flex-1 items-center gap-3 rounded-full border bg-muted/70 px-5">
                <Search size={19} strokeWidth={1.4} className="text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") addRecentSearch(query);
                  }}
                  placeholder="Search MERASH luxury catalog..."
                  className="min-w-0 flex-1 bg-transparent text-base"
                />
                <Mic size={18} strokeWidth={1.4} className="text-muted-foreground" />
              </label>
              <button onClick={closeSearch} aria-label="Close search" className="flex h-12 w-12 items-center justify-center rounded-full border">
                <X size={18} />
              </button>
            </div>

            <div className="mt-8">
              <p className="mb-4 text-[10px] uppercase tracking-[0.26em] text-muted-foreground font-medium">
                {query ? "Suggestions" : "Popular searches"}
              </p>
              <div className="flex flex-wrap gap-3">
                {(query ? results.map((item) => item.name) : popularSearches).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setQuery(item);
                      addRecentSearch(item);
                    }}
                    className="rounded-full border bg-card px-5 py-3 text-sm hover:border-accent hover:text-accent transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {recentSearches.length > 0 && !query && (
              <div className="mt-9">
                <p className="mb-4 text-[10px] uppercase tracking-[0.26em] text-muted-foreground font-medium">Recent searches</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((item) => (
                    <button key={item} onClick={() => setQuery(item)} className="rounded-full bg-muted px-4 py-2 text-xs text-muted-foreground hover:text-foreground">
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query && (
              <div className="mt-9 space-y-3">
                {results.length > 0 ? (
                  results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={() => {
                        addRecentSearch(query);
                        closeSearch();
                      }}
                      className="flex items-center gap-4 rounded-3xl border bg-card p-3 transition-colors hover:border-accent"
                    >
                      <span className="relative h-20 w-16 overflow-hidden rounded-2xl bg-muted border">
                        <Image src={product.image} alt={product.name} fill sizes="64px" className="object-cover" />
                      </span>
                      <span>
                        <span className="block font-serif text-xl">{product.name}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">{product.collection} · {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product.price)}</span>
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">No pieces match &ldquo;{query}&rdquo;</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QuickViewModal() {
  const quickViewId = useAppStore((state) => state.quickViewId);
  const closeQuickView = useAppStore((state) => state.closeQuickView);
  const products = useAppStore((state) => state.products);
  const product = quickViewId ? getProduct(quickViewId, products) : undefined;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[82] flex items-end bg-black/50 p-3 backdrop-blur-md md:items-center md:justify-center md:p-8"
          onClick={closeQuickView}
        >
          <motion.div
            initial={{ y: 80, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 80, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="max-h-[88vh] w-full overflow-y-auto rounded-t-[32px] bg-background p-5 shadow-2xl md:max-w-3xl md:rounded-[36px] md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <QuickViewContent key={product.id} product={product} closeQuickView={closeQuickView} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QuickViewContent({
  product,
  closeQuickView,
}: {
  product: Product;
  closeQuickView: () => void;
}) {
  const settings = useAppStore((state) => state.settings);
  const [size, setSize] = useState(product.sizes[0] || "Standard");
  const [color, setColor] = useState(product.colors[0]?.name || "Default");

  const orderUrl = getWhatsAppOrderUrl(product, size, color, settings.whatsappPhone);

  return (
    <>
      <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-foreground/14 md:hidden" />
      <div className="grid gap-6 md:grid-cols-[0.85fr_1fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-muted border">
          <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 320px, 100vw" className="object-cover" />
        </div>
        <div className="p-1 md:p-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-accent font-medium">{product.collection}</p>
              <h2 className="mt-2 font-serif text-3xl leading-tight">{product.name}</h2>
              <p className="mt-2 text-xl font-medium">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product.price)}</p>
            </div>
            <button onClick={closeQuickView} aria-label="Close quick view" className="flex h-11 w-11 items-center justify-center rounded-full border">
              <X size={17} />
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{product.description}</p>

          <div className="mt-6">
            <p className="mb-2 text-[10px] uppercase tracking-[0.24em] font-medium">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((item) => (
                <button key={item} onClick={() => setSize(item)} className={cn("min-h-10 rounded-full border px-4 text-xs transition-all", size === item && "border-accent bg-accent text-accent-foreground font-semibold")}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[10px] uppercase tracking-[0.24em] font-medium">Select Colour</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((item) => (
                <button key={item.name} onClick={() => setColor(item.name)} className={cn("flex min-h-10 items-center gap-2 rounded-full border px-4 text-xs transition-all", color === item.name && "border-accent text-accent font-semibold")}>
                  <span className="h-3.5 w-3.5 rounded-full border" style={{ backgroundColor: item.value }} />
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <a href={orderUrl} target="_blank" className="magnetic-button flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-5 text-xs uppercase tracking-[0.22em] text-accent-foreground font-semibold">
              <MessageCircle size={16} />
              WhatsApp
            </a>
            <Link href={`/product/${product.id}`} onClick={closeQuickView} className="flex min-h-12 items-center justify-center rounded-full border px-5 text-xs uppercase tracking-[0.22em] hover:bg-muted font-medium">
              View Details
            </Link>
          </div>
          <a href={`tel:${settings.ownerPhone}`} className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 text-xs uppercase tracking-[0.22em] hover:bg-muted">
            <Phone size={16} />
            Call Store ({settings.ownerDisplayPhone})
          </a>
        </div>
      </div>
    </>
  );
}
