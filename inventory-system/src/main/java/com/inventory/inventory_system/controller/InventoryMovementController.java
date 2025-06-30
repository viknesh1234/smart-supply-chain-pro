package com.inventory.inventory_system.controller;

import com.inventory.inventory_system.entity.InventoryMovement;
import com.inventory.inventory_system.service.InventoryMovementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movements")
@CrossOrigin("*")
public class InventoryMovementController {
    private final InventoryMovementService service;

    public InventoryMovementController(InventoryMovementService service) {
        this.service = service;
    }

    @GetMapping
    public List<InventoryMovement> getAll() {
        return service.getAll();
    }

    @PostMapping
    public InventoryMovement create(@RequestBody InventoryMovement movement) {
        return service.save(movement);
    }
}
