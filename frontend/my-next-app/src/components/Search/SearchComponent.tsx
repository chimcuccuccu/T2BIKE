"use client"

import type Reach from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import Image from "next/image"
import { Product } from "@/types/product"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function SearchComponent() {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
    }
  
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])
  
    useEffect(() => {
        const fetchProducts = async () => {
            if (searchTerm.trim().length === 0) {
            setProducts([])
            return
            }
    
            setIsLoading(true)
            try {
            const response = await axios.get("http://localhost:8081/api/all-products/search", {
                params: { keyword: searchTerm }
            })
            setProducts(response.data || [])
            } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error)
            setProducts([])
            } finally {
            setIsLoading(false)
            }
        }
  
        const timeoutId = setTimeout(() => {
            fetchProducts()
        }, 300)
  
        return () => clearTimeout(timeoutId)
    }, [searchTerm])
  
    const handleFocus = () => {
        setIsOpen(true)
    }
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setIsOpen(true)
    }
  
    const clearSearch = () => {
        setSearchTerm("")
        setIsOpen(false)
        setProducts([])
        inputRef.current?.focus()
    }
    const displayProducts: Product[] = products

    return (
        <div className="relative w-full max-w-xl mx-auto" ref={searchRef}>
            {/* Thanh tìm kiếm */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full py-2.5 pl-10 pr-10 bg-white border border-gray-200 rounded-lg focus:outline-none"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={handleChange}
                    onFocus={handleFocus}
                />
                {searchTerm && (
                <button className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={clearSearch}>
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
                )}
            </div>
    
            {/* Dropdown kết quả tìm kiếm */}
            {isOpen && (
                <div className="absolute z-50 w-[150%] left-[-15%] mt-1 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-3">
                        <div className="text-base font-medium text-gray-500 px-3 py-2 border-b border-gray-100">
                        {isLoading ? "Đang tìm kiếm..." : searchTerm ? `Kết quả cho "${searchTerm}"` : "Sản phẩm phổ biến"}
                        </div>
            
                        {/* Danh sách sản phẩm có thể cuộn, giới hạn chiều cao */}
                        <div className="max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                            {displayProducts.length > 0 ? (
                            displayProducts.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => router.push(`/product-detail/${product.id}`)}
                                    className="flex items-center gap-4 p-4 hover:bg-pink-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                                >
                                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 overflow-hidden rounded-md">
                                        <Image
                                            src={product.imageUrls[0] || "/placeholder.svg"}
                                            alt={product.name}
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lg font-medium text-gray-900">{product.name}</p>
                                        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                                        <p className="text-lg font-semibold text-pink-600">{product.price.toLocaleString("vi-VN")}đ</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-gray-500">
                            {searchTerm ? "Không tìm thấy sản phẩm nào" : "Nhập từ khóa để tìm kiếm"}
                            </div>
                        )}
                        </div>
            
                        {displayProducts.length > 0 && (
                            <div className="p-3 border-t border-gray-100">
                                <button className="w-full py-3 text-center text-pink-600 hover:text-pink-700 font-medium border border-pink-200 rounded-md hover:bg-pink-50 transition-colors text-base">
                                    Xem tất cả kết quả
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}