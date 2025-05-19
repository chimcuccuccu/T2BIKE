"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Order } from "@/types/order"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("orders")
  const [activeStatus, setActiveStatus] = useState("all")

  // Sample orders data with different statuses
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      product: "Xe đạp ABC",
      color: "Đen",
      price: 15000000,
      quantity: 1,
      status: "waiting",
      image: "/bike.png",
      date: "15/05/2023",
      statusChanged: true,
    },
    {
      id: 2,
      product: "Xe đạp XYZ",
      color: "Trắng",
      price: 12000000,
      quantity: 1,
      status: "confirmed",
      image: "/bike.png",
      date: "10/05/2023",
      statusChanged: false,
    },
    {
      id: 3,
      product: "Mũ bảo hiểm",
      color: "Đỏ",
      price: 500000,
      quantity: 2,
      status: "shipping",
      image: "/bike.png",
      date: "05/05/2023",
      statusChanged: true,
    },
    {
      id: 4,
      product: "Đèn xe",
      color: "Đen",
      price: 300000,
      quantity: 1,
      status: "delivered",
      image: "/bike.png",
      date: "01/05/2023",
      statusChanged: false,
    },
    // Không có đơn hàng nào ở trạng thái "cancelled"
  ])

  // Filtered orders based on selected status
  const filteredOrders = orders.filter((order) => (activeStatus === "all" ? true : order.status === activeStatus))

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Get status text and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "waiting":
        return {
          text: "Chờ xác nhận",
          icon: <Clock className="h-4 w-4 mr-1" />,
          color: "text-yellow-500 bg-yellow-50",
        }
      case "confirmed":
        return {
          text: "Đã xác nhận",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          color: "text-blue-500 bg-blue-50",
        }
      case "shipping":
        return {
          text: "Đang vận chuyển",
          icon: <Truck className="h-4 w-4 mr-1" />,
          color: "text-purple-500 bg-purple-50",
        }
      case "delivered":
        return {
          text: "Đã giao hàng",
          icon: <Package className="h-4 w-4 mr-1" />,
          color: "text-green-500 bg-green-50",
        }
      case "cancelled":
        return {
          text: "Đã hủy",
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
                className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                  activeTab === "home" ? "bg-pink-100 text-pink-600 shadow-sm" : "hover:bg-pink-50"
                }`}
                onClick={() => handleTabChange("home")}
              >
                <Home className={`h-5 w-5 ${activeTab === "home" ? "text-pink-600" : ""}`} />
                <span>Trang chủ</span>
              </Link>
              <Link
                href="/profile"
                className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                  activeTab === "orders" ? "bg-pink-100 text-pink-600 shadow-sm" : "hover:bg-pink-50"
                }`}
                onClick={() => handleTabChange("orders")}
              >
                <ShoppingBag className={`h-5 w-5 ${activeTab === "orders" ? "text-pink-600" : ""}`} />
                <span>Lịch sử mua hàng</span>
              </Link>
              <Link
                href="/profile"
                className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${
                  activeTab === "account" ? "bg-pink-100 text-pink-600 shadow-sm" : "hover:bg-pink-50"
                }`}
                onClick={() => handleTabChange("account")}
              >
                <User className={`h-5 w-5 ${activeTab === "account" ? "text-pink-600" : ""}`} />
                <span>Tài khoản của bạn</span>
              </Link>
              <Link
                href="/logout"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-pink-50 transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Đăng xuất</span>
              </Link>
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
                    <h2 className="text-xl font-semibold text-pink-600">Chimcuccuccu</h2>
                    <p className="text-gray-500">0123456789</p>
                    <p className="text-gray-500">meomeohehe@gau.quack</p>
                  </div>
                </motion.div>

                <motion.div className="grid grid-cols-2 gap-4 mt-6" variants={itemVariants}>
                  <div className="bg-pink-100 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-md">
                    <h3 className="text-4xl font-bold text-pink-700">{orders.length}</h3>
                    <p className="text-gray-500 mt-1">Đơn hàng</p>
                  </div>
                  <div className="bg-pink-100 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-md">
                    <h3 className="text-4xl font-bold text-pink-700">0đ</h3>
                    <p className="text-gray-500 mt-1">Tổng tiền đã chi</p>
                  </div>
                </motion.div>

                <motion.div className="space-y-4 mt-6" variants={itemVariants}>
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
                      variant={activeStatus === "waiting" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveStatus("waiting")}
                      className={
                        activeStatus === "waiting"
                          ? "bg-pink-600 hover:bg-pink-700 rounded-full shadow-md"
                          : "bg-pink-100 text-gray-700 border-pink-200 hover:bg-pink-200 hover:text-gray-800 rounded-full"
                      }
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Chờ xác nhận
                    </Button>
                    <Button
                      variant={activeStatus === "confirmed" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveStatus("confirmed")}
                      className={
                        activeStatus === "confirmed"
                          ? "bg-pink-600 hover:bg-pink-700 rounded-full shadow-md"
                          : "bg-pink-100 text-gray-700 border-pink-200 hover:bg-pink-200 hover:text-gray-800 rounded-full"
                      }
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Đã xác nhận
                    </Button>
                    <Button
                      variant={activeStatus === "shipping" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveStatus("shipping")}
                      className={
                        activeStatus === "shipping"
                          ? "bg-pink-600 hover:bg-pink-700 rounded-full shadow-md"
                          : "bg-pink-100 text-gray-700 border-pink-200 hover:bg-pink-200 hover:text-gray-800 rounded-full"
                      }
                    >
                      <Truck className="h-4 w-4 mr-1" />
                      Đang vận chuyển
                    </Button>
                    <Button
                      variant={activeStatus === "delivered" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveStatus("delivered")}
                      className={
                        activeStatus === "delivered"
                          ? "bg-pink-600 hover:bg-pink-700 rounded-full shadow-md"
                          : "bg-pink-100 text-gray-700 border-pink-200 hover:bg-pink-200 hover:text-gray-800 rounded-full"
                      }
                    >
                      <Package className="h-4 w-4 mr-1" />
                      Đã giao hàng
                    </Button>
                    <Button
                      variant={activeStatus === "cancelled" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveStatus("cancelled")}
                      className={
                        activeStatus === "cancelled"
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
                                src="/placeholder.svg?height=96&width=96"
                                alt={order.product}
                                width={96}
                                height={96}
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-lg">{order.product}</h3>
                                <div className="flex items-center">
                                  {order.statusChanged && (
                                    <Badge variant="outline" className="mr-2 bg-pink-50 text-pink-600 border-pink-200">
                                      Mới cập nhật
                                    </Badge>
                                  )}
                                  <Badge className={`flex items-center ${getStatusInfo(order.status).color}`}>
                                    {getStatusInfo(order.status).icon}
                                    {getStatusInfo(order.status).text}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-gray-600">Màu: {order.color}</p>
                              <div className="flex justify-between mt-2">
                                <p className="text-pink-600 font-medium">{order.price.toLocaleString()}đ</p>
                                <p className="text-gray-500 text-sm">Ngày đặt: {order.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">Số lượng: {order.quantity}</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 text-xs border-pink-200 text-pink-600 hover:bg-pink-50"
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
                        <h3 className="text-xl font-medium text-pink-700">Bạn chưa có đơn hàng nào</h3>
                        <p className="text-gray-500">
                          {activeStatus === "all"
                            ? "Hãy mua sắm để có đơn hàng đầu tiên"
                            : `Bạn chưa có đơn hàng nào ở trạng thái ${getStatusInfo(activeStatus).text}`}
                        </p>
                        {activeStatus !== "all" ? (
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
                    <h2 className="text-2xl font-semibold text-pink-600">Chimcuccuccu</h2>
                  </motion.div>

                  <motion.div className="space-y-4 mt-8" variants={containerVariants}>
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <label className="text-sm text-gray-500">Họ và tên:</label>
                      <Input
                        type="text"
                        defaultValue="Chimcuccuccu"
                        className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <label className="text-sm text-gray-500">Email:</label>
                      <Input
                        type="email"
                        defaultValue="hihihihahaha@hoho.hehe"
                        className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <label className="text-sm text-gray-500">Giới tính:</label>
                      <Input
                        type="text"
                        defaultValue="Nam"
                        className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <label className="text-sm text-gray-500">Số điện thoại:</label>
                      <Input
                        type="tel"
                        defaultValue="0123456789"
                        className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <label className="text-sm text-gray-500">Địa chỉ:</label>
                      <Input
                        type="text"
                        defaultValue="chưa có"
                        className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button className="w-full bg-pink-600 hover:bg-pink-700 mt-4 shadow-md">
                        Cập nhật thông tin
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
                      <h2 className="text-xl font-medium text-pink-600">Chimcuccuccu</h2>
                      <p className="text-gray-500">0123456789</p>
                      <p className="text-gray-500">meomeohehe@gau.quack</p>
                    </div>
                  </motion.div>

                  <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={itemVariants}>
                    <div
                      className="bg-pink-100 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-md cursor-pointer"
                      onClick={() => handleTabChange("orders")}
                    >
                      <h3 className="text-4xl font-bold text-pink-700">{orders.length}</h3>
                      <p className="text-gray-500 mt-1">Đơn hàng</p>
                    </div>
                    <div className="bg-pink-100 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-md cursor-pointer">
                      <h3 className="text-4xl font-bold text-pink-700">0đ</h3>
                      <p className="text-gray-500 mt-1">Tổng tiền đã chi</p>
                    </div>
                  </motion.div>

                  <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8" variants={containerVariants}>
                    <motion.div
                      className="border rounded-lg p-6 transition-all duration-200 hover:shadow-md"
                      variants={itemVariants}
                    >
                      <h3 className="text-lg font-medium mb-4 text-pink-600">Thông tin cá nhân</h3>
                      <div className="space-y-2">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Họ tên:</span>
                          <span>Chimcuccuccu</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span>meomeohehe@gau.quack</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Số điện thoại:</span>
                          <span>0123456789</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Giới tính:</span>
                          <span>Nam</span>
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
                      <h3 className="text-lg font-medium mb-4 text-pink-600">Đơn hàng gần đây</h3>
                      {orders.length > 0 ? (
                        <div>
                          <div className="border-b pb-4 mb-4">
                            <div className="flex justify-between">
                              <p className="font-medium">{orders[0].product}</p>
                              <Badge className={getStatusInfo(orders[0].status).color}>
                                {getStatusInfo(orders[0].status).icon}
                                {getStatusInfo(orders[0].status).text}
                              </Badge>
                            </div>
                            <div className="flex justify-between mt-2">
                              <span className="text-gray-500">Ngày đặt:</span>
                              <span>{orders[0].date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Giá:</span>
                              <span className="text-pink-600">{orders[0].price.toLocaleString()}đ</span>
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
    </div>
  )
}

