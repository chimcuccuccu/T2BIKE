"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Heart, Minus, Plus,
         MessageCircle, Check, 
         Star, Truck, RefreshCw, 
         Search, ShoppingCart, Home,
         ChevronRight, Facebook, ChevronUp, ZoomIn, ShieldCheck,
         ArrowLeft, ArrowRight, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Product } from "@/types/product"
import { useParams } from "next/navigation"
import axios from "axios"
import FormatPrice from "@/components/ui/FormatPrice"
import { cn } from "@/lib/utils"
import ImageLightbox from "@/components/ImageLightBox"
import ProductSpecs from "@/components/ProductSpecs"
import QuestionsAnswers from "@/components/QuestionAnswer"
import { HeaderPage } from "@/components/Header/header-page"

export default function ProductDetail() {
    const { id } = useParams()
    const [quantity, setQuantity] = useState(1)
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedColor, setSelectedColor] = useState("red")
    const [selectedImage, setSelectedImage] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [activeTab, setActiveTab] = useState("info")
    const [currentImage, setCurrentImage] = useState(0)

    const increaseQuantity = () => setQuantity((prev) => prev + 1)
    const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
    
  
    const toggleWishlist = () => {
        setIsWishlisted((prev) => !prev)
      }

    const productRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: productRef,
        offset: ["start start", "end start"],
    })

    const imageScale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
    const imageOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.6])

    const nextImage = () => {
        setCurrentImage((prev) => (prev === (product?.imageUrls?.length ?? 0) - 1 ? 0 : prev + 1))
    }
    
      const prevImage = () => {
        setCurrentImage((prev) => (prev === 0 ? (product?.imageUrls?.length ?? 0) - 1 : prev - 1))
    }

      
    useEffect(() => {
        const handleScroll = () => {
          setIsScrolled(window.scrollY > 100)
        }
    
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
      }, [])

    console.log("id la", id)
    useEffect(() => {
        if (id) {
          axios.get(`http://localhost:8081/api/all-products/${id}`)
            .then((res) => {
                setProduct(res.data)
                console.log("Dữ liệu nhận được:", res.data);
            })
            .catch((err) => console.error('Lỗi khi lấy chi tiết sản phẩm:', err));
        }
    }, [id]);

    if (!product) return (
        <div className="flex items-center justify-center h-screen">
             <Image
                src="/cat-loading.gif" 
                alt="Loading Cat"
                width={150}
                height={150}
                className="mb-4"
            />
            <p className="text-4xl font-bold text-pink-600">
                Đang tải, bạn chờ xíu nha <span className="dot1">.</span><span className="dot2">.</span><span className="dot3">.</span>
            </p>
            <style jsx>{`
                @keyframes blink {
                0% { opacity: 1; }
                33% { opacity: 0; }
                66% { opacity: 1; }
                100% { opacity: 1; }
                }
                .dot1 { animation: blink 1.5s infinite; }
                .dot2 { animation: blink 1.5s infinite 0.2s; }
                .dot3 { animation: blink 1.5s infinite 0.4s; }
            `}</style>
        </div>
    );

    return (
        <div className="min-h-screen bg-pink-50">
           {/* Header */}
        
            <div className="container mx-auto px-4 mt-10 max-w-5xl">
                <AnimatePresence>
                    {isScrolled && (
                    <motion.div
                        className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 py-4 px-8"
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    >
                        <div className="container mx-auto flex justify-between items-center">
                        <h2 className="font-bold text-2xl">{product.name}</h2>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-pink-500 text-2xl"><FormatPrice price={product.price}/></span>
                            <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-md font-semibold" size="lg">
                            Mua ngay
                            </Button>
                        </div>
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>

                {/* Product Section */}
                <div className="container mx-auto px-4 py-8 -mt-10">
                    <div className=" grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Product Images */}
                        <div className="p-6">
                        <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square mb-4 group">
                            
                            {/* Nút chuyển ảnh trái */}
                            <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md"
                            onClick={prevImage}
                            >
                            <ArrowLeft className="h-5 w-5" />
                            </Button>

                            {/* Ảnh chính */}
                            <Image
                            src={product.imageUrls[currentImage] || "/placeholder.svg"}
                            alt="Xe tay thang"
                            width={600}
                            height={600}
                            className="object-contain transition-transform duration-300 hover:scale-105 cursor-pointer"
                            onClick={() => setLightboxOpen(true)}
                            />

                            {/* Nút chuyển ảnh phải */}
                            <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md"
                            onClick={nextImage}
                            >
                            <ArrowRight className="h-5 w-5" />
                            </Button>

                            {/* Nút phóng to */}
                            <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white shadow-md p-2"
                            onClick={() => setLightboxOpen(true)}
                            >
                            <ZoomIn className="h-5 w-5" />
                            </Button>

                            {/* Badge BestSeller */}
                            <Badge className="absolute top-4 left-4 bg-pink-500 hover:bg-pink-600">
                            BestSeller
                            </Badge>
                        </div>

                        {/* Thumbnail List */}
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {product.imageUrls.map((img, index) => (
                            <div
                                key={index}
                                className={`border-2 rounded cursor-pointer flex-shrink-0 transition-all duration-300 ${
                                currentImage === index ? "border-pink-500 opacity-100" : "border-gray-200 opacity-60 hover:opacity-100"
                                }`}
                                onClick={() => setCurrentImage(index)}
                            >
                                <Image
                                src={img || "/placeholder.svg"}
                                alt={`Thumbnail ${index + 1}`}
                                width={80}
                                height={80}
                                className="h-20 w-20 object-cover"
                                />
                            </div>
                            ))}
                        </div>
                        
                        <ImageLightbox
                            isOpen={lightboxOpen}
                            onClose={() => setLightboxOpen(false)}
                            src={product.imageUrls[selectedImage] || "/placeholder.svg"}
                            alt="Xe đạp ABC"
                        />
                    </div>
                    <div className="p-6 lg:p-8 flex flex-col">
                        <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <div className="flex items-center gap-4 mb-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-5 w-5 ${star <= 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                                />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">36 đánh giá</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">Mã sản phẩm: TT012</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Share2 className="h-5 w-5" />
                        </Button>
                        </div>

                        <p className="text-3xl font-bold text-gray-900"><FormatPrice price={product.price}/></p>
                        <p className="text-sm text-gray-500 mt-1">Giá đã bao gồm VAT</p>
                        <Separator className="my-2" />

                    {/* Color selection */}
                    <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    >
                        <h3 className="font-semibold mb-2">Màu</h3>
                        <div className="flex gap-3">
                            {product.color.map((color) => (
                                <motion.div
                                key={color}
                                className={cn(
                                    "w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2",
                                    selectedColor === color ? "border-gray-400" : "border-transparent",
                                )}
                                onClick={() => setSelectedColor(color)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                >
                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quantity */}
                    <div className="mb-6">
                        <div className="flex justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-900">Số lượng</h3>
                            <p className="text-sm text-gray-500">Còn lại: {product.quantity - quantity}</p>
                        </div>
                        <div className="flex items-center">
                            <button
                            className="w-10 h-10 rounded-l-md border border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                            onClick={decreaseQuantity}
                            disabled={quantity === 1}
                            >
                            <span className="text-xl font-medium">−</span>
                            </button>
                            <input
                            type="text"
                            value={quantity}
                            readOnly
                            className="w-14 h-10 border-t border-b border-gray-300 text-center"
                            />
                            <button
                            className="w-10 h-10 rounded-r-md border border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                            onClick={increaseQuantity}
                            disabled={quantity >= product.quantity}
                            >
                            <span className="text-xl font-medium">+</span>
                            </button>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        <Button className="h-12 text-base font-medium bg-pink-500 hover:bg-pink-600">Mua ngay</Button>
                        <Button
                            variant="outline"
                            className="h-12 text-base font-medium border-pink-500 text-pink-500 hover:bg-pink-50"
                        >
                            Thêm vào giỏ hàng
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <Button
                            variant="secondary"
                            className="h-12 text-base font-medium bg-pink-100 hover:bg-pink-200 text-pink-700"
                        >
                            Trả góp 0%
                        </Button>
                        <Button
                            variant="secondary"
                            className="h-12 text-base font-medium flex items-center justify-center gap-2 bg-pink-100 hover:bg-pink-200 text-pink-700"
                        >
                            <Heart className="h-5 w-5" />
                            Yêu thích
                        </Button>
                    </div>

                    {/* Benefits */}
                    <div className="bg-pink-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5 text-pink-500" />
                            <div>
                            <p className="text-sm font-medium">Giao hàng miễn phí</p>
                            <p className="text-xs text-gray-500">Cho đơn hàng từ 2.000.000đ</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-pink-500" />
                            <div>
                                <p className="text-sm font-medium">Bảo hành chính hãng 12 tháng</p>
                                <p className="text-xs text-gray-500">1 đổi 1 trong 30 ngày đầu tiên</p>
                            </div>
                        </div>
                        </div>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
                    <Tabs defaultValue="description">
                        <TabsList className="w-full border-b bg-gray-50 p-0 h-auto">
                        <TabsTrigger
                            value="description"
                            className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none"
                        >
                            Mô tả sản phẩm
                        </TabsTrigger>
                        <TabsTrigger
                            value="specs"
                            className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none"
                        >
                            Thông số kỹ thuật
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none"
                        >
                            Đánh giá (36)
                        </TabsTrigger>
                        </TabsList>
                        <TabsContent value="description" className="p-6">
                            <div className="prose max-w-none">
                                    {product.description}
                            </div>
                        </TabsContent>
                        <TabsContent value="specs" className="p-6">
                            <ProductSpecs></ProductSpecs>
                        </TabsContent>
                        <TabsContent value="reviews" className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                            <h3 className="font-medium text-lg">Đánh giá từ khách hàng</h3>
                            <div className="flex items-center mt-2">
                                <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                    key={star}
                                    className={`h-5 w-5 ${star <= 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                                    />
                                ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-500">4.0/5 (36 đánh giá)</span>
                            </div>
                            </div>
                            <Button className="bg-pink-500 hover:bg-pink-600">Viết đánh giá</Button>
                        </div>

                        <Separator className="my-6" />

                        <div className="space-y-6">
                            {[1, 2, 3].map((review) => (
                            <div key={review} className="pb-6 border-b border-gray-100 last:border-0">
                                <div className="flex justify-between mb-2">
                                <div>
                                    <h4 className="font-medium">Nguyễn Văn A</h4>
                                    <div className="flex mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                        key={star}
                                        className={`h-4 w-4 ${star <= 5 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                                        />
                                    ))}
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">12/03/2023</span>
                                </div>
                                <p className="text-gray-600 mt-2">
                                Sản phẩm rất tốt, đúng như mô tả. Xe chạy êm, phanh nhạy và chuyển số mượt mà. Giao hàng nhanh và
                                đóng gói cẩn thận. Rất hài lòng với sản phẩm này!
                                </p>
                            </div>
                            ))}
                        </div>

                        <div className="mt-6 text-center">
                            <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50">
                            Xem thêm đánh giá
                            </Button>
                        </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
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
    );
}

