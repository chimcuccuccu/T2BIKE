"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Product } from "@/types/product"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

interface EditProductModalProps {
    isOpen: boolean
    onClose: () => void
    product: Product | null
    onUpdate: (page: number) => void
}

interface ProductAttribute {
    attributeName: string
    attributeValue: string
}

interface ProductDetail {
    productId: number
    name: string
    description: string
    price: number
    category: string
    brand: string
    quantity: number
    color: string[]
    imageUrls: string[]
    attributes: ProductAttribute[]
}

export default function EditProductModal({ isOpen, onClose, product, onUpdate }: EditProductModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        imageUrls: [] as string[],
        category: "",
        brand: "",
        color: [] as string[],
        quantity: 0,
        attributes: [] as ProductAttribute[]
    })
    const [productDetails, setProductDetails] = useState<ProductDetail | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description || "",
                price: product.price,
                imageUrls: product.imageUrls || [],
                category: product.category,
                brand: product.brand || "",
                color: product.color || [],
                quantity: product.quantity,
                attributes: product.attributes || []
            })
            // Fetch product details
            fetchProductDetails(product.id)
        }
    }, [product])

    const fetchProductDetails = async (productId: number) => {
        try {
            setIsLoading(true)
            const response = await axios.get(`http://localhost:8081/api/product-attributes/details/${productId}`)
            if (response.data && response.data.length > 0) {
                setProductDetails(response.data[0])
                // Update form data with fetched attributes
                setFormData(prev => ({
                    ...prev,
                    attributes: response.data[0].attributes || []
                }))
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch product details",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddImage = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0 || !product?.id) return

        setIsUploading(true)
        try {
            const formData = new FormData()
            // Thêm tất cả file vào formData
            Array.from(files).forEach(file => {
                formData.append('multipartFiles', file)
            })

            const response = await axios.post(`http://localhost:8081/cloudinary/upload/${product.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (response.data && response.data.uploadedImages) {
                setFormData(prev => ({
                    ...prev,
                    imageUrls: [...prev.imageUrls, ...response.data.uploadedImages]
                }))

                toast({
                    title: "Success",
                    description: response.data.message || "Upload ảnh thành công",
                })
            }
        } catch (error) {
            console.error('Error uploading images:', error)
            toast({
                title: "Error",
                description: "Không thể upload ảnh",
                variant: "destructive",
            })
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleRemoveImage = (index: number) => {
        const newImages = [...formData.imageUrls]
        newImages.splice(index, 1)
        setFormData(prev => ({
            ...prev,
            imageUrls: newImages
        }))
    }

    const handleAddAttribute = () => {
        setFormData(prev => ({
            ...prev,
            attributes: [...prev.attributes, { attributeName: "", attributeValue: "" }]
        }))
    }

    const handleRemoveAttribute = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attributes: prev.attributes.filter((_, i) => i !== index)
        }))
    }

    const handleAttributeChange = (index: number, field: keyof ProductAttribute, value: string) => {
        setFormData(prev => ({
            ...prev,
            attributes: prev.attributes.map((attr, i) =>
                i === index ? { ...attr, [field]: value } : attr
            )
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            // 1. Cập nhật thông tin cơ bản của sản phẩm
            const productData = {
                name: formData.name,
                category: formData.category,
                price: formData.price,
                description: formData.description,
                brand: formData.brand,
                quantity: formData.quantity,
                color: formData.color,
                imageUrls: formData.imageUrls
            }
            await axios.put(`http://localhost:8081/api/all-products/${product?.id}`, productData)

            // 2. Xóa tất cả thuộc tính cũ
            await axios.delete(`http://localhost:8081/api/product-attributes/product-details/${product?.id}`)

            // 3. Thêm thuộc tính mới nếu có
            if (formData.attributes.length > 0) {
                const detailData = {
                    productId: product?.id,
                    attributes: formData.attributes.map(attr => ({
                        attributeName: attr.attributeName,
                        attributeValue: attr.attributeValue
                    }))
                }
                await axios.post(`http://localhost:8081/api/product-attributes/details`, detailData)
            }

            toast({
                title: "Success",
                description: "Product updated successfully",
            })
            onUpdate(0)
            onClose()
        } catch (error) {
            console.error('Error updating product:', error)
            toast({
                title: "Error",
                description: "Failed to update product",
                variant: "destructive",
            })
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
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
                            <h2 className="text-xl font-bold text-pink-500">Chỉnh sửa sản phẩm</h2>
                            <motion.button
                                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-pink-500"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left column */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="product-name" className="text-base">
                                            Tên sản phẩm <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="product-name"
                                            placeholder="Nhập tên sản phẩm"
                                            className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="product-category" className="text-base">
                                            Danh mục <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                            required
                                        >
                                            <SelectTrigger
                                                id="product-category"
                                                className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                                            >
                                                <SelectValue placeholder="Chọn danh mục" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="xe_tay_cong">Xe tay cong</SelectItem>
                                                <SelectItem value="xe_tay_thang">Xe tay thẳng</SelectItem>
                                                <SelectItem value="xe_gap">Xe gấp</SelectItem>
                                                <SelectItem value="xe_mini">Xe mini</SelectItem>
                                                <SelectItem value="xe_the_thao">Xe thể thao</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-base">
                                            Giá (VNĐ) <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="flex items-center">
                                            <motion.div whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setFormData(prev => ({ ...prev, price: Math.max(0, prev.price - 1000) }))}
                                                    className="rounded-md h-10 w-10 border-gray-200"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                            </motion.div>
                                            <Input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                                className="mx-2 text-center border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                                                required
                                            />
                                            <motion.div whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setFormData(prev => ({ ...prev, price: prev.price + 1000 }))}
                                                    className="rounded-md h-10 w-10 border-gray-200"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-base">
                                            Số lượng <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="flex items-center">
                                            <motion.div whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(0, prev.quantity - 1) }))}
                                                    className="rounded-md h-10 w-10 border-gray-200"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                            </motion.div>
                                            <Input
                                                type="number"
                                                value={formData.quantity}
                                                onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                                                className="mx-2 text-center border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                                                required
                                            />
                                            <motion.div whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                                                    className="rounded-md h-10 w-10 border-gray-200"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="product-description" className="text-base">
                                            Mô tả sản phẩm
                                        </Label>
                                        <Textarea
                                            id="product-description"
                                            placeholder="Nhập mô tả sản phẩm"
                                            className="min-h-[120px] border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                {/* Right column */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-base">Hình ảnh sản phẩm</Label>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            {formData.imageUrls.map((image, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`Product ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <motion.button
                                                        type="button"
                                                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleRemoveImage(index)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </motion.button>
                                                </motion.div>
                                            ))}

                                            {formData.imageUrls.length < 6 && (
                                                <motion.button
                                                    type="button"
                                                    className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-300 transition-colors"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleAddImage}
                                                    disabled={isUploading}
                                                >
                                                    {isUploading ? (
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-6 h-6 mb-2" />
                                                            <span>Thêm ảnh</span>
                                                        </>
                                                    )}
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="product-brand" className="text-base">
                                            Thương hiệu
                                        </Label>
                                        <Input
                                            id="product-brand"
                                            placeholder="Nhập thương hiệu"
                                            className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                                            value={formData.brand}
                                            onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="product-color" className="text-base">
                                            Màu sắc
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {["black", "white", "red", "blue", "green"].map((color) => (
                                                <Button
                                                    key={color}
                                                    type="button"
                                                    variant={formData.color.includes(color) ? "default" : "outline"}
                                                    className={`${formData.color.includes(color)
                                                        ? "bg-pink-500 text-white"
                                                        : "border-gray-200"
                                                        }`}
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            color: prev.color.includes(color)
                                                                ? prev.color.filter(c => c !== color)
                                                                : [...prev.color, color]
                                                        }))
                                                    }}
                                                >
                                                    {color}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-base">Thông số kỹ thuật</Label>
                                        {isLoading ? (
                                            <div className="flex items-center justify-center py-4">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {formData.attributes.map((attr, index) => (
                                                    <div key={index} className="flex gap-2 items-start">
                                                        <div className="flex-1 space-y-2">
                                                            <Input
                                                                placeholder="Tên thuộc tính"
                                                                value={attr.attributeName}
                                                                onChange={(e) => handleAttributeChange(index, "attributeName", e.target.value)}
                                                                className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                                                            />
                                                            <Input
                                                                placeholder="Giá trị"
                                                                value={attr.attributeValue}
                                                                onChange={(e) => handleAttributeChange(index, "attributeValue", e.target.value)}
                                                                className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                                                            />
                                                        </div>
                                                        <motion.button
                                                            type="button"
                                                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-red-500 border border-gray-200"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleRemoveAttribute(index)}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </motion.button>
                                                    </div>
                                                ))}
                                                <motion.button
                                                    type="button"
                                                    className="w-full py-2 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-300 transition-colors"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleAddAttribute}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Thêm thuộc tính
                                                </motion.button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        className="border-gray-200 text-gray-700 hover:bg-gray-100"
                                    >
                                        Hủy
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
                                        Lưu thay đổi
                                    </Button>
                                </motion.div>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
} 