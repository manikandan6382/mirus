"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { useAppStore } from "../lib/store";

export default function ContactPage() {
  const settings = useAppStore((state) => state.settings);
  const addInquiry = useAppStore((state) => state.addInquiry);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const cleanPhone = settings.ownerPhone.replace(/[^\d]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry(name, phone, message);
    setSubmitted(true);
    setName("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background px-5 pb-24 pt-32 md:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <section data-reveal>
          <p className="mb-3 text-[10px] uppercase tracking-[0.34em] text-accent font-semibold">Contact MERASH Atelier</p>
          <h1 className="font-serif text-6xl leading-[0.92] md:text-8xl">Order with a real person.</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
            Inquire about custom fabric, fit, sizing, stock, styling advice, and door delivery. MERASH operates as a personal concierge without checkout forms or payment gateways.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: Phone, label: "Call Owner Directly", value: settings.ownerDisplayPhone, href: `tel:${settings.ownerPhone}` },
              { icon: MessageCircle, label: "WhatsApp Order Line", value: "Message MERASH Directly", href: whatsappUrl },
              { icon: Mail, label: "Concierge Email", value: "care@merash.in", href: "mailto:care@merash.in" },
            ].map((item) => (
              <a key={item.label} href={item.href} target={item.label.includes("WhatsApp") ? "_blank" : "_self"} className="luxury-card flex items-center gap-5 p-5 transition-colors hover:border-accent">
                <item.icon size={22} strokeWidth={1.4} className="text-accent" />
                <span>
                  <span className="block text-[10px] uppercase tracking-[0.24em] text-muted-foreground font-semibold">{item.label}</span>
                  <span className="mt-1 block font-serif text-2xl">{item.value}</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        <section data-reveal className="grid gap-6">
          <div className="relative min-h-[380px] overflow-hidden rounded-[36px] bg-muted border shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1800&auto=format&fit=crop"
              alt="Luxury MERASH retail consultation space"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="font-serif text-3xl">Private consultation for every order.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="luxury-card p-6">
              <Clock className="mb-6 text-accent" size={24} strokeWidth={1.4} />
              <h2 className="font-serif text-2xl">Consultation Hours</h2>
              <div className="mt-3 space-y-1 text-xs leading-6 text-muted-foreground">
                <p>Monday to Saturday: 10:00 AM – 9:00 PM</p>
                <p>Sunday: By appointment</p>
              </div>
            </div>
            <div className="luxury-card p-6">
              <MapPin className="mb-6 text-accent" size={24} strokeWidth={1.4} />
              <h2 className="font-serif text-2xl">Door Delivery</h2>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                Same-city door delivery arranged after owner confirmation. Confirm service area over phone or WhatsApp.
              </p>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="luxury-card p-8">
            <h2 className="font-serif text-3xl">Send an Inquiry</h2>
            <p className="mt-1 text-xs text-muted-foreground">Your inquiry will be logged directly into the MERASH concierge system for immediate response.</p>

            {submitted ? (
              <div className="mt-6 rounded-2xl bg-accent/15 border border-accent/30 p-6 text-center">
                <CheckCircle2 size={36} className="mx-auto text-accent mb-3" />
                <h3 className="font-serif text-2xl">Inquiry Submitted</h3>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  Thank you! The store owner has received your message and will reach out shortly on WhatsApp or phone.
                </p>
                <button onClick={() => setSubmitted(false)} className="mt-4 rounded-full border border-accent/40 px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-2xl border bg-background px-4 py-3.5 text-sm"
                    placeholder="Your Full Name *"
                  />
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-2xl border bg-background px-4 py-3.5 text-sm"
                    placeholder="WhatsApp / Phone Number *"
                  />
                </div>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-none rounded-2xl border bg-background px-4 py-3.5 text-sm"
                  placeholder="Tell us what pieces, sizes, or custom requests you are looking for..."
                />
                <button type="submit" className="magnetic-button w-full rounded-full bg-primary py-4 text-xs uppercase tracking-[0.24em] text-primary-foreground font-semibold">
                  Submit Store Inquiry
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
