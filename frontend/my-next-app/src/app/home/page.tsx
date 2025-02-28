"use client"

import { motion } from 'framer-motion';
import axios from 'axios';
import Image from "next/image"
import Link from "next/link"
import { Facebook, Heart, Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from 'react';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        if (selectedCategory) {
            axios.get(`http://localhost:8080/api/products/category/${selectedCategory}`)
                .then(response => setProducts(response.data))
                .catch(error => console.error("Error fetching products:", error));
        }
    }, [selectedCategory]);
    
    return (
    <div className="min-h-screen bg-white">
        {/* Header */}
        <motion.h1
            initial={{ opacity: 0, y: -50 }} // Bắt đầu mờ và cao hơn vị trí ban đầu
            animate={{ opacity: 1, y: 0 }}   // Hiện dần và di chuyển xuống vị trí đúng
            transition={{ duration: 1, ease: "easeOut" }} // Hiệu ứng mượt hơn
        >
            <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
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
                        <div className='border-2 border-gray-400 p-1.5'>
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
            </header>
        </motion.h1>

        {/*Hero Section */}
        <section className="w-full max-w-screen-2xl mx-auto px-4 py-8 md:py-20 bg-gradient-to-b from-[#FFCDE2] to-[#FCFCF7]">
            <div className="grid md:grid-cols-2 gap-5 items-center pl-20 pt-[60px]">

                {/* Text Content - Hiệu ứng từ trái sang */}
                <motion.div 
                initial={{ x: -100, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ duration: 1 }}
                className="text-center md:text-left space-y-8"
                >
                    <div className="space-y-8 -translate-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold space-y-10 leading-relaxed md:leading-tight">
                        Xe đạp chất lượng
                        <br />
                        Hành trình bền vững
                        </h1>
                        <p className="text-gray-600 text-lg">
                        Hãy đến ngay T2BIKE để khám phá những mẫu xe đạp Nhật bãi chất lượng,<br/> giá tốt và đồng hành cùng bạn trên mọi hành trình! 🚴‍♀️🌿
                        </p>
                        <Button size="lg" className="bg-[#FF5F9C] hover:bg-pink-600 rounded-none font-bold ">
                        MUA NGAY
                        </Button>
                    </div>
                </motion.div>
                <motion.div 
                    initial={{ x: 100, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    transition={{ duration: 1 }}
                    className="relative w-full mt-8 md:mt-0 flex justify-center"
                    >
                    <div className="relative group">
                        <Image
                            src="/xedap.webp"
                            width={600}
                            height={400}
                            className="w-full h-auto transform scale-105 transition-transform duration-300 pr-16" alt={""}
                        />
                    </div>
                </motion.div>
            </div>
        </section>

        {/* Service Highlights */}
        <motion.h1
                    initial={{ opacity: 0, y: 50 }} // Bắt đầu mờ và cao hơn vị trí ban đầu
                    animate={{ opacity: 1, y: 0 }}   // Hiện dần và di chuyển xuống vị trí đúng
                    transition={{ duration: 1, ease: "easeOut" }} // Hiệu ứng mượt hơn
            >
            <div className="flex justify-center gap-14 mt-4">
                {[
                { title: "Hỗ trợ 24/7", desc: "Luôn sẵn sàng giúp đỡ bạn" },
                { title: "Thanh toán an toàn", desc: "Đảm bảo giao dịch bảo mật tuyệt đối" },
                { title: "Hoàn tiền dễ dàng", desc: "Chấp nhận đổi trả nếu sản phẩm bị lỗi" },
                { title: "Bảo hành trọn đời", desc: "Gói bảo hành vô thời hạn" },
                ].map((item, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-sm hover:bg-pink-100 transition-shadow hover:scale-125">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                ))}
            </div>
        </motion.h1>

      {/* Product Categories */}
        <section className="container mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold mb-8">Danh mục sản phẩm</h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 font-bold">
                {["Xe tay cong", "Xe tay thẳng", "Xe mini", "Xe gấp", "Quần áo", "Phụ kiện khác"].map((category, index) => (
                    <div key={index} className="group cursor-pointer" onClick={() => setSelectedCategory(category)}>
                    <div className="aspect-square bg-pink-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-pink-200 transition-colors">
                        {category === "Xe tay cong" && (
                            <Image
                                src="/xe_tay_cong.png" 
                                width={600} 
                                height={400} 
                                className="w-full h-auto scale-50 transition-transform duration-300 object-cover" 
                                alt="Xe đạp"
                            />
                        )}
                        {category === "Xe tay thẳng" && (
                            <Image
                                src="/xe_tay_thang.png" 
                                width={600} 
                                height={400} 
                                className="w-full h-auto scale-50 transition-transform duration-300 object-cover" 
                                alt="Xe đạp"
                            />
                        )}
                        {category === "Xe mini" && (
                            <Image
                                src="/xe_mini.png" 
                                width={600} 
                                height={400} 
                                className="w-full h-auto scale-50 transition-transform duration-300 object-cover" 
                                alt="Xe đạp"
                            />
                        )}
                        {category === "Xe gấp" && (
                            <Image
                                src="/xe_gap.png" 
                                width={600} 
                                height={400} 
                                className="w-full h-auto scale-50 transition-transform duration-300 object-cover" 
                                alt="Xe đạp"
                            />
                        )}
                        {category === "Quần áo" && (
                            <Image
                                src="/quan_ao.png" 
                                width={600} 
                                height={400} 
                                className="w-full h-auto scale-50 transition-transform duration-300 object-cover" 
                                alt="Xe đạp"
                            />
                        )}
                        {category === "Phụ kiện khác" && (
                            <Image
                                src="/mu_bao_hiem.png" 
                                width={600} 
                                height={400} 
                                className="w-full h-auto scale-50 transition-transform duration-300 object-cover" 
                                alt="Xe đạp"
                            />
                        )}
                    </div>
                    <p className="text-center text-sm">{category}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-white mt-16 border-t max-w-screen-2xl mx-auto ">
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
                                <Link href="#" className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors">
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
        </footer>
    </div>
  )
}
