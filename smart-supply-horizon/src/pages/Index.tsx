import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import DemandForecastDashboard from "@/components/DemandForecastDashboard";
import InventoryManagement from "@/components/InventoryManagement";
import SmartAlerts from "@/components/SmartAlerts";
import PurchaseOrders from "@/components/PurchaseOrders";
import SupplyChainInsights from "@/components/SupplyChainInsights";
import {
  TrendingUp,
  Package,
  Bell,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getKpiData } from "@/api/api";
import { KPI } from "@/types/KPI";

const Index = () => {
  const [activeTab, setActiveTab] = useState("forecast");

  const { data: kpiData = [], isLoading } = useQuery<KPI[]>({
    queryKey: ["kpiData"],
    queryFn: getKpiData,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SmartChain Pro
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-Driven Supply Chain Management & Demand Forecasting Platform
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <p>Loading KPI data...</p>
          ) : (
            kpiData.map((kpi, index) => {
              const IconComponent =
                kpi.title === "Forecast Accuracy"
                  ? TrendingUp
                  : kpi.title === "Stock Turnover"
                  ? Package
                  : kpi.title === "Active Alerts"
                  ? Bell
                  : ShoppingCart;

              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {kpi.title}
                    </CardTitle>
                    <IconComponent className={`h-5 w-5 ${kpi.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p
                      className={`text-xs ${
                        kpi.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {kpi.change} from last month
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Main Dashboard Tabs */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              Supply Chain Control Center
            </CardTitle>
            <CardDescription>
              Monitor and manage your entire supply chain ecosystem in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="forecast" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Demand Forecast
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Inventory
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Smart Alerts
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Purchase Orders
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Supply Chain
                </TabsTrigger>
              </TabsList>

              <TabsContent value="forecast">
                <DemandForecastDashboard />
              </TabsContent>

              <TabsContent value="inventory">
                <InventoryManagement />
              </TabsContent>

              <TabsContent value="alerts">
                <SmartAlerts />
              </TabsContent>

              <TabsContent value="orders">
                <PurchaseOrders />
              </TabsContent>

              <TabsContent value="insights">
                <SupplyChainInsights />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
