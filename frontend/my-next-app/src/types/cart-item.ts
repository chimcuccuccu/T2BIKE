import { Product } from "./product";

export interface CartItem {
    id: number;
    userId: number;
    productId: number;
    quantity: number;
    product: Product;
  };
;  