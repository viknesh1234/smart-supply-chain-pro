package com.inventory.inventory_system.service;

import com.inventory.inventory_system.dto.PurchaseOrderRequest;
import com.inventory.inventory_system.dto.PurchaseItemRequest;
import com.inventory.inventory_system.entity.PurchaseOrder;
import com.inventory.inventory_system.entity.PurchaseItem;
import com.inventory.inventory_system.repository.PurchaseOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private final PurchaseOrderRepository repository;
    private final JavaMailSender mailSender;

    //  Get all purchase orders
    public List<PurchaseOrderRequest> getAll() {
        return repository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    //  Create a new purchase order with optional supplier email
    public PurchaseOrderRequest create(PurchaseOrderRequest request) {
        PurchaseOrder po = toEntity(request);
        PurchaseOrder saved = repository.save(po);

        if (saved.getSupplierEmail() != null && !saved.getSupplierEmail().isEmpty()) {
            String subject = "New Purchase Order: " + saved.getPoNumber();
            String text = "Dear " + saved.getSupplierName() + ",\n\n"
                    + "You have received a new purchase order.\n"
                    + "PO Number: " + saved.getPoNumber() + "\n"
                    + "Total Amount: $" + saved.getTotalAmount() + "\n"
                    + "Expected Delivery: " + saved.getExpectedDate() + "\n\n"
                    + "Thank you.";
            sendEmail(saved.getSupplierEmail(), subject, text);
        }

        return toDto(saved);
    }

    //  Update purchase order status and send approval email if applicable
    public PurchaseOrderRequest updateStatus(Long id, String newStatus) {
        PurchaseOrder po = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("PO not found"));

        String oldStatus = po.getStatus();
        po.setStatus(newStatus);
        PurchaseOrder updated = repository.save(po);

        if ("approved".equalsIgnoreCase(newStatus) && !"approved".equalsIgnoreCase(oldStatus)) {
            if (updated.getSupplierEmail() != null && !updated.getSupplierEmail().isEmpty()) {
                String subject = "Your Purchase Order has been Approved";
                String text = "Dear " + updated.getSupplierName() + ",\n\n"
                        + "Your purchase order has been approved.\n"
                        + "PO Number: " + updated.getPoNumber() + "\n"
                        + "Total Amount: $" + updated.getTotalAmount() + "\n\n"
                        + "Thank you.";
                sendEmail(updated.getSupplierEmail(), subject, text);
            }
        }

        return toDto(updated);
    }

    //  Count of pending orders
    public long getPendingOrderCount() {
        return repository.countByStatus("pending");
    }

    //  Count of in-transit orders
    public long getInTransitOrderCount() {
        return repository.countByStatus("in transit");
    }

    //  Count of all orders
    public long getTotalOrderCount() {
        return repository.count();
    }

    //  Email sender
    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println("✅ Email sent to: " + to);
        } catch (Exception e) {
            System.err.println("❌ Email send failed: " + e.getMessage());
        }
    }

    //  Convert entity → DTO
    private PurchaseOrderRequest toDto(PurchaseOrder po) {
        PurchaseOrderRequest dto = new PurchaseOrderRequest();
        dto.setId(po.getId());
        dto.setPoNumber(po.getPoNumber());
        dto.setSupplierName(po.getSupplierName());
        dto.setSupplierEmail(po.getSupplierEmail());
        dto.setCreatedDate(po.getCreatedDate());
        dto.setExpectedDate(po.getExpectedDate());
        dto.setStatus(po.getStatus());
        dto.setTotalAmount(po.getTotalAmount());
        dto.setProgress(po.getProgress());

        dto.setItems(po.getItems().stream().map(item -> {
            PurchaseItemRequest i = new PurchaseItemRequest();
            i.setProductId(item.getProductId());
            i.setQuantity(item.getQuantity());
            i.setUnitPrice(item.getUnitPrice());
            return i;
        }).collect(Collectors.toList()));

        return dto;
    }

    //  Convert DTO → entity
    private PurchaseOrder toEntity(PurchaseOrderRequest dto) {
        PurchaseOrder po = new PurchaseOrder();
        po.setPoNumber(dto.getPoNumber());
        po.setSupplierName(dto.getSupplierName());
        po.setSupplierEmail(dto.getSupplierEmail());
        po.setCreatedDate(dto.getCreatedDate());
        po.setExpectedDate(dto.getExpectedDate());
        po.setStatus(dto.getStatus());
        po.setTotalAmount(dto.getTotalAmount());
        po.setProgress(dto.getProgress());

        List<PurchaseItem> items = dto.getItems().stream().map(item -> {
            PurchaseItem i = new PurchaseItem();
            i.setProductId(item.getProductId());
            i.setQuantity(item.getQuantity());
            i.setUnitPrice(item.getUnitPrice());
            i.setTotal(item.getQuantity() * item.getUnitPrice());
            i.setPurchaseOrder(po); // back reference
            return i;
        }).collect(Collectors.toList());

        po.setItems(items);
        return po;
    }
}
