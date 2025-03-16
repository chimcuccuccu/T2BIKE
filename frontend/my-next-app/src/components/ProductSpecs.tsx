"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useParams } from "next/navigation"
import axios from "axios"
import { Product } from "@/types/product"
import { ProductAttribute } from "@/types/product-attribute"

export default function ProductSpecs() {
    const [product, setProduct] = useState<Product | null>(null);
    const searchParams = useParams();
    const id = searchParams.id;
    console.log("ID từ URL:", id);

    useEffect(() => {
        if (id) {
        axios.get(`http://localhost:8081/api/product-attributes/attributes/${id}`) // Gửi request đến BE
            .then(response => {
            console.log("Dữ liệu từ API:", response.data);
            setProduct(response.data); // Lưu dữ liệu sản phẩm
            console.log("Danh sách attributes:", response.data.attributes);
            })
            .catch(error => {
            console.error("❌ Lỗi khi lấy dữ liệu sản phẩm:", error.response?.data || error.message);
            });
        }
    }, [id]); // Chạy lại khi ID thay đổi

    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: true, amount: 0.2 })

    return (
        <div className="p-6" ref={containerRef}>
        <motion.h2
            className="text-xl font-bold text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
        >
            Thông số kỹ thuật
        </motion.h2>
        <motion.div
            className="overflow-hidden rounded-lg border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
        >
            {product?.attributes?.map((attr, index) => (
            <motion.div
                key={index}
                className={`grid grid-cols-2 ${index % 2 === 1 ? "bg-pink-50" : "bg-white"}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                transition={{ delay: 0.1 * (index + 1) }}
                whileHover={{ backgroundColor: index % 2 === 1 ? "rgb(253, 232, 242)" : "rgb(249, 250, 251)",
                transition: { duration: 0 } 
                }}
            >
                <div className="p-4 font-medium border-r border-gray-200">{attr.attributeName}</div>
                <div className="p-4">{attr.attributeValue}</div>
            </motion.div>
            ))}
        </motion.div>
    </div>
  )
}

