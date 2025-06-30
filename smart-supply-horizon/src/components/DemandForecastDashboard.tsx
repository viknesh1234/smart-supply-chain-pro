import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Badge } from "@/components/ui/badge";

import {
  getProducts,
  getForecastAccuracy,
  getSeasonalFactors
} from '../api/api';
import { Product } from '../types/Product';

const DemandForecastDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [forecastPeriod, setForecastPeriod] = useState<string>('30');
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [accuracyData, setAccuracyData] = useState<any[]>([]);
  const [seasonalFactors, setSeasonalFactors] = useState<any[]>([]);

  // 🔄 Load products
  useEffect(() => {
    getProducts().then((data) => {
      const validProducts = data.filter((p) => p.name.trim() !== '');
      setProducts(validProducts);

      // Default selection
      if (!selectedProduct && validProducts.length > 0) {
        setSelectedProduct(validProducts[0].name);
      }
    });
  }, []);

  // 🔄 Load forecast and other metrics
  useEffect(() => {
    if (!selectedProduct) return;

    axios.get(`http://localhost:8080/api/forecast/demand?product=${selectedProduct}&period=${forecastPeriod}`)
      .then(res => {
        console.log('✅ Forecast response:', res.data); // Debug line
        setForecastData(res.data);
      })
      .catch(err => console.error('❌ Forecast fetch error:', err));

    getForecastAccuracy()
      .then(setAccuracyData)
      .catch(err => console.error('❌ Accuracy fetch error:', err));

    getSeasonalFactors()
      .then(setSeasonalFactors)
      .catch(err => console.error('❌ Seasonal factors fetch error:', err));
  }, [selectedProduct, forecastPeriod]);

  return (
    <div className="space-y-6">
      {/* Select Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Product Category</label>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.name} value={product.name}>
                  {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Forecast Period</label>
          <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Demand Forecast Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Demand Forecast - {selectedProduct}</CardTitle>
            <CardDescription>
              AI-powered demand prediction with confidence intervals
            </CardDescription>
          </CardHeader>
          <CardContent>
            {forecastData.length === 0 ? (
              <p className="text-center text-red-500">No forecast data available for this product.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} name="Actual Sales" />
                  <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Predicted Sales" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Accuracy Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Model Performance</CardTitle>
            <CardDescription>Accuracy comparison across ML models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accuracyData.map((model, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{model.model}</span>
                    <Badge variant={index === 0 ? "default" : "secondary"}>
                      {model.accuracy}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${model.accuracy}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground">MAE: {model.mae}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seasonal Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Seasonal Factors & External Influences</CardTitle>
          <CardDescription>
            Key events and patterns affecting demand forecasting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {seasonalFactors.map((factor, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="font-medium">{factor.factor}</div>
                <div className="text-2xl font-bold text-green-600">{factor.impact}</div>
                <div className="text-sm text-muted-foreground">{factor.period}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemandForecastDashboard;
