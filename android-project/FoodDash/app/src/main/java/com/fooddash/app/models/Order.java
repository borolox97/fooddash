package com.fooddash.app.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Order model stored under fooddash/orders/{orderId}.
 */
public class Order implements Serializable {
    private String orderId;
    private String customerId;
    private String customerName;
    private String customerPhone;
    private List<CartItem> items = new ArrayList<>();
    private double subtotal;
    private double deliveryFee;
    private double total;
    private String paymentMethod;  // "Cash on Delivery", "bKash", "Nagad"
    private String paymentStatus;  // "COD_DUE", "PENDING_VERIFICATION", "VERIFIED", "REJECTED"
    private String transactionId;  // Manual TrxID for bKash / Nagad
    private String status;         // "PENDING", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "REJECTED"
    private String deliveryAddress;
    private long createdAt;

    public Order() {
    }

    public Order(String orderId, String customerId, String customerName, String customerPhone,
                 List<CartItem> items, double subtotal, double deliveryFee, double total,
                 String paymentMethod, String paymentStatus, String transactionId,
                 String status, String deliveryAddress, long createdAt) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.items = items;
        this.subtotal = subtotal;
        this.deliveryFee = deliveryFee;
        this.total = total;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.transactionId = transactionId;
        this.status = status;
        this.deliveryAddress = deliveryAddress;
        this.createdAt = createdAt;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(double deliveryFee) { this.deliveryFee = deliveryFee; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }
}
