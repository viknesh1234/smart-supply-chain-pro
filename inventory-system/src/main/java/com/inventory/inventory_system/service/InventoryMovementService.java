package com.inventory.inventory_system.service;

import com.inventory.inventory_system.entity.InventoryMovement;
import com.inventory.inventory_system.entity.Product;
import com.inventory.inventory_system.repository.InventoryMovementRepository;
import com.inventory.inventory_system.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryMovementService {

    private final InventoryMovementRepository repository;
    private final ProductRepository productRepository;

    public InventoryMovementService(InventoryMovementRepository repository, ProductRepository productRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
    }

    public List<InventoryMovement> getAll() {
        return repository.findAll();
    }

    public InventoryMovement save(InventoryMovement movement) {
        Product product = movement.getProduct();

        if ("IN".equalsIgnoreCase(movement.getType())) {
            product.setStockLevel(product.getStockLevel() + movement.getQuantity());
        } else if ("OUT".equalsIgnoreCase(movement.getType())) {
            product.setStockLevel(product.getStockLevel() - movement.getQuantity());
        }

        productRepository.save(product);
        return repository.save(movement);
    }
}
