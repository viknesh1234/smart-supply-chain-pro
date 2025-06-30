package com.inventory.inventory_system.repository;

import com.inventory.inventory_system.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    long countByStatus(String status);

    long countBySupplierName(String supplierName);

    long countByStatusIn(List<String> statuses);
}
