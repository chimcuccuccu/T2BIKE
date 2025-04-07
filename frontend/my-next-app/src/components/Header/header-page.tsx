"use client"

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import Image from "next/image"
import Link from "next/link"
import { Facebook, Heart, Search, ShoppingCart, User, LogOut} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserMenu } from '../user-menu/user-menu';

export const HeaderPage = () => {
    const { user, setUser } = useAuth();

    console.log("User in HeaderPage:", user);
    
    const handleLogout = async () => {
        // Xử lý logout ở đây (xóa thông tin người dùng)
        await axios.post('http://localhost:8081/api/users/logout');
        setUser(null); // Xóa user trong state
        localStorage.removeItem('user'); // Xóa thông tin người dùng khỏi localStorage
    };
return (
    <div>
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

                        <div className="flex items-center space-x-4">
                            {user ? (
                                <UserMenu username={user.username}>
                                </UserMenu>
                            ) : (
                                <>
                                <Link href="/signin">
                                    <Button variant="outline" className="text-pink-500 border-pink-300">Đăng nhập</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button variant="outline" className="text-pink-500 border-pink-300">Đăng ký</Button>
                                </Link>
                                </>
                            )}
                        </div>
                        </div>
                    </div>
                </div>
            </header>
        </motion.h1>
    </div>
)}