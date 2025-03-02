// "use client"
// import Link from "next/link"
// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, Heart, ShoppingCart, ArrowLeft} from "lucide-react"
// export default function PaymentInfo() {
//     return (
//         <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
//             {/* Header */}
//             <motion.h1
//                 initial={{ opacity: 0, y: -50 }} // Bắt đầu mờ và cao hơn vị trí ban đầu
//                 animate={{ opacity: 1, y: 0 }}   // Hiện dần và di chuyển xuống vị trí đúng
//                 transition={{ duration: 1, ease: "easeOut" }} // Hiệu ứng mượt hơn
//                 >
//                 <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
//                     <div className="container mx-auto px-24 py-4">
//                         <div className="flex items-center justify-between">s
//                             <Link href="/home" className="text-3xl font-extrabold text-pink-500">
//                             T2BIKE
//                             </Link>

//                             <nav className="hidden md:flex items-center space-x-9">
//                                             <Link href="/home" className="text-black hover:text-pink-500 transition-colors font-bold">
//                                 Trang chủ
//                             </Link>
//                             <Link href="/all-products" className="text-black hover:text-pink-500 transition-colors font-bold">
//                                 Cửa hàng
//                             </Link>
//                             <Link href="/about" className="text-black hover:text-pink-500 transition-colors font-bold">
//                                 Về chúng tôi
//                             </Link>
//                             <Link href="/faq" className="text-black hover:text-pink-500 transition-colors font-bold">
//                                 FAQ
//                             </Link>
//                             <Link href="/contact" className="text-black hover:text-pink-500 transition-colors font-bold">
//                                 Liên hệ
//                             </Link>
//                             </nav>

//                             <div className="flex items-center space-x-4">
//                             <div className="relative hidden md:block w-64">
//                                 <Input type="search" placeholder="Tìm kiếm..." className="pl-10 pr-4" />
//                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                             </div>
//                             <button className="p-2 hover:text-pink-500 transition-colors">
//                                 <Heart className="h-6 w-6" />
//                             </button>
//                             <button className="p-2 hover:text-pink-500 transition-colors">
//                                 <ShoppingCart className="h-6 w-6" />
//                             </button>
//                             <div className="border-2 border-gray-400 p-1.5">
//                                     <Link href="/signin" className="text-black hover:text-pink-500 transition-colors">
//                                     Đăng nhập
//                                     </Link>
//                             </div>
//                             <Link href="/about" className="text-black hover:text-pink-500 transition-colors">
//                                 Đăng ký
//                             </Link>
//                             </div>
//                         </div>
//                     </div>
//                 </header>
//             </motion.h1>

//             {/* Main Content */}
//       <main className="max-w-3xl mx-auto p-4 pt-6">
//         <motion.div
//           className="bg-white rounded-2xl shadow-md p-6 mb-6"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="flex items-center mb-6">
//             <Link href="#" className="text-pink-500">
//               <ArrowLeft className="h-5 w-5" />
//             </Link>
//             <h2 className="text-center flex-1 font-medium">Thanh toán</h2>
//           </div>

//           {/* Progress Steps */}
//           <div className="grid grid-cols-2 gap-4 mb-6">
//             <div className="bg-pink-100 rounded-full py-2 px-4 text-center text-pink-500 text-sm">
//               1. Thông tin giao hàng
//             </div>
//             <motion.div
//               className="bg-pink-500 rounded-full py-2 px-4 text-center text-white text-sm"
//               initial={{ scale: 0.95 }}
//               animate={{ scale: 1 }}
//               transition={{
//                 repeat: Number.POSITIVE_INFINITY,
//                 repeatType: "reverse",
//                 duration: 1.5,
//               }}
//             >
//               2. Thanh toán
//             </motion.div>
//           </div>

//           {/* Note Input */}
//           <div className="mb-4 relative">
//             <input
//               type="text"
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               placeholder="Nhập mã giảm giá hoặc ghi chú đơn hàng"
//               className="w-full border rounded-lg py-2 px-3 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
//             />
//             <button className="absolute right-1 top-1 bg-pink-500 text-white rounded-lg px-3 py-1 text-xs hover:bg-pink-600 transition-colors">
//               Áp dụng
//             </button>
//           </div>

//           {/* Order Summary */}
//           <motion.div
//             className="bg-pink-50 rounded-xl p-4 mb-6"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//           >
//             <motion.div variants={itemVariants} className="flex justify-between text-sm mb-2">
//               <span className="text-gray-600">Số lượng sản phẩm:</span>
//               <span className="font-medium">01</span>
//             </motion.div>
//             <motion.div variants={itemVariants} className="flex justify-between text-sm mb-2">
//               <span className="text-gray-600">Tiền hàng thanh toán:</span>
//               <span className="font-medium">15.000.000₫</span>    
//             </motion.div>
//             <motion.div variants={itemVariants} className="flex justify-between text-sm mb-2">
//               <span className="text-gray-600">Phí vận chuyển:</span>
//               <span className="font-medium">Miễn phí</span>
//             </motion.div>
//             <motion.div variants={itemVariants} className="flex justify-between font-medium pt-2 border-t">
//               <span>Tổng tiền:</span>
//               <span className="text-pink-500">15.000.000₫</span>
//             </motion.div>
//           </motion.div>
//         </motion.div>

//         {/* Shipping Information */}
//         <motion.div
//           className="bg-white rounded-2xl shadow-md p-6 mb-6"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-medium">Thanh toán khi nhận hàng</h3>
//             <button className="text-pink-500 text-sm flex items-center">
//               Thay đổi <ChevronRight className="h-4 w-4" />
//             </button>
//           </div>

//           <div className="space-y-3">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-600">Khách hàng:</span>
//               <span>Chimmcucxu</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-600">Số điện thoại:</span>
//               <span>0123456789</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-600">Email:</span>
//               <span>helloworld@me</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-600">Người nhận tại:</span>
//               <span>Quế Phong, Nghệ An</span>
//             </div>
//           </div>
//         </motion.div>

//         {/* Total and Checkout Button */}
//         <motion.div
//           className="bg-white rounded-2xl shadow-md p-6"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//         >
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-medium">Tổng tiền thanh toán:</h3>
//             <span className="text-pink-500 font-bold text-lg">15.000.000₫</span>
//           </div>

//           <motion.button
//             className="w-full bg-pink-500 text-white rounded-xl py-3 font-medium hover:bg-pink-600 transition-colors"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             Thanh toán
//           </motion.button>
//         </motion.div>
//       </main>

//         </div>
        
//     )
// }