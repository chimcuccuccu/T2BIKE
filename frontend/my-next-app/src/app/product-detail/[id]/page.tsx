"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
    Heart, Minus, Plus,
    MessageCircle, Check,
    Star, Truck, RefreshCw,
    Search, ShoppingCart, Home,
    ChevronRight, Facebook, ChevronUp, ZoomIn, ShieldCheck,
    ArrowLeft, ArrowRight, Share2, Send, User, Store, Smile, Trash2, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Product, ProductReview, ProductReviewResponse } from "@/types/product"
import { useParams } from "next/navigation"
import axios from "axios"
import FormatPrice from "@/components/ui/FormatPrice"
import { cn } from "@/lib/utils"
import ImageLightbox from "@/components/ImageLightBox"
import ProductSpecs from "@/components/ProductSpecs"
import QuestionsAnswers from "@/components/QuestionAnswer"
import { HeaderPage } from "@/components/Header/header-page"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/context/CartContext"
import { useUser } from "@/hooks/useUser"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useWishlist } from "@/context/WishlistContext"

// Add type definition for Question
type Question = {
    id: string;
    userId: number;
    user: string;
    question: string;
    date: string;
    replies: {
        id: string;
        admin: boolean;
        adminName: string;
        content: string;
        date: string;
    }[];
};

