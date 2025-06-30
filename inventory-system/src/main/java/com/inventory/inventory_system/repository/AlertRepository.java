package com.inventory.inventory_system.repository;

import com.inventory.inventory_system.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    boolean existsByTitle(String title);
}
