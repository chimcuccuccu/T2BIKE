"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  Trophy,
  Users,
  Medal,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  ChevronLeft,
  ChevronRight,
  X,
  Search, 
  Heart, 
  ShoppingCart
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { HeaderPage } from "@/components/Header/header-page"

const communityImages = [
    "/anh_cong_dong6.jpg",
    "/anh_cong_dong1.jpg",
    "/anh_cong_dong2.jpg",
    "/anh_cong_dong3.jpg",
    "/anh_cong_dong4.jpg",
    "/anh_cong_dong5.jpg",
]

const competitions = [
  {
    title: "Giải đua xe đạp tỉnh Bắc Giang mở rộng",
    description: "Giải 4 cá nhân nữ",
    images: [
      "/dua_xe_BG1.jpg",
      "/dua_xe_BG2.jpg",
      "/dua_xe_BG3.jpg",
    ],
    date: "2025",
    participants: 500,
    position: 4,
  },
  {
    title: "Giải đua xe đạp quốc tế Một đường đua hai quốc gia (Việt Nam - Trung Quốc)",
    description: "Top 4 cá nhân nữ Việt Nam",
    images: ["/anh_bome1.jpg", "/dua_xe_TQ1.jpg", "dua_xe_TQ2.jpg"],
    date: "2024",
    participants: 800,
    position: 7,
  },
  {
    title: "Giải vô địch xe đạp đường trường phong trào toàn quốc (tỉnh Hòa Bình)",
    description: "Top 7 cá nhân nữ",
    images: ["/dua_xe_HB2.jpg", "/dua_xe_HB1.jpg", "/dua_xe_HB3.jpg"],
    date: "2024",
    participants: 600,
    position: 7,
  },
  {
    title: "Giải đua xe đạp tỉnh Quảng Trị - Điểm đến hòa bình",
    description: "Gặp sự cố thủng săm xe",
    images: ["/dua_xe_QT1.jpg", "/dua_xe_QT2.jpg", "/dua_xe_QT3.jpg"],
    date: "2024",
    participants: 650,
    position: null,
  },
  {
    title: "Giải đua xe đạp thị xã Thái Hòa mở rộng",
    description: "Giải nhất cá nhân nữ",
    images: ["/dua_xe_TH2.jpg", "/dua_xe_TH4.jpg", "/dua_xe_TH3.jpg", "/dua_xe_TH1.jpg"],
    date: "2024",
    participants: 400,
    position: 1,
  },
]

const stats = [
  {
    title: "Năm kinh nghiệm",
    value: "6+",
    icon: Calendar,
  },
  {
    title: "Khách hàng",
    value: "100+",
    icon: Users,
  },
  {
    title: "Giải thưởng",
    value: "6+",
    icon: Trophy,
  },
]

