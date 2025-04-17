"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { CartItem } from "@/types/cart-item"
import { Product } from "@/types/product"
import { useUser } from "@/hooks/useUser"

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
  const user = useUser()

  // Lấy giỏ hàng từ localStorage hoặc API nếu người dùng đã đăng nhập
  useEffect(() => {
    if (user) {
      fetchCartFromDB(Number(user.id))
    } else {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart))
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error)
        }
      }
    }
  }, [user]) // Khi `user` thay đổi, giỏ hàng sẽ được tải lại

  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, user]) // Đồng bộ giỏ hàng vào localStorage khi có thay đổi

  const fetchCartFromDB = async (userId: number) => {
    try {
      const res = await fetch(`/api/cart/${userId}`)
      const data: CartItem[] = await res.json()
      setCart(data)
    } catch (error) {
      console.error("Failed to fetch cart from DB:", error)
    }
  }

  const toggleCartItem = (product: Product) => {
    if (!user) {
      console.warn("Bạn chưa đăng nhập nên không thể thao tác giỏ hàng")
      return
    }
  
    setCart((prevCart) => {
      const isInCart = prevCart.some((item) => item.productId === product.id)
      console.log("Toggling cart item:", { product, isInCart })
  
      let updatedCart: CartItem[]
      if (isInCart) {
        // Xóa khỏi giỏ hàng
        updatedCart = prevCart.filter((item) => item.productId !== product.id)
      } else {
        // Thêm vào giỏ hàng
        const newCartItem: CartItem = {
          id: Date.now(),
          userId: Number(user.id),
          productId: product.id,
          product: product,
          quantity: 1,
        }
        updatedCart = [...prevCart, newCartItem]
      }
  
      console.log("Updated cart:", updatedCart)
      saveCartToDB(Number(user.id), updatedCart)
  
      return updatedCart
    })
  }

  const removeFromCart = (productId: number) => {
    if (!user) {
      console.warn("Bạn chưa đăng nhập nên không thể thao tác giỏ hàng");
      return;
    }
  
    setCart((prevCart) => {
      // Lọc giỏ hàng để loại bỏ sản phẩm theo productId
      const updatedCart = prevCart.filter((item) => item.productId !== productId);
  
      if (!user) {
        // Nếu chưa đăng nhập, lưu vào localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } else {
        // Nếu đã đăng nhập, gọi hàm lưu giỏ hàng vào DB
        saveCartToDB(Number(user.id), updatedCart);
      }
  
      return updatedCart;
    });
  };

  const updateQuantity = (cartItemId: number, quantity: number) => {
    if (!user) {
      console.warn("Bạn chưa đăng nhập nên không thể thao tác giỏ hàng")
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    if (!user) {
      console.warn("Bạn chưa đăng nhập nên không thể thao tác giỏ hàng")
      return
    }

    setCart([])
  }

  const isInCart = (productId: number) => {
    console.log("Checking if product is in cart:", { productId, cart });
    return cart.some((item) => item.productId === productId);
  }

  const saveCartToDB = async (userId: number, cart: CartItem[]) => {
    try {
      await fetch(`/api/cart/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart),
      })
    } catch (error) {
      console.error("Failed to save cart to DB:", error)
    }
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart: toggleCartItem, removeFromCart, updateQuantity, clearCart, isInCart }}
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
