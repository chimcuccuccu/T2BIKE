"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { CartItem } from "@/types/cart-item"
import { Product } from "@/types/product"

type CartContextType = {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (cartItemId: number) => void
  updateQuantity: (cartItemId: number, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === product.id)

      if (existingItem) {
        // Nếu đã có → tăng số lượng
        return prevCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Nếu chưa có → thêm mới
        const newCartItem: CartItem = {
          id: Date.now(), // ID riêng của CartItem
          userId: 0, // Tạm thời chưa có login
          productId: product.id,
          product: product,
          quantity: 1,
        }
        return [...prevCart, newCartItem]
      }
    })
  }

  const removeFromCart = (cartItemId: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.productId !== item.product.id)
      // Save the updated cart to localStorage after removing the item
      localStorage.setItem("cart", JSON.stringify(updatedCart))
      return updatedCart
    })
  }
  

  const updateQuantity = (cartItemId: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const isInCart = (productId: number) => {
    return cart.some((item) => item.productId === productId);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, isInCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
