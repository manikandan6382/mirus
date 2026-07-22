"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  ImagePlus,
  Inbox,
  LayoutDashboard,
  Lock,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Star,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { categories, collections as collectionList, formatINR, type Product } from "../lib/products";
import { useAppStore, type Inquiry } from "../lib/store";

type AdminTab = "dashboard" | "products" | "add-product" | "inquiries" | "settings";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Store bindings
  const products = useAppStore((state) => state.products);
  const hiddenProductIds = useAppStore((state) => state.hiddenProductIds);
  const inquiries = useAppStore((state) => state.inquiries);
  const settings = useAppStore((state) => state.settings);
  
  const toggleProductFlag = useAppStore((state) => state.toggleProductFlag);
  const updateStock = useAppStore((state) => state.updateStock);
  const deleteProduct = useAppStore((state) => state.deleteProduct);
  const updateInquiryStatus = useAppStore((state) => state.updateInquiryStatus);
  const deleteInquiry = useAppStore((state) => state.deleteInquiry);
  const updateSettings = useAppStore((state) => state.updateSettings);

  // Modals state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [previewProductId, setPreviewProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalStock = useMemo(() => products.reduce((sum, item) => sum + item.stock, 0), [products]);
  const featuredCount = useMemo(() => products.filter((item) => item.isFeatured).length, [products]);
  const newArrivalsCount = useMemo(() => products.filter((item) => item.isNew).length, [products]);
  const newInquiriesCount = useMemo(() => inquiries.filter((inq) => inq.status === "New").length, [inquiries]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.collection.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  if (!isLoggedIn) {
    return (
      <div className="app-screen flex min-h-screen items-center justify-center bg-muted/50 px-5 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[36px] border bg-card p-8 shadow-2xl">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <Lock size={28} />
          </div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-accent">MERASH Concierge</p>
          <h1 className="font-serif text-4xl">Admin Control Room</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Sign in to manage catalog items, stock counts, featured edits, customer inquiries, and store contact settings.
          </p>
          <form
            className="mt-8 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setIsLoggedIn(true);
              showToast("Welcome to MERASH Admin Control Room");
            }}
          >
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Admin Email</label>
              <input className="min-h-14 w-full rounded-2xl border bg-background px-4 text-sm" placeholder="Email" defaultValue="owner@merash.in" required />
            </div>
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Password</label>
              <input className="min-h-14 w-full rounded-2xl border bg-background px-4 text-sm" type="password" placeholder="Password" defaultValue="merash" required />
            </div>
            <button type="submit" className="magnetic-button flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-primary text-xs uppercase tracking-[0.24em] text-primary-foreground">
              <LogIn size={16} />
              Enter Control Room
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { id: "dashboard" as AdminTab, icon: LayoutDashboard, label: "Dashboard" },
    { id: "products" as AdminTab, icon: Package, label: "Products", badge: products.length },
    { id: "add-product" as AdminTab, icon: Plus, label: "Add Product" },
    { id: "inquiries" as AdminTab, icon: Inbox, label: "Inquiries", badge: newInquiriesCount > 0 ? newInquiriesCount : undefined },
    { id: "settings" as AdminTab, icon: Settings, label: "Settings" },
  ];

  return (
    <div className="app-screen min-h-screen bg-background pt-20 md:pt-0">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-5 left-1/2 z-[100] -translate-x-1/2 rounded-full border bg-primary px-6 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground shadow-2xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Top Admin Navigation */}
      <div className="fixed top-0 inset-x-0 z-40 flex items-center justify-between border-b bg-background/90 px-5 py-4 backdrop-blur-xl md:hidden">
        <Link href="/" className="font-serif text-2xl tracking-[0.3em]">MERASH</Link>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium capitalize">{activeTab}</span>
          <button onClick={() => setMobileMenuOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full border">
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-md md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="ml-auto h-full w-4/5 max-w-xs border-l bg-background p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-6 border-b">
                <p className="font-serif text-2xl tracking-[0.3em]">MERASH</p>
                <button onClick={() => setMobileMenuOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full border">
                  <X size={16} />
                </button>
              </div>
              <div className="mt-6 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium transition-colors ${
                      activeTab === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon size={18} />
                      {item.label}
                    </span>
                    {item.badge && <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] text-accent">{item.badge}</span>}
                  </button>
                ))}
              </div>
              <div className="mt-12 pt-6 border-t">
                <button onClick={() => setIsLoggedIn(false)} className="flex w-full items-center gap-3 text-red-500 text-sm font-medium px-4 py-3 rounded-2xl hover:bg-red-500/10">
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-[260px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden min-h-screen border-r bg-card px-5 py-8 md:block">
          <div className="mb-10">
            <Link href="/" className="font-serif text-3xl tracking-[0.34em]">MERASH</Link>
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.3em] text-accent">Control Room</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition-all ${
                  activeTab === item.id ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon size={18} strokeWidth={1.5} />
                  {item.label}
                </span>
                {item.badge && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeTab === item.id ? "bg-white/20 text-white" : "bg-accent/15 text-accent"}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-20 rounded-2xl border bg-muted/50 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Signed in as</p>
            <p className="mt-1 font-serif text-sm">owner@merash.in</p>
            <button onClick={() => setIsLoggedIn(false)} className="mt-4 flex items-center gap-2 text-xs text-red-500 hover:underline">
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="px-5 py-8 md:px-8 lg:px-10">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent">MERASH Atelier Management</p>
              <h1 className="font-serif text-4xl leading-tight md:text-6xl">
                {activeTab === "dashboard" && "Atelier Dashboard"}
                {activeTab === "products" && "Product Catalog"}
                {activeTab === "add-product" && "Add New Product"}
                {activeTab === "inquiries" && "Client Inquiries"}
                {activeTab === "settings" && "Store Settings"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/shop" target="_blank" className="flex items-center gap-2 rounded-full border px-5 py-3 text-xs uppercase tracking-[0.2em] hover:bg-muted">
                <Eye size={15} />
                Live Store
              </Link>
              {activeTab !== "add-product" && (
                <button onClick={() => setActiveTab("add-product")} className="magnetic-button flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground">
                  <Plus size={16} />
                  Add Piece
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Products", value: products.length, helper: `${products.length - hiddenProductIds.length} visible in store`, icon: Package },
                  { label: "Total Inventory", value: totalStock, helper: "Units across all pieces", icon: LayoutDashboard },
                  { label: "Featured Edit", value: featuredCount, helper: "Spotlighted on homepage", icon: Star },
                  { label: "New Inquiries", value: newInquiriesCount, helper: "Pending customer responses", icon: Inbox },
                ].map((stat) => (
                  <div key={stat.label} className="luxury-card p-6">
                    <stat.icon className="mb-6 text-accent" size={24} strokeWidth={1.4} />
                    <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 font-serif text-4xl md:text-5xl">{stat.value}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{stat.helper}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Products */}
                <div className="luxury-card p-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <h2 className="font-serif text-2xl">Recent Products</h2>
                    <button onClick={() => setActiveTab("products")} className="text-xs uppercase tracking-[0.2em] text-accent hover:underline">View All</button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {products.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-10 overflow-hidden rounded-xl bg-muted">
                            <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.category} · {formatINR(item.price)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 text-[9px] uppercase rounded-full ${item.stock > 0 ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"}`}>
                            {item.stock > 0 ? `${item.stock} in stock` : "Sold Out"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Client Inquiries */}
                <div className="luxury-card p-6">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <h2 className="font-serif text-2xl">Client Orders & Messages</h2>
                    <button onClick={() => setActiveTab("inquiries")} className="text-xs uppercase tracking-[0.2em] text-accent hover:underline">View All</button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {inquiries.length > 0 ? (
                      inquiries.slice(0, 4).map((inq) => (
                        <div key={inq.id} className="rounded-2xl border p-4">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-sm">{inq.name}</span>
                            <span className={`text-[9px] uppercase px-2.5 py-0.5 rounded-full ${inq.status === "New" ? "bg-accent/20 text-accent font-semibold" : "bg-muted text-muted-foreground"}`}>
                              {inq.status}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{inq.message}</p>
                          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>{inq.phone}</span>
                            <a href={`https://wa.me/${inq.phone.replace(/[^\d]/g, "")}`} target="_blank" className="flex items-center gap-1 text-accent hover:underline font-medium">
                              <MessageCircle size={12} /> WhatsApp
                            </a>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground py-8 text-center">No inquiries logged yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT */}
          {activeTab === "products" && (
            <div className="space-y-6">
              {/* Search & Stats Bar */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border bg-card p-4">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products by name, category, collection..."
                    className="w-full rounded-2xl border bg-background pl-11 pr-4 py-3 text-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
              </div>

              {/* Products Table */}
              <div className="luxury-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left">
                    <thead>
                      <tr className="border-b bg-muted/60 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                        <th className="px-6 py-4 font-medium">Product</th>
                        <th className="px-6 py-4 font-medium">Category</th>
                        <th className="px-6 py-4 font-medium">Price</th>
                        <th className="px-6 py-4 font-medium">Stock</th>
                        <th className="px-6 py-4 font-medium">Badges / Visibility</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                      {filteredProducts.map((product) => {
                        const isHidden = hiddenProductIds.includes(product.id);
                        return (
                          <tr key={product.id} className={`transition-colors hover:bg-muted/40 ${isHidden ? "opacity-50" : ""}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="relative h-16 w-12 overflow-hidden rounded-xl bg-muted border">
                                  <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                                </div>
                                <div>
                                  <p className="font-serif text-base">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">{product.collection}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                            <td className="px-6 py-4 font-medium">{formatINR(product.price)}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={product.stock}
                                  onChange={(e) => {
                                    updateStock(product.id, parseInt(e.target.value) || 0);
                                    showToast(`Stock updated for ${product.name}`);
                                  }}
                                  className="w-16 rounded-xl border bg-background px-2.5 py-1.5 text-center text-xs font-semibold"
                                />
                                <span className="text-[10px] text-muted-foreground">units</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1.5">
                                <button
                                  onClick={() => {
                                    toggleProductFlag(product.id, "isFeatured");
                                    showToast(`Updated Featured state for ${product.name}`);
                                  }}
                                  className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-[0.18em] transition-colors ${
                                    product.isFeatured ? "bg-accent text-accent-foreground font-semibold" : "border text-muted-foreground hover:bg-muted"
                                  }`}
                                >
                                  Featured
                                </button>
                                <button
                                  onClick={() => {
                                    toggleProductFlag(product.id, "isNew");
                                    showToast(`Updated New state for ${product.name}`);
                                  }}
                                  className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-[0.18em] transition-colors ${
                                    product.isNew ? "bg-primary text-primary-foreground font-semibold" : "border text-muted-foreground hover:bg-muted"
                                  }`}
                                >
                                  New
                                </button>
                                <button
                                  onClick={() => {
                                    toggleProductFlag(product.id, "isVisible");
                                    showToast(`Toggled visibility for ${product.name}`);
                                  }}
                                  className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-[0.18em] transition-colors ${
                                    !isHidden ? "border border-green-500/50 text-green-600 bg-green-500/10 font-semibold" : "border border-red-500/30 text-red-500 bg-red-500/10"
                                  }`}
                                >
                                  {!isHidden ? "Visible" : "Hidden"}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 text-muted-foreground">
                                <button
                                  onClick={() => setPreviewProductId(product.id)}
                                  title="Preview Product"
                                  className="flex h-9 w-9 items-center justify-center rounded-full border hover:bg-muted hover:text-foreground"
                                >
                                  <Eye size={15} />
                                </button>
                                <button
                                  onClick={() => setEditingProduct(product)}
                                  title="Edit Product"
                                  className="flex h-9 w-9 items-center justify-center rounded-full border hover:bg-muted hover:text-foreground"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  onClick={() => setDeletingProductId(product.id)}
                                  title="Delete Product"
                                  className="flex h-9 w-9 items-center justify-center rounded-full border hover:border-red-500 hover:text-red-500"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADD PRODUCT */}
          {activeTab === "add-product" && (
            <div className="max-w-3xl mx-auto">
              <AddProductForm
                onSuccess={() => {
                  showToast("New product created and published to live catalog!");
                  setActiveTab("products");
                }}
              />
            </div>
          )}

          {/* TAB 4: CLIENT INQUIRIES */}
          {activeTab === "inquiries" && (
            <div className="space-y-6">
              <div className="luxury-card p-6">
                <h2 className="font-serif text-3xl">Customer Order & Inquiry Log</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Inquiries submitted by users via the Store Enquiry form appear here. Reach out on WhatsApp or Call to complete door delivery arrangements.
                </p>
                <div className="mt-6 space-y-4">
                  {inquiries.length > 0 ? (
                    inquiries.map((inq) => (
                      <div key={inq.id} className="rounded-3xl border bg-background p-6 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-serif text-2xl">{inq.name}</h3>
                              <span
                                className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full font-semibold ${
                                  inq.status === "New" ? "bg-accent text-accent-foreground" : inq.status === "Contacted" ? "bg-blue-500/20 text-blue-600" : "bg-green-500/20 text-green-600"
                                }`}
                              >
                                {inq.status}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                              <Clock size={13} /> Logged on {inq.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={inq.status}
                              onChange={(e) => {
                                updateInquiryStatus(inq.id, e.target.value as Inquiry["status"]);
                                showToast(`Inquiry status updated for ${inq.name}`);
                              }}
                              className="rounded-full border bg-card px-4 py-2 text-xs font-medium"
                            >
                              <option value="New">Mark as New</option>
                              <option value="Contacted">Mark as Contacted</option>
                              <option value="Completed">Mark as Completed</option>
                            </select>
                            <button
                              onClick={() => {
                                deleteInquiry(inq.id);
                                showToast(`Inquiry removed`);
                              }}
                              className="flex h-9 w-9 items-center justify-center rounded-full border text-muted-foreground hover:text-red-500"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-sm leading-7 text-foreground/90">{inq.message}</p>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(`Hi ${inq.name}, thank you for contacting MERASH regarding your inquiry: "${inq.message}"`)}`}
                            target="_blank"
                            className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-accent-foreground font-medium"
                          >
                            <MessageCircle size={15} /> Chat on WhatsApp
                          </a>
                          <a href={`tel:${inq.phone}`} className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs uppercase tracking-[0.2em] hover:bg-muted">
                            <Phone size={15} /> Call Client ({inq.phone})
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <Inbox className="mx-auto text-accent mb-4" size={36} />
                      <p className="font-serif text-2xl">No customer inquiries recorded yet.</p>
                      <p className="text-sm text-muted-foreground mt-2">When users submit the Contact form, their order requests will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <SettingsForm
                settings={settings}
                onSave={(newSettings) => {
                  updateSettings(newSettings);
                  showToast("Store settings saved successfully!");
                }}
              />
            </div>
          )}
        </main>
      </div>

      {/* EDIT PRODUCT MODAL */}
      <AnimatePresence>
        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={(updated) => {
              useAppStore.getState().updateProduct(editingProduct.id, updated);
              setEditingProduct(null);
              showToast(`Updated details for ${updated.name || editingProduct.name}`);
            }}
          />
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingProductId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md rounded-[32px] border bg-card p-6 shadow-2xl">
              <h3 className="font-serif text-3xl">Delete Product?</h3>
              <p className="mt-3 text-sm text-muted-foreground">Are you sure you want to permanently remove this piece from the catalog? This action cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setDeletingProductId(null)} className="rounded-full border px-6 py-3 text-xs uppercase tracking-[0.2em]">Cancel</button>
                <button
                  onClick={() => {
                    deleteProduct(deletingProductId);
                    setDeletingProductId(null);
                    showToast("Product deleted successfully");
                  }}
                  className="rounded-full bg-red-600 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREVIEW PRODUCT MODAL */}
      <AnimatePresence>
        {previewProductId && (
          <PreviewModal productId={previewProductId} onClose={() => setPreviewProductId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------------------------------------------------------------
// ADD PRODUCT FORM COMPONENT
// ----------------------------------------------------------------------
function AddProductForm({ onSuccess }: { onSuccess: () => void }) {
  const addProduct = useAppStore((state) => state.addProduct);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Women");
  const [collection, setCollection] = useState("Atelier Evening");
  const [stock, setStock] = useState("10");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1617922001439-4a2e6562f328?q=80&w=1200&auto=format&fit=crop");
  const [material, setMaterial] = useState("Premium Silk Blend");
  const [care, setCare] = useState("Dry clean recommended.");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState<string[]>(["S", "M", "L", "XL"]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name,
      price: parseFloat(price) || 1999,
      category,
      collection,
      stock: parseInt(stock) || 10,
      image: image || "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?q=80&w=1200&auto=format&fit=crop",
      gallery: [image],
      material,
      care,
      description: description || "An exquisite piece crafted with luxury proportions and finest finish.",
      details: ["Handcrafted finish", "Premium weave"],
      rating: 4.9,
      reviewCount: 1,
      tags: [category, "New Arrivals", "Premium Wear"],
      sizes,
      colors: [{ name: "Noir", value: "#111111" }, { name: "Ivory", value: "#e7dac0" }],
      isNew: true,
      isFeatured: true,
      isTrending: true,
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="luxury-card p-6 md:p-8 space-y-6">
      <div>
        <h2 className="font-serif text-3xl">Add New Atelier Piece</h2>
        <p className="mt-1 text-sm text-muted-foreground">Fill in details to add a new clothing piece to the live MERASH catalog.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Product Title *</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Banaras Silk Drape Dress" className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Price in INR (₹) *</label>
          <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2999" className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-2xl border bg-background px-4 py-3 text-sm">
            {categories.slice(1).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Collection *</label>
          <select value={collection} onChange={(e) => setCollection(e.target.value)} className="w-full rounded-2xl border bg-background px-4 py-3 text-sm">
            {collectionList.map((col) => (
              <option key={col.name} value={col.name}>{col.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Initial Stock Count *</label>
          <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Main Image URL *</label>
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" />
        {image && (
          <div className="mt-3 flex items-center gap-4 border rounded-2xl p-3 bg-muted/40">
            <div className="relative h-16 w-12 overflow-hidden rounded-xl bg-muted border">
              <Image src={image} alt="Preview" fill sizes="48px" className="object-cover" />
            </div>
            <p className="text-xs text-muted-foreground">Live image thumbnail preview</p>
          </div>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Material / Fabric</label>
          <input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="e.g. Pure Silk Blend" className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Garment Care</label>
          <input value={care} onChange={(e) => setCare(e.target.value)} placeholder="e.g. Dry clean recommended" className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Product Description</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the silhouette, drape, and occasion suitability..." className="w-full rounded-2xl border bg-background px-4 py-3 text-sm resize-none" />
      </div>

      <button type="submit" className="magnetic-button w-full rounded-full bg-primary px-8 py-4 text-xs uppercase tracking-[0.24em] text-primary-foreground font-medium">
        Publish Creation to Catalog
      </button>
    </form>
  );
}

// ----------------------------------------------------------------------
// EDIT PRODUCT MODAL COMPONENT
// ----------------------------------------------------------------------
function EditProductModal({ product, onClose, onSave }: { product: Product; onClose: () => void; onSave: (updated: Partial<Product>) => void }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [category, setCategory] = useState(product.category);
  const [stock, setStock] = useState(product.stock.toString());
  const [image, setImage] = useState(product.image);
  const [description, setDescription] = useState(product.description);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[36px] border bg-card p-6 md:p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="font-serif text-3xl">Edit Piece</h2>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border">
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Title</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Price (₹)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Stock</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-2xl border bg-background px-4 py-3 text-sm">
              {categories.slice(1).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Image URL</label>
            <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-2xl border bg-background px-4 py-3 text-sm resize-none" />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
            <button onClick={onClose} className="rounded-full border px-6 py-3 text-xs uppercase tracking-[0.2em]">Cancel</button>
            <button
              onClick={() => onSave({ name, price: parseFloat(price) || 0, category, stock: parseInt(stock) || 0, image, description })}
              className="rounded-full bg-primary px-6 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// PREVIEW MODAL COMPONENT
// ----------------------------------------------------------------------
function PreviewModal({ productId, onClose }: { productId: string; onClose: () => void }) {
  const products = useAppStore((state) => state.products);
  const product = products.find((p) => p.id === productId);

  if (!product) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[36px] border bg-background p-6 md:p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-accent">{product.collection}</span>
            <h2 className="font-serif text-3xl mt-1">{product.name}</h2>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border">
            <X size={16} />
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
            <Image src={product.image} alt={product.name} fill sizes="300px" className="object-cover" />
          </div>
          <div className="space-y-4 text-sm">
            <p className="font-serif text-2xl">{formatINR(product.price)}</p>
            <p className="text-muted-foreground leading-6">{product.description}</p>
            <div className="space-y-1 text-xs text-muted-foreground pt-3 border-t">
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Material:</strong> {product.material}</p>
              <p><strong>Stock:</strong> {product.stock} units available</p>
            </div>
            <Link href={`/product/${product.id}`} target="_blank" className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent hover:underline">
              Open Full Product Page →
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// SETTINGS FORM COMPONENT
// ----------------------------------------------------------------------
function SettingsForm({ settings, onSave }: { settings: any; onSave: (settings: any) => void }) {
  const [ownerPhone, setOwnerPhone] = useState(settings.ownerPhone);
  const [ownerDisplayPhone, setOwnerDisplayPhone] = useState(settings.ownerDisplayPhone);
  const [whatsappPhone, setWhatsappPhone] = useState(settings.whatsappPhone);
  const [sameCityDelivery, setSameCityDelivery] = useState(settings.sameCityDelivery);
  const [confirmationRequired, setConfirmationRequired] = useState(settings.confirmationRequired);
  const [whatsappOrdersEnabled, setWhatsappOrdersEnabled] = useState(settings.whatsappOrdersEnabled);
  const [bannerText, setBannerText] = useState(settings.bannerText);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ownerPhone, ownerDisplayPhone, whatsappPhone, sameCityDelivery, confirmationRequired, whatsappOrdersEnabled, bannerText });
      }}
      className="luxury-card p-6 md:p-8 space-y-6"
    >
      <div>
        <h2 className="font-serif text-3xl">Store & Contact Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Configure global phone numbers, WhatsApp order routing, and delivery options.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Owner Call Phone Number</label>
          <input value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Formatted Display Phone</label>
          <input value={ownerDisplayPhone} onChange={(e) => setOwnerDisplayPhone(e.target.value)} className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">WhatsApp Order Number</label>
          <input value={whatsappPhone} onChange={(e) => setWhatsappPhone(e.target.value)} className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Homepage Announcement Banner</label>
          <input value={bannerText} onChange={(e) => setBannerText(e.target.value)} className="w-full rounded-2xl border bg-background px-4 py-3 text-sm" />
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t text-sm">
        <label className="flex items-center justify-between border rounded-2xl p-4 cursor-pointer hover:bg-muted/30">
          <span>Same-City Door Delivery Option</span>
          <input type="checkbox" checked={sameCityDelivery} onChange={(e) => setSameCityDelivery(e.target.checked)} className="h-5 w-5 accent-[var(--accent)]" />
        </label>
        <label className="flex items-center justify-between border rounded-2xl p-4 cursor-pointer hover:bg-muted/30">
          <span>Owner Confirmation Before Dispatch</span>
          <input type="checkbox" checked={confirmationRequired} onChange={(e) => setConfirmationRequired(e.target.checked)} className="h-5 w-5 accent-[var(--accent)]" />
        </label>
        <label className="flex items-center justify-between border rounded-2xl p-4 cursor-pointer hover:bg-muted/30">
          <span>WhatsApp Direct Ordering Enabled</span>
          <input type="checkbox" checked={whatsappOrdersEnabled} onChange={(e) => setWhatsappOrdersEnabled(e.target.checked)} className="h-5 w-5 accent-[var(--accent)]" />
        </label>
      </div>

      <button type="submit" className="magnetic-button w-full rounded-full bg-primary px-8 py-4 text-xs uppercase tracking-[0.24em] text-primary-foreground font-medium">
        Save Settings
      </button>
    </form>
  );
}
