export interface Order {
  id: number
  customerName: string
  createdAt: string
  user: {
    id: number
    username: string
    fullName: string
    gender: string
    birthDate: string
    email: string
    phone: string
    address: string
    role: string
  }
  items: {
    id: number
    quantity: number
    priceAtOrder: number
    product: {
      id: number
      name: string
      description: string
      price: number
      imageUrls: string[]
      category: string
      brand: string
      color: string[]
      quantity: number
    }
  }[]
  status: "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED" | "RETURNED"
  shippingInfo: {
    id: number
    receiverName: string
    phone: string
    province: string
    district: string
    address: string
    note: string
  } | null
  totalPrice: number | null
}

export interface UserOrderStatsDTO {
  totalOrders: number
  totalAmountSpent: number
}