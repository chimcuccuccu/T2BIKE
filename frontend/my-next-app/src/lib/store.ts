import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Product } from "@/types/product"

type WishlistStore = {
  wishlist: Product[]
  
  // Wishlist actions
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
  wishlistCount: () => number
}

export const useStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],

      addToWishlist: (product) => {
        const { wishlist } = get()
        const existingItem = wishlist.find((item) => item.id === product.id)

        if (!existingItem) {
          set({ wishlist: [...wishlist, product] })
        }
      },

      removeFromWishlist: (productId) => {
        const { wishlist } = get()
        set({ wishlist: wishlist.filter((item) => item.id !== productId) })
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.id === productId)
      },

      wishlistCount: () => {
        return get().wishlist.length
      },
    }),
    {
      name: "wishlist-store",
    },
  ),
)
