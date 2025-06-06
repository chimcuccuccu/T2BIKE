"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import { CustomerInfoForm } from "./customer-info-form"
import { PaymentForm } from "./payment-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { CustomerInfo } from "@/types/customer-info"
import { useCart } from "@/context/CartContext"
import districts from "../../data dist/quan_huyen.json"
import provinces from "../../data dist/tinh_tp.json";

export type PaymentMethod = "cod" | "qr"

export const Checkout = () => {
  const [activeTab, setActiveTab] = useState("info")
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    phone: "",
    email: "",
    fullName: "",
    province: "",
    district: "",
    address: "",
    note: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod")
  const [isInfoValid, setIsInfoValid] = useState(false)

  const { cart } = useCart()
  const { clearCart } = useCart()

  const provinceName =
    provinces[customerInfo.province as keyof typeof provinces]?.name_with_type || "";

  const districtName =
    districts[customerInfo.district as keyof typeof districts]?.name_with_type || "";


  const handleInfoSubmit = (info: CustomerInfo) => {
    setCustomerInfo(info)
    setIsInfoValid(true)
    setActiveTab("payment")
  }

  const handlePaymentSubmit = async () => {
    const orderData = {
      customerName: customerInfo.fullName,
      items: cart.map(({ productId, quantity }) => ({ productId, quantity })),
      shippingInfo: {
        receiverName: customerInfo.fullName,
        phone: customerInfo.phone,
        province: provinceName,
        district: districtName,
        address: customerInfo.address,
        note: customerInfo.note
      }
    };


    console.log("customerInfo:", customerInfo);
    console.log("orderData:", orderData);


    try {
      const res = await fetch("http://localhost:8081/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      })

      if (res.ok) {
        const data = await res.json()
        setOrderId(data.id) // ⚠️ backend cần trả về { id: ... }
        setOrderComplete(true)
        await clearCart() // Xóa toàn bộ giỏ hàng sau khi đặt hàng thành công
      } else {
        alert("Đặt hàng thất bại.")
        console.error(await res.text())
      }
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error)
      alert("Không thể kết nối đến máy chủ.")
    }
  }

  const handleBackToInfo = () => {
    setActiveTab("info")
  }

  const handleStartOver = () => {
    setOrderComplete(false)
    setActiveTab("info")
    setIsInfoValid(false)
    setCustomerInfo({
      phone: "",
      email: "",
      fullName: "",
      province: "",
      district: "",
      address: "",
      note: "",
    })
    setPaymentMethod("cod")
    setOrderId(null)
  }

  return (
    <div className="w-full max-w-3xl pt-20">
      <AnimatePresence mode="wait">
        {orderComplete ? (
          <OrderComplete onStartOver={handleStartOver} orderId={orderId} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <header className="bg-white p-4 border-b">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-pink-500">T2BIKE</h1>
                {activeTab === "payment" && (
                  <Button variant="ghost" size="lg" className="px-4 text-pink-500" onClick={handleBackToInfo}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                  </Button>
                )}
              </div>
            </header>

            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {activeTab === "info" ? "Thông tin" : "Thanh toán"}
              </h2>

              {/* Thanh tiến trình */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center w-full">
                    <div
                      className={`rounded-full w-8 h-8 flex items-center justify-center ${activeTab === "info" ? "bg-pink-500 text-white" : "bg-pink-200 text-pink-700"
                        }`}
                    >
                      1
                    </div>
                    <div className={`h-1 flex-1 mx-2 ${activeTab === "payment" ? "bg-pink-500" : "bg-pink-200"}`}></div>
                    <div
                      className={`rounded-full w-8 h-8 flex items-center justify-center ${activeTab === "payment" ? "bg-pink-500 text-white" : "bg-pink-200 text-pink-700"
                        }`}
                    >
                      2
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className={activeTab === "info" ? "text-pink-500 font-medium" : ""}>Thông tin</span>
                  <span className={activeTab === "payment" ? "text-pink-500 font-medium" : ""}>Đặt hàng</span>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="info" className="mt-0">
                  <CustomerInfoForm initialValues={customerInfo} onSubmit={handleInfoSubmit} />
                </TabsContent>
                <TabsContent value="payment" className="mt-0">
                  {isInfoValid ? (
                    <PaymentForm
                      customerInfo={customerInfo}
                      paymentMethod={paymentMethod}
                      setPaymentMethod={setPaymentMethod}
                      onSubmit={handlePaymentSubmit}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Vui lòng điền thông tin trước khi thanh toán</p>
                      <Button variant="outline" className="mt-4" onClick={() => setActiveTab("info")}>
                        Quay lại điền thông tin
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ✅ OrderComplete – nhận orderId từ props
const OrderComplete = ({
  onStartOver,
  orderId
}: {
  onStartOver: () => void
  orderId: number | null
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-xl shadow-lg p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center"
      >
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Đặt hàng thành công!</h2>
      <p className="text-gray-600 mb-6">Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.</p>

      {orderId && (
        <p className="text-gray-600 mb-6">
          Mã đơn hàng của bạn: <span className="font-semibold">ORD-{orderId}</span>
        </p>
      )}

      <Button onClick={onStartOver} className="bg-pink-500 hover:bg-pink-600">
        Tiếp tục mua sắm
      </Button>
    </motion.div>
  )
}