export default function ProductDetail() {
    const { id } = useParams()
    const [quantity, setQuantity] = useState(1)
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedColor, setSelectedColor] = useState("red")
    const [selectedImage, setSelectedImage] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [activeTab, setActiveTab] = useState("info")
    const [currentImage, setCurrentImage] = useState(0)
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [totalReviewPages, setTotalReviewPages] = useState(1);
    const [currentReviewPage, setCurrentReviewPage] = useState(0);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const { addToCart, removeFromCart, isInCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { user } = useUser();
    const { toast } = useToast();
    const router = useRouter();

    const increaseQuantity = () => setQuantity((prev) => prev + 1)
    const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

    const [currentQAPage, setCurrentQAPage] = useState(1)
    const [totalQAPages, setTotalQAPages] = useState(1)
    const questionsPerPage = 4

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

    // Animation variants
    const tabContentVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                duration: 0.4,
            },
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                duration: 0.3,
            },
        },
    }

    const reviewItemVariants = {
        hidden: { opacity: 0, x: -30, scale: 0.95 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                delay: i * 0.08,
                duration: 0.4,
            },
        }),
        exit: (i: number) => ({
            opacity: 0,
            x: 30,
            scale: 0.95,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                delay: i * 0.04,
                duration: 0.3,
            },
        }),
    }

    const paginationVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                delay: 0.2,
                staggerChildren: 0.05,
                delayChildren: 0.3,
            },
        },
    }

    const paginationItemVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 24,
            },
        },
    }

    const commentFormVariants = {
        hidden: { opacity: 0, height: 0, marginTop: 0 },
        visible: {
            opacity: 1,
            height: "auto",
            marginTop: 16,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                duration: 0.3,
            },
        },
        exit: {
            opacity: 0,
            height: 0,
            marginTop: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                duration: 0.2,
            },
        },
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
            },
        },
    }

    const replyFormVariants = {
        hidden: { opacity: 0, height: 0, marginTop: 0 },
        visible: {
            opacity: 1,
            height: "auto",
            marginTop: 12,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
            },
        },
        exit: {
            opacity: 0,
            height: 0,
            marginTop: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
            },
        },
    }
    const toggleWishlist = () => {
        setIsWishlisted((prev) => !prev)
    }

    const productRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: productRef,
        offset: ["start start", "end start"],
    })

    const imageScale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
    const imageOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.6])

    const nextImage = () => {
        setCurrentImage((prev) => (prev === (product?.imageUrls?.length ?? 0) - 1 ? 0 : prev + 1))
    }

    const prevImage = () => {
        setCurrentImage((prev) => (prev === 0 ? (product?.imageUrls?.length ?? 0) - 1 : prev - 1))
    }


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    console.log("id la", id)
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8081/api/all-products/${id}`)
                .then((res) => {
                    setProduct(res.data)
                    console.log("Dữ liệu nhận được:", res.data);
                })
                .catch((err) => console.error('Lỗi khi lấy chi tiết sản phẩm:', err));
        }
    }, [id]);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) return;
            setIsLoadingReviews(true);
            try {
                const response = await axios.get<ProductReview[]>(
                    `http://localhost:8081/api/product-reviews/product/${id}`
                );
                setReviews(response.data);
                setTotalReviewPages(Math.ceil(response.data.length / 9));
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setIsLoadingReviews(false);
            }
        };

        fetchReviews();
    }, [id]);

    // Check if user is logged in
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/users/me', { withCredentials: true });
                if (response.data && response.data.id) {
                    setIsLoggedIn(true);
                    setUserId(response.data.id);
                    console.log("User ID:", response.data.id);
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                setIsLoggedIn(false);
                setUserId(null);
            }
        };
        checkLoginStatus();
    }, []);

    // Map reviews to questions format
    const mappedQuestions = reviews.map(review => ({
        id: review.id.toString(),
        userId: review.userId,
        user: review.username,
        question: review.comment,
        date: review.createdAt,
        replies: review.answer ? [{
            id: `${review.id}-1`,
            admin: true,
            adminName: "T2BIKE",
            content: review.answer,
            date: review.answeredAt || "",
        }] : [],
    }));

    // Update state definition
    const [questions, setQuestions] = useState<Question[]>(mappedQuestions)
    const [newQuestion, setNewQuestion] = useState("")
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState("")
    const [isAdmin, setIsAdmin] = useState(false) // Toggle this based on user role
    const questionInputRef = useRef<HTMLTextAreaElement>(null)
    const replyInputRef = useRef<HTMLTextAreaElement>(null)

    // Update getCurrentPageQuestions function with proper typing
    const getCurrentPageQuestions = (): Question[] => {
        const startIndex = (currentQAPage - 1) * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;
        return questions.slice(startIndex, endIndex);
    };

    // Update the useEffect for questions
    useEffect(() => {
        // Sort questions by date (newest first)
        const sortedQuestions = [...mappedQuestions].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setQuestions(sortedQuestions);
        setTotalQAPages(Math.ceil(sortedQuestions.length / questionsPerPage));
    }, [reviews, totalReviewPages]);

    const handleSubmitQuestion = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newQuestion.trim()) return;

        if (!isLoggedIn) {
            setNotification({ type: 'error', message: 'Vui lòng đăng nhập để đặt câu hỏi' });
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8081/api/product-reviews',
                {
                    productId: id,
                    comment: newQuestion
                },
                { withCredentials: true }
            );

            if (response.status === 200) {
                // Refresh reviews after adding new one
                const reviewsResponse = await axios.get<ProductReview[]>(
                    `http://localhost:8081/api/product-reviews/product/${id}`
                );
                setReviews(reviewsResponse.data);
                setNewQuestion("");
                setNotification({ type: 'success', message: 'Đã thêm câu hỏi thành công!' });
            }
        } catch (error) {
            console.error('Error adding review:', error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setNotification({ type: 'error', message: 'Vui lòng đăng nhập để đặt câu hỏi' });
                } else {
                    setNotification({ type: 'error', message: error.response?.data?.message || 'Có lỗi xảy ra khi thêm câu hỏi' });
                }
            } else {
                setNotification({ type: 'error', message: 'Có lỗi xảy ra khi thêm câu hỏi' });
            }
        }
    };

    const handleSubmitReply = (questionId: string) => {
        if (!replyContent.trim()) return

        const updatedQuestions = questions.map((q) => {
            if (q.id === questionId) {
                return {
                    ...q,
                    replies: [
                        ...q.replies,
                        {
                            id: `${questionId}-${q.replies.length + 1}`,
                            admin: true,
                            adminName: "T2BIKE", // Use your actual admin/store name
                            content: replyContent,
                            date: new Date().toISOString(),
                        },
                    ],
                }
            }
            return q
        })

        setQuestions(updatedQuestions)
        setReplyContent("")
        setReplyingTo(null)
    }

    // Change Q&A page
    const goToNextQAPage = () => {
        if (currentQAPage < totalQAPages) {
            setCurrentQAPage(prev => prev + 1);
            setCurrentReviewPage(prev => prev + 1);
        }
    }

    const goToPrevQAPage = () => {
        if (currentQAPage > 1) {
            setCurrentQAPage(prev => prev - 1);
            setCurrentReviewPage(prev => prev - 1);
        }
    }

    const handleEditReview = async (reviewId: string) => {
        if (!editContent.trim()) return;

        try {
            await axios.put(
                `http://localhost:8081/api/product-reviews/${reviewId}`,
                {
                    comment: editContent
                },
                { withCredentials: true }
            );

            // Refresh reviews after editing
            const reviewsResponse = await axios.get<ProductReview[]>(
                `http://localhost:8081/api/product-reviews/product/${id}`
            );
            setReviews(reviewsResponse.data);
            setIsEditing(null);
            setEditContent("");
        } catch (error) {
            console.error('Error editing review:', error);
            alert("Có lỗi xảy ra khi chỉnh sửa câu hỏi");
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        setReviewToDelete(reviewId);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!reviewToDelete) return;

        try {
            await axios.delete(
                `http://localhost:8081/api/product-reviews/${reviewToDelete}`,
                { withCredentials: true }
            );

            // Refresh reviews after deleting
            const reviewsResponse = await axios.get<ProductReview[]>(
                `http://localhost:8081/api/product-reviews/product/${id}`
            );
            setReviews(reviewsResponse.data);
            setNotification({ type: 'success', message: 'Đã xóa câu hỏi thành công!' });
        } catch (error) {
            console.error('Error deleting review:', error);
            setNotification({ type: 'error', message: 'Có lỗi xảy ra khi xóa câu hỏi' });
        } finally {
            setDeleteConfirmOpen(false);
            setReviewToDelete(null);
        }
    };

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleAddToCart = () => {
        if (!user) {
            toast({
                variant: "pink",
                title: "Vui lòng đăng nhập!",
                description: (
                    <>
                        Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.
                        <Button
                            size="sm"
                            variant="link"
                            onClick={() => router.push("/signin")}
                            className="text-white font-semibold text-sm bg-pink-600 hover:bg-pink-700 border border-transparent rounded-md px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                        >
                            Đăng nhập
                        </Button>
                    </>
                ),
            });
            return;
        }

        if (!product) return;

        if (isInCart(product.id)) {
            removeFromCart(product.id);
            toast({
                variant: "pink",
                title: "Đã xóa khỏi giỏ hàng!",
                description: `${product.name} đã được xóa khỏi giỏ hàng của bạn.`,
            });
        } else {
            addToCart(product);
            toast({
                variant: "pink",
                title: "Đã thêm vào giỏ hàng!",
                description: `${product.name} đã được thêm vào giỏ hàng của bạn.`,
            });
        }
    };

    const handleAddToWishlist = async () => {
        if (!user) {
            toast({
                variant: "pink",
                title: "Vui lòng đăng nhập!",
                description: (
                    <>
                        Bạn cần đăng nhập để thêm sản phẩm vào danh sách yêu thích.
                        <Button
                            size="sm"
                            variant="link"
                            onClick={() => router.push("/signin")}
                            className="text-white font-semibold text-sm bg-pink-600 hover:bg-pink-700 border border-transparent rounded-md px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                        >
                            Đăng nhập
                        </Button>
                    </>
                ),
            });
            return;
        }

        if (!product) return;

        try {
            if (isInWishlist(product.id)) {
                // Gọi API xóa khỏi wishlist
                await axios.delete(`http://localhost:8081/api/wishlist/delete/${product.id}`, {
                    withCredentials: true
                });
                removeFromWishlist(product.id);
                toast({
                    variant: "pink",
                    title: "Đã xóa khỏi danh sách yêu thích!",
                    description: `${product.name} đã được xóa khỏi danh sách yêu thích của bạn.`,
                });
            } else {
                // Gọi API thêm vào wishlist
                await axios.post('http://localhost:8081/api/wishlist/add', {
                    userId: user.id,
                    productId: product.id
                }, {
                    withCredentials: true
                });
                addToWishlist(product);
                toast({
                    variant: "pink",
                    title: "Đã thêm vào danh sách yêu thích!",
                    description: `${product.name} đã được thêm vào danh sách yêu thích của bạn.`,
                });
            }
        } catch (error) {
            console.error('Error handling wishlist:', error);
            toast({
                variant: "destructive",
                title: "Có lỗi xảy ra!",
                description: "Không thể thực hiện thao tác này. Vui lòng thử lại sau.",
            });
        }
    };

    const handleBuyNow = () => {
        if (!user) {
            toast({
                variant: "pink",
                title: "Vui lòng đăng nhập!",
                description: (
                    <>
                        Bạn cần đăng nhập để mua hàng.
                        <Button
                            size="sm"
                            variant="link"
                            onClick={() => router.push("/signin")}
                            className="text-white font-semibold text-sm bg-pink-600 hover:bg-pink-700 border border-transparent rounded-md px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                        >
                            Đăng nhập
                        </Button>
                    </>
                ),
            });
            return;
        }

        if (!product) return;

        // Add to cart first
        addToCart(product);

        // Then redirect to checkout
        router.push("/checkout");
    };

    if (!product) return (
        <div className="flex items-center justify-center h-screen">
            <Image
                src="/cat-loading.gif"
                alt="Loading Cat"
                width={150}
                height={150}
                className="mb-4"
            />
            <p className="text-4xl font-bold text-pink-600">
                Đang tải, bạn chờ xíu nha <span className="dot1">.</span><span className="dot2">.</span><span className="dot3">.</span>
            </p>
            <style jsx>{`
            @keyframes blink {
            0% { opacity: 1; }
            33% { opacity: 0; }
            66% { opacity: 1; }
            100% { opacity: 1; }
            }
            .dot1 { animation: blink 1.5s infinite; }
            .dot2 { animation: blink 1.5s infinite 0.2s; }
            .dot3 { animation: blink 1.5s infinite 0.4s; }
        `}</style>
        </div>
    );

    return (
        <div className="min-h-screen bg-pink-50">
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        className={`fixed top-4 left-[650px] transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-pink-400' : 'bg-red-500'
                            } text-white`}

                    >
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>

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

            <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >

                <div className="container mx-auto px-4 mt-10 max-w-5xl pt-16">
                    <AnimatePresence>
                        {isScrolled && (
                            <motion.div
                                className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 py-4 px-8"
                                initial={{ y: -100 }}
                                animate={{ y: 0 }}
                                exit={{ y: -100 }}
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            >
                                <div className="container mx-auto flex justify-between items-center">
                                    <h2 className="font-bold text-2xl">{product.name}</h2>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-pink-500 text-2xl"><FormatPrice price={product.price} /></span>
                                        <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-md font-semibold" size="lg">
                                            Mua ngay
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Product Section */}
                    <div className="container mx-auto px-4 py-8 -mt-10">
                        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl shadow-sm overflow-hidden">
                            {/* Product Images */}
                            <div className="p-6">
                                <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square mb-4 group">

                                    {/* Nút chuyển ảnh trái */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md"
                                        onClick={prevImage}
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>

                                    {/* Ảnh chính */}
                                    <Image
                                        src={product.imageUrls[currentImage] || "/placeholder.svg"}
                                        alt="Xe tay thang"
                                        width={600}
                                        height={600}
                                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105 cursor-pointer"
                                        onClick={() => setLightboxOpen(true)}
                                    />

                                    {/* Nút chuyển ảnh phải */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md"
                                        onClick={nextImage}
                                    >
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>

                                    {/* Nút phóng to */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white shadow-md p-2"
                                        onClick={() => setLightboxOpen(true)}
                                    >
                                        <ZoomIn className="h-5 w-5" />
                                    </Button>

                                    {/* Badge BestSeller */}
                                    <Badge className="absolute top-4 left-4 bg-pink-500 hover:bg-pink-600">
                                        BestSeller
                                    </Badge>
                                </div>

                                {/* Thumbnail List */}
                                <div className="flex space-x-2 overflow-x-auto pb-2">
                                    {product.imageUrls.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`border-2 rounded cursor-pointer flex-shrink-0 transition-all duration-300 ${currentImage === index ? "border-pink-500 opacity-100" : "border-gray-200 opacity-60 hover:opacity-100"
                                                }`}
                                            onClick={() => setCurrentImage(index)}
                                        >
                                            <Image
                                                src={img || "/placeholder.svg"}
                                                alt={`Thumbnail ${index + 1}`}
                                                width={80}
                                                height={80}
                                                className="h-20 w-20 object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <ImageLightbox
                                    isOpen={lightboxOpen}
                                    onClose={() => setLightboxOpen(false)}
                                    src={product.imageUrls[currentImage] || "/placeholder.svg"}
                                    alt="Xe đạp ABC"
                                />
                            </div>
                            <div className="p-6 lg:p-8 flex flex-col">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                        <div className="flex items-center gap-4 mb-2">
                                            {/* <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-5 w-5 ${star <= 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                                                    />
                                                ))}
                                            </div> */}
                                            {/* <span className="text-sm text-gray-500">36 đánh giá</span> */}
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">Mã sản phẩm: TT{product.id}</p>
                                    </div>
                                </div>

                                <p className="text-3xl font-bold text-gray-900"><FormatPrice price={product.price} /></p>
                                <p className="text-sm text-gray-500 mt-1">Giá đã bao gồm VAT</p>
                                <Separator className="my-2" />

                                {/* Color selection */}

                                <h3 className="font-semibold mb-2">Màu</h3>
                                <div className="flex gap-3">
                                    {product.color.map((color) => (
                                        <motion.div
                                            key={color}
                                            className={cn(
                                                "w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2",
                                                selectedColor === color ? "border-gray-400" : "border-transparent",
                                            )}
                                            onClick={() => setSelectedColor(color)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
                                        </motion.div>
                                    ))}
                                </div>


                                {/* Quantity */}
                                <div className="mb-6 mt-5">
                                    <div className="flex justify-between mb-2">
                                        <h3 className="text-sm font-medium text-gray-900">Số lượng</h3>
                                        <p className="text-sm text-gray-500">Còn lại: {product.quantity - quantity}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            className="w-10 h-10 rounded-l-md border border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                                            onClick={decreaseQuantity}
                                            disabled={quantity === 1}
                                        >
                                            <span className="text-xl font-medium">−</span>
                                        </button>
                                        <input
                                            type="text"
                                            value={quantity}
                                            readOnly
                                            className="w-14 h-10 border-t border-b border-gray-300 text-center"
                                        />
                                        <button
                                            className="w-10 h-10 rounded-r-md border border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                                            onClick={increaseQuantity}
                                            disabled={quantity >= product.quantity}
                                        >
                                            <span className="text-xl font-medium">+</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mb-6">
                                    <Button
                                        className="w-[400] h-12 text-base font-medium bg-pink-500 hover:bg-pink-600"
                                        onClick={handleBuyNow}
                                    >
                                        Mua ngay
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <Button
                                        variant="secondary"
                                        className={cn(
                                            "h-12 text-base font-medium flex items-center justify-center gap-2",
                                            isInWishlist(product?.id || 0)
                                                ? "bg-pink-500 text-white hover:bg-pink-600"
                                                : "bg-pink-100 hover:bg-pink-200 text-pink-700"
                                        )}
                                        onClick={handleAddToWishlist}
                                    >
                                        <Heart className={cn("h-5 w-5", isInWishlist(product?.id || 0) && "fill-current")} />
                                        {isInWishlist(product?.id || 0) ? "Đã yêu thích" : "Yêu thích"}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "h-12 text-base font-medium border-pink-500",
                                            isInCart(product?.id || 0)
                                                ? "bg-pink-500 text-white hover:bg-pink-600"
                                                : "text-pink-500 hover:bg-pink-50"
                                        )}
                                        onClick={handleAddToCart}
                                    >
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        {isInCart(product?.id || 0) ? "Đã thêm vào giỏ" : "Thêm vào giỏ hàng"}
                                    </Button>
                                </div>

                                {/* Benefits */}
                                <div className="bg-pink-50 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Truck className="h-5 w-5 text-pink-500" />
                                        <div>
                                            <p className="text-sm font-medium">Giao hàng miễn phí</p>
                                            <p className="text-xs text-gray-500">Cho đơn hàng từ 2.000.000đ</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="h-5 w-5 text-pink-500" />
                                        <div>
                                            <p className="text-sm font-medium">Bảo hành chính hãng 12 tháng</p>
                                            <p className="text-xs text-gray-500">1 đổi 1 trong 30 ngày đầu tiên</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Info */}
                    <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
                        <Tabs defaultValue="description">
                            <TabsList className="w-full border-b bg-gray-50 p-0 h-auto">
                                <TabsTrigger
                                    value="description"
                                    className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none"
                                >
                                    Mô tả sản phẩm
                                </TabsTrigger>
                                <TabsTrigger
                                    value="specs"
                                    className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none"
                                >
                                    Thông số kỹ thuật
                                </TabsTrigger>
                                <TabsTrigger
                                    value="reviews"
                                    className="py-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none"
                                >
                                    Hỏi và đáp
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="description" className="p-6">
                                <div className="prose max-w-none">
                                    {product.description}
                                </div>
                            </TabsContent>

                            <TabsContent value="specs" className="p-6">
                                <ProductSpecs></ProductSpecs>
                            </TabsContent>

                            <TabsContent value="reviews" className="p-6">
                                <motion.div variants={tabContentVariants} initial="hidden" animate="visible" exit="exit">
                                    {/* Question input */}
                                    <form onSubmit={handleSubmitQuestion} className="mb-8">
                                        <div className="relative">
                                            <Textarea
                                                ref={questionInputRef}
                                                value={newQuestion}
                                                onChange={(e) => setNewQuestion(e.target.value)}
                                                placeholder={isLoggedIn ? "Xin mời để lại câu hỏi, T2BIKE sẽ trả lời lại trong 1h, các câu hỏi từ 22h-6h sẽ được trả lời vào sáng hôm sau." : "Vui lòng đăng nhập để đặt câu hỏi"}
                                                className="pr-14 min-h-[80px] border-gray-200 rounded-lg focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                                                disabled={!isLoggedIn}
                                            />
                                            <motion.button
                                                type="submit"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                disabled={!newQuestion.trim() || !isLoggedIn}
                                                className="absolute right-3 top-3 bg-pink-500 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Send size={18} />
                                            </motion.button>
                                        </div>
                                    </form>

                                    {/* Questions and answers list */}
                                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                                        {getCurrentPageQuestions().map((question) => (
                                            <motion.div
                                                key={question.id}
                                                variants={itemVariants}
                                                className="border border-gray-100 rounded-xl overflow-hidden"
                                            >
                                                {/* Question */}
                                                <div className="p-4 bg-gray-50">
                                                    <div className="flex items-start gap-3">
                                                        <Avatar className="h-8 w-8 bg-blue-100 text-blue-500 flex items-center justify-center">
                                                            <User size={16} />
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between mb-1">
                                                                <h4 className="font-medium text-sm">{question.user}</h4>
                                                                <span className="text-xs text-gray-500">{formatDate(new Date(question.date))}</span>
                                                            </div>

                                                            {isEditing === question.id ? (
                                                                <div className="mt-2">
                                                                    <Textarea
                                                                        value={editContent}
                                                                        onChange={(e) => setEditContent(e.target.value)}
                                                                        className="min-h-[80px] pr-14 text-sm border-gray-200 rounded-lg focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                                                                    />
                                                                    <div className="flex justify-end gap-2 mt-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                setIsEditing(null);
                                                                                setEditContent("");
                                                                            }}
                                                                        >
                                                                            Hủy
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={() => handleEditReview(question.id)}
                                                                        >
                                                                            Lưu
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-700">{question.question}</p>
                                                            )}

                                                            {/* Edit/Delete buttons - only visible to the review owner */}
                                                            {isLoggedIn && userId === question.userId && !isEditing && (
                                                                <div className="mt-2 flex justify-end gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-red-500 hover:text-red-600"
                                                                        onClick={() => handleDeleteReview(question.id)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Replies */}
                                                {question.replies.map((reply) => (
                                                    <motion.div
                                                        key={reply.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 24 }}
                                                        className="p-4 border-t border-gray-100 bg-white"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <Avatar className="h-8 w-8 bg-pink-100 text-pink-500 flex items-center justify-center">
                                                                <Store size={16} />
                                                            </Avatar>
                                                            <div className="flex-1">
                                                                <div className="flex justify-between mb-1">
                                                                    <h4 className="font-medium text-sm text-pink-500">{reply.adminName}</h4>
                                                                    <span className="text-xs text-gray-500">{formatDate(new Date(reply.date))}</span>
                                                                </div>
                                                                <p className="text-gray-700 whitespace-pre-line">{reply.content}</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}

                                                {/* Reply form - only visible when replying to this question */}
                                                <AnimatePresence>
                                                    {replyingTo === question.id && (
                                                        <motion.div
                                                            variants={replyFormVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="exit"
                                                            className="p-4 border-t border-gray-100 bg-gray-50"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <Avatar className="h-8 w-8 bg-pink-100 text-pink-500 flex items-center justify-center">
                                                                    <Store size={16} />
                                                                </Avatar>
                                                                <div className="flex-1">
                                                                    <div className="relative">
                                                                        <Textarea
                                                                            ref={replyInputRef}
                                                                            value={replyContent}
                                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                                            placeholder="Nhập câu trả lời của bạn..."
                                                                            className="min-h-[80px] pr-14 text-sm border-gray-200 rounded-lg focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                                                                        />
                                                                        <div className="absolute right-2 bottom-2 flex gap-2">
                                                                            <motion.button
                                                                                whileHover={{ scale: 1.05 }}
                                                                                whileTap={{ scale: 0.95 }}
                                                                                onClick={() => setReplyingTo(null)}
                                                                                className="text-gray-400 hover:text-gray-600 p-1"
                                                                            >
                                                                                Hủy
                                                                            </motion.button>
                                                                            <motion.button
                                                                                whileHover={{ scale: 1.05 }}
                                                                                whileTap={{ scale: 0.95 }}
                                                                                onClick={() => handleSubmitReply(question.id)}
                                                                                disabled={!replyContent.trim()}
                                                                                className="bg-pink-500 text-white p-1 px-3 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            >
                                                                                Gửi
                                                                            </motion.button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Reply button below the last reply or question if no replies */}
                                                {isAdmin && question.replies.length > 0 && (
                                                    <div className="p-3 border-t border-gray-100 bg-white">
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => setReplyingTo(question.id)}
                                                            className="w-full text-center text-sm text-pink-500 hover:text-pink-600 py-1"
                                                        >
                                                            Trả lời thêm
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {questions.length > questionsPerPage && (
                                        <motion.div
                                            variants={paginationVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="mt-8 flex justify-center items-center gap-2"
                                        >
                                            <motion.button
                                                variants={paginationItemVariants}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={goToPrevQAPage}
                                                disabled={currentQAPage === 1}
                                                className="w-10 h-10 rounded-full flex items-center justify-center border border-pink-300 text-pink-500 hover:bg-pink-50 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
                                            >
                                                <span className="sr-only">Trang trước</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="m15 18-6-6 6-6" />
                                                </svg>
                                            </motion.button>

                                            {Array.from({ length: totalQAPages }).map((_, index) => {
                                                const pageNumber = index + 1
                                                const isCurrentPage = pageNumber === currentQAPage

                                                // Show current page, first, last, and pages around current
                                                const shouldShow =
                                                    pageNumber === 1 ||
                                                    pageNumber === totalQAPages ||
                                                    (pageNumber >= currentQAPage - 1 && pageNumber <= currentQAPage + 1)

                                                // Show ellipsis for gaps
                                                if (!shouldShow) {
                                                    // Show ellipsis only once between gaps
                                                    if (pageNumber === 2 || pageNumber === totalQAPages - 1) {
                                                        return (
                                                            <motion.span
                                                                key={`qa-ellipsis-${pageNumber}`}
                                                                variants={paginationItemVariants}
                                                                className="text-gray-400 mx-1"
                                                            >
                                                                ...
                                                            </motion.span>
                                                        )
                                                    }
                                                    return null
                                                }

                                                return (
                                                    <motion.button
                                                        key={`qa-page-${pageNumber}`}
                                                        variants={paginationItemVariants}
                                                        whileHover={isCurrentPage ? {} : { scale: 1.1 }}
                                                        whileTap={isCurrentPage ? {} : { scale: 0.95 }}
                                                        onClick={() => setCurrentQAPage(pageNumber)}
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isCurrentPage
                                                            ? "bg-pink-500 text-white font-medium shadow-md"
                                                            : "border border-pink-300 text-pink-500 hover:bg-pink-50"
                                                            }`}
                                                    >
                                                        {pageNumber}
                                                    </motion.button>
                                                )
                                            })}

                                            <motion.button
                                                variants={paginationItemVariants}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={goToNextQAPage}
                                                disabled={currentQAPage === totalQAPages}
                                                className="w-10 h-10 rounded-full flex items-center justify-center border border-pink-300 text-pink-500 hover:bg-pink-50 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
                                            >
                                                <span className="sr-only">Trang tiếp</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="m9 18 6-6-6-6" />
                                                </svg>
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </motion.div>

            {/* Footer */}
            <footer className="bg-white mt-16 border-t max-w-screen-2xl mx-auto ">
                <div className="border-t border-pink-100 bg-[#FFE4EF]">
                    <div className="container mx-auto px-4 py-8">
                        {/* <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex-1 w-full max-w-xl">
                            <div className="flex gap-2">
                                <Input type="email" placeholder="Nhập Email Để Tư Vấn" className="bg-white" />
                                <Button className="bg-pink-500 hover:bg-pink-600 text-white min-w-[120px]">SUBSCRIBE</Button>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">Đăng ký để nhận được thông báo mới nhất từ T2BIKE</p>
                    </div> */}
                    </div>
                </div>

                {/* Main Footer */}
                <div className="border-t border-pink-100">
                    <div className="container mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                            {/* Column 1 - Logo & Contact */}
                            <div className="lg:col-span-1">
                                <Link href="/" className="text-3xl font-extrabold text-pink-500">
                                    T2BIKE
                                </Link>
                                <div className="mt-4 space-y-2">
                                    <h3 className="font-semibold">LIÊN HỆ</h3>
                                    <p className="text-sm text-gray-600">Số Điện Thoại: 99988765</p>
                                    <p className="text-sm text-gray-600">Email: Greengrocery9@Gmail.Com</p>
                                </div>
                                {/* Payment Methods */}
                                <div className="mt-6 flex gap-2">
                                    <Image src="/placeholder.svg?height=30&width=45" alt="Visa" width={45} height={30} className="h-8" />
                                    <Image
                                        src="/placeholder.svg?height=30&width=45"
                                        alt="Mastercard"
                                        width={45}
                                        height={30}
                                        className="h-8"
                                    />
                                </div>
                            </div>

                            {/* Column 2 - Social Media */}
                            <div>
                                <h3 className="font-semibold mb-4">MẠNG XÃ HỘI</h3>
                                <div className="space-y-3">
                                    <Link href="#" className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors">
                                        <Facebook size={20} />
                                        <span>FACEBOOK</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Column 3 - Information */}
                            <div>
                                <h3 className="font-semibold mb-4">THÔNG TIN</h3>
                                <div className="space-y-2">
                                    {["Trang chủ", "Cửa hàng", "Về chúng tôi", "FAQ", "Liên hệ"].map((item) => (
                                        <Link key={item} href="#" className="block text-gray-600 hover:text-pink-500 transition-colors">
                                            {item}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Column 4 - My Accounts */}
                            <div>
                                <h3 className="font-semibold mb-4">TÀI KHOẢN CỦA TÔI</h3>
                                <div className="space-y-2">
                                    {["Tài khoản của tôi", "Yêu thích", "Giỏ hàng"].map((item) => (
                                        <Link key={item} href="#" className="block text-gray-600 hover:text-pink-500 transition-colors">
                                            {item}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Column 5 - Categories */}
                            <div>
                                <h3 className="font-semibold mb-4">DANH MỤC SẢN PHẨM</h3>
                                <div className="space-y-2">
                                    {["Xe tay thẳng", "Xe tay cong", "Xe mini", "Xe gấp", "Quần áo", "Phụ kiện khác"].map((item) => (
                                        <Link key={item} href="#" className="block text-gray-600 hover:text-pink-500 transition-colors">
                                            {item}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-pink-100">
                    <div className="container mx-auto px-4 py-4">
                        <p className="text-center text-sm text-gray-600">Copyright © 2024 T2BIKE.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

