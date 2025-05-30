"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Heart,
  Search,
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ChevronDown,
  Gift,
  Truck,
  CreditCard,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { HeaderPage } from "@/components/Header/header-page"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/hooks/useAuth"
import { CartItem } from "@/types/cart-item"
import { useUser } from "@/hooks/useUser"

export default function CartPage() {
  const { toast } = useToast()
  const { cart, removeFromCart, updateQuantity } = useCart()
  const { isLoggedIn } = useAuth()
  const { user, isLoading: isUserLoading } = useUser()
  const router = useRouter()
  const [note, setNote] = useState("")
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [isCheckoutHovered, setIsCheckoutHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [discount, setDiscount] = useState(0)

  // Format currency to VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND"
  }

  // Calculate total price
  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
    return subtotal - discount
  }

  // Update quantity
  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1 || !id) return
    updateQuantity(id, newQuantity)
  }

  // Remove item from cart with animation
  const handleRemoveItem = (id: number) => {
    if (!id) return
    removeFromCart(id)
  }

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "t2bike") {
      setDiscount(1500000)
      setPromoApplied(true)
      toast({
        title: "Mã giảm giá đã được áp dụng!",
        description: "Bạn đã được giảm 1.500.000 VND",
        duration: 3000,
        variant: "default",
        className: "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-none",
      })
    } else {
      toast({
        title: "Mã giảm giá không hợp lệ",
        description: "Vui lòng kiểm tra lại mã giảm giá",
        duration: 3000,
        variant: "destructive",
      })
    }
  }

  // Simulate checkout process
  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để tiếp tục thanh toán",
        duration: 3000,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Chuyển hướng đến trang thanh toán
    router.push("/checkout")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-pink-50 to-rose-50">
      {/* Header */}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-pink-100">
          {/* Cart Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-rose-50">
            <div className="flex items-center">
              <Link href="/all-products">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-4 text-pink-500 hover:text-pink-600 hover:bg-pink-200 transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span className="text-base ">Tiếp tục mua sắm</span>
                </Button>
              </Link>
              <h1 className="text-2xl pl-28 font-bold text-pink-600">Giỏ hàng của bạn</h1>
            </div>
          </div>

          <div className="md:grid md:grid-cols-3 md:gap-6">
            {/* Cart Items */}
            <div className="md:col-span-2 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-pink-500" />
                Tổng đơn hàng
              </h2>

              <div className="space-y-4">
                <AnimatePresence>
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative flex items-center p-4 border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 group bg-white"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.1), 0 8px 10px -6px rgba(236, 72, 153, 0.1)",
                      }}
                    >
                      <div className="absolute -top-2 -left-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Item #{index + 1}
                      </div>

                      <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg overflow-hidden p-2">
                        <Image
                          src={item.product.imageUrls[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="ml-4 flex-grow">
                        <h3 className="font-medium text-gray-800 group-hover:text-pink-600 transition-colors">
                          {item.product.name}
                        </h3>
                        <p className="font-medium text-pink-500">{formatCurrency(item.product.price)}</p>
                        <p className="text-sm text-gray-500">Màu: {item.product.color[0]}</p>

                        <div className="mt-2 flex items-center">
                          <span className="text-sm text-gray-500 mr-2">Số lượng:</span>
                          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none text-gray-500 hover:text-white hover:bg-pink-500 transition-all"
                              onClick={() => item.id && handleUpdateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-none text-gray-500 hover:text-white hover:bg-pink-500 transition-all"
                              onClick={() => item.id && handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="ml-auto text-right">
                        <p className="font-medium text-gray-800">{formatCurrency(item.product.price * item.quantity)}</p>
                        <motion.button
                          whileHover={{ scale: 1.1, color: "#ef4444" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => item.id && handleRemoveItem(item.id)}
                          className="mt-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {cart.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center">
                    <div className="mx-auto w-24 h-24 mb-4 text-gray-300 opacity-50">
                      <ShoppingCart className="w-full h-full" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Giỏ hàng trống</h3>
                    <p className="text-gray-500 mb-4">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                    <Button className="bg-pink-500 hover:bg-pink-600 transition-all duration-300">
                      <Link href="/shop">Tiếp tục mua sắm</Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 border-l border-pink-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-pink-500" />
                Tạm tính
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền hàng:</span>
                  <span className="font-semibold">
                    {formatCurrency(cart.reduce((total, item) => total + item.product.price * item.quantity, 0))}
                  </span>
                </div>

                {discount > 0 && (
                  <motion.div
                    className="flex justify-between text-green-600"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <span>Giảm giá:</span>
                    <span className="font-medium">- {formatCurrency(discount)}</span>
                  </motion.div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-semibold">0 VND</span>
                </div>

                <div className="pt-3 border-t border-pink-200 flex justify-between">
                  <span className="text-lg font-semibold">Tổng thanh toán:</span>
                  <motion.span
                    className="text-lg font-bold text-pink-600"
                    key={calculateTotal()}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    {formatCurrency(calculateTotal())}
                  </motion.span>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setIsCheckoutHovered(true)}
                onHoverEnd={() => setIsCheckoutHovered(false)}
              >
                <Button
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || isLoading}
                  className={cn(
                    "w-full py-6 text-lg text-white transition-all duration-500",
                    isLoading
                      ? "bg-pink-400"
                      : "bg-pink-500 hover:bg-pink-600 shadow-lg hover:shadow-xl hover:shadow-pink-200",
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </div>
                  ) : (
                    <span>Mua ngay</span>
                  )}
                </Button>
              </motion.div>

              <AnimatePresence>
                {isCheckoutHovered && !isLoading && cart.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4 p-3 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg border border-pink-200"
                  >
                    <p className="text-sm text-pink-700">
                      Nhấn "Mua ngay" để hoàn tất đơn hàng của bạn. Cảm ơn bạn đã mua sắm tại T2BIKE!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 space-y-4">
                <div className="p-3 bg-white rounded-lg border border-pink-100 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <Truck className="h-5 w-5 text-pink-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Giao hàng miễn phí</h4>
                    <p className="text-sm text-gray-500 mt-1">Cho đơn hàng từ 8.000.000đ</p>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-pink-100 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <Shield className="h-5 w-5 text-pink-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Bảo hành 12 tháng</h4>
                    <p className="text-sm text-gray-500 mt-1">Đổi trả miễn phí trong 30 ngày</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-2">Chúng tôi chấp nhận:</h3>
                <div className="grid grid-1 gap-2">
                  {/* <div className="h-10 bg-blue-500 rounded-md flex items-center justify-center text-xs font-medium text-white shadow-sm">
                    VISA
                  </div>
                  <div className="h-10 bg-red-500 rounded-md flex items-center justify-center text-xs font-medium text-white shadow-sm">
                    MC
                  </div>
                  <div className="h-10 bg-pink-500 rounded-md flex items-center justify-center text-xs font-medium text-white shadow-sm">
                    MOMO
                  </div> */}
                  <div className="h-10 bg-orange-400 rounded-md flex items-center justify-center text-xs font-medium text-white shadow-sm">
                    Thanh toán tận nơi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with simplified gradient */}
      <footer className="mt-12 py-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10"></div>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">© 2025 T2BIKE. Tất cả các quyền được bảo lưu.</p>
          <p className="text-sm text-gray-500 mt-1">Thiết kế bởi T2BIKE Team</p>
        </div>
      </footer>
    </div>
  )
}

