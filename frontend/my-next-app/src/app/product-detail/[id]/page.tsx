"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Heart, Minus, Plus, MessageCircle, Check, Star, Truck, RefreshCw, Search, ShoppingCart, Facebook } from "lucide-react"
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
        <div className="min-h-screen bg-white">
           {/* Header */}
           <motion.header
                initial={{ opacity: 0, y: -50 }} // Bắt đầu mờ và cao hơn vị trí ban đầu
                animate={{ opacity: 1, y: 0 }}   // Hiện dần và di chuyển xuống vị trí đúng
                transition={{ duration: 1, ease: "easeOut" }} // Hiệu ứng mượt hơn
            >
                <header className="top-0 left-0 w-full z-50 bg-white shadow-sm">
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
            </motion.header>
        
            <div className="container mx-auto px-4 -mt-20 max-w-5xl">
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
                        <span>{product.name}</span>
                    </div>
                </motion.div>

                {/* Product Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">

                    {/* Product Images */}
                    <div className="p-4">
                    <motion.div
                        className="relative aspect-square rounded-lg overflow-hidden mb-4 cursor-pointer group"
                        style={{ scale: imageScale, opacity: imageOpacity }}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setLightboxOpen(true)}
                    >
                        <Image
                        src={product.imageUrls[0] || "/placeholder.svg"}
                        alt="Xe đạp ABC"
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                        priority
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-white/80 text-black px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                            Nhấn để phóng to
                        </span>
                        </div>
                    </motion.div>
                    
                    <div className="grid grid-cols-4 gap-2">
                        {product.imageUrls.map((image, index) => (
                        <motion.div
                            key={index}
                            className={cn(
                            "border rounded-lg overflow-hidden cursor-pointer relative aspect-square",
                            selectedImage === index ? "border-gray-400" : "border-gray-200",
                            )}
                            onClick={() => setSelectedImage(index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Image
                            src={image || "/placeholder.svg"}
                            alt={`Xe đạp ABC ${index + 1}`}
                            fill
                            className="object-contain p-1"
                            />
                            {selectedImage === index && (
                            <motion.div
                                className="absolute inset-0 border-2 border-pink-500 rounded-lg"
                                layoutId="selectedImageOutline"
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            />
                            )}
                            </motion.div>
                            ))}

                            <ImageLightbox
                            isOpen={lightboxOpen}
                            onClose={() => setLightboxOpen(false)}
                            src={product.imageUrls[selectedImage] || "/placeholder.svg"}
                            alt="Xe đạp ABC"
                            />
                        </div>
                    </div>

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
                                {product.name}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Mã sản phẩm: TT012
                            </p>
                        </div>
                        <motion.div
                            className="text-3xl font-bold text-black mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <FormatPrice price={product.price}/>
                        </motion.div>
                        
                    {/* Color */}
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
                        <motion.div
                            className="mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="font-semibold mb-2">Số lượng: {product.quantity} (còn lại: {product.quantity - quantity})</h3>
                            <div className="flex items-center">
                            <motion.div whileTap={{ scale: 0.9 }}>
                                <Button
                                variant="outline"
                                size="icon"
                                className="rounded-md h-10 w-10 relative overflow-hidden"
                                onClick={decreaseQuantity}
                                disabled={quantity === 1}
                                >
                                <Minus className="h-4 w-4 relative z-10" />
                                <motion.div
                                    className="absolute inset-0 bg-gray-100"
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileTap={{ scale: 4, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                                </Button>
                            </motion.div>
                            <span className="w-12 text-center">{quantity}</span>
                            <motion.div whileTap={{ scale: 0.9 }}>
                                <Button
                                variant="outline"
                                size="icon"
                                onClick={increaseQuantity}
                                disabled={quantity >= product.quantity}
                                className="rounded-md h-10 w-10 relative overflow-hidden"
                                >
                                <Plus className="h-4 w-4 relative z-10" />
                                <motion.div
                                    className="absolute inset-0 bg-gray-100"
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileTap={{ scale: 4, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                />
                                </Button>
                            </motion.div>
                            </div>
                        </motion.div>

                        {/* Button */}
                        <div className="grid gap-3 mb-6">
                        <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex justify-between">
                                <Button className="flex items-center bg-white hover:bg-gray-100 text-black border border-gray-300 rounded-md h-12 w-[420px] relative overflow-hidden group">
                                <span className="relative z-10">Thêm vào giỏ hàng</span>
                                <motion.div
                                className="absolute inset-0 bg-gray-200"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                                />
                                </Button>
                                <motion.button
                                className={cn("self-end p-3 rounded-full relative", isWishlisted ? "bg-pink-100" : "bg-gray-100")}
                                onClick={toggleWishlist}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                            >
                                <Heart
                                className={cn(
                                    "w-6 h-6 transition-colors relative z-10",
                                    isWishlisted ? "fill-pink-500 stroke-pink-500" : "stroke-gray-500",
                                )}
                                />
                                {isWishlisted && (
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.5, 1] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="absolute inset-0 rounded-full bg-pink-200 animate-ping opacity-75"></div>
                                </motion.div>
                                )}
                                </motion.button>
                                
                            </div>
                        </motion.div>

                        <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        >
                            <Button className="bg-[#FF5F9C] hover:bg-pink-600 text-white font-semibold rounded-md h-12 w-full text-base relative overflow-hidden group">
                                <span className="relative z-10">Mua ngay</span>
                                <motion.div
                                className="absolute inset-0 bg-pink-600"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                                />
                            </Button>
                            </motion.div>

                            <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            >
                            <Button
                                variant="outline"
                                className="bg-[#FEA500] border-orange-500 text-white font-semibold  hover:bg-orange-50 rounded-md h-12 w-full text-base relative overflow-hidden group"
                            >
                                <span className="relative z-10">Trả góp 0%</span>
                                <motion.div
                                className="absolute inset-0 bg-orange-50"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                                />
                            </Button>
                            </motion.div>

                            <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            >
                            <Button
                                variant="outline"
                                className="border-teal-500 bg-[#73C7C7] text-white hover:bg-teal-50 rounded-md font-semibold h-12 w-full text-base relative overflow-hidden group"
                            >
                                <span className="relative z-10">Thu lại lên đời</span>
                                <motion.div
                                className="absolute inset-0 bg-teal-50"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                                />
                            </Button>
                            </motion.div>
                        </div>            
                    </motion.div>
                </div>

                {/* Info */}
                <div className="mt-8">
                    <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-3 mb-4">
                            {["info", "specs", "qa"].map((tab) => (
                            <TabsTrigger key={tab} value={tab} className="text-base relative overflow-hidden group">
                                {tab === "info" && "Thông tin sản phẩm"}
                                {tab === "specs" && "Thông số kỹ thuật"}
                                {tab === "qa" && "Hỏi và đáp"}
                                {activeTab === tab && (
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"
                                    layoutId="activeTabIndicator"
                                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                />
                                )}
                                <motion.div
                                className="absolute inset-0 bg-gray-100"
                                initial={{ y: "100%" }}
                                whileHover={{ y: activeTab === tab ? "100%" : 0 }}
                                transition={{ duration: 0.3 }}
                                />
                            </TabsTrigger>
                            ))}
                        </TabsList>

                        <div>
                            <TabsContent value="info" className="bg-white p-6 rounded-xl shadow-sm">
                            <motion.h2
                                className="text-xl font-bold text-center mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                Thông tin sản phẩm
                            </motion.h2>
                            <div className="space-y-4">
                                <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                >
                                {product.description}
                                </motion.p>
                            </div>
                            </TabsContent>

                            <TabsContent value="specs" className="bg-white rounded-xl shadow-sm">
                            <ProductSpecs />
                            </TabsContent>

                            <TabsContent value="qa" className="bg-white rounded-xl shadow-sm">
                            <QuestionsAnswers />
                            </TabsContent>
                        </div>
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
    )
}

