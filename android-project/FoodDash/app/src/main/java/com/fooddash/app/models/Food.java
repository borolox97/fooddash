package com.fooddash.app.models;

import java.io.Serializable;

/**
 * Food model representing a menu item in Firebase Realtime Database.
 * Node path: fooddash/food/{foodId}
 */
public class Food implements Serializable {
    private String foodId;
    private String name;
    private String description;
    private double price;
    private String category;
    private String imageUrl;
    private boolean available;

    // Required empty constructor for Firebase Realtime Database
    public Food() {
    }

    public Food(String foodId, String name, String description, double price,
                String category, String imageUrl, boolean available) {
        this.foodId = foodId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.imageUrl = imageUrl;
        this.available = available;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
