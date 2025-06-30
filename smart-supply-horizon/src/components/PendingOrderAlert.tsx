// src/components/PendingOrderAlert.tsx
import React from 'react';
import { usePendingOrderCount } from '@/hooks/usePurchaseOrders';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PendingOrderAlert = () => {
  const { data: count, isLoading, isError } = usePendingOrderCount();

  if (isLoading) {
    return <Badge className="bg-gray-400 text-white">⏳ Loading...</Badge>;
  }

  if (isError) {
    return (
      <Badge variant="destructive" className="text-white">
        ❌ Error fetching orders
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <AlertCircle className="text-yellow-500" size={20} />
      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer">
        📦 Pending Orders: {count}
      </Badge>
    </div>
  );
};

export default PendingOrderAlert;
