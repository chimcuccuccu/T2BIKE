"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Product } from "@/types/product"
import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useStore } from "@/lib/store"

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const {user, isLoading} = useUser()
    const { addToCart, removeFromCart, isInCart } = useCart()
    const { toast } = useToast()
    const [isHovered, setIsHovered] = useState(false)
    const router = useRouter();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useStore()

    const handleAddToCart = () => {
        if (!user) {
        // Hiển thị thông báo yêu cầu đăng nhập
        toast({
            variant: "pink",
            title: "Vui lòng đăng nhập!",
            description: (
            <>
                Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.
                <Button
                size="sm"
                variant="link"
                onClick={() => router.push("/signin")} // Chuyển hướng đến trang đăng nhập
                className="text-white font-semibold text-sm bg-pink-600 hover:bg-pink-700 border border-transparent rounded-md px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                >
                Đăng nhập
                </Button>
            </>
            ),
        })
        return
        }

        if (inCart) {
        console.log("Removing from cart", product.id);

        removeFromCart(product.id);

        toast({
            variant: "pink",
            title: "Đã xóa khỏi giỏ hàng!",
            description: `${product.name} đã được xóa khỏi giỏ hàng của bạn.`,
        });
        } else {
        console.log("Adding to cart", product.id);

        addToCart(product);

        toast({
            variant: "pink",
            title: "Đã thêm vào giỏ hàng!",
            description: `${product.name} đã được thêm vào giỏ hàng của bạn.`,
        });
        }
    };


    const handleAddToWishlist = () => {
        if (!user) {
        // Hiển thị thông báo yêu cầu đăng nhập
        toast({
            variant: "pink",
            title: "Vui lòng đăng nhập!",
            description: (
            <>
                Bạn cần đăng nhập để thêm sản phẩm vào danh sách yêu thích
                <br />
                <Button
                size="sm"
                variant="link"
                onClick={() => router.push("/signin")} // Chuyển hướng đến trang đăng nhập
                className="text-white font-semibold text-sm bg-pink-600 hover:bg-pink-700 border border-transparent rounded-md px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                >
                Đăng nhập
                </Button>
            </>
            ),
        })
        return
        }

        if (inWishlist) {
        removeFromWishlist(product.id)
        toast({
            variant: "pink",
            title: "Đã xóa khỏi danh sách yêu thích!",
            description: `${product.name} đã được xóa khỏi danh sách yêu thích của bạn.`,
        })
        } else {
        addToWishlist(product)
        toast({
            variant: "pink",
            title: "Đã thêm vào danh sách yêu thích!",
            description: `${product.name} đã được thêm vào danh sách yêu thích của bạn.`,
        })
        }
    }

    const inWishlist = isInWishlist(product.id)
    const inCart = isInCart(product.id)

    return (
        <motion.div
        className="group relative rounded-lg border overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-xl"
        whileHover={{ y: -5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
        <div className="relative aspect-square overflow-hidden">
            <Image
            src={product.imageUrls[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <motion.div
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity"
            animate={{ opacity: isHovered ? 1 : 0 }}
            >
            <div className="flex gap-2">
                <Button
                size="icon"
                variant="secondary"
                className={cn(
                    "rounded-full bg-white hover:bg-pink-50",
                    inCart ? "text-pink-500" : "text-gray-500 hover:text-pink-500",
                )}
                onClick={handleAddToCart}
                >
                <ShoppingCart className={cn("h-5 w-5", inCart && "fill-pink-500")} />
                </Button>
                <Button
                size="icon"
                variant="secondary"
                className={cn(
                    "rounded-full bg-white hover:bg-pink-50",
                    inWishlist ? "text-pink-500" : "text-gray-500 hover:text-pink-500",
                )}
                onClick={handleAddToWishlist}
                >
                <Heart className={cn("h-5 w-5", inWishlist && "fill-pink-500")} />
                </Button>
            </div>
            </motion.div>
        </div>

        <div className="p-4">
            <Link href={`/product-detail/${product.id}`}>
            <h3 className="font-medium text-gray-800 line-clamp-1 hover:underline cursor-pointer">
                {product.name}
            </h3>
            </Link>
            <p className="mt-1 text-pink-500 font-bold">{product.price.toLocaleString("vi-VN")} ₫</p>
        </div>

        {inCart && (
            <div className="absolute top-2 right-2">
            <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">Trong giỏ hàng</span>
            </div>
        )}
        </motion.div>
    )
}
