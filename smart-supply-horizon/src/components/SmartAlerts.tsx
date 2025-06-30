import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Bell,
  AlertTriangle,
  TrendingDown,
  Package,
  Clock,
  CheckCircle,
  LucideIcon
} from 'lucide-react';
import { Alert } from '@/types/Alert';

const iconMap: Record<string, LucideIcon> = {
  low_stock: AlertTriangle,
  overstock: TrendingDown,
  expiry: Clock,
  reorder: Package,
  resolved: CheckCircle,
};

const severityColors: Record<string, { color: string; bgColor: string; borderColor: string }> = {
  high: { color: 'text-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  medium: { color: 'text-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  low: { color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
};

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case 'high':
      return <Badge variant="destructive">High Priority</Badge>;
    case 'medium':
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Medium</Badge>;
    case 'low':
      return <Badge variant="secondary">Low Priority</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const SmartAlerts = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  const { data: alerts = [], isLoading, isError } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:8080/api/alerts');
      return res.data;
    }
  });

  const alertStats = {
    total: alerts.length,
    high: alerts.filter((a) => a.severity === 'high').length,
    medium: alerts.filter((a) => a.severity === 'medium').length,
    resolved: alerts.filter((a) => a.type === 'resolved').length
  };

  if (isLoading) return <div className="text-center p-6">Loading alerts...</div>;
  if (isError) return <div className="text-center text-red-500 p-6">Error fetching alerts.</div>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><Bell className="h-5 w-5 text-blue-500" /><div><p className="text-sm font-medium">Total Alerts</p><p className="text-2xl font-bold">{alertStats.total}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><AlertTriangle className="h-5 w-5 text-red-500" /><div><p className="text-sm font-medium">High Priority</p><p className="text-2xl font-bold text-red-600">{alertStats.high}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><Package className="h-5 w-5 text-orange-500" /><div><p className="text-sm font-medium">Medium Priority</p><p className="text-2xl font-bold text-orange-600">{alertStats.medium}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><CheckCircle className="h-5 w-5 text-green-500" /><div><p className="text-sm font-medium">Resolved</p><p className="text-2xl font-bold text-green-600">{alertStats.resolved}</p></div></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
            <CardDescription>Real-time notifications and recommended actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, index) => {
                const IconComponent = iconMap[alert.type] || Bell;
                const { color, bgColor, borderColor } = severityColors[alert.severity] || {};
                return (
                  <div
                    key={alert.id ?? `alert-${index}`}
                    className={`p-4 rounded-xl shadow-sm border-l-4 ${bgColor} ${borderColor}`}
                  >
                    {/* Product Name */}
                    <div className="text-base font-semibold mb-1 text-gray-900">{alert.productName}</div>

                    {/* Icon + Title + Severity */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <IconComponent className={`h-5 w-5 ${color}`} />
                        <p className="text-sm font-medium text-gray-800">{alert.title}</p>
                      </div>
                      {getSeverityBadge(alert.severity)}
                    </div>

                    {/* Message */}
                    <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>

                    {/* Timestamp + Action */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.triggeredAt).toLocaleString()}
                      </span>
                      {alert.action && (
                        <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                          {alert.action}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure how you receive alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                </div>
                <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Browser push notifications</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <h4 className="font-medium">Alert Thresholds</h4>

              <div className="space-y-2">
                <label htmlFor="low-stock-threshold" className="text-sm">Low Stock Threshold</label>
                <div className="flex items-center space-x-2">
                  <input
                    id="low-stock-threshold"
                    type="number"
                    defaultValue="10"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="expiry-warning" className="text-sm">Expiry Warning</label>
                <div className="flex items-center space-x-2">
                  <input
                    id="expiry-warning"
                    type="number"
                    defaultValue="7"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  />
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
              </div>
            </div>

            <Button className="w-full">Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartAlerts;
