export interface Product {
  prodId: string;
  prodName: string;
  prodDesc: string | null;
  prodPrice: number;
  prodCategory: string | null;
  prodImages: string[];
  prodStock: number;
  createdAt: string;
  updatedAt: string;
}