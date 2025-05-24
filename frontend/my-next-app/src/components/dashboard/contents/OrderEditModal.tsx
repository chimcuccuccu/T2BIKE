"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Order, ShippingInfo } from "@/types/order"
import { toast } from "sonner"
import { da } from "date-fns/locale"

interface OrderEditModalProps {
    isOpen: boolean
    onClose: () => void
    orderId: number | null
    onOrderUpdated: () => void
}

export default function OrderEditModal({ isOpen, onClose, orderId, onOrderUpdated }: OrderEditModalProps) {
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        customerName: "",
        status: "",
        shippingInfo: {
            receiverName: "",
            phone: "",
            province: "",
            district: "",
            address: "",
            note: ""
        },
        user: {
            fullName: "",
        }   
    })

    useEffect(() => {
        if (orderId && isOpen) {
            fetchOrderDetails()
        }
    }, [orderId, isOpen])

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/orders/${orderId}`)
            if (!response.ok) throw new Error("Failed to fetch order details")
            const data = await response.json()
            setOrder(data)
            setFormData({
                customerName: data.customerName,
                status: data.status,
                shippingInfo: data.shippingInfo || {
                    receiverName: "",
                    phone: "",
                    province: "",
                    district: "",
                    address: "",
                    note: ""
                },
                user: data.user,
            })
        } catch (error) {
            console.error("Error fetching order details:", error)
            toast.error("Không thể tải thông tin đơn hàng")
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name.startsWith("shippingInfo.")) {
            const field = name.split(".")[1]
            setFormData(prev => ({
                ...prev,
                shippingInfo: {
                    ...prev.shippingInfo,
                    [field]: value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleStatusChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            status: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Update order details
            const updateResponse = await fetch(`http://localhost:8081/api/orders/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerName: formData.customerName,
                    items: order?.items.map(item => ({
                        productId: item.product.id,
                        quantity: item.quantity
                    })) || [],
                    shippingInfo: {
                        receiverName: formData.shippingInfo.receiverName,
                        phone: formData.shippingInfo.phone,
                        province: formData.shippingInfo.province,
                        district: formData.shippingInfo.district,
                        address: formData.shippingInfo.address,
                        note: formData.shippingInfo.note
                    }
                }),
            })

            if (!updateResponse.ok) {
                const errorText = await updateResponse.text()
                throw new Error(errorText || "Failed to update order")
            }

            // Update order status
            const statusResponse = await fetch(`http://localhost:8081/api/orders/${orderId}/status?status=${formData.status}`, {
                method: "PUT",
            })

            if (!statusResponse.ok) {
                const errorText = await statusResponse.text()
                throw new Error(errorText || "Failed to update order status")
            }

            toast.success("Cập nhật đơn hàng thành công")
            onOrderUpdated()
            onClose()
        } catch (error) {
            console.error("Error updating order:", error)
            toast.error(error instanceof Error ? error.message : "Không thể cập nhật đơn hàng")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-pink-600 font-semibold text-2xl">Chỉnh sửa đơn hàng #{orderId}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="customerName"
                            className="font-semibold text-pink-500">Tên khách hàng</Label>
                            <Input
                                id="customerName"
                                name="customerName"
                                value={formData.user.fullName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status"
                            className="font-semibold text-pink-500">Trạng thái</Label>
                            <Select value={formData.status} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                                    <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                                    <SelectItem value="SHIPPING">Đang giao hàng</SelectItem>
                                    <SelectItem value="DELIVERED">Đã giao hàng</SelectItem>
                                    <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium text-pink-600 font-semibold">Thông tin giao hàng</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="receiverName"
                                className="font-semibold">Tên người nhận</Label>
                                <Input
                                    id="receiverName"
                                    name="shippingInfo.receiverName"
                                    value={formData.shippingInfo.receiverName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone"
                                className="font-semibold">Số điện thoại</Label>
                                <Input
                                    id="phone"
                                    name="shippingInfo.phone"
                                    value={formData.shippingInfo.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="province"
                                className="font-semibold">Tỉnh/Thành phố</Label>
                                <Input
                                    id="province"
                                    name="shippingInfo.province"
                                    value={formData.shippingInfo.province}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="district"
                                className="font-semibold">Quận/Huyện</Label>
                                <Input
                                    id="district"
                                    name="shippingInfo.district"
                                    value={formData.shippingInfo.district}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="address"
                                className="font-semibold">Địa chỉ</Label>
                                <Input
                                    id="address"
                                    name="shippingInfo.address"
                                    value={formData.shippingInfo.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="note"
                                className="font-semibold">Ghi chú</Label>
                                <Input
                                    id="note"
                                    name="shippingInfo.note"
                                    value={formData.shippingInfo.note}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-pink-500" disabled={isLoading}>
                            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
} 