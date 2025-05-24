"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const MotionDialogContent = motion(DialogContent)

interface User {
    id: number
    username: string
    fullName: string
    gender: string
    birthDate: string
    email: string | null
    phone: string | null
    address: string | null
    role: string | null
}

interface UserDetailModalProps {
    isOpen: boolean
    onClose: () => void
    username: string | null
}

export default function UserDetailModal({ isOpen, onClose, username }: UserDetailModalProps) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isOpen && username) {
            fetchUserDetails()
        }
    }, [isOpen, username])

    const fetchUserDetails = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`http://localhost:8081/api/users/${username}`)
            if (!response.ok) {
                throw new Error("Failed to fetch user details")
            }
            const data = await response.json()
            setUser(data)
        } catch (error) {
            console.error("Error fetching user details:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Chi tiết người dùng
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                    </div>
                ) : user ? (
                    <div className="space-y-6">
                        {/* User Status */}
                        <div className="bg-pink-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Vai trò</p>
                                    <p className="text-lg font-semibold text-pink-600">{user.role || "Người dùng"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">ID</p>
                                    <p className="text-lg font-semibold">{user.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* User Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded-lg border">
                                <h3 className="font-semibold mb-3">Thông tin cơ bản</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Tên đăng nhập</p>
                                        <p className="font-medium">{user.username}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Họ và tên</p>
                                        <p className="font-medium">{user.fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Giới tính</p>
                                        <p className="font-medium">{user.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Ngày sinh</p>
                                        <p className="font-medium">{user.birthDate}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border">
                                <h3 className="font-semibold mb-3">Thông tin liên hệ</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium">{user.email || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Số điện thoại</p>
                                        <p className="font-medium">{user.phone || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Địa chỉ</p>
                                        <p className="font-medium">{user.address || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Không tìm thấy thông tin người dùng
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
