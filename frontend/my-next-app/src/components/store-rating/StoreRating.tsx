"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Star, Send, Edit, Trash2, ChevronLeft, ChevronRight, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { UserCircle } from "lucide-react"

export type ShopReview = {
    id: string
    comment: string
    rating: number
    reviewerName: string
    createdAt: string
    userId: string
}

export interface ShopReviewStats {
    averageRating: number;
    totalReviews: number;
    starCounts: Record<number, number>;
}

export default function StoreRating() {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState("")
    const [editingReview, setEditingReview] = useState<string | null>(null)
    const [editRating, setEditRating] = useState(0)
    const [editHoverRating, setEditHoverRating] = useState(0)
    const [editComment, setEditComment] = useState("")
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [reviewToDelete, setReviewToDelete] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<String | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const commentInputRef = useRef<HTMLInputElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)
    const reviewsPerPage = 5

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/users/me', {
                    credentials: 'include',
                });
                if (response.ok) {
                    const userData = await response.json()
                    setCurrentUserId(userData.id)
                    setIsAdmin(userData.role === 'admin')
                    console.log('Current User:', userData)
                }
            } catch (error) {
                console.error('Error fetching user info:', error)
            }
        }
        fetchUserInfo()
    }, [])

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:8081/api/shop-reviews?page=${currentPage - 1}&size=${reviewsPerPage}`)
                if (response.ok) {
                    const data = await response.json()
                    console.log('Full API response:', data)
                    console.log('Review content:', data.content)
                    // Sort reviews by createdAt in descending order (newest first)
                    const sortedReviews = [...data.content].sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                    setReviews(sortedReviews)
                }
            } catch (error) {
                console.error('Error fetching reviews:', error)
            }
        }
        fetchReviews()
    }, [currentPage])

    const [reviews, setReviews] = useState<ShopReview[]>([])
    const [ratingStats, setRatingStats] = useState<ShopReviewStats>({
        averageRating: 0,
        totalReviews: 0,
        starCounts: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
        },
    });

    useEffect(() => {
        const fetchRatingStats = async () => {
            try {
                const res = await fetch("http://localhost:8081/api/shop-reviews/stats");
                const data: ShopReviewStats = await res.json();
                setRatingStats(data);
            } catch (err) {
                console.error("Lỗi khi fetch thống kê đánh giá:", err);
            }
        };

        fetchRatingStats();
    }, []);

    const getPercentage = (count: number) => {
        if (ratingStats.totalReviews === 0) return 0;
        return ((count / ratingStats.totalReviews) * 100).toFixed(1);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setDeleteConfirmOpen(false)
            }
        }

        if (deleteConfirmOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [deleteConfirmOpen])


    useEffect(() => {
        function handleEscapeKey(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setDeleteConfirmOpen(false)
            }
        }

        if (deleteConfirmOpen) {
            document.addEventListener("keydown", handleEscapeKey)
        }

        return () => {
            document.removeEventListener("keydown", handleEscapeKey)
        }
    }, [deleteConfirmOpen])

    const totalPages = Math.ceil(reviews.length / reviewsPerPage)
    const indexOfLastReview = currentPage * reviewsPerPage
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview)

    const handleRatingChange = (value: number) => {
        setRating(value)
        if (commentInputRef.current) {
            commentInputRef.current.focus()
        }
    }

    const handleEditRatingChange = (value: number) => {
        setEditRating(value)
    }

    const handleSubmit = async () => {
        if (comment.trim()) {
            setIsSubmitting(true)
            try {
                const response = await fetch('http://localhost:8081/api/shop-reviews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        rating,
                        comment,
                    }),
                })

                if (response.ok) {
                    const newReview = await response.json()
                    setReviews([newReview, ...reviews])
                    setComment("")
                    setRating(0)
                    setHoverRating(0)
                    setShowSuccessMessage(true)
                    setTimeout(() => {
                        setShowSuccessMessage(false)
                    }, 3000)
                    setCurrentPage(1)
                } else {
                    const error = await response.text()
                    alert(error)
                }
            } catch (error) {
                console.error('Error submitting review:', error)
                alert('Có lỗi xảy ra khi gửi đánh giá')
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    const startEditing = (review: ShopReview) => {
        setEditingReview(review.id)
        setEditRating(review.rating)
        setEditHoverRating(0)
        setEditComment(review.comment)
    }

    const cancelEditing = () => {
        setEditingReview(null)
        setEditRating(0)
        setEditComment("")
    }

    const saveEdit = async (id: string) => {
        if (editComment.trim()) {
            setIsSubmitting(true)
            try {
                const response = await fetch(`http://localhost:8081/api/shop-reviews/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        rating: editRating,
                        comment: editComment,
                    }),
                })

                if (response.ok) {
                    const updatedReview = await response.json()
                    setReviews(reviews.map((review) =>
                        review.id === id ? updatedReview : review
                    ))
                    setEditingReview(null)
                } else {
                    const error = await response.text()
                    alert(error)
                }
            } catch (error) {
                console.error('Error updating review:', error)
                alert('Có lỗi xảy ra khi cập nhật đánh giá')
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    const confirmDelete = (id: string) => {
        setReviewToDelete(id)
        setDeleteConfirmOpen(true)
    }

    const handleDelete = async () => {
        if (reviewToDelete) {
            try {
                const response = await fetch(`http://localhost:8081/api/shop-reviews/${reviewToDelete}`, {
                    method: 'DELETE',
                    credentials: 'include',
                })

                if (response.ok) {
                    setReviews(reviews.filter((review) => review.id !== reviewToDelete))
                    setDeleteConfirmOpen(false)
                    setReviewToDelete(null)

                    if (currentReviews.length === 1 && currentPage > 1) {
                        setCurrentPage(currentPage - 1)
                    }
                } else {
                    const error = await response.text()
                    alert(error)
                }
            } catch (error) {
                console.error('Error deleting review:', error)
                alert('Có lỗi xảy ra khi xóa đánh giá')
            }
        }
    }

    const formatDate = (date: Date) => {
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) {
            return "Vừa xong"
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)} phút trước`
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)} giờ trước`
        } else if (diffInSeconds < 604800) {
            return `${Math.floor(diffInSeconds / 86400)} ngày trước`
        } else {
            const day = date.getDate().toString().padStart(2, "0")
            const month = (date.getMonth() + 1).toString().padStart(2, "0")
            const year = date.getFullYear()
            const hours = date.getHours().toString().padStart(2, "0")
            const minutes = date.getMinutes().toString().padStart(2, "0")

            return `${day}/${month}/${year} ${hours}:${minutes}`
        }
    }

    const changePage = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="bg-white rounded-xl shadow-lg border p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-white opacity-50 z-0"></div>

                <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                        <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-transparent bg-clip-text">
                            Đánh giá cửa hàng
                        </span>
                    </h2>

                    {/* Rating Summary Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 bg-white rounded-xl shadow-sm p-5 border border-pink-100"
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Average Rating */}
                            <div className="flex flex-col items-center justify-center md:w-1/3">
                                <div className="text-4xl font-bold text-gray-800">{ratingStats.averageRating.toFixed(1)}</div>
                                <div className="flex my-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={cn(
                                                "w-5 h-5",
                                                ratingStats.averageRating >= star
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : ratingStats.averageRating >= star - 0.5
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300",
                                            )}
                                        />
                                    ))}
                                </div>
                                <div className="text-sm text-gray-500">{ratingStats.totalReviews} đánh giá</div>
                            </div>

                            {/* Rating Distribution */}
                            <div className="flex-1">
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((starNum) => (
                                        <div key={starNum} className="flex items-center gap-2">
                                            <div className="flex items-center w-16">
                                                <span className="text-sm font-medium text-gray-700">{starNum}</span>
                                                <Star className="w-4 h-4 ml-1 fill-yellow-400 text-yellow-400" />
                                            </div>
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${getPercentage(ratingStats.starCounts[starNum - 1])}%` }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                                                />
                                            </div>
                                            <div className="w-10 text-xs text-gray-500 text-right">
                                                {ratingStats.starCounts[starNum]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-pink-100 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center justify-center mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingChange(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none transform transition-transform duration-200 hover:scale-110"
                                    suppressHydrationWarning
                                >
                                    <Star
                                        className={cn(
                                            "w-8 h-8 mx-1 transition-all duration-200",
                                            (hoverRating || rating) >= star
                                                ? "fill-yellow-400 text-yellow-400 drop-shadow-md"
                                                : "text-gray-300 hover:text-gray-400",
                                        )}
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2 relative">
                            <Input
                                ref={commentInputRef}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Xin mời bạn để lại đánh giá để T2BIKE có thể phát triển hơn nhau!"
                                className="rounded-full py-6 px-4 border-gray-200 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition-all duration-300"
                                suppressHydrationWarning
                            />
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !rating || !comment.trim()}
                                className={cn(
                                    "rounded-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 h-12 w-12 p-0 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105",
                                    isSubmitting && "opacity-70 cursor-not-allowed",
                                )}
                            >
                                {isSubmitting ? (
                                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </Button>
                        </div>

                        <AnimatePresence>
                            {showSuccessMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-2 text-green-600 flex items-center text-sm"
                                >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Cảm ơn bạn đã gửi đánh giá!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-4 mt-6">
                        <AnimatePresence initial={false}>
                            {currentReviews.map((review, index) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: "hidden" }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="rounded-full overflow-hidden border-2 border-pink-100 shadow-sm">
                                            <div className="flex-shrink-0">
                                                <div className="rounded-full overflow-hidden border-2 border-pink-100 shadow-sm flex items-center justify-center w-10 h-10 bg-pink-50">
                                                    <UserCircle
                                                        size={40}
                                                        color="#ec4899"  // màu hồng (pink-500 Tailwind)
                                                        className="transition-transform duration-300 hover:scale-110"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        {editingReview === review.id ? (
                                            // Edit mode
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-bold">{review.reviewerName}</span>
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => handleEditRatingChange(star)}
                                                                onMouseEnter={() => setEditHoverRating(star)}
                                                                onMouseLeave={() => setEditHoverRating(0)}
                                                                className="focus:outline-none transform transition-transform duration-200 hover:scale-110"
                                                                suppressHydrationWarning
                                                            >
                                                                <Star
                                                                    className={cn(
                                                                        "w-4 h-4 transition-all duration-200",
                                                                        (editHoverRating || editRating) >= star
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300",
                                                                    )}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <Input
                                                    value={editComment}
                                                    onChange={(e) => setEditComment(e.target.value)}
                                                    className="mb-2 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50 transition-all duration-300"
                                                    suppressHydrationWarning
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => saveEdit(review.id)}
                                                        disabled={isSubmitting}
                                                        className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 transition-all duration-300"
                                                    >
                                                        {isSubmitting ? (
                                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                                                        ) : null}
                                                        Lưu
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={cancelEditing}
                                                        className="border-pink-200 text-pink-700 hover:bg-pink-50 transition-all duration-300"
                                                    >
                                                        Hủy
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            // View mode
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-800">{review.reviewerName}</span>
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={cn(
                                                                    "w-4 h-4",
                                                                    review.rating >= star
                                                                        ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                                                                        : "text-gray-300",
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-500 ml-2">{formatDate(new Date(review.createdAt))}</span>
                                                </div>
                                                <p className="text-gray-700 mt-1">{review.comment}</p>
                                                <div className="flex gap-2 mt-2">
                                                    {(currentUserId === review.userId || isAdmin) && (
                                                        <>
                                                            {/* <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300"
                                    onClick={() => startEditing(review)}
                                >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Chỉnh sửa
                                </Button> */}
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
                                                                onClick={() => confirmDelete(review.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                Xóa
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex justify-center items-center mt-6 gap-2"
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => changePage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="h-8 w-8 p-0 border-pink-200 text-pink-600 hover:bg-pink-50 transition-all duration-300"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Trang trước</span>
                            </Button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => changePage(page)}
                                    className={cn(
                                        "h-8 w-8 p-0 transition-all duration-300 transform hover:scale-110",
                                        currentPage === page
                                            ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-md"
                                            : "border-pink-200 text-pink-600 hover:bg-pink-50",
                                    )}
                                >
                                    {page}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => changePage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8 p-0 border-pink-200 text-pink-600 hover:bg-pink-50 transition-all duration-300"
                            >
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Trang sau</span>
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirmOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            onClick={() => setDeleteConfirmOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="fixed inset-0 z-50 flex items-center justify-center"
                        >
                            <div ref={modalRef}
                                className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6 mx-4 w-full max-w-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Xác nhận xóa</h3>
                                    <button
                                        onClick={() => setDeleteConfirmOpen(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="py-2">
                                    <p className="text-gray-600">
                                        Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.
                                    </p>
                                </div>

                                <div className="flex justify-end gap-2 mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => setDeleteConfirmOpen(false)}
                                        className="border-pink-200 text-gray-600 hover:bg-pink-50 transition-all duration-300"
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        onClick={handleDelete}
                                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                                    >
                                        Xóa
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
