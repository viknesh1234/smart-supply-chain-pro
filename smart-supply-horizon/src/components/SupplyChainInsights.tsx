import React from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Truck, Clock, CheckCircle, AlertTriangle, TrendingUp, Globe
} from 'lucide-react';
import {
  useKPIs,
  useDeliveryPerformance,
  useSuppliers,
  useRegions,
  useShipments
} from '@/hooks/useInsights';

const SupplyChainInsights = () => {
  const { data: kpiMetricsRaw, isLoading: kpiLoading } = useKPIs();
  const { data: deliveryPerformance = [] } = useDeliveryPerformance();
  const { data: supplierPerformance = [] } = useSuppliers();
  const { data: regionData = [] } = useRegions();
  const { data: shipmentStatus = [] } = useShipments();

  const kpiMetrics = Array.isArray(kpiMetricsRaw) ? kpiMetricsRaw : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_transit':
        return <Badge variant="outline" className="border-blue-500 text-blue-600">In Transit</Badge>;
      case 'customs':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Customs</Badge>;
      case 'delivered':
        return <Badge variant="default" className="bg-green-500">Delivered</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiMetrics.map((metric: any, index: number) => {
          const IconComponent = {
            CheckCircle,
            Clock,
            AlertTriangle,
            TrendingUp,
            Globe
          }[metric.icon as keyof typeof import('lucide-react')];

          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  {IconComponent && <IconComponent className={`h-5 w-5 ${metric.color}`} />}
                  <div>
                    <p className="text-sm font-medium">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-green-600">{metric.change}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance Trends</CardTitle>
            <CardDescription>
              Monthly on-time delivery and efficiency metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deliveryPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="onTime" fill="#10b981" name="On Time %" />
                <Bar dataKey="efficiency" fill="#3b82f6" name="Efficiency %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Supply Chain Distribution</CardTitle>
            <CardDescription>
              Regional breakdown of supply chain operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {regionData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Performance Dashboard</CardTitle>
          <CardDescription>
            Key metrics for top suppliers and their performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supplierPerformance.map((supplier: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <h3 className="font-semibold">{supplier.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Value: ${supplier.value?.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Reliability</span>
                      <span>{supplier.reliability}%</span>
                    </div>
                    <Progress value={supplier.reliability} className="h-2" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Quality Score</span>
                      <span>{supplier.quality}%</span>
                    </div>
                    <Progress value={supplier.quality} className="h-2" />
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium">Lead Time</p>
                    <p className="text-lg font-bold">{supplier.leadTime} days</p>
                  </div>

                  <div className="text-center">
                    {supplier.reliability >= 95 ? (
                      <Badge variant="default" className="bg-green-500">Excellent</Badge>
                    ) : supplier.reliability >= 90 ? (
                      <Badge variant="outline" className="border-blue-500 text-blue-600">Good</Badge>
                    ) : (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-600">Average</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Shipments */}
      <Card>
        <CardHeader>
          <CardTitle>Active Shipment Tracking</CardTitle>
          <CardDescription>
            Real-time tracking of shipments and last-mile delivery status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipmentStatus.map((shipment: any) => (
              <div key={shipment.id} className="p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div>
                    <h3 className="font-semibold">{shipment.id}</h3>
                    <p className="text-sm text-muted-foreground">{shipment.carrier}</p>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Truck className="h-4 w-4 text-blue-500" />
                      <span>{shipment.origin}</span>
                      <span>→</span>
                      <span>{shipment.destination}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{shipment.progress}%</span>
                    </div>
                    <Progress value={shipment.progress} className="h-2" />
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium">ETA</p>
                    <p className="text-sm">{shipment.eta}</p>
                    <p className="text-xs text-muted-foreground">{shipment.value}</p>
                  </div>

                  <div className="text-center">
                    {getStatusBadge(shipment.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplyChainInsights;
