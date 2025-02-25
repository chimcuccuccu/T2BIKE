"use client"

import { motion } from 'framer-motion';

import Image from "next/image"
import Link from "next/link"
import { Facebook, Heart, Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQSection() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <motion.h1
            initial={{ opacity: 0, y: -50 }} // Bắt đầu mờ và cao hơn vị trí ban đầu
            animate={{ opacity: 1, y: 0 }}   // Hiện dần và di chuyển xuống vị trí đúng
            transition={{ duration: 1, ease: "easeOut" }} // Hiệu ứng mượt hơn
            >
                <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
                    <div className="container mx-auto px-24 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/home" className="text-3xl font-extrabold text-pink-500">
                                T2BIKE
                            </Link>

                            <nav className="hidden md:flex items-center space-x-9">
                                <Link href="/home" className="text-black hover:text-pink-500 transition-colors font-bold">
                                    Trang chủ
                                </Link>

                                <Link href="/all-products" className="text-black hover:text-pink-500 transition-colors font-bold">
                                    Cửa hàng
                                </Link>

                                <Link href="/about" className="text-black hover:text-pink-500 transition-colors font-bold">
                                    Về chúng tôi
                                </Link>
                                
                                <Link href="/faq" className="text-black hover:text-pink-500 transition-colors font-bold">
                                    FAQ
                                </Link>

                                <Link href="/contact" className="text-black hover:text-pink-500 transition-colors font-bold">
                                    Liên hệ
                                </Link>
                            </nav>

                            <div className="flex items-center space-x-4">
                            <div className="relative hidden md:block w-64">
                                <Input type="search" placeholder="Tìm kiếm..." className="pl-10 pr-4" />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                            <button className="p-2 hover:text-pink-500 transition-colors">
                                <Heart className="h-6 w-6" />
                            </button>
                            <button className="p-2 hover:text-pink-500 transition-colors">
                                <ShoppingCart className="h-6 w-6" />
                            </button>
                            <div className='border-2 border-gray-400 p-1.5'>
                                <Link href="/signin" className="text-black hover:text-pink-500 transition-colors">
                                Đăng nhập
                                </Link>
                            </div>
                            <Link href="/signup" className="text-black hover:text-pink-500 transition-colors">
                                Đăng ký
                            </Link>
                            </div>
                        </div>
                    </div>
                </header>
            </motion.h1>

            {/* Main */}
            <div className="container mx-auto p-6 bg-gradient-to-b from-pink-50 to-white min-h-screen"> 
                <h1 className="mt-20 text-4xl md:text-5xl font-bold text-center mb-10">
                    MỘT SỐ CÂU HỎI THƯỜNG GẶP
                </h1>

                {/* Question */}
                <Accordion type="single" collapsible className="grid space-y-4 w-5/6 mx-auto">
                    <AccordionItem value="item-0" className="border rounded-xl shadow-sm bg-white px-10"> 
                        <AccordionTrigger className="text-pink-500 font-bold text-2xl hover:text-pink-600 hover:no-underline">
                            Tại sao nên đạp xe?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-xl pb-4">
                        Đạp xe mang lại nhiều lợi ích cho sức khỏe và cuộc sống, bao gồm:
                            <li>Cải thiện sức khỏe tim mạch – Giúp giảm nguy cơ bệnh tim, huyết áp cao và đột quỵ.</li>
                            <li>Tăng cường cơ bắp và xương khớp – Phát triển cơ chân, đùi, bắp chân và giảm nguy cơ loãng xương.</li>
                            <li>Hỗ trợ giảm cân – Đốt cháy calo hiệu quả, giúp kiểm soát cân nặng.</li>
                            <li>Giảm căng thẳng, cải thiện tâm trạng – Kích thích sản sinh endorphin giúp tinh thần sảng khoái, giảm stress.</li>
                            <li>Tốt cho hệ hô hấp – Tăng cường dung tích phổi, cải thiện sức bền.</li>
                            <li>TIết kiệm chi phí, bảo vệ môi trường – Giảm sử dụng nhiên liệu, hạn chế khí thải và kẹt xe.</li>
                            Nhiều khách hàng yêu quý của T2BIKE đã cải thiện gần như hoàn toàn bệnh thoái hóa khớp gối nhờ rèn luyện
                            <br/>đạp xe mỗi ngày ♥️♥️♥️
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-1" className="border rounded-xl shadow-sm bg-white px-10"> 
                        <AccordionTrigger className="text-pink-500 font-bold text-2xl hover:text-pink-600 hover:no-underline">
                            Xe đạp thể thao hàng Nhật bãi là gì?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-xl pb-4">
                            Xe đạp thể thao Nhật bãi là những chiếc xe đạp đã qua sử dụng được nhập khẩu từ Nhật Bản. Những xe này
                            thường có chất lượng tốt, độ bền cao và được bảo quản cẩn thận.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border rounded-xl shadow-sm bg-white px-10"> 
                        <AccordionTrigger className="text-pink-500 font-bold text-2xl hover:text-pink-600 hover:no-underline">
                            Vì sao xe đạp thể thao hàng Nhật bãi được ưa chuộng?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-xl pb-4">
                            Xe đạp Nhật bãi được ưa chuộng vì chất lượng cao, độ bền tốt, giá cả hợp lý so với xe mới. Ngoài ra, người
                            Nhật có thói quen bảo quản xe cẩn thận nên xe thường trong tình trạng tốt.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border rounded-xl shadow-sm bg-white px-10"> 
                        <AccordionTrigger className="text-pink-500 font-bold text-2xl hover:text-pink-600 hover:no-underline">
                            Xe đạp thể thao hàng Nhật bãi có bền không?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-xl pb-4">
                            Xe đạp Nhật bãi nổi tiếng với độ bền cao nhờ khung sườn chắc chắn, linh kiện chất lượng và quy trình sản xuất nghiêm ngặt.
                            Nếu được bảo dưỡng đúng cách, xe có thể sử dụng trong nhiều năm mà không gặp vấn đề lớn. Những khách hàng yêu quý đã mua xe
                            ở T2BIKE và thời gian sử dụng đã lên đến đơn vị tính bằng năm nhưng xe vẫn bền và đạp rất tốt.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4" className="border rounded-xl shadow-sm bg-white px-10"> 
                        <AccordionTrigger className="text-pink-500 font-bold text-2xl hover:text-pink-600 hover:no-underline">
                            Giá xe đạp thể thao hàng Nhật bãi khoảng bao nhiêu?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-xl pb-4">
                            Giá dao động từ 2 triệu - 50 triệu VNĐ, tùy vào thương hiệu, tình trạng xe, và dòng xe. 
                            Xe cao cấp hoặc còn mới thường có giá cao hơn.
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-5" className="border rounded-xl shadow-sm bg-white px-10"> 
                        <AccordionTrigger className="text-pink-500 font-bold text-2xl hover:text-pink-600 hover:no-underline">
                            Ai nên chọn xe đạp thể thao Nhật Bãi?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-xl pb-4">
                            Xe đạp Nhật bãi phù hợp với những người muốn sở hữu xe đạp chất lượng cao, bền bỉ, với giá cả hợp lý, vừa túi tiền,
                            người mới tập đi xe đạp thể thao, hoặc những người đam mê xe đạp vintage Nhật Bản.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6" className="border rounded-xl shadow-sm bg-white px-10"> 
                        <AccordionTrigger className="text-pink-500 font-bold text-2xl hover:text-pink-600 hover:no-underline">
                            Chính sách bảo hành của T2BIKE như thế nào?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-xl pb-4">
                            Vì là thợ "nhà trồng được" nên quý khách yên tâm gửi gắm chiếc xe yêu quý của mình đến cửa hàng mỗi khi xe có trục trặc nhé,
                            nhưng nghề chính của chúng tôi vẫn là đi dạy nên đôi khi thời gian sửa chữa và bảo hành sẽ không nhanh như mong muốn!
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Footer */}
        <motion.footer
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white mt-16 border-t max-w-screen-2xl mx-auto"
        >
        <div className="border-t border-pink-100 bg-[#FFE4EF]">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full max-w-xl">
                    <div className="flex gap-2">
                    <Input type="email" placeholder="Nhập Email Để Tư Vấn" className="bg-white" />
                    <Button className="bg-pink-500 hover:bg-pink-600 text-white min-w-[120px]">SUBSCRIBE</Button>
                    </div>
                </div>
                <p className="text-gray-600 text-sm">Đăng ký để nhận được thông báo mới nhất từ T2BIKE</p>
                </div>
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
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors"
                            >
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
        </motion.footer>
    </div>   
    )
}