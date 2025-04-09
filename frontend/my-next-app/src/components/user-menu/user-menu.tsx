"use client"

import { useState, useRef, useEffect } from "react"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { AnimatePresence } from "framer-motion"
import { motion } from "framer-motion"
import { User } from "lucide-react"

interface UserMenuProps {
  username: string
  fullName: string
}

export function UserMenu({ username, fullName }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/users/logout", {
        method: "POST",
        credentials: "include", 
      })
  
      if (res.ok) {
        // Đăng xuất thành công => chuyển về trang chủ
        window.location.href = "/home"
      } else {
        console.error("Đăng xuất thất bại")
      }
    } catch (error) {
      console.error("Lỗi khi gọi API logout:", error)
    }
  }
  

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>


      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-pink-400 text-white font-medium shadow-sm hover:shadow-md transition-all"
        >
          <span className="text-md">Hi, {username}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-lg border border-pink-100 overflow-hidden z-50"
            >
              <div className="p-4 bg-gradient-to-r from-pink-50 to-white border-b border-pink-100">
                <p className="text-sm font-medium text-pink-600">Xin chào!</p>
                <p className="text-gray-700 font-medium">{fullName}</p>
              </div>

              <div className="p-2">
                <button className="flex w-full items-center gap-3 px-4 py-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors">
                  <User className="w-5 h-5 text-pink-500" />
                  <span>Tài khoản của tôi</span>
                </button>

                <button 
                  className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

