"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { QrCode, Truck } from "lucide-react"
import type { CustomerInfo, PaymentMethod } from "./checkout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"

interface PaymentFormProps {
  customerInfo: CustomerInfo
  paymentMethod: PaymentMethod
  setPaymentMethod: (method: PaymentMethod) => void
  onSubmit: () => void
}

export const PaymentForm = ({ customerInfo, paymentMethod, setPaymentMethod, onSubmit }: PaymentFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoCode, setPromoCode] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      onSubmit()
      setIsProcessing(false)
    }, 1500)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Phương thức thanh toán</h3>

            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="flex items-center cursor-pointer">
                  <Truck className="h-5 w-5 mr-2 text-pink-500" />
                  <div>
                    <p className="font-medium">Thanh toán khi nhận hàng</p>
                    <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="qr" id="qr" />
                <Label htmlFor="qr" className="flex items-center cursor-pointer">
                  <QrCode className="h-5 w-5 mr-2 text-pink-500" />
                  <div>
                    <p className="font-medium">Thanh toán bằng mã QR</p>
                    <p className="text-sm text-gray-500">Quét mã QR để thanh toán</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <AnimatePresence mode="wait">
            {paymentMethod === "qr" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-3">Quét mã QR để thanh toán</p>
                  <div className="bg-white p-4 rounded-lg inline-block mx-auto">
                    <img src="/placeholder.svg?height=200&width=200" alt="QR Code" className="w-40 h-40 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600 mt-3">Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            <h3 className="font-medium">Mã giảm giá</h3>
            <div className="flex gap-2">
              <Input placeholder="Nhập mã giảm giá" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              <Button type="button" variant="outline">
                Áp dụng
              </Button>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                </>
              ) : (
                "Thanh toán"
              )}
            </Button>
          </motion.div>
        </form>
      </div>

      <div>
        <div className="bg-pink-50 rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-lg mb-4">Thông tin đơn hàng</h3>
          <div className="flex items-center gap-4 border-b pb-4">
            <div className="w-20 h-20 bg-white rounded-md overflow-hidden">
              <img src="/placeholder.svg?height=80&width=80" alt="Xe đạp ABC" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-medium">Xe đạp ABC</h4>
              <p className="text-sm text-gray-500">Màu: Đen</p>
              <p className="text-sm text-gray-500">Số lượng: 1</p>
              <p className="font-semibold text-pink-600 mt-1">15.000.000₫</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Tạm tính:</span>
              <span>15.000.000₫</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phí vận chuyển:</span>
              <span>0₫</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t mt-2">
              <span>Tổng cộng:</span>
              <span className="text-pink-600">15.000.000₫</span>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <h4 className="font-medium mb-3">Thông tin khách hàng</h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600">Họ tên:</span>{" "}
                <span className="font-medium">{customerInfo.fullName}</span>
              </p>
              <p>
                <span className="text-gray-600">Số điện thoại:</span>{" "}
                <span className="font-medium">{customerInfo.phone}</span>
              </p>
              <p>
                <span className="text-gray-600">Email:</span> <span className="font-medium">{customerInfo.email}</span>
              </p>
              <p>
                <span className="text-gray-600">Địa chỉ:</span>{" "}
                <span className="font-medium">
                  {customerInfo.address}, {customerInfo.district}, {customerInfo.province}
                </span>
              </p>
              {customerInfo.note && (
                <p>
                  <span className="text-gray-600">Ghi chú:</span>{" "}
                  <span className="font-medium">{customerInfo.note}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

