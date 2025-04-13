"use client"

import { Product } from "@/types/product";
import { useState, useEffect } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Search, ShoppingCart, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SliderCustom } from "./slider"
import FormatPrice from "@/components/ui/FormatPrice";
import { useSearchParams } from "next/navigation";
import { Filters } from "@/types/filters";
import { HeaderPage } from "@/components/Header/header-page";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ProductList } from "@/components/Product-List/product-list";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [priceRange, setPriceRange] = useState([0, 50])
    const [bikeType, setBikeType] = useState("")
    const [brand, setBrand] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isFiltered, setIsFiltered] = useState(false);

    const productsPerPage = 9

    const searchParams = useSearchParams()
    const category = searchParams.get("category")

    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: 0,
        category: "",
        brand: "",
    })
    
    useEffect(() => {
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/all-products");
            setProducts(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        }
    };

    const fetchFilteredProducts = async () => {
        try {
            const params: Record<string, string> = {
                minPrice: filters.minPrice.toString(),
                maxPrice: filters.maxPrice.toString(),
            };
    
            if (filters.category) params.category = filters.category;
            if (filters.brand) params.brand = filters.brand;
    
            const query = new URLSearchParams(params).toString();
            const url = `http://localhost:8081/api/all-products/filter?${query}`;
    
            console.log("Fetching filtered products from:", url);
    
            const response = await axios.get(url);
            setProducts(response.data);
        } catch (error) {
            console.error("Lỗi khi lọc sản phẩm:", error);
        }
    };
    
    const handleSearch = () => {
        setFilters({
            minPrice: priceRange[0] * 1_000_000,
            maxPrice: priceRange[1] * 1_000_000,
            category: bikeType,
            brand: brand,
        });
        setIsFiltered(true);
    };
    
    useEffect(() => {
        if (isFiltered) {
            fetchFilteredProducts();
        }
    }, [filters]);

    const handleReset = () => {
        setPriceRange([0, 50]);
        setBikeType("");
        setBrand("");
        setFilters({
            minPrice: 0,
            maxPrice: 0,
            category: "",
            brand: "",
        });
        setIsFiltered(false); // Đặt lại trạng thái để hiển thị tất cả sản phẩm
        fetchAllProducts(); // Load lại toàn bộ danh sách sản phẩm
    }

    const handleFilterChange = (key: keyof Filters, value: string | number) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        window.scrollTo({
        top: 0,
        behavior: "smooth",
        })
    }, [currentPage])

    // Calculate the products to display on the current page
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

    // Calculate total pages
    const totalPages = Math.ceil(products.length / productsPerPage)

    const { addToCart } = useCart()
    // const { wishlist, addToWishlist, removeFromWishlist } = useWishlist()
    const { toast } = useToast()
    const [addedProducts, setAddedProducts] = useState<number[]>([])

    const handleAddToCart = (product: any) => {
        addToCart(product)

        // Hiệu ứng thêm vào giỏ hàng
        setAddedProducts((prev) => [...prev, product.id])
        setTimeout(() => {
        setAddedProducts((prev) => prev.filter((id) => id !== product.id))
        }, 1000)

        toast({
        title: "Đã thêm vào giỏ hàng",
        description: `${product.name} đã được thêm vào giỏ hàng của bạn.`,
        })
    }

    // const handleToggleWishlist = (product: any) => {
    //     const isInWishlist = wishlist.some((item) => item.id === product.id)

    //     if (isInWishlist) {
    //     removeFromWishlist(product.id)
    //     toast({
    //         title: "Đã xóa khỏi danh sách yêu thích",
    //         description: `${product.name} đã được xóa khỏi danh sách yêu thích của bạn.`,
    //     })
    //     } else {
    //     addToWishlist(product)
    //     toast({
    //         title: "Đã thêm vào danh sách yêu thích",
    //         description: `${product.name} đã được thêm vào danh sách yêu thích của bạn.`,
    //     })
    //     }
    // }
    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
            {/* Header */}

            {/* Breadcrumb */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 py-4"
            >
                <div className="text-sm breadcrumbs text-gray-600 pt-10">
                <span>Trang chủ</span>
                <span className="mx-2">/</span>
                <span>Tất cả sản phẩm</span>
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

                            {/* Bike Type */}
                            <div className="space-y-4 mb-6">
                                <h3 className="font-medium">Loại xe</h3>
                                <Select value={bikeType} onValueChange={setBikeType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại xe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="road">Xe đạp đường trường</SelectItem>
                                    <SelectItem value="mountain">Xe đạp địa hình</SelectItem>
                                    <SelectItem value="city">Xe đạp thành phố</SelectItem>
                                </SelectContent>
                                </Select>
                            </div>

                            {/* Brand */}
                            <div className="space-y-4 mb-6">
                                <h3 className="font-medium">Hãng xe</h3>
                                <Select value={brand} onValueChange={setBrand}>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Chọn hãng xe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="Giant">Giant</SelectItem>
                                    <SelectItem value="trek">Trek</SelectItem>
                                    <SelectItem value="specialized">Specialized</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Search Button */}
                            <div className="grid grid-cols-2 gap-2 pt-2">
                                <Button variant="outline" onClick={handleReset} className="w-full">
                                    Mặc định
                                </Button>
                                <Button onClick={handleSearch} className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                                    Tìm kiếm
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Product Grid */}
                    <motion.div
                    key={JSON.stringify(products)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1"
                    >
                        <div className="flex-1">
                            {products.length === 0 ? (
                                 <div className="flex flex-col items-center justify-center">
                                 <Image
                                     src="/dog.gif" 
                                     alt="Loading Dog"
                                     width={150}
                                     height={150}
                                     className="mb-4"
                                 />
                                 <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                    Hiện tại chưa có sản phẩm nào!
                                 </h2>
                             </div>
                            ) : (
                                <motion.div
                                    key={JSON.stringify(products)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex-1"
                                >
                                    <ProductList
                                    products={currentProducts}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    isFiltered={isFiltered}
                                    onPageChange={setCurrentPage}
                                    />
                                </motion.div>
                            )}
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