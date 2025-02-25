"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    day: "",
    month: "",
    year: "",
    gender: "",
    contact: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
  }

  // Generate arrays for days, months, and years
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFCDE2] to-[#FCFCF7] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-extrabold text-pink-500">T2BIKE</h1>
        </motion.div>

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-pink-500">TẠO TÀI KHOẢN MỚI</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Họ</Label>
              <Input
                id="firstName"
                placeholder="Họ"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="transition-all duration-200 focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Tên</Label>
              <Input
                id="lastName"
                placeholder="Tên"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="transition-all duration-200 focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Ngày</Label>
              <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="22" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tháng</Label>
              <Select value={formData.month} onValueChange={(value) => setFormData({ ...formData, month: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Tháng 11" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      Tháng {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Năm</Label>
              <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="2004" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Gender Selection */}
          <div className="space-y-2">
            <Label>Giới tính</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nam" id="nam" />
                <Label htmlFor="nam">Nam</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nu" id="nu" />
                <Label htmlFor="nu">Nữ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="khac" id="khac" />
                <Label htmlFor="khac">Khác</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <Label htmlFor="contact">Số di động hoặc email</Label>
            <Input
              id="contact"
              type="text"
              placeholder="Số di động hoặc email"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="transition-all duration-200 focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu mới</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mật khẩu mới"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="transition-all duration-200 focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              ĐĂNG KÝ
            </Button>
          </motion.div>
        </form>

        {/* Login Link */}
        <div className="text-center">
          <Link href="/login" className="text-sm text-pink-500 hover:text-pink-600 transition-colors">
            Bạn đã có tài khoản ư?
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

