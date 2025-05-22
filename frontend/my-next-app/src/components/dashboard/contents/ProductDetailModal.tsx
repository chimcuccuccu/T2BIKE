"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

interface Attribute {
    attributeName: string
    attributeValue: string
}

interface ProductDetail {
    attributes: Attribute[]
    productId: number
    name: string
    description: string
    price: number
    category: string
    brand: string
    quantity: number
    color: string[]
    imageUrls: string[]
}

interface ProductDetailModalProps {
    isOpen: boolean
    onClose: () => void
    productId: number
}

export default function ProductDetailModal({ isOpen, onClose, productId }: ProductDetailModalProps) {
    const [productDetails, setProductDetails] = useState<ProductDetail[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        if (isOpen && productId) {
            fetchProductDetails()
        }
    }, [isOpen, productId])

    const fetchProductDetails = async () => {
        try {
            setIsLoading(true)
            console.log('Fetching details for product ID:', productId)
            const response = await axios.get(`http://localhost:8081/api/product-attributes/details/${productId}`)
            console.log('API Response:', response.data)
            setProductDetails(response.data)
        } catch (error) {
            console.error('Error fetching product details:', error)
            toast({
                title: "Error",
                description: "Failed to fetch product details",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto m-4"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="sticky top-0 z-10 bg-gradient-to-r from-pink-100 to-pink-50 px-6 py-4 rounded-t-2xl flex justify-between items-center border-b border-pink-100">
                        <h2 className="text-xl font-bold text-pink-500">Chi tiết sản phẩm</h2>
                        <motion.button
                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-pink-500"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </motion.button>
                    </div>

                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                            </div>
                        ) : (
                            productDetails.map((detail) => (
                                <div key={detail.productId} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left column - Images */}
                                        <div className="space-y-4">
                                            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                                <img
                                                    src={detail.imageUrls[0]}
                                                    alt={detail.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 gap-2">
                                                {detail.imageUrls.slice(1).map((url, index) => (
                                                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                        <img
                                                            src={url}
                                                            alt={`${detail.name} - ${index + 2}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right column - Details */}
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">{detail.name}</h3>
                                                <p className="text-3xl font-bold text-pink-500 mt-2">
                                                    {detail.price.toLocaleString("vi-VN")}đ
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">Thông tin cơ bản</h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Mã sản phẩm</p>
                                                            <p className="font-medium">{detail.productId}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Danh mục</p>
                                                            <p className="font-medium">{detail.category}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Thương hiệu</p>
                                                            <p className="font-medium">{detail.brand}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Số lượng</p>
                                                            <p className="font-medium">{detail.quantity}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Màu sắc</p>
                                                            <p className="font-medium">{detail.color.join(", ")}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">Mô tả</h4>
                                                    <p className="text-gray-600">{detail.description}</p>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-2">Thông số kỹ thuật</h4>
                                                    <div className="space-y-2">
                                                        {detail.attributes.map((attr, index) => (
                                                            <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                                                                <span className="text-gray-600">{attr.attributeName}</span>
                                                                <span className="font-medium">{attr.attributeValue}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
} 