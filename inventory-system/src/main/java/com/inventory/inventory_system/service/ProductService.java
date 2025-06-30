package com.inventory.inventory_system.service;

import com.inventory.inventory_system.entity.Product;
import com.inventory.inventory_system.entity.Alert;
import com.inventory.inventory_system.repository.ProductRepository;
import com.inventory.inventory_system.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private EmailService emailService;

    //  Save or update product and trigger alert if low
    public Product saveOrUpdateProduct(Product product) {
        // Use saveAndFlush to ensure ID is generated and committed
        Product savedProduct = productRepository.saveAndFlush(product);
        checkAndAlert(savedProduct);
        return savedProduct;
    }

    //  Update only stock level and re-check alert conditions
    public Product updateStockLevel(Long productId, int newStockLevel) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));
        product.setStockLevel(newStockLevel);
        Product updatedProduct = productRepository.saveAndFlush(product);
        checkAndAlert(updatedProduct);
        return updatedProduct;
    }

    //  Alert logic - checks stock threshold and sends email if needed
    private void checkAndAlert(Product product) {
        if (product.getStockLevel() <= product.getThreshold()) {
            String title = "Low Stock - " + product.getName();

            // Avoid creating duplicate alerts
            boolean exists = alertRepository.existsByTitle(title);
            if (!exists) {
                Alert alert = new Alert();
                alert.setTitle(title);
                alert.setMessage("Only " + product.getStockLevel() + " units remaining. Reorder recommended.");
                alert.setSeverity("High");
                alert.setTriggeredAt(LocalDateTime.now());
                alert.setAction("Create Purchase Order");
                alert.setProduct(product);
                alert.setType("low_stock");
                alert.setResolved(false);

                alertRepository.save(alert);

                // Send notification email
                String subject = "⚠ Low Stock Alert: " + product.getName();
                String body = "Product: " + product.getName() + "\n"
                        + "Current Stock: " + product.getStockLevel() + "\n"
                        + "Threshold: " + product.getThreshold() + "\n"
                        + "Action Recommended: Please reorder soon.";
                emailService.sendAlertEmail("your_email@gmail.com", subject, body);
            }
        }
    }

    //  Fetch all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    //  Fetch only low stock products
    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }
}
