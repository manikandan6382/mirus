"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownUp, Grid2X2, List, Mic, Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../components/product-card";
import { categories, formatINR, matchesCategory } from "../lib/products";
import { useAppStore } from "../lib/store";
import { cn } from "../lib/utils";

const sortOptions = ["Latest", "Price Low to High", "Price High to Low", "Popular", "New Arrivals"];
const filterSizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const filterColors = ["Black", "White", "Ivory", "Marigold", "Charcoal", "Sage", "Saffron Noir", "Rose Gold"];

function ListingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="skeleton aspect-[3/4.25] rounded-[28px]" />
          <div className="skeleton h-3 w-20 rounded-full" />
          <div className="skeleton h-5 w-32 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function ShopPage() {
  const openSearch = useAppStore((state) => state.openSearch);
  const products = useAppStore((state) => state.products);
  const hiddenProductIds = useAppStore((state) => state.hiddenProductIds);

  const visibleProducts = useMemo(
    () => products.filter((p) => !hiddenProductIds.includes(p.id)),
    [products, hiddenProductIds]
  );

  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Latest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const timer = window.setTimeout(() => {
      if (category && categories.includes(category)) setActiveCategory(category);
      setLoading(false);
    }, 120);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    const searched = visibleProducts.filter((product) => {
      const text = `${product.name} ${product.category} ${product.collection} ${product.tags.join(" ")}`.toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase());
      const matchesSize = !selectedSize || product.sizes.includes(selectedSize);
      const matchesColor = !selectedColor || product.colors.some((color) => color.name.toLowerCase().includes(selectedColor.toLowerCase()));
      const matchesAvailability = !availabilityOnly || product.stock > 0;
      return matchesCategory(product, activeCategory) && matchesQuery && matchesSize && matchesColor && matchesAvailability;
    });

    return [...searched].sort((a, b) => {
      if (sort === "Price Low to High") return a.price - b.price;
      if (sort === "Price High to Low") return b.price - a.price;
      if (sort === "Popular") return b.rating - a.rating;
      if (sort === "New Arrivals") return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
      return 0;
    });
  }, [activeCategory, availabilityOnly, query, selectedColor, selectedSize, sort, visibleProducts]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="app-screen min-h-screen bg-background px-5 pb-24 pt-28 md:px-8">
      <section className="mx-auto max-w-[1500px]">
        <div className="mb-7">
          <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-accent font-semibold">MERASH Catalog</p>
          <h1 className="font-serif text-5xl leading-none md:text-8xl">Browse the Edit.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            Select pieces, view details, and order directly on WhatsApp or phone. Door delivery after owner confirmation.
          </p>
        </div>

        {/* Sticky Filter & Search Bar */}
        <div className="sticky top-[76px] z-30 -mx-5 mb-7 border-y bg-background/92 px-5 py-4 backdrop-blur-xl md:-mx-8 md:px-8">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex items-center gap-3">
              <button
                onClick={openSearch}
                className="flex min-h-14 flex-1 items-center gap-3 rounded-full border bg-card px-5 text-left text-sm text-muted-foreground hover:border-accent transition-colors"
              >
                <Search size={18} />
                Search luxury pieces...
                <Mic className="ml-auto" size={17} />
              </button>
              <button onClick={() => setFilterOpen(true)} className="flex h-14 w-14 items-center justify-center rounded-full border bg-card hover:border-accent transition-colors" aria-label="Open filters">
                <SlidersHorizontal size={18} />
              </button>
            </div>
            <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setVisibleCount(8);
                  }}
                  className={cn(
                    "snap-start whitespace-nowrap rounded-full border px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-medium transition-all active:scale-95",
                    activeCategory === category ? "border-accent bg-accent text-accent-foreground shadow-md" : "bg-card text-muted-foreground hover:border-accent",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info & View Switcher */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-medium">{filteredProducts.length} pieces found</p>
          <div className="flex items-center gap-2">
            <label className="flex min-h-11 items-center gap-2 rounded-full border bg-card px-4 text-xs font-medium">
              <ArrowDownUp size={14} />
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent cursor-pointer">
                {sortOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <button onClick={() => setView(view === "grid" ? "list" : "grid")} className="flex h-11 w-11 items-center justify-center rounded-full border bg-card hover:border-accent transition-colors" aria-label="Toggle view">
              {view === "grid" ? <List size={17} /> : <Grid2X2 size={17} />}
            </button>
          </div>
        </div>

        {/* Product Grid / List */}
        {loading ? (
          <ListingSkeleton />
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {displayedProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="luxury-card flex gap-5 p-4 items-center hover:border-accent transition-colors">
                <span className="relative h-36 w-28 overflow-hidden rounded-2xl bg-muted border flex-shrink-0">
                  <Image src={product.image} alt={product.name} fill sizes="112px" className="object-cover" />
                </span>
                <span className="flex flex-1 flex-col justify-center">
                  <span className="text-[10px] uppercase tracking-[0.24em] text-accent font-semibold">{product.collection}</span>
                  <span className="mt-1 font-serif text-2xl">{product.name}</span>
                  <span className="mt-2 text-sm font-semibold">{formatINR(product.price)}</span>
                  <span className="mt-2 text-xs text-muted-foreground">{product.stock > 0 ? `${product.stock} units available` : "Sold Out"}</span>
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && visibleCount < filteredProducts.length && (
          <div className="mt-14 flex justify-center">
            <button
              onClick={() => setVisibleCount((count) => count + 4)}
              className="magnetic-button min-h-14 rounded-full border bg-card px-10 text-[11px] uppercase tracking-[0.24em] font-medium"
            >
              Load More Pieces
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="luxury-card p-12 text-center max-w-lg mx-auto">
            <p className="font-serif text-4xl">No pieces found.</p>
            <p className="mt-2 text-xs text-muted-foreground">Try adjusting your filters or search terms to find available products.</p>
            <button
              onClick={() => {
                setQuery("");
                setSelectedSize("");
                setSelectedColor("");
                setAvailabilityOnly(false);
                setActiveCategory("All");
              }}
              className="mt-6 min-h-12 rounded-full bg-primary px-8 text-xs uppercase tracking-[0.22em] text-primary-foreground font-medium"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Filter Drawer */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div className="fixed inset-0 z-[70] flex items-end bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFilterOpen(false)}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="max-h-[86vh] w-full overflow-y-auto rounded-t-[36px] bg-background p-6 shadow-2xl md:mx-auto md:max-w-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-foreground/15" />
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-serif text-3xl">Refine Selection</h2>
                <button onClick={() => setFilterOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border" aria-label="Close filters">
                  <X size={17} />
                </button>
              </div>

              <FilterGroup title="Size" items={filterSizes} value={selectedSize} onChange={setSelectedSize} />
              <FilterGroup title="Color" items={filterColors} value={selectedColor} onChange={setSelectedColor} />

              <div className="mt-7 rounded-[24px] border p-5 bg-card">
                <label className="flex items-center justify-between gap-4 cursor-pointer">
                  <span>
                    <span className="block text-sm font-medium">Availability Filter</span>
                    <span className="text-xs text-muted-foreground">Show in-stock pieces only</span>
                  </span>
                  <input type="checkbox" checked={availabilityOnly} onChange={(event) => setAvailabilityOnly(event.target.checked)} className="h-5 w-5 accent-[var(--accent)]" />
                </label>
              </div>

              <div className="sticky bottom-0 mt-8 grid grid-cols-2 gap-3 bg-background pt-4 border-t">
                <button
                  onClick={() => {
                    setSelectedSize("");
                    setSelectedColor("");
                    setAvailabilityOnly(false);
                  }}
                  className="min-h-14 rounded-full border text-xs uppercase tracking-[0.22em] font-medium"
                >
                  Reset
                </button>
                <button onClick={() => setFilterOpen(false)} className="min-h-14 rounded-full bg-primary text-xs uppercase tracking-[0.22em] text-primary-foreground font-medium">
                  Apply Filter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({
  title,
  items,
  value,
  onChange,
}: {
  title: string;
  items: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-6">
      <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground font-medium">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onChange(value === item ? "" : item)}
            className={cn("min-h-10 rounded-full border px-4 text-xs font-medium transition-all", value === item ? "border-accent bg-accent text-accent-foreground font-semibold" : "bg-card")}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
