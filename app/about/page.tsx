"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background px-5 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1500px]">
        <section className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div data-reveal>
            <p className="mb-5 text-[10px] uppercase tracking-[0.34em] text-accent font-semibold">The MERASH Philosophy</p>
            <h1 className="font-serif text-6xl leading-[0.92] md:text-8xl">
              Indian clothing, edited like a global house.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-9 text-muted-foreground">
              MERASH was created for customers who want a luxury fashion experience without losing the trust of a personal relationship. Every piece is selected for fabric, fall, finish, and the way it belongs in an Indian wardrobe.
            </p>
            <Link href="/shop" className="mt-10 inline-flex items-center gap-3 border-b border-accent pb-2 text-[11px] uppercase tracking-[0.25em] text-accent font-semibold">
              Explore the Edit
              <ArrowRight size={15} />
            </Link>
          </div>
          <div data-reveal className="relative min-h-[680px] overflow-hidden rounded-[36px] bg-muted border shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1800&auto=format&fit=crop"
              alt="MERASH boutique interior"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        <section className="my-24 border-y py-20 text-center md:my-32">
          <p className="mx-auto max-w-5xl font-serif text-4xl leading-tight md:text-6xl">
            &ldquo;Luxury is not distance. It is precision, warmth, and the confidence that someone has chosen well on your behalf.&rdquo;
          </p>
        </section>

        <section className="grid gap-8 md:grid-cols-3">
          {[
            ["Curated Excellence", "Focused edits of premium Indian and contemporary clothing, never endless anonymous product feeds."],
            ["Personal Ordering", "Call or WhatsApp the owner to confirm your product, size, colour, and delivery details."],
            ["Door Delivery", "Orders are confirmed personally and delivered with care, without online payment gateways or credit card checkout."],
          ].map(([title, body]) => (
            <div key={title} data-reveal className="luxury-card p-8">
              <h2 className="font-serif text-3xl">{title}</h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
