"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "../components/product-card";
import { collections } from "../lib/products";
import { useAppStore } from "../lib/store";

export default function CollectionsPage() {
  const products = useAppStore((state) => state.products);
  const hiddenProductIds = useAppStore((state) => state.hiddenProductIds);

  const visibleProducts = products.filter((p) => !hiddenProductIds.includes(p.id));

  return (
    <div className="app-screen min-h-screen bg-background px-5 pb-24 pt-28 md:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10">
          <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-accent font-semibold">Atelier Edits</p>
          <h1 className="font-serif text-5xl leading-none md:text-8xl">Curated Collections.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Urban Essentials, Festive Edit, Workwear, Weekend Casuals, and Premium Shirts crafted with couture precision.
          </p>
        </div>

        <div className="space-y-16">
          {collections.map((collection) => {
            const collectionProducts = visibleProducts.filter(
              (product) => product.collection === collection.name || product.tags.includes(collection.name)
            ).slice(0, 4);

            return (
              <section key={collection.id} id={collection.id} className="scroll-mt-28">
                <Link
                  href={`/shop?category=${encodeURIComponent(collection.name)}`}
                  className="group relative block min-h-[440px] overflow-hidden rounded-[36px] bg-muted border shadow-lg"
                >
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    sizes="100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8 text-white md:p-12">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-semibold">Curated Edit</span>
                    <h2 className="font-serif text-4xl md:text-7xl mt-1">{collection.name}</h2>
                    <p className="mt-3 max-w-xl text-xs leading-6 text-white/75 md:text-sm">{collection.description}</p>
                    <span className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-[10px] uppercase tracking-[0.22em] text-black font-semibold shadow-md transition-transform group-hover:scale-105">
                      Explore Edit
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>

                {collectionProducts.length > 0 && (
                  <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
                    {collectionProducts.map((product) => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
