// src/hooks/useInsights.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/insights'; //  corrected to match backend

export const useKPIs = () =>
  useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/kpis`);
      return response.data;
    },
  });

export const useDeliveryPerformance = () =>
  useQuery({
    queryKey: ['delivery-performance'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/delivery-performance`);
      return response.data;
    },
  });

export const useSuppliers = () =>
  useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/suppliers/performance`);
      return response.data;
    },
  });

export const useRegions = () =>
  useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/regions/distribution`);
      return response.data;
    },
  });

export const useShipments = () =>
  useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/shipments/status`);
      return response.data;
    },
  });
