import axios from 'axios';
import { PurchaseOrder } from '@/types/PurchaseOrder'; // Assumes you configured `@` path alias

const BASE_URL = 'http://localhost:8080/api/purchase-orders';

/**
 * Fetch all purchase orders from backend
 */
export const fetchPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

/**
 * Update the status of a purchase order (e.g., to 'approved', 'shipped', 'received')
 *
 * Backend expects the status as a query parameter (?status=approved)
 *
 * @param id - Purchase order ID (number)
 * @param status - New status to set (string)
 */
export const updatePurchaseOrderStatus = async (
  id: number,
  status: string
): Promise<PurchaseOrder> => {
  const response = await axios.put(`${BASE_URL}/${id}/status`, null, {
    params: { status },
  });
  return response.data;
};
