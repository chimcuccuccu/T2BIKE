import { ProductAttribute } from "./ProductAttribute";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    attributes?: ProductAttribute[];
  }
