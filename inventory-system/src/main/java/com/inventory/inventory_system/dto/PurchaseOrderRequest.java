package com.inventory.inventory_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderRequest {

    private Long id;

    private String poNumber;

    private String supplierName;

    private String supplierEmail; //  Required for sending emails

    private LocalDate createdDate;

    private LocalDate expectedDate;

    private String status;

    private Double totalAmount;

    private Integer progress;

    private List<PurchaseItemRequest> items; //  List of product items
}
