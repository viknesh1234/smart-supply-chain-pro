import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPurchaseOrders, updatePurchaseOrderStatus } from '@/api/purchaseOrders';
import { PurchaseOrder, PurchaseItem } from '@/types/PurchaseOrder';

import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";

import {
  Search, Plus, FileText, Truck, CheckCircle, Clock,
} from 'lucide-react';

import CreatePO from './CreatePO';

const PurchaseOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['purchaseOrders'],
    queryFn: fetchPurchaseOrders,
  });

  const purchaseOrders: PurchaseOrder[] = Array.isArray(data) ? data : [];

  const { mutate: approveOrder } = useMutation({
    mutationFn: (orderId: number) => updatePurchaseOrderStatus(orderId, 'approved'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] }),
    onError: () => alert('Approval failed'),
  });

  const filteredOrders = purchaseOrders.filter(order => {
    const matchSearch = order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: purchaseOrders.length,
    totalValue: purchaseOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    pending: purchaseOrders.filter(o => ['created', 'approved'].includes(o.status)).length,
    inTransit: purchaseOrders.filter(o => o.status === 'shipped').length,
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      created: "border-blue-500 text-blue-600",
      approved: "border-yellow-500 text-yellow-600",
      shipped: "border-purple-500 text-purple-600",
      received: "bg-green-500 text-white",
    };
    const label: any = {
      created: "Created",
      approved: "Approved",
      shipped: "Shipped",
      received: "Received",
    };
    return (
      <Badge variant={status === "received" ? "default" : "outline"} className={variants[status]}>
        {label[status] || status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    const icons: any = {
      created: <FileText className="h-4 w-4 text-blue-500" />,
      approved: <CheckCircle className="h-4 w-4 text-yellow-500" />,
      shipped: <Truck className="h-4 w-4 text-purple-500" />,
      received: <CheckCircle className="h-4 w-4 text-green-500" />,
    };
    return icons[status] || <Clock className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Total Orders</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </CardContent></Card>

        <Card><CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <span className="text-green-500 font-bold">$</span>
            <div>
              <p className="text-sm font-medium">Total Value</p>
              <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </CardContent></Card>

        <Card><CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </CardContent></Card>

        <Card><CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Truck className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm font-medium">In Transit</p>
              <p className="text-2xl font-bold text-purple-600">{stats.inTransit}</p>
            </div>
          </div>
        </CardContent></Card>
      </div>

      {/* Filters + Form Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>View and manage your generated orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search PO number or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="received">Received</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> {showForm ? "Close" : "Create PO"}
            </Button>
          </div>

          {/* Create PO Form */}
          {showForm && (
            <div className="mb-6">
              <CreatePO
                onSuccess={() => {
                  setShowForm(false);
                  queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
                }}
              />
            </div>
          )}

          {/* Orders List */}
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Loading...</div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <Card key={order.id} className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
                    {/* PO Info */}
                    <div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <h3 className="font-semibold">{order.poNumber}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.supplierName}</p>
                      <p className="text-xs text-muted-foreground">Created: {order.createdDate || 'N/A'}</p>
                    </div>

                    {/* Amount */}
                    <div className="text-center">
                      <p className="text-2xl font-bold">${order.totalAmount?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{order.items?.length || 0} items</p>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{order.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${order.progress || 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Expected: {order.expectedDate || 'N/A'}</p>
                    </div>

                    {/* Status */}
                    <div className="text-center">{getStatusBadge(order.status)}</div>

                    {/* Actions */}
                    <div className="text-center space-y-2">
                      <Button size="sm" variant="outline" className="w-full">View</Button>
                      {order.status === 'created' && (
                        <Button size="sm" className="w-full" onClick={() => approveOrder(order.id)}>
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Item Preview */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      {order.items?.slice(0, 3)?.map((item: PurchaseItem, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span>Item #{item.productId}</span>
                          <span>{item.quantity} × ${item.unitPrice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseOrders;
