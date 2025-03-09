"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Product } from "@/types/product";

const ProductAttributes = () => {
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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-gray-50 flex items-center justify-center">
            <Image
              src={product?.imageUrl || "/placeholder.svg?height=400&width=400"}
              alt={product?.name || "Product image"}
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product?.name}</h1>

          <div className="text-2xl font-bold text-gray-900">{product?.price.toLocaleString("vi-VN")} VNĐ</div>

          {product?.description && (
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
          )}

          <div className="space-y-4">
            <button className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-all duration-300">
              Mua ngay
            </button>
            <button className="w-full py-3 bg-yellow-400 text-gray-800 rounded-md hover:bg-yellow-500 transition-all duration-300">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>

      {/* Product Specifications */}
      {product?.attributes && product?.attributes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Thông số kỹ thuật</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
              {product?.attributes?.map((attr, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 border-b font-medium">{attr?.attributeName || "Không có dữ liệu"}</td>
                  <td className="py-3 px-4 border-b">{attr?.attributeValue || "Không có dữ liệu"}</td>
                </tr>
              ))}

              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAttributes;