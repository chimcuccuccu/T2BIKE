"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { CartItem } from "@/types/cart-item"
import { Product } from "@/types/product"
import { useUser } from "@/hooks/useUser"
import { useToast } from "@/hooks/use-toast"

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
  const { user, isLoading } = useUser()
  const { toast } = useToast()

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      fetchCartFromDB(Number(user.id));
    } else {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error);
        }
      }
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (user) {
      saveCartToDB(Number(user.id), cart)
    } else {
      // Lưu giỏ hàng vào localStorage nếu chưa đăng nhập
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, user])

  const fetchCartFromDB = async (userId: number) => {
    try {
      const res = await fetch(`http://localhost:8081/api/cart/${userId}`)
      if (!res.ok) throw new Error('Failed to fetch cart')
      const data = await res.json()
      // Convert response to CartItem format
      const cartItems: CartItem[] = data.items.map((item: any) => ({
        id: item.id,
        userId: userId,
        productId: item.productId,
        product: {
          name: item.productName,
          price: item.price,
          description: '',
          imageUrls: [],
          category: '',
          brand: '',
          color: [],
          quantity: 0
        },
        quantity: item.quantity
      }));

      setCart(cartItems);

    } catch (error) {
      console.error("Failed to fetch cart from DB:", error)
    }
  }

  const toggleCartItem = async (product: Product) => {
    if (!user || isLoading) {
      console.warn("Bạn chưa đăng nhập hoặc chưa sẵn sàng thao tác giỏ hàng");
      return;
    }
  
    const isInCartNow = cart.some(item => item.productId === product.id);
  
    if (isInCartNow) {
      await removeFromCart(product.id);
      await fetchCartFromDB(Number(user.id)); 
    } else {
      try {
        const res = await fetch('http://localhost:8081/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: Number(user.id),
            productId: product.id,
            quantity: 1
          })
        });
  
        if (!res.ok) throw new Error("Lỗi khi thêm vào giỏ hàng");
  
        await fetchCartFromDB(Number(user.id));
      } catch (error) {
        console.error("Lỗi khi toggle sản phẩm vào giỏ hàng:", error);
      }
    }
  };
  

  const removeFromCart = async (productId: number) => {
    if (!user) {
      console.warn("Bạn chưa đăng nhập nên không thể thao tác giỏ hàng");
      return;
    }

    if (isLoading || !user) {
      console.warn("Chưa sẵn sàng thao tác giỏ hàng");
      return;
    }

    try {
      const cartItem = cart.find(item => item.productId == productId);
      if (!cartItem) return;

      console.log("Cart hiện tại:", cart);
      console.log("Sản phẩm cần xóa:", cartItem);

      await fetch(`http://localhost:8081/api/cart/delete/${cartItem.id}`, {
        method: 'DELETE'
      });
      
      await fetchCartFromDB(Number(user.id));
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!user) {
      console.warn("Bạn chưa đăng nhập nên không thể thao tác giỏ hàng")
      return
    }

    if (isLoading || !user) {
      console.warn("Chưa sẵn sàng thao tác giỏ hàng");
      return;
    }

    try {
      await fetch(`http://localhost:8081/api/cart/update/${cartItemId}?quantity=${quantity}`, {
        method: 'PUT'
      });

      // Update local state
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === cartItemId ? { ...item, quantity } : item
        )
      )
    } catch (error) {
      console.error("Failed to update cart item quantity:", error);
    }
  }

  const clearCart = async () => {
    if (!user) {
      console.warn("Bạn chưa đăng nhập nên không thể thao tác giỏ hàng")
      return
    }

    if (isLoading || !user) {
      console.warn("Chưa sẵn sàng thao tác giỏ hàng");
      return;
    }

    try {
      await fetch(`http://localhost:8081/api/cart/clear/${user.id}`, {
        method: 'DELETE'
      });

      setCart([])
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  }

  const isInCart = (productId: number) => {
    console.log("Checking if product is in cart:", { productId, cart });
    return cart.some((item) => item.productId === productId);
  }

  const saveCartToDB = async (userId: number, cart: CartItem[]) => {
    try {
      const cartItems = cart.map(item => ({
        userId: userId,
        productId: item.productId,
        quantity: item.quantity
      }))

      for (const item of cartItems) {
        await fetch('http://localhost:8081/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        })
      }

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