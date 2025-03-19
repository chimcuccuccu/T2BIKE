"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Search, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function UsersContent() {
  const [users] = useState([])

  return (
    <div>
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold flex items-center">
          <Users className="mr-2 h-6 w-6 text-pink-500" />
          Quản lý người dùng
        </h2>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Plus className="mr-2 h-4 w-4" /> Thêm người dùng
        </Button>
      </motion.div>

      <motion.div
        className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm người dùng..."
            className="pl-10 border-gray-200 focus:border-pink-300 focus:ring-pink-200"
          />
        </div>
        <Button variant="outline" className="border-gray-200 text-gray-600">
          <Filter className="mr-2 h-4 w-4" /> Lọc
        </Button>
      </motion.div>

      {users.length > 0 ? (
        <motion.div
          className="bg-white rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Users list would go here */}
        </motion.div>
      ) : (
        <motion.div
          className="bg-white rounded-xl shadow-sm p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-pink-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">Chưa có người dùng nào</h3>
          <p className="text-gray-500 mb-6">Bắt đầu bằng cách thêm người dùng đầu tiên</p>
          <Button className="bg-pink-500 hover:bg-pink-600">
            <Plus className="mr-2 h-4 w-4" /> Thêm người dùng
          </Button>
        </motion.div>
      )}
    </div>
  )
}

