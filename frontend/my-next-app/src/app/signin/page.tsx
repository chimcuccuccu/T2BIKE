"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFCDE2] to-[#FCFCF7] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative p-8 md:p-12 bg-pink-100 flex flex-col justify-center animate-fade-right"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-pink-500 tracking-tight">T2BIKE</h1>
            <p className="text-xl md:text-2xl text-gray-600">Tư Thủy Bike - theo đuổi đam mê</p>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 md:p-12 flex flex-col justify-center animate-fade-left"
        >
          <div className="w-full max-w-md mx-auto space-y-6">
            {/* Google Sign In Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 ease-in-out"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Đăng nhập với Google</span>
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">hoặc</span>
              </div>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Số di động hoặc email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring-pink-500 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring-pink-500 transition-all duration-200"
                />
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="w-full bg-pink-500 hover:bg-pink-600 font-semibold text-white py-3 rounded-lg transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "    Đang đăng nhập..." : "ĐĂNG NHẬP"}
                </Button>
              </motion.div>

              <div className="text-center">
                <a href="#" className="text-sm text-pink-500 hover:text-pink-600 transition-colors">
                  Quên mật khẩu?
                </a>
              </div>
            </form>

            <div className="pt-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        variant="outline"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white border-none py-3 rounded-lg transition-all duration-200"
                    >
                        <a href="/signup">
                            Tạo tài khoản mới
                        </a>
                    </Button>
                </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}