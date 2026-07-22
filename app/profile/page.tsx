"use client";

import Link from "next/link";
import { MessageCircle, Moon, Phone, ShieldAlert, Shirt, Sun, Truck, type LucideIcon } from "lucide-react";
import ProductCard from "../components/product-card";
import { useAppStore } from "../lib/store";
import { useTheme } from "../components/theme-provider";

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const products = useAppStore((state) => state.products);
  const hiddenProductIds = useAppStore((state) => state.hiddenProductIds);
  const settings = useAppStore((state) => state.settings);
  const wishlist = useAppStore((state) => state.wishlist);
  const recentlyViewed = useAppStore((state) => state.recentlyViewed);

  const visibleProducts = products.filter((p) => !hiddenProductIds.includes(p.id));
  const savedProducts = visibleProducts.filter((product) => wishlist.includes(product.id)).slice(0, 4);
  const viewedProducts = visibleProducts.filter((product) => recentlyViewed.includes(product.id)).slice(0, 4);

  const cleanPhone = settings.ownerPhone.replace(/[^\d]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}`;

  return (
    <div className="app-screen min-h-screen bg-background px-5 pb-24 pt-28 md:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-accent font-semibold">Concierge Profile</p>
            <h1 className="font-serif text-5xl leading-none md:text-8xl">Your MERASH Space.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              Saved pieces, recent views, store contact details, delivery policy, and concierge access.
            </p>
          </div>
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:border-accent hover:text-accent transition-colors">
            <ShieldAlert size={15} />
            Admin Portal Access
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <ProfileCard icon={Shirt} title="Saved Pieces" body={`${wishlist.length} products saved locally`} href="/wishlist" />
          <ProfileCard icon={MessageCircle} title="WhatsApp Concierge" body="Direct ordering for size, colour, and door delivery" href={whatsappUrl} isExternal />
          <ProfileCard icon={Phone} title="Contact Store" body={settings.ownerDisplayPhone} href={`tel:${settings.ownerPhone}`} />
        </div>

        <section className="mt-8 luxury-card p-6 md:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-accent font-semibold">Visual Experience</p>
              <h2 className="mt-1 font-serif text-3xl">Switch theme preference.</h2>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex min-h-14 items-center justify-center gap-3 rounded-full border px-7 text-xs uppercase tracking-[0.22em] font-medium hover:border-accent"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </section>

        <section className="mt-8 luxury-card p-6 md:p-8">
          <Truck className="mb-6 text-accent" size={26} />
          <h2 className="font-serif text-3xl">Door Delivery & Order Guarantee</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            MERASH manual door delivery is arranged after call or WhatsApp confirmation. There is no automated credit card checkout or payment gateway required in this app.
          </p>
        </section>

        {viewedProducts.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-serif text-4xl">Recently Viewed</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {viewedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        )}

        {savedProducts.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-serif text-4xl">Saved Wishlist Pieces</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {savedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ProfileCard({
  icon: Icon,
  title,
  body,
  href,
  isExternal,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
  isExternal?: boolean;
}) {
  const content = (
    <div className="luxury-card p-7 transition-all hover:-translate-y-1 hover:border-accent">
      <Icon className="mb-6 text-accent" size={26} strokeWidth={1.4} />
      <h2 className="font-serif text-3xl">{title}</h2>
      <p className="mt-3 text-xs leading-6 text-muted-foreground">{body}</p>
    </div>
  );

  if (isExternal) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>;
  }

  return <Link href={href}>{content}</Link>;
}
