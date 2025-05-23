"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, ShoppingCart, DollarSign, TrendingUp, Users } from "lucide-react"
import { getDashboardData, AdminDashboardResponse } from "@/services/dashboard"
import { useToast } from "@/hooks/use-toast"

type StatCardProps = {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
  delay: number
}

const StatCard = ({ title, value, icon, color, delay }: StatCardProps) => (
  <motion.div
    className="bg-pink-50 rounded-xl p-4 shadow-sm"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(240, 143, 179, 0.1)" }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-600 mb-1">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
    </div>
  </motion.div>
)

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function DashboardContent() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData()
        setDashboardData(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div>
      <motion.h2
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        Bảng điều khiển
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <StatCard
          title="Tổng sản phẩm"
          value={dashboardData?.totalProducts || 0}
          icon={<Package className="h-6 w-6 text-blue-500" />}
          color="bg-blue-100"
          delay={0.1}
        />

        <StatCard
          title="Tổng đơn hàng"
          value={dashboardData?.totalOrders || 0}
          icon={<ShoppingCart className="h-6 w-6 text-pink-500" />}
          color="bg-pink-100"
          delay={0.2}
        />

        <StatCard
          title="Doanh thu"
          value={formatCurrency(dashboardData?.totalRevenue || 0)}
          icon={<DollarSign className="h-6 w-6 text-yellow-500" />}
          color="bg-yellow-100"
          delay={0.3}
        />

        {/* <StatCard
          title="Tăng trưởng"
          value={0}
          icon={<TrendingUp className="h-6 w-6 text-purple-500" />}
          color="bg-purple-100"
          delay={0.4}
        /> */}

        <StatCard
          title="Tổng số người dùng"
          value={dashboardData?.totalUsers || 0}
          icon={<Users className="h-6 w-6 text-green-500" />}
          color="bg-green-100"
          delay={0.5}
        />
      </motion.div>
    </div>
  )
}

