"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Facebook, Clock, Search, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"

export default function ContactSection() {
    const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
        },
    }

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

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-4 -left-4 w-24 h-24 bg-pink-200 rounded-full opacity-20"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, 0],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                />
                <motion.div
                    className="absolute top-1/4 -right-8 w-32 h-32 bg-pink-200 rounded-full opacity-20"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -15, 0],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 -left-16 w-48 h-48 bg-pink-200 rounded-full opacity-20"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 20, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                }}
                />
                <motion.div
                    className="absolute -bottom-8 right-1/3 w-40 h-40 bg-pink-200 rounded-full opacity-20"
                    animate={{
                        scale: [1, 1.15, 1],
                        rotate: [0, -10, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                }}
                />
            </div>

            {/* Main */}
            <div className="container mx-auto px-4 py-28 relative">
                <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={containerVariants} 
                    className="max-w-4xl mx-auto">
                    <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-center mb-4">
                        LIÊN HỆ VỚI CHÚNG TÔI
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        T2BIKE luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các phương thức dưới đây.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-pink-50 rounded-full -translate-y-1/2 translate-x-1/2 z-0" />

                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-6 group relative z-10"
                        >
                            <div className="p-4 bg-pink-50 rounded-full group-hover:bg-pink-100 transition-colors">
                                <MapPin className="w-8 h-8 text-pink-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl text-gray-900 mb-1">Địa chỉ</h3>
                                <Link href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                                    Khối Bản Bon - Thị trấn Kim Sơn - Huyện Quế Phong - Tỉnh Nghệ An
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-6 group relative z-10"
                        >
                            <div className="p-4 bg-pink-50 rounded-full group-hover:bg-pink-100 transition-colors">
                                <Phone className="w-8 h-8 text-pink-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl text-gray-900 mb-1">Điện thoại</h3>
                                <Link href="tel:0123456789" className="text-gray-600 hover:text-pink-500 transition-colors">
                                0123456789
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-6 group relative z-10"
                            >
                            <div className="p-4 bg-pink-50 rounded-full group-hover:bg-pink-100 transition-colors">
                                <Mail className="w-8 h-8 text-pink-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl text-gray-900 mb-1">Email</h3>
                                <Link
                                href="mailto:contact@quephong.com"
                                className="text-gray-600 hover:text-pink-500 transition-colors"
                                >
                                contact@quephong.com
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-6 group relative z-10"
                        >
                            <div className="p-4 bg-pink-50 rounded-full group-hover:bg-pink-100 transition-colors">
                                <Facebook className="w-8 h-8 text-pink-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl text-gray-900 mb-1">Facebook</h3>
                                <Link href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                                    Trương Thủy
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-6 group relative z-10"
                        >
                            <div className="p-4 bg-pink-50 rounded-full group-hover:bg-pink-100 transition-colors">
                                <Clock className="w-8 h-8 text-pink-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl text-gray-900 mb-1">Giờ làm việc</h3>
                                <p className="text-gray-600">
                                Giờ giấc linh động (Đóng quán sau 19h00)
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Map Section */}
                    <motion.div variants={itemVariants} className="mt-12 bg-white rounded-2xl shadow-lg p-4 aspect-video">
                        <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d946.6116411635164!2d104.93241177838716!3d19.623245239363373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3130d6a1598c9195%3A0xce0feeb97b700852!2zTOG7kXAsIOG6rmMgUXV5IMO0VMO0IC0gWGUgxJHhuqFwIHRo4buDIHRoYW8!5e0!3m2!1svi!2s!4v1708651151099!5m2!1svi!2s"
                        className="w-full h-full rounded-xl"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        />
                    </motion.div>
                </motion.div>
            </div>

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
    )
}