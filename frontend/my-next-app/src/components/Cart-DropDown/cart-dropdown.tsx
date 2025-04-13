// "use client"

// import { useCart } from "@/context/CartContext"
// import { Button } from "@/components/ui/button"
// import { ShoppingCart, X } from "lucide-react"
// import Image from "next/image"
// import Link from "next/link"
// import { motion } from "framer-motion"
// import { formatCurrency } from "@/lib/utils"

// interface CartDropdownProps {
//   onClose: () => void
// }

// export default function CartDropdown({ onClose }: CartDropdownProps) {
//   const { cart, removeFromCart } = useCart()

//   const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

//   return (
//     <div className="bg-white border rounded-lg shadow-lg overflow-hidden">
//       <div className="p-4 border-b flex items-center justify-between">
//         <h3 className="font-medium flex items-center">
//           <ShoppingCart className="h-4 w-4 mr-2" />
//           Giỏ hàng ({cart.length})
//         </h3>
//         <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
//           <X className="h-4 w-4" />
//         </Button>
//       </div>

//       <div className="max-h-80 overflow-y-auto p-4">
//         {cart.length === 0 ? (
//           <div className="text-center py-6 text-gray-500">Giỏ hàng của bạn đang trống</div>
//         ) : (
//           <div className="space-y-4">
//             {cart.map((item) => (
//               <motion.div
//                 key={item.id}
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="flex items-center gap-3"
//               >
//                 <div className="relative w-16 h-16 flex-shrink-0">
//                   <Image src={item.product.imageUrls[0] || "/placeholder.svg"} alt={item.product.name} fill className="object-cover rounded" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
//                   <div className="flex items-center justify-between mt-1">
//                     <span className="text-sm text-gray-500">
//                       {item.quantity} x {formatCurrency(item.product.price)}
//                     </span>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-6 w-6 text-red-500"
//                       onClick={() => removeFromCart(item.id)}
//                     >
//                       <X className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>

//       {cart.length > 0 && (
//         <div className="p-4 border-t">
//           <div className="flex justify-between mb-4">
//             <span className="font-medium">Tổng cộng:</span>
//             <span className="font-bold">{formatCurrency(totalPrice)}</span>
//           </div>
//           <div className="grid grid-cols-2 gap-2">
//             <Link href="/gio-hang" className="col-span-2">
//               <Button className="w-full" onClick={onClose}>
//                 Xem giỏ hàng
//               </Button>
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"

export function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, removeFromCart, updateQuantity } = useCart()

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
  }

  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="relative text-pink-500" onClick={toggleDropdown}>
        <ShoppingCart className={cn("!h-6 !w-6", cart.length > 0 && "fill-pink-500")} />
        {cart.length > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-pink-500 text-white border-none px-1.5 min-w-[20px] h-5">
            {cart.length}
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
                <h3 className="font-medium text-pink-700">Giỏ hàng của bạn</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-pink-700 hover:bg-pink-100"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {cart.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-3">
                    <ShoppingCart className="h-8 w-8 text-pink-300" />
                  </div>
                  <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
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
                      {cart.map((item) => (
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
                              src={item.product.imageUrls[0] || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{item.product.name}</h4>
                            <p className="text-sm text-pink-500 font-bold mt-1">
                              {item.product.price.toLocaleString("vi-VN")} ₫
                            </p>

                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-none text-pink-500 hover:bg-pink-50"
                                  onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm">{item.quantity || 1}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-none text-pink-500 hover:bg-pink-50"
                                  onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-gray-400 hover:text-pink-500 hover:bg-pink-50"
                                onClick={() => removeFromCart(item.id)}
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

                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tổng cộng:</span>
                      <span className="text-lg font-bold text-pink-500">{formatCurrency(totalPrice)} ₫</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="text-pink-500 border-pink-200 hover:bg-pink-50"
                        onClick={() => setIsOpen(false)}
                      >
                        Tiếp tục mua sắm
                      </Button>
                      <Link href="/cart" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-pink-500 hover:bg-pink-600">Xem giỏ hàng</Button>
                      </Link>
                    </div>
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
