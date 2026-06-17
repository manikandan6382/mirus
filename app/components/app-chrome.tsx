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
import { getProduct, getWhatsAppOrderUrl, ownerPhone, products } from "../lib/products";
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
          <button onClick={() => window.location.reload()} className="flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-xs text-primary-foreground">
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
      <div className="luxury-blur grid grid-cols-5 rounded-t-[28px] border px-2 py-2 shadow-2xl">
        {bottomItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] text-muted-foreground"
            >
              {active && (
                <motion.span
                  layoutId="mobile-bottom-active"
                  className="absolute inset-1 rounded-2xl bg-accent/12"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <motion.span whileTap={{ scale: 0.86 }} className={cn("relative", active && "text-accent")}>
                <item.icon size={20} strokeWidth={active ? 2 : 1.5} fill={item.label === "Wishlist" && active ? "currentColor" : "none"} />
              </motion.span>
              <span className={cn("relative", active && "text-foreground")}>{item.label}</span>
              {item.label === "Wishlist" && wishlistCount > 0 && (
                <span className="absolute right-4 top-2 min-w-5 rounded-full bg-accent px-1 text-center text-[9px] leading-5 text-accent-foreground">
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
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.toLowerCase();
    return products
      .filter((product) => `${product.name} ${product.category} ${product.collection} ${product.tags.join(" ")}`.toLowerCase().includes(normalized))
      .slice(0, 5);
  }, [query]);

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
                  placeholder="Search MIRUS"
                  className="min-w-0 flex-1 bg-transparent text-base"
                />
                <Mic size={18} strokeWidth={1.4} className="text-muted-foreground" />
              </label>
              <button onClick={closeSearch} aria-label="Close search" className="flex h-12 w-12 items-center justify-center rounded-full border">
                <X size={18} />
              </button>
            </div>

            <div className="mt-8">
              <p className="mb-4 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
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
                    className="rounded-full border bg-background px-5 py-3 text-sm"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {recentSearches.length > 0 && (
              <div className="mt-9">
                <p className="mb-4 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">Recent searches</p>
                <div className="space-y-2">
                  {recentSearches.map((item) => (
                    <button key={item} onClick={() => setQuery(item)} className="block w-full rounded-2xl bg-muted px-5 py-4 text-left text-sm">
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query && (
              <div className="mt-9 space-y-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => {
                      addRecentSearch(query);
                      closeSearch();
                    }}
                    className="flex items-center gap-4 rounded-3xl border bg-background p-3"
                  >
                    <span className="relative h-20 w-16 overflow-hidden rounded-2xl bg-muted">
                      <Image src={product.image} alt={product.name} fill sizes="64px" className="object-cover" />
                    </span>
                    <span>
                      <span className="block font-serif text-xl">{product.name}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{product.collection}</span>
                    </span>
                  </Link>
                ))}
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
  const product = quickViewId ? getProduct(quickViewId) : undefined;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[82] flex items-end bg-black/45 p-3 backdrop-blur-md md:items-center md:justify-center md:p-8"
          onClick={closeQuickView}
        >
          <motion.div
            initial={{ y: 80, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 80, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="max-h-[88vh] w-full overflow-y-auto rounded-t-[32px] bg-background p-4 shadow-2xl md:max-w-3xl md:rounded-[32px] md:p-5"
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
  product: NonNullable<ReturnType<typeof getProduct>>;
  closeQuickView: () => void;
}) {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0].name);

  return (
    <>
      <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-foreground/14 md:hidden" />
      <div className="grid gap-5 md:grid-cols-[0.85fr_1fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-muted">
          <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 320px, 100vw" className="object-cover" />
        </div>
        <div className="p-1 md:p-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-accent">{product.collection}</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight">{product.name}</h2>
              <p className="mt-3 text-lg">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product.price)}</p>
            </div>
            <button onClick={closeQuickView} aria-label="Close quick view" className="flex h-11 w-11 items-center justify-center rounded-full border">
              <X size={17} />
            </button>
          </div>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">{product.description}</p>

          <div className="mt-6">
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em]">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((item) => (
                <button key={item} onClick={() => setSize(item)} className={cn("min-h-11 rounded-full border px-4 text-sm", size === item && "border-accent bg-accent text-accent-foreground")}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em]">Colour</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((item) => (
                <button key={item.name} onClick={() => setColor(item.name)} className={cn("flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm", color === item.name && "border-accent text-accent")}>
                  <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: item.value }} />
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <a href={getWhatsAppOrderUrl(product, size, color)} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs uppercase tracking-[0.22em] text-primary-foreground">
              <MessageCircle size={16} />
              WhatsApp
            </a>
            <Link href={`/product/${product.id}`} onClick={closeQuickView} className="flex min-h-12 items-center justify-center rounded-full border px-5 text-xs uppercase tracking-[0.22em]">
              View details
            </Link>
          </div>
          <a href={`tel:${ownerPhone}`} className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 text-xs uppercase tracking-[0.22em]">
            <Phone size={16} />
            Call to Order
          </a>
        </div>
      </div>
    </>
  );
}
