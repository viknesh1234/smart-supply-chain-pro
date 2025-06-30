package com.inventory.inventory_system.controller;

import com.inventory.inventory_system.entity.Sale;
import com.inventory.inventory_system.repository.SaleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin("*")
public class SaleController {
    private final SaleRepository repository;

    public SaleController(SaleRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Sale> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Sale create(@RequestBody Sale sale) {
        return repository.save(sale);
    }
}
