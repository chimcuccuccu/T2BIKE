"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { CartItem } from "@/types/cart-item"
import { Product } from "@/types/product"
import { useUser } from "@/hooks/useUser"
import { useToast } from "@/hooks/use-toast"
import { WishlistItem } from "@/types/wishlist-item"

type WishlistContextType = {
  wishlist: WishlistItem[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (wishlistItemId: number) => void
  clearWishlist: () => void
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const { user, isLoading } = useUser()
  const { toast } = useToast()
  // Lấy giỏ hàng từ localStorage hoặc API nếu người dùng đã đăng nhập
  useEffect(() => {
    if (isLoading) return;

    if (user) {
      fetchWishlistFromDB(Number(user.id));
    } else {
      const savedWishlist = localStorage.getItem("cart");
      if (savedWishlist) {
        try {
          setWishlist(JSON.parse(savedWishlist));
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error);
        }
      }
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (user) {
      saveWishlistToDB(Number(user.id), wishlist)
    } else {
      // Lưu giỏ hàng vào localStorage nếu chưa đăng nhập
      localStorage.setItem("cart", JSON.stringify(wishlist));
    }
  }, [wishlist, user])

  const fetchWishlistFromDB = async (userId: number) => {
    try {
      const res = await fetch(`http://localhost:8081/api/wishlist/${userId}`)
      if (!res.ok) throw new Error('Failed to fetch wishlist')
      const data = await res.json()
      console.log("Dữ liệu wishlist từ backend:", data)

      // Convert response to CartItem format
      const wishlistItems: WishlistItem[] = data.items.map((item: any) => ({
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
      }));

      setWishlist(wishlistItems);

    } catch (error) {
      console.error("Failed to fetch cart from DB:", error)
    }
  }

  const toggleWishlistItem = async (product: Product) => {
    if (!user || isLoading) {
      console.warn("Bạn chưa đăng nhập hoặc chưa sẵn sàng thao tác giỏ hàng");
      return;
    }
  
    const isInWishlistNow = wishlist.some(item => item.productId === product.id);
  
    if (isInWishlistNow) {
      // Nếu đã có → xóa khỏi backend và cập nhật lại cart
      await removeFromWishlist(product.id);
      await fetchWishlistFromDB(Number(user.id)); // cập nhật cart có ID
    } else {
      try {
        const res = await fetch('http://localhost:8081/api/wishlist/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: Number(user.id),
            productId: product.id,
          })
        });
  
        if (!res.ok) throw new Error("Lỗi khi thêm vào giỏ hàng");
  
        // Sau khi thêm, fetch lại cart để có ID
        await fetchWishlistFromDB(Number(user.id));
      } catch (error) {
        console.error("Lỗi khi toggle sản phẩm vào giỏ hàng:", error);
      }
    }
  };
  

  const removeFromWishlist = async (productId: number) => {
    if (!user) {
      console.warn("Bạn chưa đăng nhập nên không thể thao tác giỏ hàng");
      return;
    }

    if (isLoading || !user) {
      console.warn("Chưa sẵn sàng thao tác giỏ hàng");
      return;
    }

    try {
      // Find the cart item ID
      const wishlistItem = wishlist.find(item => item.productId == productId);
      if (!wishlistItem) return;

      console.log("Cart hiện tại:", wishlist);
      console.log("Sản phẩm cần xóa:", wishlistItem);

      // Call backend API to delete
      await fetch(`http://localhost:8081/api/wishlist/delete/${wishlistItem.id}`, {
        method: 'DELETE'
      });
      
      // 🟢 Gọi lại để cập nhật cart với id từ DB
      await fetchWishlistFromDB(Number(user.id));
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const clearWishlist= async () => {
    if (!user) {
      console.warn("Bạn chưa đăng nhập nên không thể thao tác giỏ hàng")
      return
    }

    if (isLoading || !user) {
      console.warn("Chưa sẵn sàng thao tác giỏ hàng");
      return;
    }

    try {
      // Call backend API to clear cart
      await fetch(`http://localhost:8081/api/cart/clear/${user.id}`, {
        method: 'DELETE'
      });

      // Update local state
      setWishlist([])
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  }

  const isInWishlist = (productId: number) => {
    console.log("Checking if product is in cart:", { productId, wishlist });
    return wishlist.some((item) => item.productId === productId);
  }

  const saveWishlistToDB = async (userId: number, wishlist: WishlistItem[]) => {
    try {
      // Convert cart items to backend format
      const cartItems = wishlist.map(item => ({
        userId: userId,
        productId: item.productId,
      }))

      // Send each item to backend
      for (const item of cartItems) {
        await fetch('http://localhost:8081/api/wishlist/add', {
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
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist: toggleWishlistItem, removeFromWishlist, clearWishlist, isInWishlist}}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
} 