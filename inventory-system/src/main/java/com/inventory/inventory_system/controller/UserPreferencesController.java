package com.inventory.inventory_system.controller;

import com.inventory.inventory_system.entity.UserPreferences;
import com.inventory.inventory_system.repository.UserPreferencesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
@CrossOrigin("*")
public class UserPreferencesController {

    @Autowired
    private UserPreferencesRepository repository;

    @GetMapping("/{id}")
    public UserPreferences get(@PathVariable Long id) {
        return repository.findById(id).orElse(new UserPreferences());
    }

    @PostMapping
    public UserPreferences save(@RequestBody UserPreferences prefs) {
        return repository.save(prefs);
    }
}
