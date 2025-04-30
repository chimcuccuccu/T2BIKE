"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, X, ShoppingCart, Trash2, LogIn } from "lucide-react"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export function WishlistDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { wishlist, removeFromWishlist, addToCart, wishlistCount, isLoggedIn } = useStore()
  const { toast } = useToast()

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleAddToCart = (product: any) => {
    addToCart(product)
    toast({
      variant: "pink",
      title: "Đã thêm vào giỏ hàng!",
      description: `${product.name} đã được thêm vào giỏ hàng của bạn.`,
    })
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="relative text-pink-500" onClick={toggleDropdown}>
        <Heart className={cn("!h-6 !w-6", wishlistCount() > 0 && "fill-pink-500")} />
        {wishlistCount() > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-pink-500 text-white border-none px-1.5 min-w-[20px] h-5">
            {wishlistCount()}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 bg-pink-50 flex items-center justify-between">
                <h3 className="font-medium text-pink-700">Danh sách yêu thích</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-pink-700 hover:bg-pink-100"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {!isLoggedIn ? (
                <div className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-3">
                    <LogIn className="h-8 w-8 text-pink-300" />
                  </div>
                  <p className="text-gray-500 mb-4">Vui lòng đăng nhập để xem danh sách yêu thích của bạn</p>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="bg-pink-500 hover:bg-pink-600">Đăng nhập ngay</Button>
                  </Link>
                </div>
              ) : wishlist.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-3">
                    <Heart className="h-8 w-8 text-pink-300" />
                  </div>
                  <p className="text-gray-500">Danh sách yêu thích của bạn đang trống</p>
                  <Button
                    variant="outline"
                    className="mt-4 text-pink-500 border-pink-200 hover:bg-pink-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </div>
              ) : (
                <>
                  <ScrollArea className="max-h-[300px]">
                    <div className="p-4 space-y-4">
                      {wishlist.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex gap-3"
                        >
                          <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.imageUrls[0] || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</h4>
                            <p className="text-sm text-pink-500 font-bold mt-1">
                              {item.price.toLocaleString("vi-VN")} ₫
                            </p>

                            <div className="flex items-center justify-between mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs text-pink-500 hover:bg-pink-50"
                                onClick={() => handleAddToCart(item)}
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                Thêm vào giỏ
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-400 hover:text-pink-500 hover:bg-pink-50"
                                onClick={() => removeFromWishlist(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>

                  <Separator />

                  <div className="p-4">
                    <Link href="/wishlist" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-pink-500 hover:bg-pink-600">Xem tất cả yêu thích</Button>
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
