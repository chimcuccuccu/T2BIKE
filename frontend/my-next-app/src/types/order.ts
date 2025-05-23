export interface User {
  id: number;
  username: string;
  fullName: string;
  gender: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  role: string | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: string;
  brand: string;
  color: string[];
  quantity: number | null;
}

export interface OrderItem {
  id: number;
  quantity: number;
  priceAtOrder: number;
  product: Product;
}

export interface ShippingInfo {
  id: number;
  receiverName: string;
  phone: string;
  province: string;
  district: string;
  address: string;
  note: string;
}

export interface Order {
  id: number;
  customerName: string;
  createdAt: string;
  user: User;
  items: OrderItem[];
  status: string;
  shippingInfo: ShippingInfo;
  totalPrice: number;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface UserOrderStatsDTO {
  totalOrders: number
  totalAmountSpent: number
}