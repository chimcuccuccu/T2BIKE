"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, Trash2, ShoppingCart, ArrowLeft, LogIn } from "lucide-react"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart, isLoggedIn } = useStore()
  const { toast } = useToast()

  const handleAddToCart = (product: any) => {
    addToCart(product)
    toast({
      variant: "pink",
      title: "Đã thêm vào giỏ hàng!",
      description: `${product.name} đã được thêm vào giỏ hàng của bạn.`,
    })
  }

  if (!isLoggedIn) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 rounded-full bg-pink-50 flex items-center justify-center mb-6">
            <LogIn className="h-12 w-12 text-pink-300" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập để xem danh sách yêu thích</h1>
          <p className="text-gray-500 mb-8">Bạn cần đăng nhập để xem và quản lý danh sách yêu thích của mình</p>
          <Link href="/login">
            <Button className="bg-pink-500 hover:bg-pink-600">Đăng nhập ngay</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 rounded-full bg-pink-50 flex items-center justify-center mb-6">
            <Heart className="h-12 w-12 text-pink-300" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Danh sách yêu thích của bạn đang trống</h1>
          <p className="text-gray-500 mb-8">Hãy thêm sản phẩm vào danh sách yêu thích để xem sau</p>
          <Link href="/">
            <Button className="bg-pink-500 hover:bg-pink-600">Tiếp tục mua sắm</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center mb-8">
        <Link href="/" className="flex items-center text-pink-500 hover:text-pink-600">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Tiếp tục mua sắm</span>
        </Link>
        <h1 className="text-2xl font-bold mx-auto">Danh sách yêu thích</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-gray-500">
            <div className="col-span-6">Sản phẩm</div>
            <div className="col-span-2 text-center">Đơn giá</div>
            <div className="col-span-4 text-center">Thao tác</div>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-12 gap-4 items-center"
              >
                <div className="md:col-span-6 flex gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image src={item.imageUrls[0] || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <div className="md:hidden mt-2 text-sm text-gray-500">
                      Đơn giá: <span className="text-pink-500 font-medium">{item.price.toLocaleString("vi-VN")} ₫</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 text-center hidden md:block">
                  <span className="text-pink-500 font-medium">{item.price.toLocaleString("vi-VN")} ₫</span>
                </div>

                <div className="md:col-span-4 flex flex-wrap gap-2 justify-between md:justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-pink-500 border-pink-200 hover:bg-pink-50"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Thêm vào giỏ hàng
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-500 hover:text-pink-500 hover:bg-pink-50"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </Button>
                </div>

                <div className="md:col-span-12">
                  <Separator />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
