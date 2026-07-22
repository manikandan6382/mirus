"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as defaultProducts, type Product } from "./products";

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  message: string;
  date: string;
  status: "New" | "Contacted" | "Completed";
};

export type StoreSettings = {
  ownerPhone: string;
  ownerDisplayPhone: string;
  whatsappPhone: string;
  sameCityDelivery: boolean;
  confirmationRequired: boolean;
  whatsappOrdersEnabled: boolean;
  bannerText: string;
};

const initialSettings: StoreSettings = {
  ownerPhone: "+919876543210",
  ownerDisplayPhone: "+91 98765 43210",
  whatsappPhone: "+919876543210",
  sameCityDelivery: true,
  confirmationRequired: true,
  whatsappOrdersEnabled: true,
  bannerText: "New Season Drop · Door Delivery Available",
};

const initialInquiries: Inquiry[] = [
  {
    id: "inq-1",
    name: "Aarohi Mehta",
    phone: "+91 98200 12345",
    message: "Interested in Banaras Silk Drape Dress in size M. Is same-day delivery available?",
    date: "2026-07-22 14:30",
    status: "New",
  },
  {
    id: "inq-2",
    name: "Rohan Kapoor",
    phone: "+91 98111 67890",
    message: "Need 2 MERASH Nehru Jackets for a wedding event next week.",
    date: "2026-07-21 18:15",
    status: "Contacted",
  },
];

type AppStore = {
  products: Product[];
  inquiries: Inquiry[];
  settings: StoreSettings;
  hiddenProductIds: string[];
  wishlist: string[];
  recentSearches: string[];
  recentlyViewed: string[];
  quickViewId: string | null;
  searchOpen: boolean;

  // Product Actions
  addProduct: (productData: Omit<Product, "id"> & { id?: string }) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductFlag: (id: string, flag: "isFeatured" | "isNew" | "isTrending" | "isVisible") => void;
  updateStock: (id: string, stock: number) => void;

  // Inquiry Actions
  addInquiry: (name: string, phone: string, message: string) => void;
  updateInquiryStatus: (id: string, status: Inquiry["status"]) => void;
  deleteInquiry: (id: string) => void;

  // Settings Actions
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // UI Actions
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  addRecentSearch: (query: string) => void;
  addRecentlyViewed: (id: string) => void;
  openQuickView: (id: string) => void;
  closeQuickView: () => void;
  openSearch: () => void;
  closeSearch: () => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      products: defaultProducts,
      inquiries: initialInquiries,
      settings: initialSettings,
      hiddenProductIds: [],
      wishlist: [],
      recentSearches: [],
      recentlyViewed: [],
      quickViewId: null,
      searchOpen: false,

      // Product Management Actions
      addProduct: (productData) => {
        const id = productData.id || `merash-item-${Date.now()}`;
        const newProduct: Product = {
          id,
          name: productData.name || "Untitled Creation",
          price: Number(productData.price) || 999,
          category: productData.category || "Women",
          collection: productData.collection || "Urban Essentials",
          tags: productData.tags || ["New Arrivals", "Premium Wear"],
          image: productData.image || "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?q=80&w=1200&auto=format&fit=crop",
          gallery: productData.gallery && productData.gallery.length > 0 ? productData.gallery : [productData.image || "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?q=80&w=1200&auto=format&fit=crop"],
          isNew: productData.isNew ?? true,
          isFeatured: productData.isFeatured ?? true,
          isTrending: productData.isTrending ?? false,
          stock: Number(productData.stock) ?? 10,
          rating: 4.9,
          reviewCount: 1,
          material: productData.material || "Premium Handcrafted Fabric",
          care: productData.care || "Dry clean recommended.",
          description: productData.description || "An exquisite piece crafted with precision.",
          details: productData.details || ["Premium weave", "Handcrafted finish"],
          sizes: productData.sizes && productData.sizes.length > 0 ? productData.sizes : ["S", "M", "L", "XL"],
          colors: productData.colors && productData.colors.length > 0 ? productData.colors : [{ name: "Default", value: "#111111" }],
        };
        set((state) => ({ products: [newProduct, ...state.products] }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((item) => (item.id === id ? { ...item, ...updates } : item)),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((item) => item.id !== id),
          wishlist: state.wishlist.filter((itemId) => itemId !== id),
          recentlyViewed: state.recentlyViewed.filter((itemId) => itemId !== id),
        }));
      },

      toggleProductFlag: (id, flag) => {
        if (flag === "isVisible") {
          set((state) => ({
            hiddenProductIds: state.hiddenProductIds.includes(id)
              ? state.hiddenProductIds.filter((item) => item !== id)
              : [...state.hiddenProductIds, id],
          }));
          return;
        }
        set((state) => ({
          products: state.products.map((item) => (item.id === id ? { ...item, [flag]: !item[flag] } : item)),
        }));
      },

      updateStock: (id, stock) => {
        set((state) => ({
          products: state.products.map((item) => (item.id === id ? { ...item, stock: Math.max(0, stock) } : item)),
        }));
      },

      // Inquiry Actions
      addInquiry: (name, phone, message) => {
        const newInquiry: Inquiry = {
          id: `inq-${Date.now()}`,
          name: name.trim() || "Anonymous Client",
          phone: phone.trim() || "Not provided",
          message: message.trim() || "Expressed interest in MERASH catalog.",
          date: new Date().toISOString().replace("T", " ").slice(0, 16),
          status: "New",
        };
        set((state) => ({ inquiries: [newInquiry, ...state.inquiries] }));
      },

      updateInquiryStatus: (id, status) => {
        set((state) => ({
          inquiries: state.inquiries.map((item) => (item.id === id ? { ...item, status } : item)),
        }));
      },

      deleteInquiry: (id) => {
        set((state) => ({
          inquiries: state.inquiries.filter((item) => item.id !== id),
        }));
      },

      // Settings Action
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      // UI Actions
      toggleWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.includes(id)
            ? state.wishlist.filter((item) => item !== id)
            : [id, ...state.wishlist],
        })),

      isWishlisted: (id) => get().wishlist.includes(id),

      addRecentSearch: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        set((state) => ({
          recentSearches: [trimmed, ...state.recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6),
        }));
      },

      addRecentlyViewed: (id) =>
        set((state) => ({
          recentlyViewed: [id, ...state.recentlyViewed.filter((item) => item !== id)].slice(0, 8),
        })),

      openQuickView: (id) => set({ quickViewId: id }),
      closeQuickView: () => set({ quickViewId: null }),
      openSearch: () => set({ searchOpen: true }),
      closeSearch: () => set({ searchOpen: false }),
    }),
    {
      name: "merash-app-state-v2",
      partialize: (state) => ({
        products: state.products,
        inquiries: state.inquiries,
        settings: state.settings,
        hiddenProductIds: state.hiddenProductIds,
        wishlist: state.wishlist,
        recentSearches: state.recentSearches,
        recentlyViewed: state.recentlyViewed,
      }),
    },
  ),
);
