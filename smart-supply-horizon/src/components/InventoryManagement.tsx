import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/api/api';
import { Product } from '@/types/Product';

import AddProductForm from './AddProductForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: inventoryData = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const filteredInventory = inventoryData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stockSummary = {
    totalItems: inventoryData.length,
    lowStock: inventoryData.filter((item) => item.stockLevel <= item.threshold).length,
    overStock: inventoryData.filter((item) => item.stockLevel > item.maxStock).length,
  };

  const isExpiringSoon = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    return expiry <= oneMonthFromNow;
  };

  if (isLoading) {
    return <div className="text-center py-10 text-lg">Loading Inventory...</div>;
  }

  return (
    <div className="space-y-8 p-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm">Total Items</p><p className="text-xl font-bold">{stockSummary.totalItems}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm">Low Stock</p><p className="text-xl font-bold text-red-600">{stockSummary.lowStock}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm">Overstock</p><p className="text-xl font-bold text-orange-500">{stockSummary.overStock}</p></CardContent></Card>
      </div>

      {/* Toggle Add Form */}
      <div className="flex justify-end">
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Hide Form' : 'Add New Item'}
        </Button>
      </div>

      {/* Product Form */}
      {showAddForm && <AddProductForm defaultExpiryDate={getDefaultExpiryDate()} />}

      {/* Search + Inventory List */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Search & Management</CardTitle>
          <CardDescription>Search, track, and manage inventory in real-time.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search by SKU, name, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredInventory.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">No items found.</p>
            ) : (
              filteredInventory.map((item) => {
                const stockPercentage = Math.round((item.stockLevel / item.maxStock) * 100);
                const stockStatus =
                  item.stockLevel <= item.threshold ? 'Low Stock' :
                  item.stockLevel > item.maxStock ? 'Overstock' : 'Optimal';

                const statusColor =
                  stockStatus === 'Low Stock' ? 'text-red-600' :
                  stockStatus === 'Overstock' ? 'text-yellow-500' : 'text-green-600';

                return (
                  <Card key={item.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                        <p className="text-sm text-muted-foreground">Category: {item.category}</p>
                      </div>
                      <div>
                        <p className="text-sm">Current Stock: <span className="font-bold">{item.stockLevel}</span></p>
                        <p className="text-sm">Min: {item.minStock} | Max: {item.maxStock}</p>
                      </div>
                      <div>
                        <p className="text-sm">Stock Level:</p>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${stockPercentage}%`,
                              backgroundColor:
                                stockStatus === 'Low Stock' ? '#DC2626' :
                                stockStatus === 'Overstock' ? '#F59E0B' : '#22C55E',
                            }}
                          ></div>
                        </div>
                        <p className={`text-xs font-medium mt-1 ${statusColor}`}>{stockStatus}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Price: ₹{item.price}
                          {item.category.toLowerCase() === 'food' && item.expiryDate && (
                            <span className={`ml-4 text-xs font-semibold ${
                              isExpiringSoon(item.expiryDate) ? 'text-yellow-600' : 'text-gray-500'
                            }`}>
                              Exp: {item.expiryDate}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function getDefaultExpiryDate() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().split('T')[0];
}

export default InventoryManagement;
