"use client"

import { motion } from "framer-motion"

export const OrderSummary = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="md:hidden bg-pink-50 shadow-md rounded-lg p-4"
    >
        <h3 className="font-semibold text-lg mb-3">Thông tin đơn hàng</h3>
        <div className="flex items-center gap-3 border-b pb-3">
            <div className="w-16 h-16 bg-white rounded-md overflow-hidden">
            <img src="/placeholder.svg?height=64&width=64" alt="Xe đạp ABC" className="w-full h-full object-cover" />
            </div>
            <div>
            <h4 className="font-medium">Xe đạp ABC</h4>
            <p className="text-xs text-gray-500">Số lượng: 1</p>
            <p className="font-semibold text-pink-600 mt-1">15.000.000₫</p>
            </div>
        </div>

        <div className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
            <span className="text-gray-600">Tạm tính:</span>
            <span>15.000.000₫</span>
            </div>
            <div className="flex justify-between">
            <span className="text-gray-600">Phí vận chuyển:</span>
            <span>0₫</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t mt-1">
            <span>Tổng cộng:</span>
            <span className="text-pink-600">15.000.000₫</span>
            </div>
        </div>
    </motion.div>
  )
}

