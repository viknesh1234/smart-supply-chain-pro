package com.inventory.inventory_system.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "SKU is required")
    private String sku;

    private String category;

    @NotNull(message = "Price is required")
    private Double price;

    @NotNull(message = "Threshold is required")
    private Integer threshold;

    @NotNull(message = "Stock level is required")
    @Column(name = "stock_level")
    private Integer stockLevel;

    @Column(name = "min_stock")
    private Integer minStock;

    @Column(name = "max_stock")
    private Integer maxStock;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    public Product() {}

    public Product(String name, String sku, String category, Double price,
                   Integer threshold, Integer stockLevel, Integer minStock,
                   Integer maxStock, LocalDate expiryDate) {
        this.name = name;
        this.sku = sku;
        this.category = category;
        this.price = price;
        this.threshold = threshold;
        this.stockLevel = stockLevel;
        this.minStock = minStock;
        this.maxStock = maxStock;
        this.expiryDate = expiryDate;
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getThreshold() { return threshold; }
    public void setThreshold(Integer threshold) { this.threshold = threshold; }

    public Integer getStockLevel() { return stockLevel; }
    public void setStockLevel(Integer stockLevel) { this.stockLevel = stockLevel; }

    public Integer getMinStock() { return minStock; }
    public void setMinStock(Integer minStock) { this.minStock = minStock; }

    public Integer getMaxStock() { return maxStock; }
    public void setMaxStock(Integer maxStock) { this.maxStock = maxStock; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
}
