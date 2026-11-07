export interface AndroidSourceFile {
  path: string;
  name: string;
  category: 'models' | 'adapters' | 'helpers' | 'activities' | 'layout' | 'values' | 'config' | 'docs';
  language: 'java' | 'xml' | 'json' | 'kotlin' | 'markdown';
  description: string;
  universityRequirementIds: number[];
  content: string;
}

export const MODELS_AND_HELPERS_FILES: AndroidSourceFile[] = [
  {
    path: 'app/src/main/java/com/fooddash/app/models/User.java',
    name: 'User.java',
    category: 'models',
    language: 'java',
    description: 'Java POJO model class for Firebase users node (uid, name, email, phone, role, address, photoUrl) with default constructor for Firebase DataSnapshot deserialization and full getters/setters.',
    universityRequirementIds: [4, 7, 8],
    content: `package com.fooddash.app.models;

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
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/models/Food.java',
    name: 'Food.java',
    category: 'models',
    language: 'java',
    description: 'Java model class for food items stored under fooddash/food/{foodId} with getters, setters, and Serializable support for Intent.putExtra().',
    universityRequirementIds: [1, 4, 6, 8],
    content: `package com.fooddash.app.models;

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
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/models/CartItem.java',
    name: 'CartItem.java',
    category: 'models',
    language: 'java',
    description: 'Java model class for shopping cart line items and order line items with quantity and line subtotal computation.',
    universityRequirementIds: [4, 5],
    content: `package com.fooddash.app.models;

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
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/models/Order.java',
    name: 'Order.java',
    category: 'models',
    language: 'java',
    description: 'Java model class for customer orders under fooddash/orders/{orderId} supporting COD, bKash, and Nagad with PENDING_VERIFICATION status.',
    universityRequirementIds: [4, 8],
    content: `package com.fooddash.app.models;

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
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/helpers/FirebaseHelper.java',
    name: 'FirebaseHelper.java',
    category: 'helpers',
    language: 'java',
    description: 'Centralized singleton helper managing FirebaseAuth, FirebaseDatabase references (fooddash/users, food, categories, orders, settings), and FirebaseStorage uploads.',
    universityRequirementIds: [6, 7, 8, 10],
    content: `package com.fooddash.app.helpers;

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
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/helpers/SessionManager.java',
    name: 'SessionManager.java',
    category: 'helpers',
    language: 'java',
    description: 'SharedPreferences wrapper persisting Remember Me state, cached user role, saved delivery address, local cart JSON, and shake-to-refresh preference.',
    universityRequirementIds: [7, 9],
    content: `package com.fooddash.app.helpers;

import android.content.Context;
import android.content.SharedPreferences;
import com.fooddash.app.models.CartItem;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

/**
 * SessionManager satisfies Requirement #9: Save settings on the phone using SharedPreferences.
 * Stores Remember Me, cached user role, last delivery address, shake-to-refresh toggle, and cart items.
 */
public class SessionManager {
    private static final String PREF_NAME = "FoodDashPrefs";
    private static final String KEY_REMEMBER_ME = "remember_me";
    private static final String KEY_SAVED_EMAIL = "saved_email";
    private static final String KEY_USER_ROLE = "user_role";
    private static final String KEY_USER_NAME = "user_name";
    private static final String KEY_SHAKE_ENABLED = "shake_to_refresh_enabled";
    private static final String KEY_CART_JSON = "cart_items_json";

    private final SharedPreferences prefs;
    private final SharedPreferences.Editor editor;
    private final Gson gson;

    public SessionManager(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = prefs.edit();
        gson = new Gson();
    }

    public void setRememberMe(boolean remember, String email) {
        editor.putBoolean(KEY_REMEMBER_ME, remember);
        editor.putString(KEY_SAVED_EMAIL, remember ? email : "");
        editor.apply();
    }

    public boolean isRememberMeEnabled() {
        return prefs.getBoolean(KEY_REMEMBER_ME, true);
    }

    public String getSavedEmail() {
        return prefs.getString(KEY_SAVED_EMAIL, "");
    }

    public void saveUserSession(String name, String role) {
        editor.putString(KEY_USER_NAME, name);
        editor.putString(KEY_USER_ROLE, role);
        editor.apply();
    }

    public String getUserRole() {
        return prefs.getString(KEY_USER_ROLE, "CUSTOMER");
    }

    public String getUserName() {
        return prefs.getString(KEY_USER_NAME, "");
    }

    public void setShakeToRefreshEnabled(boolean enabled) {
        editor.putBoolean(KEY_SHAKE_ENABLED, enabled);
        editor.apply();
    }

    public boolean isShakeToRefreshEnabled() {
        return prefs.getBoolean(KEY_SHAKE_ENABLED, true);
    }

    public void saveCartItems(List<CartItem> items) {
        editor.putString(KEY_CART_JSON, gson.toJson(items));
        editor.apply();
    }

    public List<CartItem> getCartItems() {
        String json = prefs.getString(KEY_CART_JSON, null);
        if (json == null || json.isEmpty()) {
            return new ArrayList<>();
        }
        Type type = new TypeToken<ArrayList<CartItem>>() {}.getType();
        return gson.fromJson(json, type);
    }

    public void clearCart() {
        editor.remove(KEY_CART_JSON).apply();
    }

    public void clearSessionOnLogout() {
        boolean remember = isRememberMeEnabled();
        String savedEmail = getSavedEmail();
        editor.clear();
        editor.putBoolean(KEY_REMEMBER_ME, remember);
        editor.putString(KEY_SAVED_EMAIL, savedEmail);
        editor.apply();
    }
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/helpers/ValidationHelper.java',
    name: 'ValidationHelper.java',
    category: 'helpers',
    language: 'java',
    description: 'Input validation helper using TextInputEditText and setError() to prevent crashes on empty or malformed inputs.',
    universityRequirementIds: [3],
    content: `package com.fooddash.app.helpers;

import android.util.Patterns;
import com.google.android.material.textfield.TextInputEditText;

/**
 * ValidationHelper satisfies Requirement #3: User input with validation
 * using TextInputEditText + setError() so the app never crashes on empty or invalid input.
 */
public class ValidationHelper {

    public static boolean validateRequired(TextInputEditText editText, String fieldName) {
        String text = editText.getText() != null ? editText.getText().toString().trim() : "";
        if (text.isEmpty()) {
            editText.setError(fieldName + " is required");
            editText.requestFocus();
            return false;
        }
        editText.setError(null);
        return true;
    }

    public static boolean validateEmail(TextInputEditText emailInput) {
        String email = emailInput.getText() != null ? emailInput.getText().toString().trim() : "";
        if (email.isEmpty()) {
            emailInput.setError("Email address is required");
            emailInput.requestFocus();
            return false;
        }
        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            emailInput.setError("Please enter a valid email address");
            emailInput.requestFocus();
            return false;
        }
        emailInput.setError(null);
        return true;
    }

    public static boolean validatePassword(TextInputEditText passwordInput) {
        String password = passwordInput.getText() != null ? passwordInput.getText().toString() : "";
        if (password.isEmpty()) {
            passwordInput.setError("Password is required");
            passwordInput.requestFocus();
            return false;
        }
        if (password.length() < 6) {
            passwordInput.setError("Password must be at least 6 characters");
            passwordInput.requestFocus();
            return false;
        }
        passwordInput.setError(null);
        return true;
    }

    public static boolean validatePhone(TextInputEditText phoneInput) {
        String phone = phoneInput.getText() != null ? phoneInput.getText().toString().trim() : "";
        if (phone.isEmpty()) {
            phoneInput.setError("Phone number is required");
            phoneInput.requestFocus();
            return false;
        }
        if (!phone.matches("^(\\+?8801|01)[3-9]\\d{8}$") && phone.length() < 10) {
            phoneInput.setError("Enter a valid phone number (e.g. 01712345678)");
            phoneInput.requestFocus();
            return false;
        }
        phoneInput.setError(null);
        return true;
    }

    public static boolean validatePositivePrice(TextInputEditText priceInput) {
        String raw = priceInput.getText() != null ? priceInput.getText().toString().trim() : "";
        if (raw.isEmpty()) {
            priceInput.setError("Price is required");
            priceInput.requestFocus();
            return false;
        }
        try {
            double value = Double.parseDouble(raw);
            if (value <= 0) {
                priceInput.setError("Price must be greater than 0");
                priceInput.requestFocus();
                return false;
            }
        } catch (NumberFormatException e) {
            priceInput.setError("Enter a valid numeric price");
            priceInput.requestFocus();
            return false;
        }
        priceInput.setError(null);
        return true;
    }

    public static boolean validateTransactionId(TextInputEditText trxInput, String paymentMethod) {
        String trx = trxInput.getText() != null ? trxInput.getText().toString().trim() : "";
        if (trx.isEmpty()) {
            trxInput.setError("Enter your " + paymentMethod + " Transaction ID");
            trxInput.requestFocus();
            return false;
        }
        if (!trx.matches("^[A-Za-z0-9]{6,20}$")) {
            trxInput.setError("Transaction ID must be 6-20 alphanumeric characters");
            trxInput.requestFocus();
            return false;
        }
        trxInput.setError(null);
        return true;
    }
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/helpers/ShakeDetector.java',
    name: 'ShakeDetector.java',
    category: 'helpers',
    language: 'java',
    description: 'Hardware accelerometer listener implementing SensorEventListener to trigger shake-to-refresh on CustomerHomeActivity and MyOrdersActivity.',
    universityRequirementIds: [11],
    content: `package com.fooddash.app.helpers;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

/**
 * ShakeDetector satisfies Requirement #11: Use one sensor (Accelerometer)
 * with SensorManager + SensorEventListener to implement Shake-to-Refresh.
 */
public class ShakeDetector implements SensorEventListener {
    private static final float SHAKE_THRESHOLD_GRAVITY = 2.7F;
    private static final int SHAKE_SLOP_TIME_MS = 750;

    private OnShakeListener listener;
    private long shakeTimestamp;

    public interface OnShakeListener {
        void onShake();
    }

    public ShakeDetector(OnShakeListener listener) {
        this.listener = listener;
    }

    public void setOnShakeListener(OnShakeListener listener) {
        this.listener = listener;
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (listener == null || event.sensor.getType() != Sensor.TYPE_ACCELEROMETER) {
            return;
        }

        float x = event.values[0];
        float y = event.values[1];
        float z = event.values[2];

        float gX = x / SensorManager.GRAVITY_EARTH;
        float gY = y / SensorManager.GRAVITY_EARTH;
        float gZ = z / SensorManager.GRAVITY_EARTH;

        // gForce will be close to 1 when there is no movement
        float gForce = (float) Math.sqrt(gX * gX + gY * gY + gZ * gZ);

        if (gForce > SHAKE_THRESHOLD_GRAVITY) {
            final long now = System.currentTimeMillis();
            if (shakeTimestamp + SHAKE_SLOP_TIME_MS > now) {
                return;
            }
            shakeTimestamp = now;
            listener.onShake();
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // No-op
    }
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/adapters/FoodAdapter.java',
    name: 'FoodAdapter.java',
    category: 'adapters',
    language: 'java',
    description: 'RecyclerView.Adapter and ViewHolder displaying food cards with support for both Customer mode (Add to Cart / View Details) and Admin mode (Edit / Delete / Toggle Availability).',
    universityRequirementIds: [2, 5, 6],
    content: `package com.fooddash.app.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.fooddash.app.R;
import com.fooddash.app.models.Food;
import java.util.List;
import java.util.Locale;

/**
 * FoodAdapter satisfies Requirement #5: RecyclerView + Adapter + ViewHolder.
 * Supports both Customer browsing and Admin CRUD actions.
 */
public class FoodAdapter extends RecyclerView.Adapter<FoodAdapter.FoodViewHolder> {

    public interface OnFoodActionListener {
        void onFoodClick(Food food);
        void onAddToCartClick(Food food);
        void onEditClick(Food food);
        void onDeleteClick(Food food);
        void onToggleAvailability(Food food);
    }

    private final Context context;
    private List<Food> foodList;
    private final boolean isAdminMode;
    private final OnFoodActionListener listener;

    public FoodAdapter(Context context, List<Food> foodList, boolean isAdminMode, OnFoodActionListener listener) {
        this.context = context;
        this.foodList = foodList;
        this.isAdminMode = isAdminMode;
        this.listener = listener;
    }

    public void updateList(List<Food> updated) {
        this.foodList = updated;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public FoodViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_food, parent, false);
        return new FoodViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull FoodViewHolder holder, int position) {
        Food food = foodList.get(position);
        holder.tvName.setText(food.getName());
        holder.tvCategory.setText(food.getCategory());
        holder.tvDescription.setText(food.getDescription());
        holder.tvPrice.setText(String.format(Locale.US, "BDT %.0f", food.getPrice()));
        holder.tvAvailability.setText(food.isAvailable() ? "Available" : "Sold Out");

        if (food.getImageUrl() != null && !food.getImageUrl().isEmpty()) {
            Glide.with(context)
                    .load(food.getImageUrl())
                    .placeholder(R.drawable.ic_fooddash_logo)
                    .into(holder.ivFood);
        }

        holder.cardView.setOnClickListener(v -> {
            if (listener != null) listener.onFoodClick(food);
        });

        if (isAdminMode) {
            holder.btnPrimaryAction.setText("Edit");
            holder.btnPrimaryAction.setOnClickListener(v -> {
                if (listener != null) listener.onEditClick(food);
            });
            holder.btnDeleteAction.setVisibility(View.VISIBLE);
            holder.btnDeleteAction.setOnClickListener(v -> {
                if (listener != null) listener.onDeleteClick(food);
            });
            holder.tvAvailability.setOnClickListener(v -> {
                if (listener != null) listener.onToggleAvailability(food);
            });
        } else {
            holder.btnDeleteAction.setVisibility(View.GONE);
            holder.btnPrimaryAction.setText(food.isAvailable() ? "Add to Cart" : "Unavailable");
            holder.btnPrimaryAction.setEnabled(food.isAvailable());
            holder.btnPrimaryAction.setOnClickListener(v -> {
                if (listener != null && food.isAvailable()) listener.onAddToCartClick(food);
            });
        }
    }

    @Override
    public int getItemCount() {
        return foodList != null ? foodList.size() : 0;
    }

    public static class FoodViewHolder extends RecyclerView.ViewHolder {
        final CardView cardView;
        final ImageView ivFood;
        final TextView tvName;
        final TextView tvCategory;
        final TextView tvDescription;
        final TextView tvPrice;
        final TextView tvAvailability;
        final Button btnPrimaryAction;
        final Button btnDeleteAction;

        public FoodViewHolder(@NonNull View itemView) {
            super(itemView);
            cardView = itemView.findViewById(R.id.cardFoodItem);
            ivFood = itemView.findViewById(R.id.ivFoodImage);
            tvName = itemView.findViewById(R.id.tvFoodName);
            tvCategory = itemView.findViewById(R.id.tvFoodCategory);
            tvDescription = itemView.findViewById(R.id.tvFoodDescription);
            tvPrice = itemView.findViewById(R.id.tvFoodPrice);
            tvAvailability = itemView.findViewById(R.id.tvFoodAvailability);
            btnPrimaryAction = itemView.findViewById(R.id.btnFoodPrimaryAction);
            btnDeleteAction = itemView.findViewById(R.id.btnFoodDeleteAction);
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/adapters/CartAdapter.java',
    name: 'CartAdapter.java',
    category: 'adapters',
    language: 'java',
    description: 'RecyclerView.Adapter and ViewHolder for shopping cart items with quantity increment, decrement, and item removal callbacks.',
    universityRequirementIds: [2, 5],
    content: `package com.fooddash.app.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.fooddash.app.R;
import com.fooddash.app.models.CartItem;
import java.util.List;
import java.util.Locale;

/**
 * CartAdapter manages the RecyclerView inside CartActivity.
 */
public class CartAdapter extends RecyclerView.Adapter<CartAdapter.CartViewHolder> {

    public interface OnCartChangeListener {
        void onQuantityChanged(CartItem item, int newQuantity);
        void onRemoveItem(CartItem item);
    }

    private final Context context;
    private final List<CartItem> cartItems;
    private final OnCartChangeListener listener;

    public CartAdapter(Context context, List<CartItem> cartItems, OnCartChangeListener listener) {
        this.context = context;
        this.cartItems = cartItems;
        this.listener = listener;
    }

    @NonNull
    @Override
    public CartViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_cart, parent, false);
        return new CartViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CartViewHolder holder, int position) {
        CartItem item = cartItems.get(position);
        holder.tvName.setText(item.getName());
        holder.tvUnitPrice.setText(String.format(Locale.US, "BDT %.0f each", item.getPrice()));
        holder.tvQuantity.setText(String.valueOf(item.getQuantity()));
        holder.tvLineTotal.setText(String.format(Locale.US, "BDT %.0f", item.getLineTotal()));

        if (item.getImageUrl() != null && !item.getImageUrl().isEmpty()) {
            Glide.with(context)
                    .load(item.getImageUrl())
                    .placeholder(R.drawable.ic_fooddash_logo)
                    .into(holder.ivCartImage);
        }

        holder.btnPlus.setOnClickListener(v -> {
            if (listener != null) listener.onQuantityChanged(item, item.getQuantity() + 1);
        });

        holder.btnMinus.setOnClickListener(v -> {
            if (listener != null) {
                if (item.getQuantity() > 1) {
                    listener.onQuantityChanged(item, item.getQuantity() - 1);
                } else {
                    listener.onRemoveItem(item);
                }
            }
        });

        holder.btnRemove.setOnClickListener(v -> {
            if (listener != null) listener.onRemoveItem(item);
        });
    }

    @Override
    public int getItemCount() {
        return cartItems != null ? cartItems.size() : 0;
    }

    public static class CartViewHolder extends RecyclerView.ViewHolder {
        final ImageView ivCartImage;
        final TextView tvName;
        final TextView tvUnitPrice;
        final TextView tvQuantity;
        final TextView tvLineTotal;
        final Button btnMinus;
        final Button btnPlus;
        final Button btnRemove;

        public CartViewHolder(@NonNull View itemView) {
            super(itemView);
            ivCartImage = itemView.findViewById(R.id.ivCartFood);
            tvName = itemView.findViewById(R.id.tvCartFoodName);
            tvUnitPrice = itemView.findViewById(R.id.tvCartUnitPrice);
            tvQuantity = itemView.findViewById(R.id.tvCartQty);
            tvLineTotal = itemView.findViewById(R.id.tvCartLineTotal);
            btnMinus = itemView.findViewById(R.id.btnCartMinus);
            btnPlus = itemView.findViewById(R.id.btnCartPlus);
            btnRemove = itemView.findViewById(R.id.btnCartRemove);
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/adapters/OrderAdapter.java',
    name: 'OrderAdapter.java',
    category: 'adapters',
    language: 'java',
    description: 'RecyclerView.Adapter and ViewHolder for customer order history and admin order management (status updates + manual bKash/Nagad verification).',
    universityRequirementIds: [2, 5, 8],
    content: `package com.fooddash.app.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;
import com.fooddash.app.R;
import com.fooddash.app.models.Order;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * OrderAdapter renders orders in both MyOrdersActivity (Customer) and AdminOrdersActivity (Admin).
 */
public class OrderAdapter extends RecyclerView.Adapter<OrderAdapter.OrderViewHolder> {

    public interface OnOrderActionListener {
        void onOrderClick(Order order);
        void onVerifyPaymentClick(Order order);
        void onUpdateStatusClick(Order order);
    }

    private final Context context;
    private final List<Order> orderList;
    private final boolean isAdminMode;
    private final OnOrderActionListener listener;
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.US);

    public OrderAdapter(Context context, List<Order> orderList, boolean isAdminMode, OnOrderActionListener listener) {
        this.context = context;
        this.orderList = orderList;
        this.isAdminMode = isAdminMode;
        this.listener = listener;
    }

    @NonNull
    @Override
    public OrderViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_order, parent, false);
        return new OrderViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull OrderViewHolder holder, int position) {
        Order order = orderList.get(position);
        holder.tvOrderId.setText("Order #" + order.getOrderId());
        holder.tvCustomerName.setText(order.getCustomerName() + " · " + order.getCustomerPhone());
        holder.tvOrderDate.setText(dateFormat.format(new Date(order.getCreatedAt())));
        holder.tvOrderStatus.setText("Status: " + order.getStatus());

        String paymentDetails = order.getPaymentMethod() + " (" + order.getPaymentStatus() + ")";
        if (order.getTransactionId() != null && !order.getTransactionId().isEmpty()) {
            paymentDetails += " · TrxID: " + order.getTransactionId();
        }
        holder.tvPaymentInfo.setText(paymentDetails);
        holder.tvTotalAmount.setText(String.format(Locale.US, "BDT %.0f", order.getTotal()));

        holder.cardOrder.setOnClickListener(v -> {
            if (listener != null) listener.onOrderClick(order);
        });

        if (isAdminMode) {
            holder.btnUpdateStatus.setVisibility(View.VISIBLE);
            holder.btnUpdateStatus.setOnClickListener(v -> {
                if (listener != null) listener.onUpdateStatusClick(order);
            });

            if ("PENDING_VERIFICATION".equals(order.getPaymentStatus())) {
                holder.btnVerifyPayment.setVisibility(View.VISIBLE);
                holder.btnVerifyPayment.setOnClickListener(v -> {
                    if (listener != null) listener.onVerifyPaymentClick(order);
                });
            } else {
                holder.btnVerifyPayment.setVisibility(View.GONE);
            }
        } else {
            holder.btnUpdateStatus.setVisibility(View.GONE);
            holder.btnVerifyPayment.setVisibility(View.GONE);
        }
    }

    @Override
    public int getItemCount() {
        return orderList != null ? orderList.size() : 0;
    }

    public static class OrderViewHolder extends RecyclerView.ViewHolder {
        final CardView cardOrder;
        final TextView tvOrderId;
        final TextView tvCustomerName;
        final TextView tvOrderDate;
        final TextView tvOrderStatus;
        final TextView tvPaymentInfo;
        final TextView tvTotalAmount;
        final Button btnVerifyPayment;
        final Button btnUpdateStatus;

        public OrderViewHolder(@NonNull View itemView) {
            super(itemView);
            cardOrder = itemView.findViewById(R.id.cardOrder);
            tvOrderId = itemView.findViewById(R.id.tvOrderId);
            tvCustomerName = itemView.findViewById(R.id.tvOrderCustomerName);
            tvOrderDate = itemView.findViewById(R.id.tvOrderDate);
            tvOrderStatus = itemView.findViewById(R.id.tvOrderStatus);
            tvPaymentInfo = itemView.findViewById(R.id.tvOrderPaymentInfo);
            tvTotalAmount = itemView.findViewById(R.id.tvOrderTotal);
            btnVerifyPayment = itemView.findViewById(R.id.btnVerifyPayment);
            btnUpdateStatus = itemView.findViewById(R.id.btnUpdateOrderStatus);
        }
    }
}
`
  }
];
