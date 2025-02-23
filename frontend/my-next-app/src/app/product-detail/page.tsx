"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Minus, Plus, MessageCircle, Check, Star, Truck, RefreshCw, Search, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const images = [
    "/xe_gap.png",

    "/xe_gap.png",
    "/xe_gap.png",
    "/xe_gap.png",
  ]

  const productFeatures = [
    "Hàng Nhật bãi, được tân trang lại mới, sạch, đẹp như hình mô tả",
    "Quà tặng kèm: Mũ bảo hiểm, đèn xe, giá treo di động",
    "Bảo hành trọn đời",
    "Giao hàng miễn phí trong nội thành",
    "Hỗ trợ trả góp 0% lãi suất",
  ]

  const specifications = [
    { name: "Khung xe", value: "Hợp kim nhôm (Aluminum Alloy 6061)" },
    { name: "Kích thước khung", value: "S (50cm), M (52cm), L (54cm)" },
    { name: "Phuộc trước", value: "Carbon Fiber, không giảm xóc" },
    { name: "Giò đĩa", value: "Shimano 50/34T" },
    { name: "Líp sau", value: "Shimano 11-28T, 10 tốc độ" },
    { name: "Tay đề", value: "Shimano Tiagra 2×10" },
    { name: "Hệ thống phanh", value: "Phanh đĩa dầu Shimano" },
    { name: "Bánh xe", value: "Vành nhôm 700C, moay-ơ bạc đạn" },
    { name: "Lốp xe", value: "Continental Ultra Sport 700×25C" },
    { name: "Ghi đông", value: "Drop Bar, hợp kim nhôm" },
    { name: "Cọc yên", value: "Carbon, đường kính 27.2mm" },
    { name: "Yên xe", value: "Fizik Arione" },
    { name: "Trọng lượng", value: "8.5 kg" },
  ]

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0}}
                transition={{ duration: 1, ease: "easeOut"}}
                className="sticky top-0 z-50 bg-white shadow-sm"
            >
                <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-4">
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
            </motion.header>
        
        <div className="container mx-auto px-4 max-w-5xl">
            {/* Breadcrumb */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 py-4"
            >
                <div className="text-sm breadcrumbs text-gray-600 pt-20">
                    <span>Trang chủ</span>
                    <span className="mx-2">/</span>
                    <span>Xe đạp tay cong</span>
                </div>
            </motion.div>

                {/* Product Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Image Gallery */}
                    <motion.div
                        initial= {{ opacity: 0, x: -20}}
                        animate= {{ opacity: 1, x: 0}}
                        transition={{ duration: 0.5}}
                        className="space-y-4"
                    >
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-lg">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImage}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={images[selectedImage] || "/placeholder.svg"}
                                        alt="Product"
                                        fill
                                        className="object-contain p-4"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {images.map((image, index) => (
                                <motion.button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative w-20 aspect-square flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                                    selectedImage === index ? "border-pink-500 shadow-md" : "border-transparent"
                                }`}
                                >
                                <Image
                                    src={image || "/placeholder.svg"}
                                    alt={`Product ${index + 1}`}
                                    fill
                                    className="object-contain p-2"
                                />
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial= {{ opacity: 0, x: 20 }}
                        animate= {{ opacity: 1, x: 0 }}
                        transition= {{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                                    BestSeller
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold">
                                Xe đạp ABC
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Mã sản phẩm: TT012
                            </p>
                        </div>


                    </motion.div>
                </div>
            </div>
        </div>
    )
}

