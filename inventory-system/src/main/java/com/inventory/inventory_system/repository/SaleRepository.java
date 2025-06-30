package com.inventory.inventory_system.repository;

import com.inventory.inventory_system.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}
