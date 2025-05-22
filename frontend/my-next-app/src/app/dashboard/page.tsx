"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Package, ShoppingCart, Users, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import OrdersContent from "@/components/dashboard/contents/OrdersContent"
import DashboardContent from "@/components/dashboard/contents/DashboardContent"
import ProductsContent from "@/components/dashboard/contents/ProductContent"
import UsersContent from "@/components/dashboard/contents/UsersContent"
import SettingsContent from "@/components/dashboard/contents/SettingsContent"
import { MenuItem } from "@/types/menu-item"
import { HeaderPage } from "@/components/Header/header-page"

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dashboardActiveItem') || "dashboard"
    }
    return "dashboard"
  })

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Trang chủ",
      icon: <Home className="h-5 w-5" />,
      content: <DashboardContent />,
    },
    {
      id: "products",
      label: "Sản phẩm",
      icon: <Package className="h-5 w-5" />,
      content: <ProductsContent />,
    },
    {
      id: "orders",
      label: "Đơn hàng",
      icon: <ShoppingCart className="h-5 w-5" />,
      content: <OrdersContent />,
    },
    {
      id: "users",
      label: "Người dùng",
      icon: <Users className="h-5 w-5" />,
      content: <UsersContent />,
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: <Settings className="h-5 w-5" />,
      content: <SettingsContent />,
    },
  ]

  const handleMenuClick = (id: string) => {
    setActiveItem(id)
    localStorage.setItem('dashboardActiveItem', id)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-pink-100">
          <div className="p-6 bg-gradient-to-r from-pink-100 to-pink-50">
            <h1 className="text-3xl font-bold text-pink-500">Admin Site</h1>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 p-4 border-r border-pink-100">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    className={cn(
                      "flex items-center w-full px-4 py-3 rounded-xl text-left transition-all",
                      activeItem === item.id ? "bg-pink-500 text-white" : "bg-pink-50 text-gray-700 hover:bg-pink-100",
                    )}
                    onClick={() => handleMenuClick(item.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                    {activeItem === item.id && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        layoutId="activeBackground"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {menuItems.find((item) => item.id === activeItem)?.content}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

