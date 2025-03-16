import { ProductAttribute } from "./product-attribute";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrls: string[];
    category: string;
    color: string[];
    quantity: number;
    attributes?: ProductAttribute[];
  }
  