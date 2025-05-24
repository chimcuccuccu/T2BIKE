import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Star, Search, Filter, Plus, Package, Edit, Trash2, MessageSquare } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface ProductReview {
    id: number;
    username: string;
    comment: string;
    createdAt: string;
    productName: string;
    answer: string | null;
    answeredAt: string;
    userId: number;
    productId: number;
}

interface PageResponse {
    content: ProductReview[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export default function ProductReviewsPage() {
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<ProductReview | null>(null);
    const [editComment, setEditComment] = useState("");
    const [responseText, setResponseText] = useState("");
    const [isUpdateAnswerDialogOpen, setIsUpdateAnswerDialogOpen] = useState(false);
    const [isDeleteAnswerDialogOpen, setIsDeleteAnswerDialogOpen] = useState(false);
    const [updateAnswerText, setUpdateAnswerText] = useState("");

    useEffect(() => {
        fetchReviews();
    }, [currentPage]);

    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:8081/api/product-reviews?page=${currentPage}&size=9`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data: PageResponse = await response.json();
                setReviews(data.content);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleEdit = (review: ProductReview) => {
        setSelectedReview(review);
        setEditComment(review.comment);
        setIsEditDialogOpen(true);
    };

    const handleResponse = (review: ProductReview) => {
        setSelectedReview(review);
        setResponseText(review.answer || "");
        setIsResponseDialogOpen(true);
    };

    const handleDelete = (review: ProductReview) => {
        setSelectedReview(review);
        setIsDeleteDialogOpen(true);
    };

    const handleUpdateAnswer = (review: ProductReview) => {
        setSelectedReview(review);
        setUpdateAnswerText(review.answer || "");
        setIsUpdateAnswerDialogOpen(true);
    };

    const handleDeleteAnswer = (review: ProductReview) => {
        setSelectedReview(review);
        setIsDeleteAnswerDialogOpen(true);
    };

    const submitEdit = async () => {
        if (!selectedReview) return;

        try {
            const response = await fetch(`http://localhost:8081/api/product-reviews/${selectedReview.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    comment: editComment,
                }),
            });

            if (response.ok) {
                setIsEditDialogOpen(false);
                await fetchReviews(); // Refresh the list after successful edit
            }
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const submitResponse = async () => {
        if (!selectedReview) return;

        try {
            const response = await fetch(`http://localhost:8081/api/product-reviews/answer/${selectedReview.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    answer: responseText,
                }),
            });

            if (response.ok) {
                setIsResponseDialogOpen(false);
                await fetchReviews(); // Refresh the list after successful response
            } else {
                const errorData = await response.text();
                console.error('Error submitting response:', errorData);
            }
        } catch (error) {
            console.error('Error submitting response:', error);
        }
    };

    const submitUpdateAnswer = async () => {
        if (!selectedReview) return;

        try {
            const response = await fetch(`http://localhost:8081/api/product-reviews/answer/${selectedReview.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    answer: updateAnswerText,
                }),
            });

            if (response.ok) {
                setIsUpdateAnswerDialogOpen(false);
                await fetchReviews(); // Refresh the list after successful update
            }
        } catch (error) {
            console.error('Error updating answer:', error);
        }
    };

    const confirmDelete = async () => {
        if (!selectedReview) return;

        try {
            const response = await fetch(`http://localhost:8081/api/product-reviews/${selectedReview.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setIsDeleteDialogOpen(false);
                await fetchReviews(); // Refresh the list after successful delete
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const confirmDeleteAnswer = async () => {
        if (!selectedReview) return;

        try {
            const response = await fetch(`http://localhost:8081/api/product-reviews/answer/${selectedReview.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setIsDeleteAnswerDialogOpen(false);
                await fetchReviews(); // Refresh the list after successful answer delete
            }
        } catch (error) {
            console.error('Error deleting answer:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                    <Package className="text-pink-500" />
                    Quản lý đánh giá sản phẩm
                </h1>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        className="pl-10"
                        placeholder="Tìm kiếm đánh giá..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Tất cả sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                        {Array.from(new Set(reviews.map(review => review.productName))).map((productName) => (
                            <SelectItem key={productName} value={productName}>
                                {productName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                </div>
            ) : reviews.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left">Người dùng</th>
                                <th className="py-3 px-4 text-left">Sản phẩm</th>
                                <th className="py-3 px-4 text-left">Nội dung</th>
                                <th className="py-3 px-4 text-left">Ngày đánh giá</th>
                                <th className="py-3 px-4 text-left">Phản hồi</th>
                                <th className="py-3 px-4 text-left">Ngày phản hồi</th>
                                <th className="py-3 px-4 text-left">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr key={review.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">{review.username}</td>
                                    <td className="py-3 px-4">{review.productName}</td>
                                    <td className="py-3 px-4 max-w-xs truncate">{review.comment}</td>
                                    <td className="py-3 px-4">{formatDate(review.createdAt)}</td>
                                    <td className="py-3 px-4">{review.answer || "Chưa phản hồi"}</td>
                                    <td className="py-3 px-4">{review.answeredAt ? formatDate(review.answeredAt) : "-"}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => handleResponse(review)}
                                            >
                                                <MessageSquare className="h-4 w-4 mr-1" />
                                                Phản hồi
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                                onClick={() => handleEdit(review)}
                                            >
                                                <Edit className="h-4 w-4 mr-1" />
                                                Sửa
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(review)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Xóa
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-between items-center p-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                        >
                            Trang trước
                        </Button>
                        <span className="text-sm text-gray-600">
                            Trang {currentPage + 1} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage === totalPages - 1}
                        >
                            Trang sau
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg">
                    <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                        <Package className="text-pink-500" size={24} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Chưa có đánh giá sản phẩm nào</h3>
                    <p className="text-gray-500">Chưa có đánh giá nào được gửi về sản phẩm</p>
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa đánh giá</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            placeholder="Nhập nội dung đánh giá..."
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={submitEdit}>
                            Lưu thay đổi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Answer Dialog */}
            <Dialog open={isUpdateAnswerDialogOpen} onOpenChange={setIsUpdateAnswerDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cập nhật phản hồi</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            value={updateAnswerText}
                            onChange={(e) => setUpdateAnswerText(e.target.value)}
                            placeholder="Nhập nội dung phản hồi..."
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUpdateAnswerDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={submitUpdateAnswer}>
                            Cập nhật phản hồi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Answer Confirmation Dialog */}
            <Dialog open={isDeleteAnswerDialogOpen} onOpenChange={setIsDeleteAnswerDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa phản hồi</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Bạn có chắc chắn muốn xóa phản hồi này?</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteAnswerDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteAnswer}>
                            Xóa phản hồi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modify the Response Dialog to include update and delete buttons */}
            <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Phản hồi đánh giá</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Nhập nội dung phản hồi..."
                            className="min-h-[100px]"
                        />
                    </div>
                    <DialogFooter className="flex justify-between">
                        <div className="flex gap-2">
                            {selectedReview?.answer && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsResponseDialogOpen(false);
                                            handleUpdateAnswer(selectedReview);
                                        }}
                                    >
                                        Cập nhật phản hồi
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            setIsResponseDialogOpen(false);
                                            handleDeleteAnswer(selectedReview);
                                        }}
                                    >
                                        Xóa phản hồi
                                    </Button>
                                </>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
                                Hủy
                            </Button>
                            <Button onClick={submitResponse}>
                                Gửi phản hồi
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Bạn có chắc chắn muốn xóa đánh giá này?</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
} 