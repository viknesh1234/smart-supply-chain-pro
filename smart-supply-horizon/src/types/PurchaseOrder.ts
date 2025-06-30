export interface PurchaseItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  productName?: string; // Optional: Useful for display if backend returns it
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierName: string;
  createdDate: string; // ISO string (e.g., "2025-06-28T12:00:00Z")
  expectedDate: string; // ISO string
  totalAmount: number;
  status: 'created' | 'approved' | 'shipped' | 'received'; // Typed for safety
  items: PurchaseItem[];
  progress?: number; // Optional (e.g., 0–100 progress bar)
  supplierEmail?: string; // Optional if you're adding email sending
}
