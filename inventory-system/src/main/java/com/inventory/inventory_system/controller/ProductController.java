package com.inventory.inventory_system.controller;

import com.inventory.inventory_system.entity.Product;
import com.inventory.inventory_system.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    //  Add new product with validation
    @PostMapping
    public ResponseEntity<?> addProduct(@Valid @RequestBody Product product) {
        try {
            Product saved = productService.saveOrUpdateProduct(product);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace(); // Log the actual error
            return ResponseEntity.badRequest().body("Failed to add product: " + e.getMessage());
        }
    }

    //  Update stock level by ID
    @PutMapping("/{id}/stock")
    public ResponseEntity<Product> updateStock(@PathVariable Long id, @RequestParam int stock) {
        try {
            Product updated = productService.updateStockLevel(id, stock);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    //  Get all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    //  Get only low stock products
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts() {
        return ResponseEntity.ok(productService.getLowStockProducts());
    }
}
