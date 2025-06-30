export interface Product {
  id?: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stockLevel: number;
  minStock: number;
  maxStock: number;
  threshold: number;
  expiryDate?: string; // optional field for food items
}
