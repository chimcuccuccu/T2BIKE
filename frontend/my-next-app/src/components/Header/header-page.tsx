"use client"

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import Image from "next/image"
import Link from "next/link"
import { Facebook, Heart, Search, ShoppingCart, User, LogOut, Badge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserMenu } from '../user-menu/user-menu';
import SearchComponent from '../Search/SearchComponent';
import { AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { CartDropdown } from '../Cart-DropDown/cart-dropdown';
import { WishlistDropdown } from '../Wishlist-Dropdown/wishlist-dropdown';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export const HeaderPage = () => {
    const { user, setUser, isAuthenticated } = useAuth();
    const [isWishlistOpen, setIsWishlistOpen] = useState(false)
    const { wishlistCount } = useStore()
    const router = useRouter();

    const handleWishlistClick = () => {
        if (!isAuthenticated()) {
            router.push('/signin');
            return;
        }
        setIsWishlistOpen(!isWishlistOpen);
    }

    console.log("User in HeaderPage:", user);

    const handleLogout = async () => {
        // Xử lý logout ở đây (xóa thông tin người dùng)
        await axios.post('http://localhost:8081/api/users/logout');
        setUser(null); // Xóa user trong state
        localStorage.removeItem('user'); // Xóa thông tin người dùng khỏi localStorage
    };

    const { cart } = useCart();
    const [showCart, setShowCart] = useState(false)

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
                                <Link href="/home" className="font-bold transition-colors hover:text-pink-500 relative group">
                                    Trang chủ
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full"></span>
                                </Link>
                                <Link href="/all-products" className="font-bold transition-colors hover:text-pink-500 relative group">
                                    Cửa hàng
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full"></span>
                                </Link>
                                <Link
                                    href="/about"
                                    className="font-bold transition-colors hover:text-pink-500 relative group"
                                >
                                    Về chúng tôi
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full"></span>
                                </Link>
                                <Link href="/faq" className="font-bold transition-colors hover:text-pink-500 relative group">
                                    FAQ
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full"></span>
                                </Link>
                                <Link href="/contact" className="font-bold transition-colors hover:text-pink-500 relative group">
                                    Liên hệ
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full"></span>
                                </Link>
                            </nav>

                            <div className="flex items-center space-x-4">
                                <SearchComponent></SearchComponent>
                                <WishlistDropdown></WishlistDropdown>
                                <CartDropdown></CartDropdown>
                               


                                <div className="flex items-center space-x-4">
                                    {user ? (
                                        <UserMenu username={user.username} fullName={user.fullName}>
                                        </UserMenu>
                                    ) : (
                                        <>
                                            <div className="hidden md:flex gap-2">
                                                <Link href="/signin">
                                                    <Button
                                                        variant="outline"
                                                        className="text-pink-500 border-pink-500 hover:bg-pink-50 transition-transform hover:scale-105"
                                                    >
                                                        Đăng nhập
                                                    </Button>
                                                </Link>
                                                <Link href="/signup">
                                                    <Button className="bg-pink-500 hover:bg-pink-600 text-white transition-transform hover:scale-105">
                                                        Đăng ký
                                                    </Button>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </motion.h1>
        </div>
    )
}