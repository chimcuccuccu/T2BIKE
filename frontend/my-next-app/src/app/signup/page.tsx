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
import axios from "axios"
import router from "next/router"

export default function SignUpForm() {
    const [errors, setErrors] = useState({
        username: "",
        firstName: "",
        lastName: "",
        day: "",
        month: "",
        year: "",
        gender: "",
        contact: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [success, setSuccess] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    
    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        day: "",
        month: "",
        year: "",
        gender: "",
        password: "",
    })

    const isValidDate = (day: number, month: number, year: number) => {
        const daysInMonth = new Date(year, month, 0).getDate();
        return day > 0 && day <= daysInMonth;
    };

    const isValidPassword = (password: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(password);
    };

    const validateForm = () => {
        let newErrors = { ...errors };
      
        if (!formData.firstName.trim()) newErrors.firstName = "Họ không được để trống";
        else newErrors.firstName = "";
      
        if (!formData.lastName.trim()) newErrors.lastName = "Tên không được để trống";
        else newErrors.lastName = "";
      
        if (!formData.day || !formData.month || !formData.year) {
            newErrors.day = "Vui lòng chọn ngày tháng năm sinh";
        } else if (!isValidDate(Number(formData.day), Number(formData.month), Number(formData.year))) {
            newErrors.day = "Ngày sinh không hợp lệ";
        } else {
            newErrors.day = "";
        }
      
        if (!formData.gender) newErrors.gender = "Vui lòng chọn giới tính";
        else newErrors.gender = "";
      
        if (!formData.username.trim()) newErrors.username = "Vui lòng nhập username";
        else newErrors.username = "";
      
        if (!formData.password.trim()) newErrors.password = "Mật khẩu không được để trống";
        else if (!isValidPassword(formData.password)) {
            newErrors.password = "Mật khẩu phải có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 chữ số và dài tối thiểu 8 ký tự.";
        } else {
            newErrors.password = "";
        }
      
        setErrors(newErrors);
      
        return Object.values(newErrors).every((error) => error === "");
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Bắt đầu submit");

        setLoading(true);
        
        if (!validateForm()) {
            console.log("Validation failed", errors);
            setLoading(false);
            return;
        }
      
        const padZero = (num: string) => num.padStart(2, '0');
        const userData = {
          username: formData.username,
          password: formData.password,
          fullName: `${formData.firstName} ${formData.lastName}`,
          gender: formData.gender,
          birthDate: `${padZero(formData.day)}-${padZero(formData.month)}-${formData.year}`,
        };
        
        console.log("Dữ liệu gửi đi:", {
            ...userData,
            birthDate: `${formData.year}-${formData.month}-${formData.day}`
          });

        try {
            const response = await axios.post("http://localhost:8081/api/users/register", userData, {
                headers: { 'Content-Type': 'application/json' }
            });
                console.log("Phản hồi từ server:", response.data);
                setSuccess(true);
                setMessage("Đăng ký thành công!");
                setTimeout(() => router.push("/signin"), 2000);
        } catch (error: any) {
            console.error("Lỗi khi gọi API:", error);
            setMessage(error.response?.data?.message || "Đăng ký thất bại");
        } finally {
            setLoading(false);
        }
      };
      
    // Generate arrays for days, months, and years
    const days = Array.from({ length: 31 }, (_, i) => i + 1)
    const months = Array.from({ length: 12 }, (_, i) => i + 1)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i)

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FFCDE2] to-[#FCFCF7] flex items-center justify-center p-4 pt-20">
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
                            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
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
                            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Ngày</Label>
                            <Select value={formData.day} 
                                onValueChange={(value) => setFormData({ ...formData, day:  value })} >
                                <SelectTrigger>
                                <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent>
                                {days.map((day) => (
                                    <SelectItem key={day} value={day.toString()}>
                                    {day}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            {errors.day && <p className="text-red-500 text-sm">{errors.day}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Tháng</Label>
                            <Select value={formData.month} onValueChange={(value) => setFormData({ ...formData, month: value })}>
                                <SelectTrigger>
                                <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent>
                                {months.map((month) => (
                                    <SelectItem key={month} value={month.toString()}>
                                    Tháng {month}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            {errors.month && <p className="text-red-500 text-sm">{errors.month}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Năm</Label>
                            <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                        {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
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
                        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2">
                        <Label htmlFor="contact">Username</Label>
                        <Input
                        id="contact"
                        type="text"
                        placeholder="User name"
                        value={formData.username}
                        onChange={(e) => {setFormData({ ...formData, username: e.target.value });
                        setErrors({ ...errors, contact: "" });
                    }}
                        className="transition-all duration-200 focus:ring-2 focus:ring-pink-500"
                        />
                        {errors.contact && <p className="text-red-500 text-sm">{errors.username}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-2 relative">
                        <Label htmlFor="password">Mật khẩu mới</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Mật khẩu mới"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 pr-10" // Chừa chỗ cho icon
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                <img
                                    src={showPassword ? "/pass-open.png" : "/password-hide.svg"}
                                    alt="Toggle Password"
                                    className="w-6 h-6"
                                />
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    {/* Submit Button */}
                    {success ? (
                        <div className="text-center p-6 bg-green-100 rounded-lg">
                            <h2 className="text-2xl font-bold text-green-600">Đăng ký thành công!</h2>
                            <Link href="/signin" className="text-gray-700 mt-2">Vui lòng đăng nhập lại</Link>
                        </div>
                    ) : (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            {message && (
                            <div className={`p-4 rounded-md ${
                                message.includes("thành công") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                                {message}
                            </div>
                            )}
                            <Button
                            type="submit"
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition-colors"
                            >
                            ĐĂNG KÝ
                            </Button>
                        </motion.div>
                    )}
                </form>

                {/* Login Link */}
                <div className="text-center">
                    <Link href="/signin" className="text-sm text-pink-500 hover:text-pink-600 transition-colors">
                        Bạn đã có tài khoản ư?
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
