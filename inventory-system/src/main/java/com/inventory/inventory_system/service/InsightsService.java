package com.inventory.inventory_system.service;

import com.inventory.inventory_system.repository.PurchaseOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class InsightsService {

    private final PurchaseOrderRepository poRepo;

    public List<Map<String, Object>> getLiveKPIs() {
        long totalOrders = poRepo.count();
        long delivered = poRepo.countByStatus("delivered");
        long delayed = poRepo.countByStatus("delayed");
        long inTransit = poRepo.countByStatus("in_transit");

        double onTimeRate = totalOrders > 0 ? (delivered * 100.0 / totalOrders) : 0;
        double delayRate = totalOrders > 0 ? (delayed * 100.0 / totalOrders) : 0;
        double issueRate = 100 - onTimeRate - delayRate;

        return List.of(
                Map.of("title", "On-Time Delivery", "value", onTimeRate + "%", "change", "+3%", "icon", "CheckCircle", "color", "text-green-500"),
                Map.of("title", "Delays", "value", delayRate + "%", "change", "-1%", "icon", "Clock", "color", "text-yellow-500"),
                Map.of("title", "Issues", "value", issueRate + "%", "change", "0%", "icon", "AlertTriangle", "color", "text-red-500"),
                Map.of("title", "Reach", "value", "28 Countries", "change", "+2", "icon", "Globe", "color", "text-blue-500")
        );
    }

    public List<Map<String, Object>> getDeliveryPerformance() {
        // You can add logic for month-wise performance using order dates
        return List.of(
                Map.of("month", "Jan", "onTime", 85, "efficiency", 78),
                Map.of("month", "Feb", "onTime", 89, "efficiency", 80),
                Map.of("month", "Mar", "onTime", 91, "efficiency", 83),
                Map.of("month", "Apr", "onTime", 94, "efficiency", 87)
        );
    }

    public List<Map<String, Object>> getSupplierMetrics() {
        // Replace with real Supplier data later
        return List.of(
                Map.of("name", "Alpha Traders", "value", 120000, "reliability", 96, "quality", 92, "leadTime", 4),
                Map.of("name", "Global Exports", "value", 87000, "reliability", 91, "quality", 89, "leadTime", 5),
                Map.of("name", "Zenith Corp", "value", 73000, "reliability", 88, "quality", 85, "leadTime", 6)
        );
    }

    public List<Map<String, Object>> getRegionData() {
        return List.of(
                Map.of("name", "Asia", "value", 40, "color", "#10b981"),
                Map.of("name", "Europe", "value", 35, "color", "#3b82f6"),
                Map.of("name", "America", "value", 25, "color", "#f59e0b")
        );
    }

    public List<Map<String, Object>> getShipments() {
        return List.of(
                Map.of("id", "SHP-001", "carrier", "DHL", "origin", "Chennai", "destination", "Berlin", "progress", 80, "eta", "2 days", "status", "in_transit", "value", "$15,000"),
                Map.of("id", "SHP-002", "carrier", "FedEx", "origin", "Mumbai", "destination", "Dubai", "progress", 100, "eta", "Delivered", "status", "delivered", "value", "$10,500"),
                Map.of("id", "SHP-003", "carrier", "UPS", "origin", "Delhi", "destination", "London", "progress", 60, "eta", "4 days", "status", "customs", "value", "$9,800")
        );
    }
}
