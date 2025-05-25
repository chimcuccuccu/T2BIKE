"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface ProductAttribute {
  attributeName: string
  attributeValue: string
}

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [images, setImages] = useState<File[]>([])
  const [price, setPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [brand, setBrand] = useState("")
  const [color, setColor] = useState<string[]>([])
  const [attributes, setAttributes] = useState<ProductAttribute[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleAddImage = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setImages(prev => [...prev, ...newImages])
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const increasePrice = () => setPrice((prev) => prev + 1000)
  const decreasePrice = () => setPrice((prev) => (prev > 1000 ? prev - 1000 : 0))

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddAttribute = () => {
    setAttributes(prev => [...prev, { attributeName: "", attributeValue: "" }])
  }

  const handleRemoveAttribute = (index: number) => {
    setAttributes(prev => prev.filter((_, i) => i !== index))
  }

  const handleAttributeChange = (index: number, field: keyof ProductAttribute, value: string) => {
    setAttributes(prev => prev.map((attr, i) =>
      i === index ? { ...attr, [field]: value } : attr
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 1. Create FormData for product and images
      const formData = new FormData()
      const productData = {
        name,
        description,
        price: Number(price),
        category,
        brand,
        quantity: Number(quantity),
        color: color.length > 0 ? color[0] : "Default" // Backend expects a single string
      }

      // Convert product data to JSON string and append as a blob
      formData.append("product", new Blob([JSON.stringify(productData)], {
        type: "application/json"
      }))

      // Append each image file
      images.forEach((image) => {
        formData.append("images", image)
      })

      // 2. Create product with images
      const productResponse = await axios.post(
        "http://localhost:8081/api/all-products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          withCredentials: true // Important for session handling
        }
      )

      const productId = productResponse.data.product.id

      // 3. Add technical specifications if there are any
      if (attributes.length > 0) {
        const detailData = {
          productId,
          attributes: attributes.map(attr => ({
            attributeName: attr.attributeName,
            attributeValue: attr.attributeValue
          }))
        }
        await axios.post(
          "http://localhost:8081/api/product-attributes/details",
          detailData,
          {
            withCredentials: true
          }
        )
      }

      toast({
        title: "Success",
        description: "Product added successfully",
      })

      onSuccess?.()
      onClose()
    } catch (error: any) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: error.response?.data || "Failed to add product",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
              <h2 className="text-xl font-bold text-pink-500">Thêm sản phẩm mới</h2>
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-category" className="text-base">
                      Danh mục <span className="text-red-500">*</span>
                    </Label>
                    <Select required value={category} onValueChange={setCategory}>
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
                        <SelectItem value="xe_dap_tre_em">Xe đạp trẻ em</SelectItem>
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
                          onClick={decreasePrice}
                          className="rounded-md h-10 w-10 border-gray-200"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="mx-2 text-center border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                        required
                      />
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={increasePrice}
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
                          onClick={decreaseQuantity}
                          className="rounded-md h-10 w-10 border-gray-200"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="mx-2 text-center border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                        required
                      />
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={increaseQuantity}
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-base">Hình ảnh sản phẩm</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {images.map((image, index) => (
                        <motion.div
                          key={index}
                          className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <img
                            src={URL.createObjectURL(image)}
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

                      {images.length < 4 && (
                        <motion.button
                          type="button"
                          className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-300 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAddImage}
                        >
                          <Upload className="w-6 h-6 mb-2" />
                          <span>Thêm ảnh</span>
                        </motion.button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-brand" className="text-base">
                      Thương hiệu
                    </Label>
                    <Input
                      id="product-brand"
                      placeholder="Nhập thương hiệu"
                      className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-color" className="text-base">
                      Màu sắc
                    </Label>
                    <Input
                      id="product-color"
                      placeholder="Nhập màu sắc (phân cách bằng dấu phẩy)"
                      className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                      onChange={(e) => setColor(e.target.value.split(",").map(c => c.trim()))}
                    />
                  </div>

                  {/* Technical Specifications */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base">Thông số kỹ thuật</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddAttribute}
                        className="text-pink-500 hover:text-pink-600"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Thêm thông số
                      </Button>
                    </div>

                    {attributes.map((attr, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Input
                            placeholder="Tên thông số"
                            value={attr.attributeName}
                            onChange={(e) => handleAttributeChange(index, "attributeName", e.target.value)}
                            className="mb-2"
                          />
                          <Input
                            placeholder="Giá trị"
                            value={attr.attributeValue}
                            onChange={(e) => handleAttributeChange(index, "attributeValue", e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAttribute(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
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
                    disabled={isLoading}
                  >
                    Hủy
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang xử lý..." : "Lưu sản phẩm"}
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

