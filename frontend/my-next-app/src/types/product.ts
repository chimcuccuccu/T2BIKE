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
  brand: string;
  attributes?: ProductAttribute[];
}

export interface ProductReview {
  id: number;
  userId: number;
  username: string;
  comment: string;
  createdAt: string;
  productName: string;
  answer: string | null;
  answeredAt: string | null;
}

export interface ProductReviewResponse {
  content: ProductReview[];
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
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
