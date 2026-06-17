"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Edit3,
  Eye,
  ImagePlus,
  LayoutDashboard,
  Lock,
  LogIn,
  Package,
  Plus,
  Settings,
  Sparkles,
  Star,
  Trash2,
  Truck,
} from "lucide-react";
import { categories, formatINR, products } from "../lib/products";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [featured, setFeatured] = useState(products.filter((product) => product.isFeatured).map((product) => product.id));
  const [newArrivals, setNewArrivals] = useState(products.filter((product) => product.isNew).map((product) => product.id));
  const [visible, setVisible] = useState(products.map((product) => product.id));

  const totalStock = useMemo(() => products.reduce((sum, product) => sum + product.stock, 0), []);

  if (!isLoggedIn) {
    return (
      <div className="app-screen flex min-h-screen items-center justify-center bg-muted px-5 py-24">
        <div className="w-full max-w-md rounded-[34px] border bg-background p-7 shadow-2xl">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-accent/12 text-accent">
            <Lock size={26} />
          </div>
          <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-accent">Secure Admin Login</p>
          <h1 className="font-serif text-4xl">MIRUS control room.</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Local demo gate for managing products, banners, stock, and contact settings. Connect real authentication before production launch.
          </p>
          <form
            className="mt-7 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setIsLoggedIn(true);
            }}
          >
            <input className="min-h-14 w-full rounded-2xl border bg-background px-4 text-sm" placeholder="Admin email" defaultValue="owner@mirus.in" />
            <input className="min-h-14 w-full rounded-2xl border bg-background px-4 text-sm" placeholder="Password" type="password" defaultValue="mirus" />
            <button className="flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-primary text-xs uppercase tracking-[0.22em] text-primary-foreground">
              <LogIn size={16} />
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-screen min-h-screen bg-muted/60 pt-24 md:pt-0">
      <div className="grid md:grid-cols-[280px_1fr]">
        <aside className="hidden min-h-screen border-r bg-background px-5 py-8 md:block">
          <div className="mb-10">
            <p className="font-serif text-3xl tracking-[0.34em]">MIRUS</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Admin Atelier</p>
          </div>
          <nav className="space-y-2">
            {[
              { icon: LayoutDashboard, label: "Dashboard" },
              { icon: Package, label: "Products" },
              { icon: ImagePlus, label: "Uploads" },
              { icon: Star, label: "Featured" },
              { icon: Truck, label: "Delivery" },
              { icon: Settings, label: "Settings" },
            ].map((item, index) => (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                  index === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon size={17} strokeWidth={1.4} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="px-5 py-10 md:px-8 lg:px-12">
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[0.34em] text-accent">MIRUS Control Room</p>
              <h1 className="font-serif text-5xl leading-none md:text-7xl">Inventory, curated.</h1>
              <p className="mt-5 max-w-2xl leading-8 text-muted-foreground">
                Manage products, categories, imagery, featured edits, new arrivals, inventory, and delivery options for the no-checkout MIRUS ordering flow.
              </p>
            </div>
            <button className="flex w-fit items-center gap-3 bg-primary px-7 py-4 text-[10px] uppercase tracking-[0.24em] text-primary-foreground">
              <Plus size={16} />
              Add Product
            </button>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Products", value: products.length, helper: "Published catalogue", icon: Package },
              { label: "Inventory", value: totalStock, helper: "Units available", icon: LayoutDashboard },
              { label: "Featured", value: featured.length, helper: "Homepage spotlight", icon: Star },
              { label: "Categories", value: categories.length - 1, helper: "Active departments", icon: Sparkles },
            ].map((stat) => (
              <div key={stat.label} className="border bg-background p-6 premium-shadow">
                <stat.icon className="mb-8 text-accent" size={24} strokeWidth={1.2} />
                <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground">{stat.label}</p>
                <p className="mt-3 font-serif text-5xl">{stat.value}</p>
                <p className="mt-3 text-sm text-muted-foreground">{stat.helper}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
            <section className="border bg-background">
              <div className="flex flex-col justify-between gap-4 border-b p-6 md:flex-row md:items-center">
                <div>
                  <h2 className="font-serif text-3xl">Product management</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Edit, delete, upload images, and control inventory visibility.</p>
                </div>
                <button className="flex w-fit items-center gap-2 border px-4 py-3 text-[10px] uppercase tracking-[0.22em]">
                  <ImagePlus size={15} />
                  Upload Images
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] text-left">
                  <thead>
                    <tr className="border-b bg-muted/70 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      <th className="px-6 py-4 font-normal">Product</th>
                      <th className="px-6 py-4 font-normal">Category</th>
                      <th className="px-6 py-4 font-normal">Price</th>
                      <th className="px-6 py-4 font-normal">Stock</th>
                      <th className="px-6 py-4 font-normal">Flags</th>
                      <th className="px-6 py-4 font-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map((product) => (
                      <tr key={product.id} className="transition-colors hover:bg-muted/50">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <span className="relative block h-16 w-12 overflow-hidden bg-muted">
                              <Image src={product.image} alt="" fill sizes="48px" className="object-cover" />
                            </span>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{product.collection}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-muted-foreground">{product.category}</td>
                        <td className="px-6 py-5 text-sm">{formatINR(product.price)}</td>
                        <td className="px-6 py-5 text-sm">{product.stock}</td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                setFeatured((current) =>
                                  current.includes(product.id)
                                    ? current.filter((id) => id !== product.id)
                                    : [...current, product.id],
                                )
                              }
                              className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] ${
                                featured.includes(product.id) ? "bg-accent text-accent-foreground" : "border"
                              }`}
                            >
                              Featured
                            </button>
                            <button
                              onClick={() =>
                                setNewArrivals((current) =>
                                  current.includes(product.id)
                                    ? current.filter((id) => id !== product.id)
                                    : [...current, product.id],
                                )
                              }
                              className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] ${
                                newArrivals.includes(product.id) ? "bg-foreground text-background" : "border"
                              }`}
                            >
                              New
                            </button>
                            <button
                              onClick={() =>
                                setVisible((current) =>
                                  current.includes(product.id)
                                    ? current.filter((id) => id !== product.id)
                                    : [...current, product.id],
                                )
                              }
                              className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] ${
                                visible.includes(product.id) ? "border border-green-500 text-green-600" : "border text-muted-foreground"
                              }`}
                            >
                              Visible
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-3 text-muted-foreground">
                            <button aria-label={`Preview ${product.name}`} className="hover:text-foreground">
                              <Eye size={16} />
                            </button>
                            <button aria-label={`Edit ${product.name}`} className="hover:text-foreground">
                              <Edit3 size={16} />
                            </button>
                            <button aria-label={`Delete ${product.name}`} className="hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <aside className="space-y-8">
              <section className="border bg-background p-6">
                <h2 className="font-serif text-3xl">Add product</h2>
                <div className="mt-6 space-y-4">
                  {["Product name", "Price in INR", "Category", "Stock count", "Sizes", "Colors"].map((label) => (
                    <label key={label} className="block">
                      <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
                      <input className="w-full border bg-background px-4 py-3 text-sm" placeholder={label} />
                    </label>
                  ))}
                  <div className="rounded-[24px] border border-dashed p-5 text-center">
                    <ImagePlus className="mx-auto mb-3 text-accent" size={24} />
                    <p className="text-sm font-medium">Drag and drop multiple product images</p>
                    <p className="mt-2 text-xs text-muted-foreground">Preview thumbnails appear here before upload.</p>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Description</span>
                    <textarea className="h-28 w-full resize-none border bg-background px-4 py-3 text-sm" placeholder="Short product story" />
                  </label>
                  <button className="w-full bg-primary px-6 py-4 text-[10px] uppercase tracking-[0.24em] text-primary-foreground">
                    Save Draft
                  </button>
                </div>
              </section>

              <section className="border bg-background p-6">
                <h2 className="font-serif text-3xl">Delivery options</h2>
                <div className="mt-6 space-y-4 text-sm">
                  {["Same-city door delivery", "Owner confirmation required", "WhatsApp order supported"].map((item) => (
                    <label key={item} className="flex items-center justify-between gap-4 border p-4">
                      <span>{item}</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--accent)]" />
                    </label>
                  ))}
                </div>
              </section>

              <section className="border bg-background p-6">
                <h2 className="font-serif text-3xl">Homepage controls</h2>
                <div className="mt-6 space-y-4 text-sm">
                  {["New Season Drop", "Door Delivery Available", "Order Directly on WhatsApp"].map((item) => (
                    <label key={item} className="flex items-center justify-between gap-4 border p-4">
                      <span>{item}</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--accent)]" />
                    </label>
                  ))}
                </div>
              </section>

              <section className="border bg-background p-6">
                <h2 className="font-serif text-3xl">Contact settings</h2>
                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Call number</span>
                    <input className="w-full border bg-background px-4 py-3 text-sm" defaultValue="+91 98765 43210" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">WhatsApp number</span>
                    <input className="w-full border bg-background px-4 py-3 text-sm" defaultValue="+91 98765 43210" />
                  </label>
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
