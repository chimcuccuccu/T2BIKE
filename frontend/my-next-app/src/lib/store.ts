import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Product } from "@/types/product"
import { User } from "@/types/user"


type CartStore = {
  cart: Product[]
  wishlist: Product[]
  user: User | null
  isLoggedIn: boolean

  // Auth actions
  login: (user: User) => void
  logout: () => void

  // Cart actions
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void

  // Wishlist actions
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void

  // Helpers
  isInWishlist: (productId: number) => boolean
  isInCart: (productId: number) => boolean
  cartTotal: () => number
  cartCount: () => number
  wishlistCount: () => number
}

export const useStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      user: null,
      isLoggedIn: false,

      // Auth actions
      login: (user) => {
        set({ user, isLoggedIn: true })
      },

      logout: () => {
        set({ user: null, isLoggedIn: false })
      },

      addToCart: (product) => {
        const { cart } = get()
        const existingItem = cart.find((item) => item.id === product.id)

        if (existingItem) {
          set({
            cart: cart.map((item) => (item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item)),
          })
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] })
        }
      },

      removeFromCart: (productId) => {
        const { cart } = get()
        set({ cart: cart.filter((item) => item.id !== productId) })
      },

      updateQuantity: (productId, quantity) => {
        const { cart } = get()
        set({
          cart: cart.map((item) => (item.id === productId ? { ...item, quantity } : item)),
        })
      },

      clearCart: () => set({ cart: [] }),

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

      isInCart: (productId) => {
        return get().cart.some((item) => item.id === productId)
      },

      cartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0)
      },

      cartCount: () => {
        return get().cart.length
      },

      wishlistCount: () => {
        return get().wishlist.length
      },
    }),
    {
      name: "t2bike-store",
    },
  ),
)
