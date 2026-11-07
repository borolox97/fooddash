package com.fooddash.app.models;

import java.io.Serializable;

/**
 * User model representing a Customer or Restaurant Admin in Firebase Realtime Database.
 * Node path: fooddash/users/{uid}
 */
public class User implements Serializable {
    private String uid;
    private String name;
    private String email;
    private String phone;
    private String role; // "CUSTOMER" or "ADMIN"
    private String address;
    private String photoUrl;

    // Required empty constructor for Firebase Realtime Database DataSnapshot.getValue(User.class)
    public User() {
    }

    public User(String uid, String name, String email, String phone, String role, String address, String photoUrl) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.address = address;
        this.photoUrl = photoUrl;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(this.role);
    }
}
