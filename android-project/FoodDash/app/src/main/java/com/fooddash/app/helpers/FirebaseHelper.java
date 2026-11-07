package com.fooddash.app.helpers;

import android.net.Uri;
import androidx.annotation.NonNull;
import com.fooddash.app.models.Food;
import com.fooddash.app.models.Order;
import com.fooddash.app.models.User;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

/**
 * FirebaseHelper encapsulates all Firebase Auth, Realtime Database, and Storage operations
 * under the root node "fooddash/".
 */
public class FirebaseHelper {
    private static final String ROOT_NODE = "fooddash";
    private static FirebaseHelper instance;

    private final FirebaseAuth auth;
    private final DatabaseReference rootRef;
    private final StorageReference storageRef;

    private FirebaseHelper() {
        auth = FirebaseAuth.getInstance();
        rootRef = FirebaseDatabase.getInstance().getReference(ROOT_NODE);
        storageRef = FirebaseStorage.getInstance().getReference(ROOT_NODE);
    }

    public static synchronized FirebaseHelper getInstance() {
        if (instance == null) {
            instance = new FirebaseHelper();
        }
        return instance;
    }

    public FirebaseAuth getAuth() {
        return auth;
    }

    public FirebaseUser getCurrentUser() {
        return auth.getCurrentUser();
    }

    public DatabaseReference getUsersRef() {
        return rootRef.child("users");
    }

    public DatabaseReference getFoodRef() {
        return rootRef.child("food");
    }

    public DatabaseReference getCategoriesRef() {
        return rootRef.child("categories");
    }

    public DatabaseReference getOrdersRef() {
        return rootRef.child("orders");
    }

    public DatabaseReference getSettingsRef() {
        return rootRef.child("settings");
    }

    public StorageReference getFoodImagesStorageRef() {
        return storageRef.child("food_images");
    }

    public StorageReference getProfileImagesStorageRef() {
        return storageRef.child("profile_images");
    }

    public void saveUserProfile(@NonNull User user, OnCompleteListener<Void> listener) {
        // Role is strictly enforced by Firebase Security Rules; new registrations default to CUSTOMER
        getUsersRef().child(user.getUid()).setValue(user).addOnCompleteListener(listener);
    }

    public void saveFoodItem(@NonNull Food food, OnCompleteListener<Void> listener) {
        if (food.getFoodId() == null || food.getFoodId().isEmpty()) {
            String key = getFoodRef().push().getKey();
            food.setFoodId(key);
        }
        getFoodRef().child(food.getFoodId()).setValue(food).addOnCompleteListener(listener);
    }

    public void deleteFoodItem(@NonNull String foodId, OnCompleteListener<Void> listener) {
        getFoodRef().child(foodId).removeValue().addOnCompleteListener(listener);
    }

    public void placeOrder(@NonNull Order order, OnCompleteListener<Void> listener) {
        if (order.getOrderId() == null || order.getOrderId().isEmpty()) {
            String key = getOrdersRef().push().getKey();
            order.setOrderId(key);
        }
        getOrdersRef().child(order.getOrderId()).setValue(order).addOnCompleteListener(listener);
    }

    public void updateOrderStatus(@NonNull String orderId, @NonNull String newStatus, OnCompleteListener<Void> listener) {
        getOrdersRef().child(orderId).child("status").setValue(newStatus).addOnCompleteListener(listener);
    }

    public void verifyOrderPayment(@NonNull String orderId, @NonNull String paymentStatus, OnCompleteListener<Void> listener) {
        getOrdersRef().child(orderId).child("paymentStatus").setValue(paymentStatus).addOnCompleteListener(listener);
    }

    public interface ImageUploadCallback {
        void onSuccess(String downloadUrl);
        void onError(String message);
    }

    public void uploadImage(@NonNull StorageReference folderRef, @NonNull String fileName,
                            @NonNull Uri fileUri, @NonNull ImageUploadCallback callback) {
        StorageReference fileRef = folderRef.child(fileName + ".jpg");
        fileRef.putFile(fileUri)
                .addOnSuccessListener(taskSnapshot ->
                        fileRef.getDownloadUrl().addOnSuccessListener(uri ->
                                callback.onSuccess(uri.toString())))
                .addOnFailureListener(e -> callback.onError(e.getMessage()));
    }
}
