"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import ProductCard from "../components/product-card";
import { useAppStore } from "../lib/store";

export default function WishlistPage() {
  const wishlist = useAppStore((state) => state.wishlist);
  const products = useAppStore((state) => state.products);
  const hiddenProductIds = useAppStore((state) => state.hiddenProductIds);

  const visibleProducts = products.filter((p) => !hiddenProductIds.includes(p.id));
  const wishlistProducts = visibleProducts.filter((product) => wishlist.includes(product.id));

  return (
    <div className="app-screen min-h-screen bg-background px-5 pb-24 pt-28 md:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-accent font-semibold">Saved Items</p>
            <h1 className="font-serif text-5xl leading-none md:text-8xl">Your Wishlist.</h1>
          </div>
          <span className="hidden rounded-full border px-5 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground md:block font-medium">
            {wishlistProducts.length} saved
          </span>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="luxury-card p-12 text-center max-w-md mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <Heart size={28} />
            </div>
            <h2 className="mt-6 font-serif text-3xl">Your wishlist is empty.</h2>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              Tap the heart icon on any MERASH piece to save it locally for fast access anytime.
            </p>
            <Link href="/shop" className="magnetic-button mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-8 text-xs uppercase tracking-[0.22em] text-primary-foreground font-medium">
              <ShoppingBag size={16} />
              Browse Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
