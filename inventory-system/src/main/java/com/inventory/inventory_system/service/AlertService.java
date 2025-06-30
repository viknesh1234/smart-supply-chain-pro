package com.inventory.inventory_system.service;

import com.inventory.inventory_system.dto.AlertDTO;
import com.inventory.inventory_system.entity.Alert;
import com.inventory.inventory_system.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertService {

    private final AlertRepository alertRepository;

    @Autowired
    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<AlertDTO> getAllAlerts() {
        List<Alert> alerts = alertRepository.findAll();

        return alerts.stream().map(alert -> {
            AlertDTO dto = new AlertDTO();
            dto.setId(alert.getId());
            dto.setTitle(alert.getTitle());
            dto.setMessage(alert.getMessage());
            dto.setType(alert.getType());
            dto.setSeverity(alert.getSeverity());
            dto.setTriggeredAt(alert.getTriggeredAt());
            dto.setAction(alert.getAction());

            //  Include product name if linked
            if (alert.getProduct() != null) {
                dto.setProductName(alert.getProduct().getName());
            }

            return dto;
        }).collect(Collectors.toList());
    }
}
