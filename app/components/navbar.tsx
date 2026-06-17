"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, MessageCircle, Moon, Phone, Search, Sun, X } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "../lib/utils";
import { ownerPhone, whatsappLink } from "../lib/products";
import { useAppStore } from "../lib/store";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/collections" },
  { name: "New Arrivals", href: "/shop?category=New%20Arrivals" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const openSearch = useAppStore((state) => state.openSearch);
  const wishlistCount = useAppStore((state) => state.wishlist.length);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-4 py-4 transition-all duration-500 md:px-8",
        isScrolled && "luxury-blur border-b premium-shadow py-3",
      )}
    >
      <div className="mx-auto grid max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {navLinks.slice(0, 4).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.26em] text-foreground/72 transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <button
          aria-label="Open menu"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center border bg-background/70 text-foreground lg:hidden"
        >
          <Menu size={19} strokeWidth={1.4} />
        </button>

        <Link href="/" className="group justify-self-center text-center">
          <span className="block font-serif text-3xl tracking-[0.36em] md:text-4xl">MIRUS</span>
          <span className="mt-0.5 block text-[9px] uppercase tracking-[0.42em] text-foreground/55">
            India
          </span>
        </Link>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <button
            aria-label="Search collections"
            onClick={openSearch}
            className="hidden h-11 w-11 items-center justify-center rounded-full border bg-background/70 transition-colors hover:border-accent hover:text-accent sm:flex"
          >
            <Search size={18} strokeWidth={1.4} />
          </button>
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-11 w-11 rounded-full border bg-background/70 transition-colors hover:border-accent hover:text-accent"
          >
            <span className="flex items-center justify-center">
              {theme === "dark" ? <Sun size={18} strokeWidth={1.4} /> : <Moon size={18} strokeWidth={1.4} />}
            </span>
          </button>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative hidden h-11 w-11 items-center justify-center rounded-full border bg-background/70 transition-colors hover:border-accent hover:text-accent sm:flex"
          >
            <Heart size={18} strokeWidth={1.4} />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-accent px-1 text-center text-[9px] leading-5 text-accent-foreground">
                {wishlistCount}
              </span>
            )}
          </Link>
          <a
            href={whatsappLink}
            className="magnetic-button hidden items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-5 py-3 text-[10px] uppercase tracking-[0.24em] text-accent transition-transform hover:-translate-y-0.5 lg:flex"
          >
            <MessageCircle size={14} strokeWidth={1.5} />
            WhatsApp
          </a>
          <a
            href={`tel:${ownerPhone}`}
            className="magnetic-button hidden items-center gap-2 rounded-full bg-primary px-5 py-3 text-[10px] uppercase tracking-[0.24em] text-primary-foreground transition-transform hover:-translate-y-0.5 md:flex"
          >
            <Phone size={14} strokeWidth={1.5} />
            Call
          </a>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/96 px-6 py-5 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="font-serif text-3xl tracking-[0.35em]">
                MIRUS
              </Link>
              <button
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-11 w-11 items-center justify-center border"
              >
                <X size={19} strokeWidth={1.4} />
              </button>
            </div>
            <div className="mt-16 flex flex-col gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-serif text-4xl leading-none"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <a
                href={`tel:${ownerPhone}`}
                className="mt-6 flex items-center justify-center gap-3 bg-primary px-8 py-5 text-xs uppercase tracking-[0.24em] text-primary-foreground"
              >
                <Phone size={17} />
                Call Owner
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
