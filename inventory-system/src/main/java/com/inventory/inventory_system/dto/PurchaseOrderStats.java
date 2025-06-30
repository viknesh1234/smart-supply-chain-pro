package com.inventory.inventory_system.dto;

public class PurchaseOrderStats {
    private long totalOrders;
    private long pendingOrders;
    private long inTransitOrders;

    public PurchaseOrderStats(long totalOrders, long pendingOrders, long inTransitOrders) {
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.inTransitOrders = inTransitOrders;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public long getInTransitOrders() {
        return inTransitOrders;
    }
}
