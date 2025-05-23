"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Order, PageResponse } from "@/types/order"
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
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import OrderDetailModal from "./OrderDetailModal"
import OrderEditModal from "./OrderEditModal"
import { useToast } from "@/hooks/use-toast"
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

export default function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageSize] = useState(5)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  const fetchOrders = async (page: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `http://localhost:8081/api/orders?page=${page}&size=${pageSize}&sortBy=createdAt&sortDir=desc`
      )
      const data: PageResponse<Order> = await response.json()
      setOrders(data.content)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(currentPage)
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi })
  }

  const handleViewDetails = (orderId: number) => {
    setSelectedOrderId(orderId)
    setIsDetailModalOpen(true)
  }

  const handleEdit = (orderId: number) => {
    setSelectedOrderId(orderId)
    setIsEditModalOpen(true)
  }

  const handleDelete = (orderId: number) => {
    setSelectedOrderId(orderId)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedOrderId) return

    try {
      const response = await fetch(`http://localhost:8081/api/orders/${selectedOrderId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Đơn hàng đã được xóa thành công",
          variant: "success",
        })
        fetchOrders(currentPage)
      } else {
        const error = await response.text()
        toast({
          title: "Lỗi",
          description: error || "Không thể xóa đơn hàng",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi xóa đơn hàng",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedOrderId(null)
    }
  }

  const handleOrderUpdated = () => {
    fetchOrders(currentPage)
  }

  return (
    <div>
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold flex items-center">
          <Package className="mr-2 h-6 w-6 text-pink-500" />
          Quản lý đơn hàng
        </h2>
      </motion.div>

      <motion.div
        className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm đơn hàng..."
            className="pl-10 border-gray-200 focus:border-pink-300 focus:ring-pink-200"
          />
        </div>
        <Button variant="outline" className="border-gray-200 text-gray-600">
          <Filter className="mr-2 h-4 w-4" /> Lọc
        </Button>
      </motion.div>

      {isLoading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : orders.length > 0 ? (
        <motion.div
          className="bg-white rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Table>
            <TableHeader className="bg-pink-50">
              <TableRow>
                <TableHead className="font-semibold">Mã đơn hàng</TableHead>
                <TableHead className="font-semibold">Khách hàng</TableHead>
                <TableHead className="font-semibold">Ngày/ giờ đặt</TableHead>
                <TableHead className="font-semibold">Tổng tiền</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
                <TableHead className="font-semibold pl-16">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>{formatPrice(order.totalPrice)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "CONFIRMED"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "SHIPPING"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "DELIVERED"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(order.id)}
                      >
                        <Eye className="h-4 w-4 text-blue-800" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(order.id)}
                      >
                        <Edit className="h-4 w-4 text-pink-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(order.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                {currentPage > 0 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                    />
                  </PaginationItem>
                )}
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => handlePageChange(i)}
                      isActive={currentPage === i}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {currentPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                    />
                  </PaginationItem>
                )}
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
          <h3 className="text-lg font-medium mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-gray-500">Không tìm thấy đơn hàng nào trong hệ thống</p>
        </motion.div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedOrderId(null)
        }}
        orderId={selectedOrderId}
      />

      <OrderEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedOrderId(null)
        }}
        orderId={selectedOrderId}
        onOrderUpdated={handleOrderUpdated}
      />
    </div>
  )
}

