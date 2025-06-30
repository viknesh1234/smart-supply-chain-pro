package com.inventory.inventory_system.dto;

import java.time.LocalDateTime;

public class AlertDTO {
    private Long id;
    private String title;
    private String message;
    private String type;
    private String severity;
    private LocalDateTime triggeredAt;
    private String action;
    private String productName;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public LocalDateTime getTriggeredAt() { return triggeredAt; }
    public void setTriggeredAt(LocalDateTime triggeredAt) { this.triggeredAt = triggeredAt; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
}
