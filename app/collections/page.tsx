"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "../components/product-card";
import { collections, products } from "../lib/products";

export default function CollectionsPage() {
  return (
    <div className="app-screen min-h-screen bg-background px-5 pb-24 pt-28 md:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10">
          <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-accent">Collections</p>
          <h1 className="font-serif text-5xl leading-none md:text-8xl">Curated edits for every occasion.</h1>
          <p className="mt-5 max-w-2xl leading-8 text-muted-foreground">
            Urban Essentials, Festive Edit, Workwear, Weekend Casuals, and Premium Shirts are built as focused fashion app destinations.
          </p>
        </div>

        <div className="space-y-14">
          {collections.map((collection) => {
            const collectionProducts = products.filter((product) => product.collection === collection.name || product.tags.includes(collection.name)).slice(0, 4);
            return (
              <section key={collection.id} id={collection.id} className="scroll-mt-28">
                <Link href={`/shop?category=${encodeURIComponent(collection.name)}`} className="group relative block min-h-[420px] overflow-hidden rounded-[34px] bg-muted">
                  <Image src={collection.image} alt={collection.name} fill sizes="100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/14 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-10">
                    <h2 className="font-serif text-5xl md:text-7xl">{collection.name}</h2>
                    <p className="mt-4 max-w-xl leading-8 text-white/72">{collection.description}</p>
                    <span className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-black">
                      Shop edit
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
                {collectionProducts.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
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
