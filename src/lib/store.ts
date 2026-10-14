'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product, StoreSettings, BuyerProfile } from '@/types';
import { DEFAULT_SETTINGS, INITIAL_PRODUCTS } from './constants';

interface AppStore {
  // Products
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductStatus: (id: string, status: Product['status']) => void;
  resetToInitialProducts: () => void;

  // Store Settings
  settings: StoreSettings;
  updateSettings: (settings: Partial<StoreSettings>) => void;

  // Cart State
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Quick Nego / Order Modal
  negoModal: {
    isOpen: boolean;
    product: Product | null;
  };
  openNegoModal: (product: Product) => void;
  closeNegoModal: () => void;

  // Buyer Info (Persistent)
  buyer: BuyerProfile;
  setBuyer: (buyer: Partial<BuyerProfile>) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Products
      products: INITIAL_PRODUCTS,
      setProducts: (products) => set({ products }),
      addProduct: (product) =>
        set((state) => ({ products: [product, ...state.products] })),
      updateProduct: (id, updated) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updated, updatedAt: new Date().toISOString() } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          cart: state.cart.filter((item) => item.product.id !== id),
        })),
      updateProductStatus: (id, status) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p
          ),
        })),
      resetToInitialProducts: () => set({ products: INITIAL_PRODUCTS }),

      // Settings
      settings: DEFAULT_SETTINGS,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Cart
      cart: [],
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      addToCart: (product) => {
        const { cart } = get();
        if (product.status !== 'ready') return;
        const existing = cart.find((item) => item.product.id === product.id);
        if (existing) {
          // Hanya 1 item per barang unik karena barang preloved/katalog pribadi
          return;
        }
        set({ cart: [...cart, { product, quantity: 1 }], isCartOpen: true });
      },
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),
      clearCart: () => set({ cart: [] }),

      // Quick Nego Modal
      negoModal: {
        isOpen: false,
        product: null,
      },
      openNegoModal: (product) =>
        set({
          negoModal: {
            isOpen: true,
            product,
          },
        }),
      closeNegoModal: () =>
        set({
          negoModal: {
            isOpen: false,
            product: null,
          },
        }),

      // Buyer Info
      buyer: {
        name: '',
        city: '',
      },
      setBuyer: (buyer) =>
        set((state) => ({
          buyer: { ...state.buyer, ...buyer },
        })),
    }),
    {
      name: 'sneering_store_storage',
      version: 5,
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : null as any)),
      partialize: (state) => ({
        products: state.products,
        settings: state.settings,
        cart: state.cart,
        buyer: state.buyer,
      }),
      migrate: (persistedState: any, version: number) => {
        if (version < 5) {
          return {
            ...persistedState,
            products: INITIAL_PRODUCTS,
            settings: {
              ...DEFAULT_SETTINGS,
              ...(persistedState?.settings || {}),
              locationCity: 'Gubeng, Surabaya',
              whatsappNumber: '62895635595069',
              storeName: 'SNEERING CATALOG',
              tagline: 'Merchandise Mobile Legends & Koleksi Eksklusif Mapzone',
            },
          };
        }
        return persistedState;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Refresh products jika masih pakai data sample lama / ada teks titipan teman
          if (
            !state.products ||
            state.products.length === 0 ||
            state.products.some(
              (p) =>
                p.id === 'prod-1' ||
                p.images[0]?.includes('unsplash.com') ||
                p.stockBreakdown?.includes('titipan') ||
                p.hasFriendItem
            )
          ) {
            state.products = INITIAL_PRODUCTS;
          }
          if (state.settings) {
            state.settings.whatsappNumber = '62895635595069';
            state.settings.locationCity = 'Gubeng, Surabaya';
            state.settings.tagline = 'Merchandise Mobile Legends & Koleksi Eksklusif Mapzone';
          }
        }
      },
    }
  )
);
