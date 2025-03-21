"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useParams } from "next/navigation"
import axios from "axios"
import { Product } from "@/types/product"
import { ProductAttribute } from "@/types/product-attribute"
import { TabsContent } from "./ui/tabs"

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

    const midIndex = Math.ceil((product?.attributes?.length ?? 0) / 2);
    const leftColumn = product?.attributes?.slice(0, midIndex) ?? [];
    const rightColumn = product?.attributes?.slice(midIndex) ?? [];

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

            <TabsContent value="specs" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cột 1 */}
              <div>
                <table className="w-full border-collapse">
                  <tbody>
                    {leftColumn.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 text-gray-500">{item.attributeName}</td>
                        <td className="py-2 font-medium">{item.attributeValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cột 2 */}
              <div>
                <table className="w-full border-collapse">
                  <tbody>
                    {rightColumn.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 text-gray-500">{item.attributeName}</td>
                        <td className="py-2 font-medium">{item.attributeValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </motion.div>
    </div>
  )
}

