package com.inventory.inventory_system.controller;

import com.inventory.inventory_system.entity.PurchaseOrder;
import com.inventory.inventory_system.repository.PurchaseOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/insights")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class InsightsController {

    private final PurchaseOrderRepository repository;

    // ✅ KPI Metrics
    @GetMapping("/kpis")
    public ResponseEntity<List<Map<String, Object>>> getKpis() {
        long totalOrders = repository.count();
        long delivered = repository.findAll().stream()
                .filter(po -> "delivered".equalsIgnoreCase(po.getStatus()))
                .count();

        double deliveryRate = (totalOrders == 0) ? 0 : (delivered * 100.0 / totalOrders);

        List<Map<String, Object>> kpis = List.of(
                Map.of("title", "On-Time Delivery", "value", String.format("%.1f%%", deliveryRate), "change", "+2%", "icon", "CheckCircle", "color", "text-green-500"),
                Map.of("title", "Delays", "value", String.format("%.1f%%", 100 - deliveryRate), "change", "-1%", "icon", "Clock", "color", "text-yellow-500"),
                Map.of("title", "Orders", "value", totalOrders, "change", "+5", "icon", "TrendingUp", "color", "text-blue-500")
        );
        return ResponseEntity.ok(kpis);
    }

    // ✅ Delivery performance by month
    @GetMapping("/delivery-performance")
    public ResponseEntity<List<Map<String, Object>>> getDeliveryPerformance() {
        List<PurchaseOrder> orders = repository.findAll();

        Map<String, List<PurchaseOrder>> grouped = orders.stream()
                .filter(po -> po.getCreatedDate() != null)
                .collect(Collectors.groupingBy(po ->
                        po.getCreatedDate().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH)));

        List<Map<String, Object>> result = new ArrayList<>();
        grouped.forEach((month, monthOrders) -> {
            long total = monthOrders.size();
            long onTime = monthOrders.stream()
                    .filter(po -> "delivered".equalsIgnoreCase(po.getStatus())
                            && po.getExpectedDate() != null && po.getCreatedDate() != null
                            && !po.getExpectedDate().isBefore(po.getCreatedDate()))
                    .count();
            double efficiency = (total == 0) ? 0 : (onTime * 100.0 / total);

            Map<String, Object> data = new HashMap<>();
            data.put("month", month);
            data.put("onTime", efficiency);
            data.put("efficiency", efficiency);
            result.add(data);
        });

        result.sort(Comparator.comparing(m -> ((String) m.get("month"))));
        return ResponseEntity.ok(result);
    }

    // ✅ Supplier performance metrics
    @GetMapping("/suppliers/performance")
    public ResponseEntity<List<Map<String, Object>>> getSuppliers() {
        List<PurchaseOrder> orders = repository.findAll();

        Map<String, List<PurchaseOrder>> grouped = orders.stream()
                .collect(Collectors.groupingBy(PurchaseOrder::getSupplierName));

        List<Map<String, Object>> result = new ArrayList<>();
        grouped.forEach((supplier, list) -> {
            double totalValue = list.stream().mapToDouble(PurchaseOrder::getTotalAmount).sum();
            double reliability = 90 + new Random().nextInt(10); // mock
            double quality = 85 + new Random().nextInt(10); // mock
            int leadTime = 2 + new Random().nextInt(4); // mock

            Map<String, Object> data = new HashMap<>();
            data.put("name", supplier);
            data.put("value", totalValue);
            data.put("reliability", reliability);
            data.put("quality", quality);
            data.put("leadTime", leadTime);
            result.add(data);
        });

        return ResponseEntity.ok(result);
    }

    // ✅ Region Distribution (static)
    @GetMapping("/regions/distribution")
    public ResponseEntity<List<Map<String, Object>>> getRegions() {
        return ResponseEntity.ok(List.of(
                Map.of("name", "Mumbai", "value", 40, "color", "#10b981"),
                Map.of("name", "Delhi", "value", 35, "color", "#3b82f6"),
                Map.of("name", "Bangalore", "value", 25, "color", "#f59e0b")
        ));
    }

    // ✅ Shipment Tracking (static)
    @GetMapping("/shipments/status")
    public ResponseEntity<List<Map<String, Object>>> getShipments() {
        return ResponseEntity.ok(List.of(
                Map.of("id", "SHP-001", "carrier", "DHL", "origin", "Chennai", "destination", "Berlin",
                        "progress", 80, "eta", "2 days", "status", "in_transit", "value", "$15,000"),
                Map.of("id", "SHP-002", "carrier", "FedEx", "origin", "Mumbai", "destination", "Dubai",
                        "progress", 100, "eta", "Delivered", "status", "delivered", "value", "$10,500"),
                Map.of("id", "SHP-003", "carrier", "UPS", "origin", "Delhi", "destination", "London",
                        "progress", 60, "eta", "4 days", "status", "customs", "value", "$9,800")
        ));
    }
}
