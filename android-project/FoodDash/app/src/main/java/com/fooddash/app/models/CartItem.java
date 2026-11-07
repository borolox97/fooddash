package com.fooddash.app.models;

import java.io.Serializable;

/**
 * CartItem model representing a selected food item and its quantity.
 */
public class CartItem implements Serializable {
    private String foodId;
    private String name;
    private double price;
    private int quantity;
    private String imageUrl;

    public CartItem() {
    }

    public CartItem(String foodId, String name, double price, int quantity, String imageUrl) {
        this.foodId = foodId;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
    }

    public String getFoodId() {
        return foodId;
    }

    public void setFoodId(String foodId) {
        this.foodId = foodId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getLineTotal() {
        return price * quantity;
    }
}
