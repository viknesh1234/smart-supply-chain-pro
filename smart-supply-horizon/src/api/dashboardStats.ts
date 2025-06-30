// src/api/dashboardStats.ts

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  inTransitOrders: number;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const res = await fetch('/api/purchase-orders/stats');

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch dashboard stats: ${res.status} ${res.statusText} - ${errorText}`);
  }

  const data = await res.json();

  // Optional: validate shape of data
  if (
    typeof data.totalOrders !== 'number' ||
    typeof data.pendingOrders !== 'number' ||
    typeof data.inTransitOrders !== 'number'
  ) {
    throw new Error('Invalid dashboard stats format received from API');
  }

  return data as DashboardStats;
};
