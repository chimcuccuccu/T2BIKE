"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { CustomerInfo } from "@/types/customer-info"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import districts from "../../data dist/quan_huyen.json"
import provinces from "../../data dist/tinh_tp.json";
import { useCart } from "@/context/CartContext"

interface CustomerInfoFormProps {
  initialValues: CustomerInfo
  onSubmit: (info: CustomerInfo) => void
}

export const CustomerInfoForm = ({ initialValues, onSubmit }: CustomerInfoFormProps) => {
  const [formData, setFormData] = useState<CustomerInfo>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({})
  const { cart } = useCart()

  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  const shippingFee = 0
  const total = subtotal + shippingFee

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }
  const provincesArray = Object.values(provinces);
  const districtArray = Object.values(districts);

  const districtOptions = districtArray.filter(
    (d) => d.parent_code === formData.province
  );

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {}

    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại"
    else if (!/^[0-9]{10}$/.test(String(formData.phone))) newErrors.phone = "Số điện thoại không hợp lệ"

    if (!formData.email) newErrors.email = "Vui lòng nhập email"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(formData.email))) newErrors.email = "Email không hợp lệ"

    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ tên"
    if (!formData.province) newErrors.province = "Vui lòng chọn tỉnh/thành phố"
    if (!formData.district) newErrors.district = "Vui lòng chọn quận/huyện"
    if (!formData.address) newErrors.address = "Vui lòng nhập địa chỉ"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Điện thoại</Label>
            <Input
              id="phone"
              placeholder="Nhập số điện thoại"
              value={String(formData.phone)}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Nhập email"
              value={String(formData.email)}
              onChange={(e) => handleChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              placeholder="Nhập họ và tên"
              value={String(formData.fullName)}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Chọn Tỉnh/Thành phố */}
            <div className="space-y-2">
              <Label htmlFor="province">Tỉnh/Thành phố</Label>
              <Select
                value={String(formData.province)}
                onValueChange={(value) => handleChange("province", value)}
              >
                <SelectTrigger id="province" className={errors.province ? "border-red-500" : ""}>
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {provincesArray.map((province) => (
                    <SelectItem key={province.code} value={province.code}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
            </div>

            {/* Chọn Quận/Huyện */}
            <div className="space-y-2">
              <Label htmlFor="district">Quận/Huyện</Label>
              <Select
                value={String(formData.district)}
                onValueChange={(value) => handleChange("district", value)}
                disabled={!formData.province}
              >
                <SelectTrigger id="district" className={errors.district ? "border-red-500" : ""}>
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {districtOptions.map((district) => (
                    <SelectItem key={district.code} value={district.code}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              placeholder="Nhập địa chỉ chi tiết"
              value={String(formData.address)}
              onChange={(e) => handleChange("address", e.target.value)}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="note"
              placeholder="Ghi chú thêm (nếu có)"
              value={String(formData.note)}
              onChange={(e) => handleChange("note", e.target.value)}
              rows={3}
            />
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">
              Tiếp tục
            </Button>
          </motion.div>
        </form>
      </div>

      <div className="hidden md:block">
        <div className="bg-pink-50 rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-lg mb-4">Thông tin đơn hàng</h3>
          <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                <div className="w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.imageUrls[0] || "/placeholder.svg?height=80&width=80"}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold">{item.product.name}</h4>
                  <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                  <p className="font-semibold text-pink-600 mt-1">
                    {(item.product.price * item.quantity).toLocaleString('vi-VN')}₫
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 sticky bottom-0 bg-pink-50 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Tạm tính:</span>
              <span>{subtotal.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phí vận chuyển:</span>
              <span>{shippingFee.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t mt-2">
              <span>Tổng cộng:</span>
              <span className="text-pink-600">{total.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

