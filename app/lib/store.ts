"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppStore = {
  wishlist: string[];
  recentSearches: string[];
  recentlyViewed: string[];
  quickViewId: string | null;
  searchOpen: boolean;
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
      wishlist: [],
      recentSearches: [],
      recentlyViewed: [],
      quickViewId: null,
      searchOpen: false,
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
      name: "mirus-app-state",
      partialize: (state) => ({
        wishlist: state.wishlist,
        recentSearches: state.recentSearches,
        recentlyViewed: state.recentlyViewed,
      }),
    },
  ),
);
