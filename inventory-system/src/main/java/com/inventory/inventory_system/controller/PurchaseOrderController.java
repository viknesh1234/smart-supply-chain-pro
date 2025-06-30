package com.inventory.inventory_system.controller;

import com.inventory.inventory_system.dto.PurchaseOrderRequest;
import com.inventory.inventory_system.service.PurchaseOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService service;

    @GetMapping
    public List<PurchaseOrderRequest> getAllPurchaseOrders() {
        return service.getAll();
    }

    @PostMapping
    public PurchaseOrderRequest createPurchaseOrder(@RequestBody PurchaseOrderRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}/status")
    public PurchaseOrderRequest updatePurchaseOrderStatus(
            @PathVariable Long id,
            @RequestParam("status") String status
    ) {
        return service.updateStatus(id, status);
    }

    // New API for stats on dashboard cards
    @GetMapping("/stats")
    public Map<String, Long> getOrderStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalOrders", service.getTotalOrderCount());
        stats.put("pendingOrders", service.getPendingOrderCount());
        stats.put("inTransitOrders", service.getInTransitOrderCount());
        return stats;
    }
}
