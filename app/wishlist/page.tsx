"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import ProductCard from "../components/product-card";
import { products } from "../lib/products";
import { useAppStore } from "../lib/store";

export default function WishlistPage() {
  const wishlist = useAppStore((state) => state.wishlist);
  const wishlistProducts = products.filter((product) => wishlist.includes(product.id));

  return (
    <div className="app-screen min-h-screen bg-background px-5 pb-24 pt-28 md:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-accent">Wishlist</p>
            <h1 className="font-serif text-5xl leading-none md:text-8xl">Saved products.</h1>
          </div>
          <span className="hidden rounded-full border px-5 py-3 text-sm text-muted-foreground md:block">{wishlistProducts.length} saved</span>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[34px] border bg-card p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/12 text-accent">
              <Heart size={28} />
            </div>
            <h2 className="mt-6 font-serif text-4xl">Your wishlist is empty.</h2>
            <p className="mx-auto mt-4 max-w-md leading-8 text-muted-foreground">
              Tap the heart on any MIRUS product to save it locally on this device.
            </p>
            <Link href="/shop" className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-7 text-xs uppercase tracking-[0.22em] text-primary-foreground">
              <ShoppingBag size={16} />
              Browse products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
