import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Star, Search, Filter, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Review {
    id: number
    comment: string
    rating: number
    reviewerName: string
    createdAt: string
    userId: number
}

interface ReviewResponse {
    content: Review[]
    totalPages: number
    totalElements: number
    size: number
    number: number
}

interface EditReviewData {
    comment: string
    rating: number
}

export default function StoreReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedReview, setSelectedReview] = useState<Review | null>(null)
    const [editData, setEditData] = useState<EditReviewData>({
        comment: "",
        rating: 0
    })
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const [searchParams, setSearchParams] = useState({
        keyword: "",
        rating: "all"
    })

    const fetchReviews = async (page: number) => {
        try {
            setIsLoading(true)
            const { keyword, rating } = searchParams
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: "5"
            })

            if (keyword) queryParams.append("keyword", keyword)
            if (rating && rating !== "all") queryParams.append("rating", rating)

            const response = await fetch(`http://localhost:8081/api/shop-reviews/search?${queryParams.toString()}`)
            const data: ReviewResponse = await response.json()
            setReviews(data.content)
            setTotalPages(data.totalPages)
        } catch (error) {
            console.error("Error fetching reviews:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews(currentPage)
    }, [currentPage, searchParams])

    const handleSearch = () => {
        setCurrentPage(0)
        fetchReviews(0)
    }

    const handleClearSearch = () => {
        setSearchParams({
            keyword: "",
            rating: "all"
        })
        setCurrentPage(0)
    }

    const handleEdit = (review: Review) => {
        setSelectedReview(review)
        setEditData({
            comment: review.comment,
            rating: review.rating
        })
        setIsEditModalOpen(true)
    }

    const handleUpdateReview = async () => {
        if (!selectedReview) return

        try {
            const response = await fetch(`http://localhost:8081/api/shop-reviews/${selectedReview.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editData),
                credentials: "include"
            })

            if (response.ok) {
                setIsEditModalOpen(false)
                fetchReviews(currentPage)
            } else {
                const errorData = await response.text()
                alert(errorData)
            }
        } catch (error) {
            console.error("Error updating review:", error)
            alert("Có lỗi xảy ra khi cập nhật đánh giá")
        }
    }

    const handleDelete = async (review: Review) => {
        setSelectedReview(review)
        setDeleteError(null)
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = async () => {
        if (!selectedReview) return

        try {
            const response = await fetch(`http://localhost:8081/api/shop-reviews/${selectedReview.id}`, {
                method: "DELETE",
                credentials: "include"
            })
            if (response.ok) {
                setIsDeleteModalOpen(false)
                fetchReviews(currentPage)
            } else {
                const errorData = await response.text()
                setDeleteError(errorData)
            }
        } catch (error) {
            console.error("Error deleting review:", error)
            setDeleteError("Có lỗi xảy ra khi xóa đánh giá")
        }
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage)
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                    <Star className="text-pink-500" />
                    Quản lý đánh giá cửa hàng
                </h1>
                {/* <Button className="bg-pink-500 hover:bg-pink-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm đánh giá
                </Button> */}
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        className="pl-10"
                        placeholder="Tìm kiếm đánh giá..."
                        value={searchParams.keyword}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Select
                    value={searchParams.rating}
                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, rating: value }))}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Đánh giá" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="5">5 sao</SelectItem>
                        <SelectItem value="4">4 sao</SelectItem>
                        <SelectItem value="3">3 sao</SelectItem>
                        <SelectItem value="2">2 sao</SelectItem>
                        <SelectItem value="1">1 sao</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    variant="outline"
                    className="border-gray-200"
                    onClick={handleSearch}
                >
                    <Search className="w-4 h-4 mr-2" />
                    Tìm kiếm
                </Button>
                {(searchParams.keyword || searchParams.rating) && (
                    <Button
                        variant="outline"
                        className="border-gray-200"
                        onClick={handleClearSearch}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Xóa bộ lọc
                    </Button>
                )}
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa đánh giá</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Đánh giá</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => setEditData({ ...editData, rating })}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            size={24}
                                            className={rating <= editData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Nội dung</label>
                            <Textarea
                                value={editData.comment}
                                onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                                placeholder="Nhập nội dung đánh giá..."
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleUpdateReview}>
                            Lưu thay đổi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa đánh giá</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    {deleteError && (
                        <div className="text-red-500 text-sm mt-2">
                            {deleteError}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {isLoading ? (
                <div className="text-center py-8">Đang tải...</div>
            ) : reviews.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left">Người dùng</th>
                                <th className="py-3 px-4 text-left">Đánh giá</th>
                                <th className="py-3 px-4 text-left">Nội dung</th>
                                <th className="py-3 px-4 text-left">Ngày</th>
                                <th className="py-3 px-4 text-left">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reviews.map((review) => (
                                <tr key={review.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">{review.reviewerName}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 max-w-xs truncate">{review.comment}</td>
                                    <td className="py-3 px-4">
                                        {format(new Date(review.createdAt), "dd/MM/yyyy")}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8"
                                                onClick={() => handleEdit(review)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-red-500 hover:text-red-600"
                                                onClick={() => handleDelete(review)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                        <div className="text-sm text-gray-500">
                            Trang {currentPage + 1} / {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Trang trước
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}
                            >
                                Trang sau
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg">
                    <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                        <Star className="text-pink-500" size={24} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Chưa có đánh giá cửa hàng nào</h3>
                    <p className="text-gray-500 mb-6">Bắt đầu bằng cách thêm đánh giá đầu tiên</p>
                    <Button className="bg-pink-500 hover:bg-pink-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm đánh giá
                    </Button>
                </div>
            )}
        </div>
    )
} 