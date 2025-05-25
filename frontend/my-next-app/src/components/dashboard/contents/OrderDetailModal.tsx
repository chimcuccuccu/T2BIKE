"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface OrderDetailModalProps {
    isOpen: boolean
    onClose: () => void
    orderId: number | null
}

interface OrderItem {
    id: number
    quantity: number
    priceAtOrder: number
    product: {
        id: number
        name: string
        description: string
        price: number
        imageUrls: string[]
        category: string
        brand: string
        color: string[]
        quantity: number
    }
}

interface ShippingInfo {
    id: number
    receiverName: string
    phone: string
    province: string
    district: string
    address: string
    note: string
}

interface User {
    id: number
    username: string
    fullName: string
    gender: string
    birthDate: string
    email: string
    phone: string
    address: string
    role: string | null
}

interface OrderDetail {
    id: number
    customerName: string
    createdAt: string
    user: User
    items: OrderItem[]
    status: string
    shippingInfo: ShippingInfo
    totalPrice: number
}

export default function OrderDetailModal({ isOpen, onClose, orderId }: OrderDetailModalProps) {
    const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isOpen && orderId) {
            fetchOrderDetail()
        }
    }, [isOpen, orderId])

    const fetchOrderDetail = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`http://localhost:8081/api/orders/${orderId}`)
            if (!response.ok) {
                throw new Error("Failed to fetch order details")
            }
            const data = await response.json()
            setOrderDetail(data)
        } catch (error) {
            console.error("Error fetching order details:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Chi tiết đơn hàng #{orderId}
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                    </div>
                ) : orderDetail ? (
                    <div className="space-y-6">
                        {/* Order Status */}
                        <div className="bg-pink-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Trạng thái đơn hàng</p>
                                    <p className="text-lg font-semibold text-pink-600">{orderDetail.status}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Ngày đặt hàng</p>
                                    <p className="text-lg font-semibold">{formatDate(orderDetail.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded-lg border">
                                <h3 className="font-semibold mb-3">Thông tin khách hàng</h3>
                                <div className="space-y-2">
                                    <p><span className="text-gray-600">Tên:</span> {orderDetail.user.fullName}</p>
                                    <p><span className="text-gray-600">Email:</span> {orderDetail.user.email}</p>
                                    <p><span className="text-gray-600">Số điện thoại:</span> {orderDetail.user.phone}</p>
                                    <p><span className="text-gray-600">Địa chỉ:</span> {orderDetail.user.address}</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border">
                                <h3 className="font-semibold mb-3">Thông tin giao hàng</h3>
                                <div className="space-y-2">
                                    <p><span className="text-gray-600">Người nhận:</span> {orderDetail.shippingInfo.receiverName}</p>
                                    <p><span className="text-gray-600">Số điện thoại:</span> {orderDetail.shippingInfo.phone}</p>
                                    <p><span className="text-gray-600">Tỉnh/Thành phố:</span> {orderDetail.shippingInfo.province}</p>
                                    <p><span className="text-gray-600">Quận/Huyện:</span> {orderDetail.shippingInfo.district}</p>
                                    <p><span className="text-gray-600">Địa chỉ:</span> {orderDetail.shippingInfo.address}</p>
                                    {orderDetail.shippingInfo.note && (
                                        <p><span className="text-gray-600">Ghi chú:</span> {orderDetail.shippingInfo.note}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white p-4 rounded-lg border">
                            <h3 className="font-semibold mb-4">Sản phẩm đã đặt</h3>
                            <div className="space-y-4">
                                {orderDetail.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden">
                                            <img
                                                src={item.product.imageUrls[0]}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.product.name}</h4>
                                            <h4 className="font-medium">{item.product.name}</h4>
                                            <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                            <p className="text-sm text-gray-600">Đơn giá: {formatPrice(item.priceAtOrder)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-pink-600">
                                                {formatPrice(item.priceAtOrder * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">Tổng tiền</h3>
                                <p className="text-xl font-bold text-pink-600">
                                    {formatPrice(orderDetail.totalPrice)}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Không tìm thấy thông tin đơn hàng
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
} 