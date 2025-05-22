"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  ShoppingBag,
  User,
  LogOut,
  Search,
  Heart,
  ShoppingCart,
  CheckCircle,
  Clock,
  Truck,
  Package,
  XCircle,
  X,
  MapPin,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Order, UserOrderStatsDTO } from "@/types/order"
import { useUser } from "@/hooks/useUser"
import axios from "axios"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useDebounce } from "@/hooks/useDebounce"
import { useRouter } from "next/navigation"

// Add this status mapping object before the component
const statusMapping = {
  'PENDING': 'Chờ xác nhận',
  'CONFIRMED': 'Đã xác nhận',
  'SHIPPING': 'Đang giao',
  'DELIVERED': 'Đã giao',
  'CANCELLED': 'Đã hủy'
} as const;

const reverseStatusMapping = {
  'Chờ xác nhận': 'PENDING',
  'Đã xác nhận': 'CONFIRMED',
  'Đang giao': 'SHIPPING',
  'Đã giao': 'DELIVERED',
  'Đã hủy': 'CANCELLED'
} as const;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(() => {
    // Try to get the activeTab from localStorage, default to "orders" if not found
    if (typeof window !== 'undefined') {
      return localStorage.getItem('profileActiveTab') || "orders"
    }
    return "orders"
  })
  const [activeStatus, setActiveStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const { user, isLoading } = useUser()
  const [orderStats, setOrderStats] = useState<UserOrderStatsDTO>({ totalOrders: 0, totalAmountSpent: 0 })
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    email: "",
    gender: "",
    phone: "",
    address: ""
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const router = useRouter()

  // Fetch user orders with search
  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        setIsLoadingOrders(true)
        setIsSearching(true)
        try {
          // First get all orders for the user
          const response = await axios.get(`http://localhost:8081/api/orders/user/${user.id}`, {
            withCredentials: true
          })

          let orders = response.data

          // Then filter based on search query and status if needed
          if (debouncedSearchQuery || activeStatus !== 'all') {
            orders = orders.filter((order: Order) => {
              const matchesSearch = debouncedSearchQuery
                ? order.items.some(item =>
                  item.product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
                )
                : true

              const matchesStatus = activeStatus !== 'all'
                ? statusMapping[order.status as keyof typeof statusMapping] === activeStatus
                : true

              return matchesSearch && matchesStatus
            })
          }

          setOrders(orders)
        } catch (error) {
          console.error("Error fetching orders:", error)
          setOrders([]) // Set empty array on error
        } finally {
          setIsLoadingOrders(false)
          setIsSearching(false)
        }
      }
    }

    fetchOrders()
  }, [user, debouncedSearchQuery, activeStatus])

  // Remove the local filtering since we're now using the API
  const filteredOrders = orders

  // Fetch user order stats
  useEffect(() => {
    const fetchOrderStats = async () => {
      if (user?.id) {
        try {
          const response = await axios.get(`http://localhost:8081/api/users/${user.id}/order-stats`, {
            withCredentials: true
          })
          setOrderStats(response.data)
        } catch (error) {
          console.error("Error fetching order stats:", error)
        }
      }
    }

    fetchOrderStats()
  }, [user])

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.username,
        fullName: user.fullName || "",
        email: user.email || "",
        gender: user.gender || "",
        phone: user.phone || "",
        address: user.address || ""
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdateProfile = async () => {
    setIsUpdating(true)
    setUpdateMessage("")
    try {
      const response = await axios.put("http://localhost:8081/api/users/me", formData, {
        withCredentials: true
      })
      setUpdateMessage("Cập nhật thông tin thành công!")
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error)
      setUpdateMessage("Có lỗi xảy ra khi cập nhật thông tin")
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    // Save to localStorage when tab changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('profileActiveTab', tab)
    }
  }

  // Get status text and icon
  const getStatusInfo = (status: string) => {
    const vietnameseStatus = statusMapping[status as keyof typeof statusMapping] || 'Không xác định'

    switch (status) {
      case "PENDING":
        return {
          text: vietnameseStatus,
          icon: <Clock className="h-4 w-4 mr-1" />,
          color: "text-yellow-500 bg-yellow-50",
        }
      case "CONFIRMED":
        return {
          text: vietnameseStatus,
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          color: "text-blue-500 bg-blue-50",
        }
      case "SHIPPING":
        return {
          text: vietnameseStatus,
          icon: <Truck className="h-4 w-4 mr-1" />,
          color: "text-purple-500 bg-purple-50",
        }
      case "DELIVERED":
        return {
          text: vietnameseStatus,
          icon: <Package className="h-4 w-4 mr-1" />,
          color: "text-green-500 bg-green-50",
        }
      case "CANCELLED":
        return {
          text: vietnameseStatus,
          icon: <XCircle className="h-4 w-4 mr-1" />,
          color: "text-red-500 bg-red-50",
        }
      default:
        return {
          text: "Không xác định",
          icon: null,
          color: "text-gray-500 bg-gray-50",
        }
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  // Add these animation variants before the return statement
  const detailsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 }
    }
  }

  const productItemVariants = {
    hidden: (index: number) => ({
      opacity: 0,
      x: -20,
      transition: { delay: index * 0.1 }
    }),
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: index * 0.1, duration: 0.3 }
    })
  }

  const handleCancelOrder = async () => {
    if (!selectedOrder) return

    setIsCancelling(true)
    try {
      const response = await axios.delete(`http://localhost:8081/api/orders/${selectedOrder.id}`, {
        withCredentials: true
      })

      // Close both dialogs
      setIsConfirmOpen(false)
      setIsDetailsOpen(false)

      // Remove the cancelled order from the list
      setOrders(prevOrders => prevOrders.filter(order => order.id !== selectedOrder.id))

      // Show success message
      setUpdateMessage("Đơn hàng đã được hủy thành công")
    } catch (error) {
      console.error("Error cancelling order:", error)
      setUpdateMessage("Có lỗi xảy ra khi hủy đơn hàng")
    } finally {
      setIsCancelling(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8081/api/users/logout", {}, {
        withCredentials: true
      })
      // Force a hard refresh to reload all components including header
      window.location.href = "/home"
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100">
      <main className="max-w-6xl mx-auto p-20 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4">
          {/* Sidebar */}
          <motion.div
            className="bg-white rounded-lg shadow-sm p-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="space-y-2">
              <Link
                href="/profile"
                className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${activeTab === "home" ? "bg-pink-100 text-pink-600 shadow-sm" : "hover:bg-pink-50"
                  }`}
                onClick={() => handleTabChange("home")}
              >
                <Home className={`h-5 w-5 ${activeTab === "home" ? "text-pink-600" : ""}`} />
                <span>Trang chủ</span>
              </Link>
              <Link
                href="/profile"
                className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${activeTab === "orders" ? "bg-pink-100 text-pink-600 shadow-sm" : "hover:bg-pink-50"
                  }`}
                onClick={() => handleTabChange("orders")}
              >
                <ShoppingBag className={`h-5 w-5 ${activeTab === "orders" ? "text-pink-600" : ""}`} />
                <span>Lịch sử mua hàng</span>
              </Link>
              <Link
                href="/profile"
                className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${activeTab === "account" ? "bg-pink-100 text-pink-600 shadow-sm" : "hover:bg-pink-50"
                  }`}
                onClick={() => handleTabChange("account")}
              >
                <User className={`h-5 w-5 ${activeTab === "account" ? "text-pink-600" : ""}`} />
                <span>Tài khoản của bạn</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-pink-50 transition-all duration-200 w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Đăng xuất</span>
              </button>
            </nav>
          </motion.div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {activeTab === "orders" && (
              <motion.div
                key="orders"
                className="bg-white rounded-lg shadow-sm p-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div className="flex items-center gap-4" variants={itemVariants}>
                  <div className="bg-pink-100 rounded-full p-4">
                    <User className="h-10 w-10 text-pink-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-pink-600">{user?.fullName || "Loading..."}</h2>
                    <p className="text-gray-500">{user?.phone || ""}</p>
                    <p className="text-gray-500">{user?.email || ""}</p>
                  </div>
                </motion.div>

                <motion.div className="grid grid-cols-2 gap-4 mt-6" variants={itemVariants}>
                  <div className="bg-pink-100 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-md">
                    <h3 className="text-4xl font-bold text-pink-700">{orders.length || 0}</h3>
                    <p className="text-gray-500 mt-1">Đơn hàng</p>
                  </div>
                  <div className="bg-pink-100 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-md">
                    <h3 className="text-4xl font-bold text-pink-700">{(orderStats.totalAmountSpent || 0).toLocaleString()}đ</h3>
                    <p className="text-gray-500 mt-1">Tổng tiền đã chi</p>
                  </div>
                </motion.div>

                <motion.div className="space-y-4 mt-6" variants={itemVariants}>
                  <motion.div className="relative mb-4" variants={itemVariants}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Tìm kiếm đơn hàng..."
                      className="pl-10 w-full rounded-lg bg-gray-50 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
                      </div>
                    )}
                  </motion.div>

                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <Button
                      variant={activeStatus === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveStatus("all")}
                      className={
                        activeStatus === "all"
                          ? "bg-pink-600 hover:bg-pink-700 rounded-full shadow-md"
                          : "bg-pink-100 text-gray-700 border-pink-200 hover:bg-pink-200 hover:text-gray-800 rounded-full"
                      }
                    >
                      Tất cả
                    </Button>
                    <Button
                      variant={activeStatus === "Chờ xác nhận" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveStatus("Chờ xác nhận")}
                      className={
                        activeStatus === "Chờ xác nhận"
                          ? "bg-pink-600 hover:bg-pink-700 rounded-full shadow-md"
                          : "bg-pink-100 text-gray-700 border-pink-200 hover:bg-pink-200 hover:text-gray-800 rounded-full"
                      }
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Chờ xác nhận
                    </Button>
                    <Button
                      variant={activeStatus === "Đã xác nhận" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveStatus("Đã xác nhận")}
                      className={
                        activeStatus === "Đã xác nhận"
                          ? "bg-pink-600 hover:bg-pink-700 rounded-full shadow-md"
                          : "bg-pink-100 text-gray-700 border-pink-200 hover:bg-pink-200 hover:text-gray-800 rounded-full"
                      }
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Đã xác nhận
                    </Button>
                    <Button
                      variant={activeStatus === "Đang giao" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveStatus("Đang giao")}
                      className={
                        activeStatus === "Đang giao"
                          ? "bg-pink-600 hover:bg-pink-700 rounded-full shadow-md"
                          : "bg-pink-100 text-gray-700 border-pink-200 hover:bg-pink-200 hover:text-gray-800 rounded-full"
                      }
                    >
                      <Truck className="h-4 w-4 mr-1" />
                      Đang giao
                    </Button>
                    <Button
                      variant={activeStatus === "Đã giao" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveStatus("Đã giao")}
                      className={
                        activeStatus === "Đã giao"
                          ? "bg-pink-600 hover:bg-pink-700 rounded-full shadow-md"
                          : "bg-pink-100 text-gray-700 border-pink-200 hover:bg-pink-200 hover:text-gray-800 rounded-full"
                      }
                    >
                      <Package className="h-4 w-4 mr-1" />
                      Đã giao
                    </Button>
                    <Button
                      variant={activeStatus === "Đã hủy" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveStatus("Đã hủy")}
                      className={
                        activeStatus === "Đã hủy"
                          ? "bg-pink-600 hover:bg-pink-700 rounded-full shadow-md"
                          : "bg-pink-100 text-gray-700 border-pink-200 hover:bg-pink-200 hover:text-gray-800 rounded-full"
                      }
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Đã hủy
                    </Button>
                  </div>

                  <AnimatePresence mode="wait">
                    {filteredOrders.length > 0 ? (
                      <motion.div
                        className="space-y-4 mt-4"
                        key="has-orders"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        {filteredOrders.map((order, index) => (
                          <motion.div
                            key={order.id}
                            className="border rounded-lg p-4 flex items-center gap-4 transition-all duration-200 hover:shadow-md"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden relative">
                              <Image
                                src={order.items[0]?.product.imageUrls[0] || "/placeholder.svg?height=96&width=96"}
                                alt={order.items[0]?.product.name || "Product"}
                                width={96}
                                height={96}
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-lg">{order.items[0]?.product.name}</h3>
                                <div className="flex items-center">
                                  <Badge className={`flex items-center ${getStatusInfo(order.status).color}`}>
                                    {getStatusInfo(order.status).icon}
                                    {getStatusInfo(order.status).text}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-gray-600">Số lượng sản phẩm: {order.items.length}</p>
                              <div className="flex justify-between mt-2">
                                <p className="text-pink-600 font-medium">{order.totalPrice?.toLocaleString()}đ</p>
                                <p className="text-gray-500 text-sm">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">Tổng số lượng: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 text-xs border-pink-200 text-pink-600 hover:bg-pink-50"
                                onClick={() => handleViewDetails(order)}
                              >
                                Chi tiết
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        className="text-center py-12 space-y-4 border rounded-lg mt-4"
                        key="no-orders"
                        variants={fadeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                          <ShoppingBag className="h-12 w-12 text-pink-500" />
                        </div>
                        <h3 className="text-xl font-medium text-pink-700">
                          {searchQuery ? "Không tìm thấy đơn hàng phù hợp" : "Bạn chưa có đơn hàng nào"}
                        </h3>
                        <p className="text-gray-500">
                          {searchQuery
                            ? "Hãy thử tìm kiếm với từ khóa khác"
                            : activeStatus === "all"
                              ? "Hãy mua sắm để có đơn hàng đầu tiên"
                              : `Bạn chưa có đơn hàng nào ở trạng thái ${getStatusInfo(activeStatus).text}`}
                        </p>
                        {searchQuery ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchQuery("")}
                            className="mt-2 border-pink-200 text-pink-600 hover:bg-pink-50"
                          >
                            Xóa tìm kiếm
                          </Button>
                        ) : activeStatus !== "all" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveStatus("all")}
                            className="mt-2 border-pink-200 text-pink-600 hover:bg-pink-50"
                          >
                            Xem tất cả đơn hàng
                          </Button>
                        ) : (
                          <Button className="bg-pink-600 hover:bg-pink-700 mt-2 shadow-md">Mua sắm ngay</Button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "account" && (
              <motion.div
                key="account"
                className="bg-white rounded-lg shadow-sm p-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="max-w-md mx-auto py-6 space-y-6">
                  <motion.div className="flex flex-col items-center gap-4" variants={itemVariants}>
                    <div className="bg-pink-100 rounded-full p-6">
                      <User className="h-12 w-12 text-pink-500" />
                    </div>
                    <h2 className="text-2xl font-semibold text-pink-600">{user?.username || "Loading..."}</h2>
                  </motion.div>

                  <motion.div className="space-y-4 mt-8" variants={containerVariants}>
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <label className="text-sm text-gray-500">Họ và tên:</label>
                      <Input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <label className="text-sm text-gray-500">Email:</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <label className="text-sm text-gray-500">Giới tính:</label>
                      <Input
                        type="text"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <label className="text-sm text-gray-500">Số điện thoại:</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <label className="text-sm text-gray-500">Địa chỉ:</label>
                      <Input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </motion.div>

                    {updateMessage && (
                      <motion.div
                        className={`text-sm ${updateMessage.includes("thành công") ? "text-green-600" : "text-red-600"}`}
                        variants={itemVariants}
                      >
                        {updateMessage}
                      </motion.div>
                    )}

                    <motion.div variants={itemVariants}>
                      <Button
                        className="w-full bg-pink-600 hover:bg-pink-700 mt-4 shadow-md"
                        onClick={handleUpdateProfile}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Đang cập nhật..." : "Cập nhật thông tin"}
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === "home" && (
              <motion.div
                key="home"
                className="bg-white rounded-lg shadow-sm p-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div className="py-6 space-y-6">
                  <motion.div className="flex items-center gap-4" variants={itemVariants}>
                    <div className="bg-pink-100 rounded-full p-4">
                      <User className="h-10 w-10 text-pink-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-medium text-pink-600"> {user?.username || "Loading..."} </h2>
                      <p className="text-gray-500"> {user?.phone || "Loading..."} </p>
                      <p className="text-gray-500"> {user?.email || "Loading..."} </p>
                    </div>
                  </motion.div>

                  <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={itemVariants}>
                    <div
                      className="bg-pink-100 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-md cursor-pointer"
                      onClick={() => handleTabChange("orders")}
                    >
                      <h3 className="text-4xl font-bold text-pink-700">{orderStats.totalOrders || 0}</h3>
                      <p className="text-gray-500 mt-1">Đơn hàng đã thanh toán</p>
                    </div>
                    <div
                      className="bg-pink-100 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-md cursor-pointer"
                      onClick={() => handleTabChange("orders")}
                    >
                      <h3 className="text-4xl font-bold text-pink-700">{(orderStats.totalAmountSpent || 0).toLocaleString()}đ</h3>
                      <p className="text-gray-500 mt-1">Tổng tiền đã chi</p>
                    </div>
                  </motion.div>

                  <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8" variants={containerVariants}>
                    <motion.div
                      className="border rounded-lg p-6 transition-all duration-200 hover:shadow-md"
                      variants={itemVariants}
                    >
                      <h3 className="text-lg font-semibold mb-4 text-pink-600">Thông tin cá nhân</h3>
                      <div className="space-y-2">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Họ tên:</span>
                          <span>{user?.fullName || "Loading..."}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span>{user?.email || "Loading..."}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Số điện thoại:</span>
                          <span>{user?.phone || "Loading..."}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Giới tính:</span>
                          <span>{user?.gender || "Loading..."}</span>
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="mt-4 w-full border-pink-200 text-pink-600 hover:bg-pink-50"
                        onClick={() => handleTabChange("account")}
                      >
                        Chỉnh sửa
                      </Button>
                    </motion.div>

                    <motion.div
                      className="border rounded-lg p-6 transition-all duration-200 hover:shadow-md"
                      variants={itemVariants}
                    >
                      <h3 className="text-lg font-semibold mb-4 text-pink-600">Đơn hàng gần đây</h3>
                      {orders.length > 0 ? (
                        <div>
                          <div className="border-b pb-4 mb-4">
                            <div className="flex justify-between">
                              <p className="font-medium">{orders[0].items[0]?.product.name}</p>
                              <Badge className={getStatusInfo(orders[0].status).color}>
                                {getStatusInfo(orders[0].status).icon}
                                {getStatusInfo(orders[0].status).text}
                              </Badge>
                            </div>
                            <div className="flex justify-between mt-2">
                              <span className="text-gray-500">Ngày đặt:</span>
                              <span>{new Date(orders[0].createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Giá:</span>
                              <span className="text-pink-600">{orders[0].totalPrice?.toLocaleString()}đ</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full border-pink-200 text-pink-600 hover:bg-pink-50"
                            onClick={() => handleTabChange("orders")}
                          >
                            Xem tất cả
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
                          <Button className="mt-4 bg-pink-600 hover:bg-pink-700 shadow-md">Mua sắm ngay</Button>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          <AnimatePresence>
            {selectedOrder && (
              <motion.div
                key={selectedOrder.id}
                variants={detailsVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="max-h-[80vh] overflow-y-auto"
              >
                <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-pink-600">Chi tiết đơn hàng #T2B{selectedOrder.id}</h2>
                    <p className="text-gray-500 text-sm">Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <Badge className={`flex items-center ${getStatusInfo(selectedOrder.status).color}`}>
                    {getStatusInfo(selectedOrder.status).icon}
                    {getStatusInfo(selectedOrder.status).text}
                  </Badge>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 text-pink-600 flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Sản phẩm
                    </h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          custom={index}
                          variants={productItemVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-center gap-4 border-b pb-4"
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative">
                            <Image
                              src={item.product.imageUrls[0] || "/placeholder.svg"}
                              alt={item.product.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-gray-600 text-sm">Màu: {item.product.color}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-pink-600 font-medium">{(item.priceAtOrder * item.quantity).toLocaleString()}đ</p>
                            <p className="text-gray-500 text-sm">Số lượng: {item.quantity}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {selectedOrder.shippingInfo && (
                    <motion.div
                      className="mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <h3 className="text-lg font-medium mb-3 text-pink-600 flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Địa chỉ giao hàng
                      </h3>
                      <div className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <p>{selectedOrder.shippingInfo.receiverName}</p>
                        <p>{selectedOrder.shippingInfo.phone}</p>
                        <p>{selectedOrder.shippingInfo.address}</p>
                        <p>{selectedOrder.shippingInfo.district}, {selectedOrder.shippingInfo.province}</p>
                        {selectedOrder.shippingInfo.note && (
                          <p className="mt-2 text-gray-500">Ghi chú: {selectedOrder.shippingInfo.note}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <h3 className="text-lg font-medium mb-3 text-pink-600 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Phương thức thanh toán
                    </h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg"> Thanh toán khi nhận hàng </p>
                  </motion.div>

                  <motion.div
                    className="border-t pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    <h3 className="text-lg font-medium mb-3 text-pink-600">Tổng cộng</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tạm tính:</span>
                        <span>
                          {selectedOrder.items
                            .reduce((sum, item) => sum + item.priceAtOrder * item.quantity, 0)
                            .toLocaleString()}đ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phí vận chuyển:</span>
                        <span>{"0"}đ</span>
                      </div>
                      {/* {selectedOrder.discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Giảm giá:</span>
                          <span className="text-green-600">-{selectedOrder.discount.toLocaleString()}đ</span>
                        </div>
                      )} */}
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Tổng tiền:</span>
                        <span className="text-pink-600">{selectedOrder.totalPrice?.toLocaleString()}đ</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="mt-6 flex justify-end gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    {selectedOrder?.status === 'PENDING' && (
                      <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => setIsConfirmOpen(true)}
                      >
                        Hủy đơn hàng
                      </Button>
                    )}
                    <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => setIsDetailsOpen(false)}>
                      Đóng
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-600">Xác nhận hủy đơn hàng</h3>
            <p className="text-gray-600">
              Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isCancelling}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleCancelOrder}
                disabled={isCancelling}
              >
                {isCancelling ? "Đang xử lý..." : "Xác nhận hủy"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

