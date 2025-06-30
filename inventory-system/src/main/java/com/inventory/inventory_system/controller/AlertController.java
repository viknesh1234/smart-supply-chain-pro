package com.inventory.inventory_system.controller;

import com.inventory.inventory_system.dto.AlertDTO;
import com.inventory.inventory_system.entity.Alert;
import com.inventory.inventory_system.entity.Product;
import com.inventory.inventory_system.repository.AlertRepository;
import com.inventory.inventory_system.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AlertController {

    private final AlertRepository alertRepository;

    @Autowired
    private ProductRepository productRepository;

    public AlertController(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    @GetMapping
    public List<AlertDTO> getAllAlerts() {
        List<AlertDTO> alertDTOs = new ArrayList<>();
        List<Product> products = productRepository.findAll();

        for (Product product : products) {
            Integer stock = product.getStockLevel();
            Integer threshold = product.getThreshold();
            Integer maxStock = product.getMaxStock();

            if (stock != null && threshold != null && stock < threshold) {
                AlertDTO dto = new AlertDTO();
                dto.setType("low_stock");
                dto.setTitle("Low Stock - " + product.getName());
                dto.setMessage("Only " + stock + " units remaining. Reorder recommended.");
                dto.setSeverity("high");
                dto.setAction("Create Purchase Order");
                dto.setProductName(product.getName());
                dto.setTriggeredAt(LocalDateTime.now());
                alertDTOs.add(dto);
            }

            if (stock != null && maxStock != null && stock > maxStock) {
                AlertDTO dto = new AlertDTO();
                dto.setType("overstock");
                dto.setTitle("Overstock - " + product.getName());
                dto.setMessage(stock + " units available. Consider a promotion.");
                dto.setSeverity("medium");
                dto.setAction("Run Promotion");
                dto.setProductName(product.getName());
                dto.setTriggeredAt(LocalDateTime.now());
                alertDTOs.add(dto);
            }
        }

        return alertDTOs;
    }

    @PostMapping
    public Alert createAlert(@RequestBody Alert alert) {
        return alertRepository.save(alert);
    }
}
