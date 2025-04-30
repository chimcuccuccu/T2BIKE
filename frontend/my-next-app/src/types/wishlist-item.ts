import { Product } from "@/types/product";

export interface WishlistItem {
  id?: number;
  userId: number;
  productId: number;
  product: Product;
}
