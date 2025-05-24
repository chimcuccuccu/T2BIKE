"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface UserEditModalProps {
    isOpen: boolean
    onClose: () => void
    username: string | null
    onUpdate: () => void
}

interface UserData {
    id: string
    username: string
    fullName: string
    gender: string
    birthDate: string
    email: string | null
    phone: string | null
    address: string | null
    role: string | null
}

export default function UserEditModal({
    isOpen,
    onClose,
    username,
    onUpdate,
}: UserEditModalProps) {
    const [formData, setFormData] = useState({
        id: "",
        fullName: "",
        gender: "",
        birthDate: "",
        email: "",
        phone: "",
        address: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (username) {
            fetchUserData()
        }
    }, [username])

    const formatDateForInput = (dateStr: string) => {
        // Convert from DD-MM-YYYY to YYYY-MM-DD for input type="date"
        const [day, month, year] = dateStr.split("-")
        return `${year}-${month}-${day}`
    }

    const formatDateForAPI = (dateStr: string) => {
        // Convert from YYYY-MM-DD to DD-MM-YYYY for API
        const [year, month, day] = dateStr.split("-")
        return `${day}-${month}-${year}`
    }

    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/users/${username}`, {
                credentials: "include"
            })
            if (!response.ok) {
                throw new Error("Không thể lấy thông tin người dùng")
            }
            const data: UserData = await response.json()
            setFormData({
                id: data.id,
                fullName: data.fullName,
                gender: data.gender,
                birthDate: formatDateForInput(data.birthDate),
                email: data.email || "",
                phone: data.phone || "",
                address: data.address || "",
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi lấy thông tin người dùng")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.id) return

        setLoading(true)
        setError("")

        try {
            const response = await fetch(`http://localhost:8081/api/users/admin/${formData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    gender: formData.gender,
                    birthDate: formatDateForAPI(formData.birthDate),
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                }),
                credentials: "include",
            })

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(errorData)
            }

            onUpdate()
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi cập nhật thông tin")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-pink-600">Chỉnh sửa thông tin người dùng #{formData.id}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Họ và tên</label>
                            <Input
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Giới tính</label>
                            <Select
                                value={formData.gender}
                                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn giới tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Nam">Nam</SelectItem>
                                    <SelectItem value="Nữ">Nữ</SelectItem>
                                    <SelectItem value="Khác">Khác</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ngày sinh</label>
                            <Input
                                type="date"
                                value={formData.birthDate}
                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Số điện thoại</label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Địa chỉ</label>
                        <Textarea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            rows={3}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-pink-500 hover:bg-pink-600" disabled={loading}>
                            {loading ? "Đang cập nhật..." : "Cập nhật"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
} 