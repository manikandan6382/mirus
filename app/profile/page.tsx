"use client";

import Link from "next/link";
import { MessageCircle, Moon, Phone, Shirt, Sun, Truck, type LucideIcon } from "lucide-react";
import ProductCard from "../components/product-card";
import { ownerDisplayPhone, ownerPhone, products, whatsappLink } from "../lib/products";
import { useAppStore } from "../lib/store";
import { useTheme } from "../components/theme-provider";

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const wishlist = useAppStore((state) => state.wishlist);
  const recentlyViewed = useAppStore((state) => state.recentlyViewed);
  const savedProducts = products.filter((product) => wishlist.includes(product.id)).slice(0, 4);
  const viewedProducts = products.filter((product) => recentlyViewed.includes(product.id)).slice(0, 4);

  return (
    <div className="app-screen min-h-screen bg-background px-5 pb-24 pt-28 md:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-10">
          <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-accent">Profile</p>
          <h1 className="font-serif text-5xl leading-none md:text-8xl">Your MIRUS space.</h1>
          <p className="mt-5 max-w-2xl leading-8 text-muted-foreground">
            Saved products, recent views, contact options, delivery information, and theme preference in one app-like profile.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <ProfileCard icon={Shirt} title="Saved products" body={`${savedProducts.length} products saved locally`} href="/wishlist" />
          <ProfileCard icon={MessageCircle} title="WhatsApp support" body="Message MIRUS for size, colour, and delivery help" href={whatsappLink} />
          <ProfileCard icon={Phone} title="Contact store" body={ownerDisplayPhone} href={`tel:${ownerPhone}`} />
        </div>

        <section className="mt-8 rounded-[32px] border bg-card p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-accent">Theme Preference</p>
              <h2 className="mt-2 font-serif text-3xl">Switch between premium light and dark mode.</h2>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex min-h-14 items-center justify-center gap-3 rounded-full border px-6 text-xs uppercase tracking-[0.22em]"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-[32px] border bg-card p-6">
          <Truck className="mb-6 text-accent" size={25} />
          <h2 className="font-serif text-3xl">Delivery information</h2>
          <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">
            MIRUS confirms each order manually by call or WhatsApp before arranging door delivery. There is no online checkout, UPI payment, credit card form, or payment gateway in this website.
          </p>
        </section>

        {viewedProducts.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-serif text-4xl">Recently viewed</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {viewedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        )}

        {savedProducts.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-serif text-4xl">Saved products</h2>
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
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link href={href} className="rounded-[32px] border bg-card p-6 transition-transform active:scale-[0.98] md:hover:-translate-y-1">
      <Icon className="mb-8 text-accent" size={25} strokeWidth={1.4} />
      <h2 className="font-serif text-3xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">{body}</p>
    </Link>
  );
}
