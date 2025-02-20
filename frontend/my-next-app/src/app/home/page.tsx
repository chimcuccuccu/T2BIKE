"use client"

import { motion } from 'framer-motion';

import Image from "next/image"
import Link from "next/link"
import { Heart, Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.h1
                initial={{ opacity: 0, y: -50 }} // Bắt đầu mờ và cao hơn vị trí ban đầu
                animate={{ opacity: 1, y: 0 }}   // Hiện dần và di chuyển xuống vị trí đúng
                transition={{ duration: 1, ease: "easeOut" }} // Hiệu ứng mượt hơn
        >
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
                <Link href="/" className="text-3xl font-extrabold text-pink-500">
                T2BIKE
                </Link>

                <nav className="hidden md:flex items-center space-x-9">
                <Link href="/" className="text-black hover:text-pink-500 transition-colors font-bold">
                    Trang chủ
                </Link>
                <Link href="/blog" className="text-black hover:text-pink-500 transition-colors font-bold">
                    Cửa hàng
                </Link>
                <Link href="/about" className="text-black hover:text-pink-500 transition-colors font-bold">
                    Về chúng tôi
                </Link>
                <Link href="/about" className="text-black hover:text-pink-500 transition-colors font-bold">
                    FAQ
                </Link>
                <Link href="/about" className="text-black hover:text-pink-500 transition-colors font-bold">
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
                <Link href="/about" className="text-black hover:text-pink-500 transition-colors">
                    Đăng nhập
                </Link>
                <Link href="/about" className="text-black hover:text-pink-500 transition-colors">
                    Đăng ký
                </Link>
                </div>
            </div>
            </div>
        </header>
        </motion.h1>

      {/*Hero Section */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 py-8 md:py-16 bg-gradient-to-b from-[#FFCDE2] to-[#FCFCF7]">
        <div className="grid md:grid-cols-2 gap-5 items-center pl-20">

            {/* Text Content - Hiệu ứng từ trái sang */}
            <motion.div 
            initial={{ x: -100, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ duration: 1 }}
            className="text-center md:text-left space-y-6"
            >
                <div className="space-y-8 -translate-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold space-y-10 leading-relaxed md:leading-tight">
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
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {["Xe tay công", "Xe tay nắng", "Xe mini", "Xe gấp", "Quần áo"].map((category, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="aspect-square bg-pink-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-pink-200 transition-colors">
                <div className="w-12 h-12" />
              </div>
              <p className="text-center text-sm">{category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white mt-16 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">T2BIKE</h3>
              <p className="text-sm text-gray-500">Your trusted bike shop</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">SOCIAL MEDIA</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Facebook</li>
                <li>Instagram</li>
                <li>Twitter</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">INFORMATION</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>About Us</li>
                <li>Contact</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">MY ACCOUNT</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Sign In</li>
                <li>Register</li>
                <li>Order Status</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
            <p>© 2024 T2BIKE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

