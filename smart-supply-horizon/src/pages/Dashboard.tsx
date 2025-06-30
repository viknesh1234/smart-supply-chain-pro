import { useEffect, useState } from 'react';
import axios from 'axios';
import PendingOrderAlert from '@/components/PendingOrderAlert';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    inTransitOrders: 0,
    forecastAccuracy: 94.2,
    stockTurnover: 12.4,
    activeAlerts: 15,
  });

  useEffect(() => {
    axios.get('http://localhost:8080/api/purchase-orders/stats')
      .then(res => setStats(prev => ({ ...prev, ...res.data })))
      .catch(err => console.error('❌ Failed to load stats:', err));
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold text-gray-800">SmartChain Pro Dashboard</h1>

      {/* 🔝 Top Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Forecast Accuracy" value={`${stats.forecastAccuracy}`} unit="%" delta="+2.5% from last month" />
        <StatCard title="Stock Turnover" value={`${stats.stockTurnover}x`} delta="+0.8x from last month" />
        <StatCard title="Active Alerts" value={stats.activeAlerts} delta="+3 from last month" icon="🔔" />
        <StatCard title="Pending POs" value={stats.pendingOrders} delta="live" icon="⏳" />
      </div>

      {/* 🔔 Pending PO Alert Section */}
      <PendingOrderAlert />
    </div>
  );
};

// 📦 Reusable Stat Card Component
const StatCard = ({
  title,
  value,
  unit,
  delta,
  icon,
}: {
  title: string;
  value: number | string;
  unit?: string;
  delta?: string;
  icon?: string;
}) => (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col justify-between">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-600">{title}</span>
      {icon && <span className="text-lg">{icon}</span>}
    </div>
    <div className="mt-2 text-2xl font-bold text-gray-800">
      {value}
      {unit && <span className="text-base font-medium text-gray-500 ml-1">{unit}</span>}
    </div>
    {delta && <p className="text-xs text-green-600 mt-1">{delta}</p>}
  </div>
);

export default Dashboard;
