"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AddProductModal from "./AddProductModal"
import EditProductModal from "./EditProductModal"
import ProductDetailModal from "./ProductDetailModal"
import { Product } from "@/types/product"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SliderCustom } from "@/app/all-products/slider"

export default function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [isFiltered, setIsFiltered] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 50])
  const [category, setCategory] = useState("")
  const [brand, setBrand] = useState("")
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 0,
    category: "",
    brand: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const fetchProducts = async (page: number) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`http://localhost:8081/api/all-products?page=${page}&size=9`)
      setProducts(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFilteredProducts = async () => {
    try {
      setIsLoading(true)
      const params: Record<string, string> = {
        minPrice: filters.minPrice.toString(),
        maxPrice: filters.maxPrice.toString(),
        page: currentPage.toString(),
        size: "9"
      }
      if (filters.category) params.category = filters.category
      if (filters.brand) params.brand = filters.brand

      const query = new URLSearchParams(params).toString()
      const url = `http://localhost:8081/api/all-products/filter?${query}`

      const response = await axios.get(url)
      setProducts(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to filter products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isFiltered) {
      fetchFilteredProducts()
    } else {
      fetchProducts(currentPage)
    }
  }, [currentPage, isFiltered])

  const handleSearch = async () => {
    setCurrentPage(0)
    const newFilters = {
      minPrice: priceRange[0] * 1_000_000,
      maxPrice: priceRange[1] * 1_000_000,
      category: category,
      brand: brand,
    }
    setFilters(newFilters)
    setIsFiltered(true)

    try {
      setIsLoading(true)
      const params: Record<string, string> = {
        minPrice: newFilters.minPrice.toString(),
        maxPrice: newFilters.maxPrice.toString(),
        page: "0",
        size: "9"
      }
      if (newFilters.category) params.category = newFilters.category
      if (newFilters.brand) params.brand = newFilters.brand

      const query = new URLSearchParams(params).toString()
      const url = `http://localhost:8081/api/all-products/filter?${query}`

      const response = await axios.get(url)
      setProducts(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to filter products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    setCurrentPage(0)
    setPriceRange([0, 50])
    setCategory("")
    setBrand("")
    setFilters({
      minPrice: 0,
      maxPrice: 0,
      category: "",
      brand: "",
    })
    setIsFiltered(false)

    try {
      setIsLoading(true)
      const response = await axios.get(`http://localhost:8081/api/all-products?page=0&size=9`)
      setProducts(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (productId: number) => {
    try {
      await axios.delete(`/api/products/${productId}`)
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
      fetchProducts(currentPage)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
    setDeleteDialogOpen(false)
    setProductToDelete(null)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedProduct(null)
  }

  const openAddModal = () => setIsAddModalOpen(true)
  const closeAddModal = () => setIsAddModalOpen(false)

  return (
    <div>
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold flex items-center">
          <Package className="mr-2 h-6 w-6 text-pink-500" />
          Quản lý sản phẩm
        </h2>
        <Button className="bg-pink-500 hover:bg-pink-600" onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
        </Button>
      </motion.div>

      <motion.div
        className="bg-white p-6 rounded-xl shadow-sm mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold mb-4">Bộ lọc tìm kiếm</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Price Range */}
          <div className="space-y-4">
            <h4 className="font-medium">Giá</h4>
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

          {/* Category */}
          <div className="space-y-4">
            <h4 className="font-medium">Danh mục</h4>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xe_tay_thang">Xe tay thẳng</SelectItem>
                <SelectItem value="xe_tay_cong">Xe tay cong</SelectItem>
                <SelectItem value="xe_gap">Xe đạp gấp</SelectItem>
                <SelectItem value="xe_mini">Xe đạp mini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Brand */}
          <div className="space-y-4">
            <h4 className="font-medium">Hãng xe</h4>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn hãng xe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Giant">Giant</SelectItem>
                <SelectItem value="Trek">Trek</SelectItem>
                <SelectItem value="Specialized">Specialized</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Mặc định
          </Button>
          <Button onClick={handleSearch} className="flex-1 bg-pink-500 hover:bg-pink-600 text-white">
            Tìm kiếm
          </Button>
        </div>
      </motion.div>

      {products.length > 0 ? (
        <motion.div
          className="bg-white rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Table>
            <TableHeader className="bg-pink-50">
              <TableRow>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Tên sản phẩm</TableHead>
                <TableHead className="font-semibold">Danh mục</TableHead>
                <TableHead className="font-semibold">Giá</TableHead>
                <TableHead className="font-semibold">Số lượng</TableHead>
                <TableHead className="font-semibold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price.toLocaleString('vi-VN')}đ</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product)
                          setIsDetailModalOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 text-blue-800" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4 text-pink-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProductToDelete(product.id)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="p-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={currentPage === 0 ? undefined : () => setCurrentPage((prev) => Math.max(0, prev - 1))}
                    className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i)}
                      isActive={currentPage === i}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={currentPage === totalPages - 1 ? undefined : () => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                    className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="bg-white rounded-xl shadow-sm p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-pink-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">Chưa có sản phẩm nào</h3>
          <p className="text-gray-500 mb-6">Bắt đầu bằng cách thêm sản phẩm đầu tiên của bạn</p>
          <Button className="bg-pink-500 hover:bg-pink-600" onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
          </Button>
        </motion.div>
      )}

      <AddProductModal isOpen={isAddModalOpen} onClose={closeAddModal} />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        product={selectedProduct}
        onUpdate={(page) => fetchProducts(page)}
      />
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        productId={selectedProduct?.id || 0}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => productToDelete && handleDelete(productToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