export default function AboutPage() {
  const [currentCommunityImageIndex, setCurrentCommunityImageIndex] = useState(0)
  const [currentCompetitionImageIndexes, setCurrentCompetitionImageIndexes] = useState(competitions.map(() => 0))
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const nextCommunityImage = () => {
    setCurrentCommunityImageIndex((prevIndex) => (prevIndex + 1) % communityImages.length)
  }

  const prevCommunityImage = () => {
    setCurrentCommunityImageIndex((prevIndex) => (prevIndex - 1 + communityImages.length) % communityImages.length)
  }

  const nextCompetitionImage = (competitionIndex: number) => {
    setCurrentCompetitionImageIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes]
      newIndexes[competitionIndex] = (newIndexes[competitionIndex] + 1) % competitions[competitionIndex].images.length
      return newIndexes
    })
  }

  const prevCompetitionImage = (competitionIndex: number) => {
    setCurrentCompetitionImageIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes]
      newIndexes[competitionIndex] =
        (newIndexes[competitionIndex] - 1 + competitions[competitionIndex].images.length) %
        competitions[competitionIndex].images.length
      return newIndexes
    })
  }

  const openImageModal = (imageSrc: string) => {
    setSelectedImage(imageSrc)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        {/* Header */}

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-28 text-center">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10">VỀ CHÚNG TÔI</h1>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2,
                    }}
                    className="relative w-48 h-48 mx-auto mb-8 cursor-pointer"
                    onClick={() => openImageModal("/anh_bome.jpg")}
                >
                    <div className="absolute inset-0 bg-pink-200 rounded-full animate-pulse" />
                    <Image
                    src="/anh_bome.jpg"
                    alt="About Us Illustration"
                    width={192}
                    height={192}
                    className="relative z-10 rounded-full"
                    />
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-600 mb-12 mt-24"
                >
                    Chúng tôi là T2BIKE - Đơn vị tiên phong trong lĩnh vực xe đạp thể thao hàng Nhật bãi tại huyện Quế Phong - Nghệ An
                </motion.p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
                {stats.map((stat, index) => (
                    <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                    >
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-pink-500" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                    <p className="text-gray-600">{stat.title}</p>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* Image Modal */}
        <AnimatePresence>
            {selectedImage && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeImageModal}
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            >
                <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-4xl w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
                >
                <Image
                    src={selectedImage || "/placeholder.svg"}
                    alt="Enlarged image"
                    fill
                    className="object-contain"
                />
                <button
                    onClick={closeImageModal}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>

        {/* Owners Profile Section */}
        <section className="container mx-auto px-4 py-16">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto space-y-16"
            >
                {/* Husband's Profile */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl"
                            onClick={() => openImageModal("/anh_bo.JPG")}
                        >
                            <Image  
                                src="/anh_bo.JPG" 
                                alt="Nguyễn Hồng Tư - Đồng sáng lập T2BIKE" 
                                width={500} // Kích thước tùy chỉnh
                                height={600} 
                                className="object-cover scale-125 transform -translate-y-28 -translate-x"
                            />
                        </motion.div>
                    </motion.div>

                    <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-6"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-4"
                        >
                            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                                NGUYỄN HỒNG TƯ
                            </h2>
                            <p className="text-2xl text-blue-500 font-semibold">Đồng sáng lập T2BIKE</p>
                            <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="text-gray-600 leading-relaxed text-xl"
                            >
                                Nếu ghé qua cửa hàng xe đạp này, bạn sẽ dễ dàng bắt gặp hình ảnh một người đàn ông tỉ mỉ
                                chỉnh từng con ốc, căng lại sợi nan hoa, thỉnh thoảng lại giải thích cho khách hàng vì
                                sao “bánh xe này lướt nhanh hơn” hay “khung xe này giảm rung tốt hơn.” Đó chính là tôi,
                                Nguyễn Hồng Tư, "ông thợ chính" của tiệm, đồng thời cũng là một giáo viên Vật Lý lâu năm kiêm Phó hiệu 
                                trưởng trường THPT Quế Phong. Tôi luôn yêu thích việc tìm hiểu và ứng dụng các nguyên lý 
                                khoa học vào thực tế. Từ nhỏ, tôi đã có sở thích sửa chữa, nâng cấp các vật dụng cơ khí và 
                                niềm đam mê này theo năm tháng vẫn không hề thay đổi. Với hơn 6 năm kinh nghiệm trong lĩnh 
                                vực xe đạp thể thao, tôi đam mê việc mang đến những sản phẩm chất lượng cao và dịch vụ tận 
                                tâm cho cộng đồng yêu xe đạp. Tại T2BIKE, chúng tôi không chỉ bán xe đạp, mà còn chia sẻ 
                                niềm đam mê và kiến thức chuyên sâu về xe đạp với khách hàng.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Wife's Profile */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl"
                            onClick={() => openImageModal("/anh_me.JPG")}
                        >
                            <Image  
                                src="/anh_me.JPG" 
                                alt="Trương Thị Thủy - Đồng sáng lập T2BIKE" 
                                width={500} // Kích thước tùy chỉnh
                                height={600} 
                                className="object-cover scale-125 transform -translate-y-28"
                            />
                        </motion.div>
                    </motion.div>

                    <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-6 md:order-first"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-4"
                        >
                            
                            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                            TRƯƠNG THỊ THỦY
                            </h2>
                            <p className="text-2xl text-pink-500 font-semibold">Đồng sáng lập T2BIKE</p>
                            <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="text-gray-600 leading-relaxed text-xl"
                            >
                                Cũng là một giáo viên Vật Lý, nhưng ngoài công việc giảng dạy, tôi còn có niềm đam mê rất lớn với 
                                các môn thể thao ngay từ khi còn đang cắp sách đến trường, những năm gần đây tôi đã bén duyên với 
                                môn thể thao mới, đó là đua xe đạp. Hiểu được giá trị của một chiếc xe tốt đối với việc rèn luyện, 
                                tôi luôn tìm kiếm những sản phẩm phù hợp cho từng nhu cầu. Với sự nhạy bén trong kinh doanh và marketing,
                                tôi đảm nhiệm việc phát triển thương hiệu, giúp cửa hàng kết nối với nhiều khách hàng hơn.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </div>
                
                <div className="grid justify-center items-center text-center text-gray-600 text-xl gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="relative h-[500px] rounded-2xl justify-center overflow-hidden shadow-2xl"
                                onClick={() => openImageModal("/anh_bome1.jpg")}
                            >
                                <Image  
                                    src="/anh_bome1.jpg" 
                                    alt="Trương Thị Thủy - Đồng sáng lập T2BIKE" 
                                    width={800} // Kích thước tùy chỉnh
                                    height={1200} 
                                    className="object-cover scale-150 transform -translate-y-36 translate-x-48"
                                />
                            </motion.div>
                    </motion.div>
                    <p>
                    Từ sự kết hợp hoàn hảo giữa kiến thức khoa học của Hồng Tư và niềm đam mê thể thao của Trương Thủy,
                    hai vợ chồng chúng tôi quyết định mở cửa hàng xe đạp thể thao hàng Nhật bãi. Ở đây, khách hàng không 
                    chỉ mua xe, mà còn được chúng tôi tư vấn tận tình về cách chọn xe, cách tập luyện, cách bảo dưỡng xe để
                    bền bỉ theo năm tháng. Cửa hàng dần trở thành một điểm hẹn cho những ai yêu thích xe đạp, muốn tìm hiểu về xe, 
                    hay đơn giản là muốn trò chuyện về những cung đường đẹp.
                    </p>
                    <p>
                        🚴‍♂️ Nếu bạn đang tìm kiếm một chiếc xe đạp chất lượng hoặc muốn có một nơi để chia sẻ đam mê đạp xe, hãy ghé 
                        qua cửa hàng T2BIKE – nơi mỗi chiếc xe đều được lựa chọn và chăm sóc bằng cả kinh nghiệm, tâm huyết và tình yêu! 🚀
                    </p>
                </div>

                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center space-y-6"
                >
                    <h3 className="text-2xl font-bold text-gray-800">Liên hệ với chúng tôi</h3>
                    <div className="flex justify-center space-x-8">
                        {[
                            { Icon: MapPin, text: "123 Đường ABC, Quận XYZ, Hà Nội" },
                            { Icon: Phone, text: "+84 123 456 789" },
                            { Icon: Mail, text: "contact@t2bike.com" },
                        ].map(({ Icon, text }, index) => (
                            <motion.div key={index} whileHover={{ y: -5 }} className="flex items-center gap-2 text-gray-700">
                            <Icon className="w-5 h-5 text-pink-500" />
                            <span>{text}</span>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-center space-x-4">
                    {[Facebook, Instagram, Youtube].map((Icon, index) => (
                        <motion.a
                        key={index}
                        whileHover={{ y: -5, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        href="#"
                        className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center shadow-lg hover:bg-pink-200 transition-colors"
                        >
                        <Icon className="w-5 h-5 text-pink-500" />
                        </motion.a>
                    ))}
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                            Liên hệ ngay
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
      </section>

      {/* Community Images Slider */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Cộng đồng đạp xe của chúng tôi</h2>
          <div className="relative">
            <div className="overflow-hidden rounded-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCommunityImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative aspect-video"
                >
                  <Image
                    src={communityImages[currentCommunityImageIndex] || "/placeholder.svg"}
                    alt={`Community Image ${currentCommunityImageIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <button
              onClick={prevCommunityImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={nextCommunityImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {communityImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCommunityImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentCommunityImageIndex ? "bg-pink-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </section>

        {/* Competitions Section */}
        <section className="container mx-auto px-4 py-16">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
            >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Các giải đua xe đạp đã tham gia</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
                Chúng tôi tự hào về những thành tích đã đạt được trong các giải đấu lớn nhỏ trên khắp cả nước
            </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competitions.map((competition, competitionIndex) => (
                <motion.div
                key={competition.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + competitionIndex * 0.1 }}
                >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div
                    className="relative h-48 cursor-pointer"
                    onClick={() => openImageModal(competition.images[currentCompetitionImageIndexes[competitionIndex]])}
                    >
                    <AnimatePresence mode="wait">
                        <motion.div
                        key={currentCompetitionImageIndexes[competitionIndex]}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                        >
                        <Image
                            src={competition.images[currentCompetitionImageIndexes[competitionIndex]] || "/placeholder.svg"}
                            alt={competition.title}
                            fill
                            className="object-cover"
                        />
                        </motion.div>
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-2">{competition.title}</h3>
                        <p className="text-white/90">{competition.description}</p>
                    </div>
                    <button
                        onClick={(e) => {
                        e.stopPropagation()
                        prevCompetitionImage(competitionIndex)
                        }}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-800" />
                    </button>
                    <button
                        onClick={(e) => {
                        e.stopPropagation()
                        nextCompetitionImage(competitionIndex)
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-gray-800" />
                    </button>
                    </div>
                    <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                        <Calendar className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                        <p className="text-sm text-gray-600">{competition.date}</p>
                        </div>
                        <div className="text-center">
                        <Users className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                        <p className="text-sm text-gray-600">{competition.participants}</p>
                        </div>
                        <div className="text-center">
                        <Medal className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                        <p className="text-sm text-gray-600">Top {competition.position}</p>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                </motion.div>
            ))} 
            </div>
        </section>


        {/* Values Section */}
        <section className="container mx-auto px-4 py-16">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg"
            >
            <h2 className="text-3xl font-bold text-center mb-8">Giá trị cốt lõi</h2>
            <div className="grid md:grid-cols-2 gap-8">
                {[
                {
                    title: "Chất lượng",
                    description: "Chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất lượng cao nhất cho khách hàng",
                },
                {
                    title: "Uy tín",
                    description: "Xây dựng niềm tin với khách hàng thông qua sự minh bạch và trách nhiệm trong kinh doanh",
                },
                {
                    title: "Đổi mới",
                    description: "Không ngừng cập nhật và áp dụng những công nghệ mới nhất trong lĩnh vực xe đạp",
                },
                {
                    title: "Tận tâm",
                    description: "Luôn lắng nghe và hỗ trợ khách hàng một cách nhiệt tình, chu đáo nhất",
                },
                ].map((value, index) => (
                <motion.div
                    key={value.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="space-y-4"
                >
                    <h3 className="text-xl font-semibold text-pink-500">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                </motion.div>
                ))}
            </div>
            </motion.div>
        </section>
        
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

