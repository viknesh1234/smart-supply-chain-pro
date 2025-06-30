package com.inventory.inventory_system.repository;

import com.inventory.inventory_system.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    //  Get products where stock is less than or equal to threshold
    @Query("SELECT p FROM Product p WHERE p.stockLevel <= p.threshold")
    List<Product> findLowStockProducts();
}
