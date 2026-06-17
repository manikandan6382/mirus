"use client";

import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { ownerDisplayPhone, ownerPhone, whatsappLink } from "../lib/products";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background px-5 pb-24 pt-32 md:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <section data-reveal>
          <p className="mb-5 text-[10px] uppercase tracking-[0.34em] text-accent">Contact MIRUS</p>
          <h1 className="font-serif text-6xl leading-[0.92] md:text-8xl">Order with a real person.</h1>
          <p className="mt-8 max-w-xl text-lg leading-9 text-muted-foreground">
            Ask about fabric, size, stock, styling, and door delivery. MIRUS does not use online checkout, payment gateways, or credit card forms.
          </p>

          <div className="mt-12 space-y-5">
            {[
              { icon: Phone, label: "Call Owner", value: ownerDisplayPhone, href: `tel:${ownerPhone}` },
              { icon: MessageCircle, label: "WhatsApp Order", value: "Message MIRUS directly", href: whatsappLink },
              { icon: Mail, label: "Email", value: "care@mirus.in", href: "mailto:care@mirus.in" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="flex items-center gap-5 border p-5 transition-colors hover:border-accent hover:text-accent">
                <item.icon size={22} strokeWidth={1.2} />
                <span>
                  <span className="block text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{item.label}</span>
                  <span className="mt-1 block font-serif text-2xl">{item.value}</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        <section data-reveal className="grid gap-6">
          <div className="relative min-h-[420px] overflow-hidden bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1800&auto=format&fit=crop"
              alt="Luxury MIRUS retail consultation space"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="font-serif text-4xl">Private assistance for every order.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="border p-7">
              <Clock className="mb-8 text-accent" size={25} strokeWidth={1.2} />
              <h2 className="font-serif text-3xl">Hours</h2>
              <div className="mt-5 space-y-2 text-sm leading-7 text-muted-foreground">
                <p>Monday to Saturday: 10:00 AM to 9:00 PM</p>
                <p>Sunday: By appointment</p>
              </div>
            </div>
            <div className="border p-7">
              <MapPin className="mb-8 text-accent" size={25} strokeWidth={1.2} />
              <h2 className="font-serif text-3xl">Delivery</h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                Door delivery is arranged after owner confirmation. Exact service area can be confirmed over call or WhatsApp.
              </p>
            </div>
          </div>

          <form className="border bg-muted/50 p-7">
            <h2 className="font-serif text-3xl">Send an enquiry</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="border bg-background px-4 py-4 text-sm" placeholder="Name" />
              <input className="border bg-background px-4 py-4 text-sm" placeholder="Phone number" />
            </div>
            <textarea className="mt-4 h-32 w-full resize-none border bg-background px-4 py-4 text-sm" placeholder="Tell us what you are looking for" />
            <button className="mt-4 w-full bg-primary px-6 py-5 text-[11px] uppercase tracking-[0.26em] text-primary-foreground">
              Request Callback
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
