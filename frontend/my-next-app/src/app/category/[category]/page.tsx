"use client"

import { notFound } from "next/navigation"
import axios from "axios"
import { usePathname } from "next/navigation";
import { Product } from "@/types/product"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Search, ShoppingCart, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SliderCustom } from "@/app/all-products/slider"
import FormatPrice from "@/components/ui/FormatPrice"
import NoProducts from "@/components/NoProducts";

export default function Categorypage() {
    const pathname = usePathname();
    const category = pathname.split("/").pop();

    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(true);

    const [priceRange, setPriceRange] = useState([0, 50])

    const [brand, setBrand] = useState("")

    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 9

    useEffect(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }, [currentPage])
    
      const handleSearch = () => {
        // Gửi request đến backend với các thông số đã chọn
        console.log("Searching with filters:", { priceRange, brand })
        // Implement the API call or state update logic here
      }
    
      // Calculate the products to display on the current page
      const indexOfLastProduct = currentPage * productsPerPage
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage
      const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)
    
      // Calculate total pages
      const totalPages = Math.ceil(products.length / productsPerPage)

    useEffect(() => {
        if (!category) return;

        axios
        .get(`http://localhost:8081/api/all-products/category/${category}`)
        .then ((response) => {
            console.log("Dữ liệu sản phẩm:", response.data);
            setProducts(response.data);
        })
        .catch((error) => {
            console.error("Lỗi khi lấy sản phẩm", error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [category]);

    if (loading) return (
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
    )
    if (products.length === 0) return <NoProducts/>
    
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

        {/* Breadcrumb */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-4"
        >
            <div className="text-sm breadcrumbs text-gray-600 pt-10">
            <span>Danh sách sản phẩm</span>
            <span className="mx-2">/</span>
            <span>
                {(() => {
                switch (category) {
                    case "xe_tay_thang":
                        return "Xe tay thẳng";
                    case "xe_tay_cong":
                        return "Xe tay cong";
                    case "xe_mini":
                        return "Xe mini";
                    case "quan_ao":
                        return "Quần áo";
                    case "phu_kien_khac":
                        return "Phụ kiện khác";
                    default:
                        return "Danh mục khác";
                }
                })()}
            </span>
            </div>
        </motion.div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters - Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full md:w-64 space-y-6"
                >
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Bộ lọc tìm kiếm</h2>

                        {/* Price Range */}
                        <div className="space-y-4 mb-6">
                            <h3 className="font-medium">Giá</h3>
                            <SliderCustom
                            defaultValue={[0, 50]}
                            max={50}
                            step={1}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>{priceRange[0]}M VND</span>
                                <span>{priceRange[1]}M VND</span>
                            </div>
                        </div>

                        {/* Brand */}
                        <div className="space-y-4 mb-6">
                            <h3 className="font-medium">Hãng xe</h3>
                            <Select onValueChange={setBrand}>
                                <SelectTrigger>
                                <SelectValue placeholder="Chọn hãng xe" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="giant">Giant</SelectItem>
                                <SelectItem value="trek">Trek</SelectItem>
                                <SelectItem value="specialized">Specialized</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Search Button */}
                        <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white" onClick={handleSearch}>
                            Tìm kiếm
                        </Button>
                    </div>
                </motion.div>

                {/* Product Grid */}
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentProducts.map((product, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="relative group">
                                <div className="aspect-square overflow-hidden">
                                    <Image
                                    src={product.imageUrl || "/placeholder.svg"}
                                    alt={product.name}
                                    width={300}
                                    height={300}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-pink-50">
                                    <Heart className="h-5 w-5 text-pink-500" />
                                    </button>
                                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-pink-50">
                                    <ShoppingCart className="h-5 w-5 text-pink-500" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium">{product.name}</h3>
                                <p className="text-pink-500 font-semibold mt-2"><FormatPrice price={product.price}/></p>
                            </div>
                        </motion.div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-8">
                        <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="px-4 py-2 mx-1 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                        disabled={currentPage === 1}
                        >
                        Trước
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 mx-1 rounded-lg transition-colors ${
                            currentPage === i + 1 ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            {i + 1}
                        </button>
                        ))}
                        <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="px-4 py-2 mx-1 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                        disabled={currentPage === totalPages}
                        >
                        Sau
                        </button>
                    </div>
                </motion.div>
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
    )

}