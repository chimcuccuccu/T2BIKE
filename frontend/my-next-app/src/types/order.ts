export interface Order {
  id: number
  product: string
  color: string
  price: number
  quantity: number
  status: "waiting" | "confirmed" | "shipping" | "delivered" | "cancelled"
  image: string
  date: string
  statusChanged: boolean
}