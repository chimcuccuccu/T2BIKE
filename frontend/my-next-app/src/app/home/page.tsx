"use client"

import { motion } from 'framer-motion';
import axios from 'axios';
import Image from "next/image"
import Link from "next/link"
import { Facebook, Heart, Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderPage } from '@/components/Header/header-page';
import StoreRating from '@/components/store-rating/StoreRating';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const respone = await axios.get('http://localhost:8081/api/users/me', { withCredentials: true});
                setUser(respone.data);
            } catch (error) {
                console.log("Chưa đăng nhập");
            }
        };
        checkLogin();
    }, []);

    const handleLogout = () => {
        setUser(null);
        axios.post("http://localhost:8081/api/users/logout", {}, {withCredentials: true});
    };

    const categories = [
        { id: "xe_tay_thang", name: "Xe tay thẳng", image: "/xe_tay_cong.png"},
        { id: "xe_tay_cong", name: "Xe tay cong", image: "/xe_tay_thang.png" },
        { id: "xe_mini", name: "Xe mini", image: "/xe_mini.png" },
        { id: "xe_gap", name: "Xe gấp", image: "/xe_gap.png" },
        { id: "quan_ao", name: "Quần áo", image: "/quan_ao.png" },
        { id: "phu_kien_khac", name: "Phụ kiện khác", image: "/mu_bao_hiem.png" },
    ];

    const router = useRouter();

    const handleCategoryClick = (categoryId: string) => {
        router.push(`/category/${categoryId}`);
    };

    useEffect(() => {
        if (selectedCategory) {
            axios.get(`http://localhost:8081/api/all-products/category/${selectedCategory}`)
                .then(response => setProducts(response.data))
                .catch(error => console.error("Error fetching products:", error));
        }
    }, [selectedCategory]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
            {/* Header */}

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
                        {categories.map((category) => (
                            <Link href={`/category/${category.id}`} key={category.id}>
                                <div
                                    className='group cursor-pointer'
                                    onClick={() => handleCategoryClick(category.id)}
                                >
                                    <div className="aspect-square bg-pink-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-pink-200 transition-colors">
                                        <Image
                                            src={category.image}
                                            width={600} 
                                            height={400} 
                                            className="w-full h-auto scale-50 transition-transform duration-300 object-cover" 
                                            alt={category.name}
                                        />
                                    </div>
                                    <p className="text-center text-sm">{category.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
            </section>

            {/* Rating */}
            <StoreRating></StoreRating>
            
            {/* Footer */}
            <footer className="bg-white mt-16 border-t max-w-screen-2xl mx-auto ">
                <div className="border-t border-pink-100 bg-[#FFE4EF]">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            {/* <div className="flex-1 w-full max-w-xl">
                                <div className="flex gap-2">
                                    <Input type="email" placeholder="Nhập Email Để Tư Vấn" className="bg-white" />
                                    <Button className="bg-pink-500 hover:bg-pink-600 text-white min-w-[120px]">SUBSCRIBE</Button>
                                </div>
                            </div> */}
                            {/* <p className="text-gray-600 text-sm">Đăng ký để nhận được thông báo mới nhất từ T2BIKE</p> */}
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