import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// ✅ Base URL for Purchase Order APIs
const BASE_URL = 'http://localhost:8080/api/purchase-orders';

/**
 * 🔁 Hook: Fetch the count of pending purchase orders
 * API: GET /api/purchase-orders/pending/count
 * Returns: number
 */
export const usePendingOrderCount = () => {
  return useQuery({
    queryKey: ['pending-orders'],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/pending/count`);
      return res.data; // Assuming response is a raw number like: 7
    },
    refetchOnWindowFocus: true, // Auto-refresh when window regains focus
    staleTime: 0,                // Always fetch fresh data
  });
};

/**
 * 🔁 Hook: Fetch all purchase orders
 * API: GET /api/purchase-orders
 * Returns: PurchaseOrderRequest[]
 */
export const useAllPurchaseOrders = () => {
  return useQuery({
    queryKey: ['all-purchase-orders'],
    queryFn: async () => {
      const res = await axios.get(BASE_URL);
      return res.data; // Array of purchase orders
    },
  });
};
