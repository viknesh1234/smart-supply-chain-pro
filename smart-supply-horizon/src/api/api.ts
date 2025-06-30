import axios from "axios";
import { Product } from "../types/Product";
import { Alert } from "../types/Alert";
import { Order } from "../types/Order";
import { Insight } from "../types/Insight";
import { KPI } from "../types/KPI";

const API_BASE_URL = "http://localhost:8080/api";

// ----------- Products -----------

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
};

export const addProduct = async (product: Product): Promise<Product> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products`, product);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding product:", error);
    throw new Error("Add Product Failed");
  }
};

// ----------- Forecast Analytics -----------

export interface ForecastAccuracy {
  accuracy: string;
}

export const getForecastAccuracy = async (): Promise<ForecastAccuracy[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/forecast/accuracy`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching forecast accuracy:", error);
    return [];
  }
};

export const getStockTurnover = async (): Promise<{ turnover: string; change: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/forecast/stock-turnover`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching stock turnover:", error);
    return { turnover: "0", change: "0%" };
  }
};

export const getSeasonalFactors = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/forecast/seasonal-factors`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching seasonal factors:", error);
    return [];
  }
};

// ----------- Alerts -----------

export const getSmartAlerts = async (): Promise<Alert[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alerts`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching alerts:", error);
    return [];
  }
};

// ----------- Orders -----------

export const getPendingOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/pending`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching pending orders:", error);
    return [];
  }
};

// ----------- Insights -----------

export const getSupplyChainInsights = async (): Promise<Insight[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/insights`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching insights:", error);
    return [];
  }
};

// ----------- Dashboard KPIs -----------

export const getKpiData = async (): Promise<KPI[]> => {
  try {
    const [forecast, turnover, alerts] = await Promise.all([
      getForecastAccuracy(),
      getStockTurnover(),
      getSmartAlerts(),
    ]);

    const forecastAccuracy = forecast[0]?.accuracy ?? "90%";

    return [
      {
        title: "Forecast Accuracy",
        value: forecastAccuracy,
        change: "+2.5%",
        trend: "up",
        color: "text-purple-600",
      },
      {
        title: "Stock Turnover",
        value: turnover.turnover,
        change: turnover.change,
        trend: turnover.change.startsWith("+") ? "up" : "down",
        color: "text-blue-600",
      },
      {
        title: "Active Alerts",
        value: `${alerts.length}`,
        change: "+3",
        trend: "up",
        color: "text-red-600",
      },
    ];
  } catch (error) {
    console.error("❌ Error generating KPI data:", error);
    return [];
  }
};
