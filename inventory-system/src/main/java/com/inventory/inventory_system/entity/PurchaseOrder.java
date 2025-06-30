package com.inventory.inventory_system.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String poNumber;

    @Column(nullable = false)
    private String supplierName;

    @Column(nullable = false)
    private String supplierEmail;

    @Column(nullable = false)
    private LocalDate createdDate;

    @Column(nullable = false)
    private LocalDate expectedDate;

    @Column(nullable = false)
    private String status; // e.g., "created", "sent", etc.

    @Column(nullable = false)
    private Double totalAmount;

    private Integer progress; // Optional

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseItem> items;
}
