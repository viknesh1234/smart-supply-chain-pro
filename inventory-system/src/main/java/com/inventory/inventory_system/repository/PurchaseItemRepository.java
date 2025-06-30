package com.inventory.inventory_system.repository;

import com.inventory.inventory_system.entity.PurchaseItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseItemRepository extends JpaRepository<PurchaseItem, Long> {
    // You can add custom queries here if needed in the future
}
