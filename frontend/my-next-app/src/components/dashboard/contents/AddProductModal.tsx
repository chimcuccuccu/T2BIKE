"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [images, setImages] = useState<string[]>([])
  const [price, setPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)

  const handleAddImage = () => {
    // In a real app, this would be an image upload function
    const newImage = `/placeholder.svg?height=200&width=200&text=Image+${images.length + 1}`
    setImages([...images, newImage])
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const increasePrice = () => setPrice((prev) => prev + 1000)
  const decreasePrice = () => setPrice((prev) => (prev > 1000 ? prev - 1000 : 0))

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    onClose()
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
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-category" className="text-base">
                      Danh mục <span className="text-red-500">*</span>
                    </Label>
                    <Select required>
                      <SelectTrigger
                        id="product-category"
                        className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                      >
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Điện tử</SelectItem>
                        <SelectItem value="clothing">Thời trang</SelectItem>
                        <SelectItem value="home">Đồ gia dụng</SelectItem>
                        <SelectItem value="beauty">Làm đẹp</SelectItem>
                        <SelectItem value="sports">Thể thao</SelectItem>
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
                            src={image || "/placeholder.svg"}
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-sku" className="text-base">
                      Mã sản phẩm (SKU)
                    </Label>
                    <Input
                      id="product-sku"
                      placeholder="Nhập mã sản phẩm"
                      className="border-gray-200 focus:border-pink-300 focus:ring-pink-200"
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
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="product-featured" className="text-base cursor-pointer">
                      Sản phẩm nổi bật
                    </Label>
                    <Switch id="product-featured" />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="product-active" className="text-base cursor-pointer">
                      Hiển thị sản phẩm
                    </Label>
                    <Switch id="product-active" defaultChecked />
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
                    Lưu sản phẩm
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

