"use client"

import { motion } from "framer-motion"
import { Settings, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsContent() {
  return (
    <div>
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold flex items-center">
          <Settings className="mr-2 h-6 w-6 text-pink-500" />
          Cài đặt hệ thống
        </h2>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">Chung</TabsTrigger>
            <TabsTrigger value="appearance">Giao diện</TabsTrigger>
            <TabsTrigger value="notifications">Thông báo</TabsTrigger>
            <TabsTrigger value="security">Bảo mật</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium mb-4">Thông tin cửa hàng</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="store-name">Tên cửa hàng</Label>
                  <Input id="store-name" placeholder="Nhập tên cửa hàng" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="store-email">Email liên hệ</Label>
                  <Input id="store-email" type="email" placeholder="email@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="store-phone">Số điện thoại</Label>
                  <Input id="store-phone" placeholder="0123456789" />
                </div>
                <div className="flex justify-end">
                  <Button className="bg-pink-500 hover:bg-pink-600">
                    <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium mb-4">Tùy chỉnh giao diện</h3>
              <p className="text-gray-500">Các tùy chọn giao diện sẽ xuất hiện ở đây</p>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium mb-4">Cài đặt thông báo</h3>
              <p className="text-gray-500">Các tùy chọn thông báo sẽ xuất hiện ở đây</p>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium mb-4">Bảo mật tài khoản</h3>
              <p className="text-gray-500">Các tùy chọn bảo mật sẽ xuất hiện ở đây</p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

