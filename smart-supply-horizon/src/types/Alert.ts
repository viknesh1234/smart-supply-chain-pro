export interface Alert {
  id: number;
  title: string;
  message: string;
  type: string; // e.g., 'low_stock', 'expiry'
  severity: string; // e.g., 'high', 'medium', 'low'
  triggeredAt: string; // ISO timestamp
  resolved: boolean;
  productName: string; // ✅ Added this
  action?: string;
}
