"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Heart, Search, ShoppingCart, Facebook } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const NoProducts = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="sticky top-0 z-50 bg-white shadow-sm"
            >
                <div className="container mx-auto px-24 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/home" className="text-3xl font-extrabold text-pink-500">
                        T2BIKE
                        </Link>
    
                        <nav className="hidden md:flex items-center space-x-9">
                            <Link href="/home" className="text-black hover:text-pink-500 transition-colors font-bold">
                                Trang chủ
                            </Link>
    
                            <Link href="/all-products" className="text-black hover:text-pink-500 transition-colors font-bold">
                                Cửa hàng
                            </Link>
    
                            <Link href="/about" className="text-black hover:text-pink-500 transition-colors font-bold">
                                Về chúng tôi
                            </Link>
    
                            <Link href="/faq" className="text-black hover:text-pink-500 transition-colors font-bold">
                                FAQ
                            </Link>
    
                            <Link href="/contact" className="text-black hover:text-pink-500 transition-colors font-bold">
                                Liên hệ
                            </Link>
                        </nav>
    
                    <div className="flex items-center space-x-4">
                        <div className="relative hidden md:block w-64">
                            <Input type="search" placeholder="Tìm kiếm..." className="pl-10 pr-4" />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                        <button className="p-2 hover:text-pink-500 transition-colors">
                            <Heart className="h-6 w-6" />
                        </button>
                        <button className="p-2 hover:text-pink-500 transition-colors">
                            <ShoppingCart className="h-6 w-6" />
                        </button>
                        <div className="border-2 border-gray-400 p-1.5">
                            <Link href="/signin" className="text-black hover:text-pink-500 transition-colors">
                            Đăng nhập
                            </Link>
                        </div>
                            <Link href="/signup" className="text-black hover:text-pink-500 transition-colors">
                                Đăng ký
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.header>
    
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center">
                    <Image
                        src="/pet-dancing.gif" 
                        alt="Loading Cat"
                        width={150}
                        height={150}
                        className="mb-4"
                    />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        Hiện tại chưa có sản phẩm nào!
                    </h2>
                    <p className="text-gray-500 mb-6">Chúng tôi sẽ cập nhật trong vài ngày nữa, bạn vui lòng xem sản phẩm khác nhé!</p>
                    <Link href="/home">
                        <button className="bg-pink-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            Quay về trang chủ
                        </button>
                    </Link>
                </div>
            </main>
    
            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white mt-16 border-t max-w-screen-2xl mx-auto"
            >
            <div className="border-t border-pink-100 bg-[#FFE4EF]">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 w-full max-w-xl">
                        <div className="flex gap-2">
                        <Input type="email" placeholder="Nhập Email Để Tư Vấn" className="bg-white" />
                        <Button className="bg-pink-500 hover:bg-pink-600 text-white min-w-[120px]">SUBSCRIBE</Button>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm">Đăng ký để nhận được thông báo mới nhất từ T2BIKE</p>
                    </div>
                </div>
            </div>
    
            {/* Main Footer */}
            <div className="border-t border-pink-100">
                <div className="container mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        {/* Column 1 - Logo & Contact */}
                        <div className="lg:col-span-1">
                            <Link href="/" className="text-3xl font-extrabold text-pink-500">
                                T2BIKE
                            </Link>
                            <div className="mt-4 space-y-2">
                                <h3 className="font-semibold">LIÊN HỆ</h3>
                                <p className="text-sm text-gray-600">Số Điện Thoại: 99988765</p>
                                <p className="text-sm text-gray-600">Email: Greengrocery9@Gmail.Com</p>
                            </div>
                            {/* Payment Methods */}
                            <div className="mt-6 flex gap-2">
                            <Image src="/placeholder.svg?height=30&width=45" alt="Visa" width={45} height={30} className="h-8" />
                            <Image
                                src="/placeholder.svg?height=30&width=45"
                                alt="Mastercard"
                                width={45}
                                height={30}
                                className="h-8"
                            />
                            </div>
                        </div>
    
                        {/* Column 2 - Social Media */}
                        <div>
                            <h3 className="font-semibold mb-4">MẠNG XÃ HỘI</h3>
                            <div className="space-y-3">
                                <Link
                                    href="#"
                                    className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors"
                                >
                                    <Facebook size={20} />
                                    <span>FACEBOOK</span>
                                </Link>
                            </div>
                        </div>
    
                        {/* Column 3 - Information */}
                        <div>
                            <h3 className="font-semibold mb-4">THÔNG TIN</h3>
                            <div className="space-y-2">
                                {["Trang chủ", "Cửa hàng", "Về chúng tôi", "FAQ", "Liên hệ"].map((item) => (
                                    <Link key={item} href="#" className="block text-gray-600 hover:text-pink-500 transition-colors">
                                    {item}
                                    </Link>
                                ))}
                            </div>
                        </div>
    
                        {/* Column 4 - My Accounts */}
                        <div>
                            <h3 className="font-semibold mb-4">TÀI KHOẢN CỦA TÔI</h3>
                            <div className="space-y-2">
                                {["Tài khoản của tôi", "Yêu thích", "Giỏ hàng"].map((item) => (
                                    <Link key={item} href="#" className="block text-gray-600 hover:text-pink-500 transition-colors">
                                    {item}
                                    </Link>
                                ))}
                            </div>
                        </div>
    
                        {/* Column 5 - Categories */}
                        <div>
                            <h3 className="font-semibold mb-4">DANH MỤC SẢN PHẨM</h3>
                            <div className="space-y-2">
                                {["Xe tay thẳng", "Xe tay cong", "Xe mini", "Xe gấp", "Quần áo", "Phụ kiện khác"].map((item) => (
                                    <Link key={item} href="#" className="block text-gray-600 hover:text-pink-500 transition-colors">
                                    {item}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
                {/* Copyright */}
                <div className="border-t border-pink-100">
                    <div className="container mx-auto px-4 py-4">
                        <p className="text-center text-sm text-gray-600">Copyright © 2024 T2BIKE.</p>
                    </div>
                </div>
            </motion.footer>
        </div>
    );
};

export default NoProducts;
