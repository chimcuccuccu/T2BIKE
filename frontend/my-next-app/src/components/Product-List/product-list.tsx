"use client";

import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import FormatPrice from "@/components/ui/FormatPrice";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProductCard } from "./product-card";

interface ProductListProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  isFiltered: boolean;
  onPageChange: (page: number) => void;
}

export function ProductList({
  products,
  currentPage,
  totalPages,
  isFiltered,
  onPageChange,
}: ProductListProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [addedProducts, setAddedProducts] = useState<number[]>([]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedProducts((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedProducts((prev) => prev.filter((id) => id !== product.id));
    }, 1000);

    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name} đã được thêm vào giỏ hàng của bạn.`,
    });
  };

  return (
    <div className="flex-1">
      <h2 className="text-2xl font-bold mb-4">
        {isFiltered ? "Kết quả lọc" : "Tất cả sản phẩm"}
      </h2>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/dog.gif"
            alt="Loading Dog"
            width={150}
            height={150}
            className="mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Hiện tại chưa có sản phẩm nào!
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className="px-4 py-2 mx-1 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          disabled={currentPage === 1}
        >
          Trước
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={`px-4 py-2 mx-1 rounded-lg transition-colors ${
              currentPage === i + 1
                ? "bg-pink-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className="px-4 py-2 mx-1 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          disabled={currentPage === totalPages}
        >
          Sau
        </Button>
      </div>
    </div>
  );
}