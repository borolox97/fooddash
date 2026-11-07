import { AndroidSourceFile } from './modelsAndHelpersSource';

export const ACTIVITIES_PART2_FILES: AndroidSourceFile[] = [
  {
    path: 'app/src/main/java/com/fooddash/app/activities/MyOrdersActivity.java',
    name: 'MyOrdersActivity.java',
    category: 'activities',
    language: 'java',
    description: 'Customer order history screen listening in real time to Firebase orders filtered by customerId, plus ShakeDetector to refresh order status.',
    universityRequirementIds: [1, 2, 5, 8, 11],
    content: `package com.fooddash.app.activities;

import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.fooddash.app.R;
import com.fooddash.app.adapters.OrderAdapter;
import com.fooddash.app.helpers.FirebaseHelper;
import com.fooddash.app.helpers.ShakeDetector;
import com.fooddash.app.models.Order;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Screen 8: MyOrdersActivity
 * Real-time customer order tracking with Firebase ValueEventListener and Shake-to-Refresh.
 */
public class MyOrdersActivity extends AppCompatActivity implements OrderAdapter.OnOrderActionListener {

    private RecyclerView rvOrders;
    private OrderAdapter orderAdapter;
    private final List<Order> myOrders = new ArrayList<>();

    private SensorManager sensorManager;
    private Sensor accelerometer;
    private ShakeDetector shakeDetector;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_my_orders);

        rvOrders = findViewById(R.id.rvMyOrders);
        rvOrders.setLayoutManager(new LinearLayoutManager(this));
        orderAdapter = new OrderAdapter(this, myOrders, false, this);
        rvOrders.setAdapter(orderAdapter);

        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        if (sensorManager != null) {
            accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
            shakeDetector = new ShakeDetector(() -> {
                Toast.makeText(this, "Shaken! Syncing real-time order status...", Toast.LENGTH_SHORT).show();
                listenToCustomerOrders();
            });
        }

        listenToCustomerOrders();
    }

    private void listenToCustomerOrders() {
        FirebaseUser user = FirebaseHelper.getInstance().getCurrentUser();
        if (user == null) return;

        FirebaseHelper.getInstance().getOrdersRef()
                .orderByChild("customerId")
                .equalTo(user.getUid())
                .addValueEventListener(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        myOrders.clear();
                        for (DataSnapshot child : snapshot.getChildren()) {
                            Order order = child.getValue(Order.class);
                            if (order != null) {
                                myOrders.add(order);
                            }
                        }
                        Collections.sort(myOrders, (a, b) -> Long.compare(b.getCreatedAt(), a.getCreatedAt()));
                        orderAdapter.notifyDataSetChanged();
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {
                        Toast.makeText(MyOrdersActivity.this, "Error: " + error.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                });
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (sensorManager != null && accelerometer != null) {
            sensorManager.registerListener(shakeDetector, accelerometer, SensorManager.SENSOR_DELAY_UI);
        }
    }

    @Override
    protected void onPause() {
        if (sensorManager != null) {
            sensorManager.unregisterListener(shakeDetector);
        }
        super.onPause();
    }

    @Override
    public void onOrderClick(Order order) {
        Intent intent = new Intent(this, OrderDetailsActivity.class);
        intent.putExtra("EXTRA_ORDER_ID", order.getOrderId());
        startActivity(intent);
    }

    @Override public void onVerifyPaymentClick(Order order) {}
    @Override public void onUpdateStatusClick(Order order) {}
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/activities/OrderDetailsActivity.java',
    name: 'OrderDetailsActivity.java',
    category: 'activities',
    language: 'java',
    description: 'Detailed receipt and live status tracker for a single order with Implicit Intents to call delivery support or share receipt.',
    universityRequirementIds: [1, 2, 8, 12],
    content: `package com.fooddash.app.activities;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.fooddash.app.R;
import com.fooddash.app.helpers.FirebaseHelper;
import com.fooddash.app.models.CartItem;
import com.fooddash.app.models.Order;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;
import java.util.Locale;

/**
 * Screen 9: OrderDetailsActivity
 * Real-time listener on fooddash/orders/{orderId} showing live status, payment verification state,
 * itemized breakdown, and Implicit Intents (ACTION_DIAL & ACTION_SEND).
 */
public class OrderDetailsActivity extends AppCompatActivity {

    private TextView tvOrderId;
    private TextView tvStatus;
    private TextView tvPaymentStatus;
    private TextView tvAddress;
    private TextView tvItemsList;
    private TextView tvTotals;
    private String orderId;
    private Order currentOrder;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_order_details);

        orderId = getIntent().getStringExtra("EXTRA_ORDER_ID");
        if (orderId == null || orderId.isEmpty()) {
            finish();
            return;
        }

        tvOrderId = findViewById(R.id.tvDetailOrderId);
        tvStatus = findViewById(R.id.tvDetailOrderStatus);
        tvPaymentStatus = findViewById(R.id.tvDetailPaymentStatus);
        tvAddress = findViewById(R.id.tvDetailDeliveryAddress);
        tvItemsList = findViewById(R.id.tvDetailOrderedItems);
        tvTotals = findViewById(R.id.tvDetailOrderTotals);
        Button btnCallRider = findViewById(R.id.btnCallHotline);
        Button btnShareReceipt = findViewById(R.id.btnShareOrderReceipt);

        listenToOrderUpdates();

        // Requirement #12: Implicit Intent ACTION_DIAL
        btnCallRider.setOnClickListener(v -> {
            Intent dialIntent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:+8801711002233"));
            startActivity(dialIntent);
        });

        // Requirement #12: Implicit Intent ACTION_SEND
        btnShareReceipt.setOnClickListener(v -> {
            if (currentOrder == null) return;
            Intent share = new Intent(Intent.ACTION_SEND);
            share.setType("text/plain");
            share.putExtra(Intent.EXTRA_TEXT, "FoodDash Order #" + currentOrder.getOrderId()
                    + " | Status: " + currentOrder.getStatus()
                    + " | Total: BDT " + currentOrder.getTotal());
            startActivity(Intent.createChooser(share, "Share Order Receipt"));
        });
    }

    private void listenToOrderUpdates() {
        FirebaseHelper.getInstance().getOrdersRef().child(orderId)
                .addValueEventListener(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        currentOrder = snapshot.getValue(Order.class);
                        if (currentOrder == null) return;

                        tvOrderId.setText("Order #" + currentOrder.getOrderId());
                        tvStatus.setText("Delivery Status: " + currentOrder.getStatus());

                        String payText = currentOrder.getPaymentMethod() + " · " + currentOrder.getPaymentStatus();
                        if (currentOrder.getTransactionId() != null && !currentOrder.getTransactionId().isEmpty()) {
                            payText += " (TrxID: " + currentOrder.getTransactionId() + ")";
                        }
                        tvPaymentStatus.setText(payText);
                        tvAddress.setText("Deliver to: " + currentOrder.getDeliveryAddress()
                                + " (" + currentOrder.getCustomerPhone() + ")");

                        StringBuilder sb = new StringBuilder();
                        if (currentOrder.getItems() != null) {
                            for (CartItem item : currentOrder.getItems()) {
                                sb.append(item.getQuantity())
                                  .append("x ")
                                  .append(item.getName())
                                  .append(" — BDT ")
                                  .append(String.format(Locale.US, "%.0f", item.getLineTotal()))
                                  .append("\n");
                            }
                        }
                        tvItemsList.setText(sb.toString().trim());

                        tvTotals.setText(String.format(Locale.US,
                                "Subtotal: BDT %.0f\nDelivery Fee: BDT %.0f\nTotal: BDT %.0f",
                                currentOrder.getSubtotal(),
                                currentOrder.getDeliveryFee(),
                                currentOrder.getTotal()));
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {}
                });
    }
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/activities/ProfileActivity.java',
    name: 'ProfileActivity.java',
    category: 'activities',
    language: 'java',
    description: 'User profile screen with Camera/Gallery photo picker Intent, Firebase Storage upload, SharedPreferences Shake-to-Refresh toggle, profile update validation, and Logout.',
    universityRequirementIds: [1, 2, 3, 7, 8, 9, 10],
    content: `package com.fooddash.app.activities;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Switch;
import android.widget.Toast;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import com.bumptech.glide.Glide;
import com.fooddash.app.R;
import com.fooddash.app.helpers.FirebaseHelper;
import com.fooddash.app.helpers.SessionManager;
import com.fooddash.app.helpers.ValidationHelper;
import com.fooddash.app.models.User;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

/**
 * Screen 10: ProfileActivity
 * Implements Requirement #9 (SharedPreferences settings), Requirement #10 (Camera / Gallery Intent),
 * Requirement #3 (TextInputEditText validation), and Requirement #7 (Firebase Logout).
 */
public class ProfileActivity extends AppCompatActivity {

    private ImageView ivProfilePhoto;
    private TextInputEditText etName;
    private TextInputEditText etPhone;
    private TextInputEditText etAddress;
    private Switch switchShakeRefresh;

    private Uri selectedPhotoUri;
    private User currentUserProfile;
    private SessionManager sessionManager;

    private final ActivityResultLauncher<Intent> galleryLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                    selectedPhotoUri = result.getData().getData();
                    ivProfilePhoto.setImageURI(selectedPhotoUri);
                    uploadProfilePhotoIfSelected();
                }
            }
    );

    private final ActivityResultLauncher<Intent> cameraLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK && result.getData() != null && result.getData().getExtras() != null) {
                    Bitmap bitmap = (Bitmap) result.getData().getExtras().get("data");
                    if (bitmap != null) {
                        ivProfilePhoto.setImageBitmap(bitmap);
                        Toast.makeText(this, "Camera photo captured!", Toast.LENGTH_SHORT).show();
                    }
                }
            }
    );

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        sessionManager = new SessionManager(this);

        ivProfilePhoto = findViewById(R.id.ivProfilePhoto);
        etName = findViewById(R.id.etProfileName);
        etPhone = findViewById(R.id.etProfilePhone);
        etAddress = findViewById(R.id.etProfileAddress);
        switchShakeRefresh = findViewById(R.id.switchShakeToRefresh);
        Button btnPickPhoto = findViewById(R.id.btnChangeProfilePhoto);
        Button btnSaveProfile = findViewById(R.id.btnSaveProfile);
        Button btnLogout = findViewById(R.id.btnLogout);

        switchShakeRefresh.setChecked(sessionManager.isShakeToRefreshEnabled());
        switchShakeRefresh.setOnCheckedChangeListener((buttonView, isChecked) -> {
            sessionManager.setShakeToRefreshEnabled(isChecked);
            Toast.makeText(this, "Shake-to-refresh setting saved in SharedPreferences", Toast.LENGTH_SHORT).show();
        });

        btnPickPhoto.setOnClickListener(v -> showPhotoSourceDialog());
        btnSaveProfile.setOnClickListener(v -> saveProfileChanges());
        btnLogout.setOnClickListener(v -> performLogout());

        loadUserProfile();
    }

    // Requirement #10: Take or pick a photo and show it using Camera / Gallery Intent
    private void showPhotoSourceDialog() {
        String[] options = {"Take Photo with Camera", "Choose from Gallery"};
        new AlertDialog.Builder(this)
                .setTitle("Update Profile Photo")
                .setItems(options, (dialog, which) -> {
                    if (which == 0) {
                        Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                        cameraLauncher.launch(cameraIntent);
                    } else {
                        Intent galleryIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                        galleryLauncher.launch(galleryIntent);
                    }
                })
                .show();
    }

    private void uploadProfilePhotoIfSelected() {
        FirebaseUser fbUser = FirebaseHelper.getInstance().getCurrentUser();
        if (fbUser == null || selectedPhotoUri == null) return;

        FirebaseHelper.getInstance().uploadImage(
                FirebaseHelper.getInstance().getProfileImagesStorageRef(),
                fbUser.getUid(),
                selectedPhotoUri,
                new FirebaseHelper.ImageUploadCallback() {
                    @Override
                    public void onSuccess(String downloadUrl) {
                        FirebaseHelper.getInstance().getUsersRef()
                                .child(fbUser.getUid())
                                .child("photoUrl")
                                .setValue(downloadUrl);
                        Toast.makeText(ProfileActivity.this, "Profile photo uploaded to Firebase Storage", Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onError(String message) {
                        Toast.makeText(ProfileActivity.this, "Upload error: " + message, Toast.LENGTH_SHORT).show();
                    }
                }
        );
    }

    private void loadUserProfile() {
        FirebaseUser fbUser = FirebaseHelper.getInstance().getCurrentUser();
        if (fbUser == null) return;

        FirebaseHelper.getInstance().getUsersRef().child(fbUser.getUid())
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        currentUserProfile = snapshot.getValue(User.class);
                        if (currentUserProfile != null) {
                            etName.setText(currentUserProfile.getName());
                            etPhone.setText(currentUserProfile.getPhone());
                            etAddress.setText(currentUserProfile.getAddress());
                            if (currentUserProfile.getPhotoUrl() != null && !currentUserProfile.getPhotoUrl().isEmpty()) {
                                Glide.with(ProfileActivity.this)
                                        .load(currentUserProfile.getPhotoUrl())
                                        .into(ivProfilePhoto);
                            }
                        }
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {}
                });
    }

    private void saveProfileChanges() {
        if (!ValidationHelper.validateRequired(etName, "Name")
                | !ValidationHelper.validatePhone(etPhone)
                | !ValidationHelper.validateRequired(etAddress, "Address")) {
            return;
        }

        if (currentUserProfile == null) return;
        currentUserProfile.setName(etName.getText().toString().trim());
        currentUserProfile.setPhone(etPhone.getText().toString().trim());
        currentUserProfile.setAddress(etAddress.getText().toString().trim());

        FirebaseHelper.getInstance().saveUserProfile(currentUserProfile, task -> {
            if (task.isSuccessful()) {
                sessionManager.saveUserSession(currentUserProfile.getName(), currentUserProfile.getRole());
                Toast.makeText(this, "Profile updated in Firebase!", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void performLogout() {
        FirebaseHelper.getInstance().getAuth().signOut();
        sessionManager.clearSessionOnLogout();
        Intent intent = new Intent(this, LoginActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/activities/AdminDashboardActivity.java',
    name: 'AdminDashboardActivity.java',
    category: 'activities',
    language: 'java',
    description: 'Dark-green (#17251F) Restaurant Admin dashboard displaying live KPI cards (Total Orders, Pending Orders, Completed Orders, Total Food Products, Sales Summary) and role authorization guard.',
    universityRequirementIds: [1, 2, 7, 8],
    content: `package com.fooddash.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.fooddash.app.R;
import com.fooddash.app.helpers.FirebaseHelper;
import com.fooddash.app.helpers.SessionManager;
import com.fooddash.app.models.Order;
import com.fooddash.app.models.User;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;
import java.util.Locale;

/**
 * Screen 11: AdminDashboardActivity
 * Displays real-time restaurant metrics:
 * - Total Orders
 * - Pending Orders
 * - Completed Orders
 * - Total Food Products
 * - Sales Summary (BDT)
 * Enforces strict role-based authorization ("ADMIN" only).
 */
public class AdminDashboardActivity extends AppCompatActivity {

    private TextView tvTotalOrders;
    private TextView tvPendingOrders;
    private TextView tvCompletedOrders;
    private TextView tvTotalFoods;
    private TextView tvSalesSummary;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin_dashboard);

        tvTotalOrders = findViewById(R.id.tvMetricTotalOrders);
        tvPendingOrders = findViewById(R.id.tvMetricPendingOrders);
        tvCompletedOrders = findViewById(R.id.tvMetricCompletedOrders);
        tvTotalFoods = findViewById(R.id.tvMetricTotalFoods);
        tvSalesSummary = findViewById(R.id.tvMetricSalesSummary);

        Button btnManageFood = findViewById(R.id.btnAdminManageFood);
        Button btnManageOrders = findViewById(R.id.btnAdminManageOrders);
        Button btnAdminLogout = findViewById(R.id.btnAdminLogout);

        verifyAdminRoleOrExit();
        listenToRealtimeAdminMetrics();

        btnManageFood.setOnClickListener(v ->
                startActivity(new Intent(this, ManageFoodActivity.class)));

        btnManageOrders.setOnClickListener(v ->
                startActivity(new Intent(this, AdminOrdersActivity.class)));

        btnAdminLogout.setOnClickListener(v -> {
            FirebaseHelper.getInstance().getAuth().signOut();
            new SessionManager(this).clearSessionOnLogout();
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        });
    }

    private void verifyAdminRoleOrExit() {
        FirebaseUser fbUser = FirebaseHelper.getInstance().getCurrentUser();
        if (fbUser == null) {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return;
        }
        FirebaseHelper.getInstance().getUsersRef().child(fbUser.getUid())
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        User user = snapshot.getValue(User.class);
                        if (user == null || !user.isAdmin()) {
                            Toast.makeText(AdminDashboardActivity.this, "Unauthorized: Admin access required", Toast.LENGTH_LONG).show();
                            startActivity(new Intent(AdminDashboardActivity.this, CustomerHomeActivity.class));
                            finish();
                        }
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {}
                });
    }

    private void listenToRealtimeAdminMetrics() {
        FirebaseHelper.getInstance().getOrdersRef()
                .addValueEventListener(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        int total = 0;
                        int pending = 0;
                        int completed = 0;
                        double sales = 0.0;

                        for (DataSnapshot child : snapshot.getChildren()) {
                            Order order = child.getValue(Order.class);
                            if (order != null) {
                                total++;
                                if ("DELIVERED".equalsIgnoreCase(order.getStatus())) {
                                    completed++;
                                } else if (!"REJECTED".equalsIgnoreCase(order.getStatus())) {
                                    pending++;
                                }
                                if (!"REJECTED".equalsIgnoreCase(order.getStatus())) {
                                    sales += order.getTotal();
                                }
                            }
                        }

                        tvTotalOrders.setText(String.valueOf(total));
                        tvPendingOrders.setText(String.valueOf(pending));
                        tvCompletedOrders.setText(String.valueOf(completed));
                        tvSalesSummary.setText(String.format(Locale.US, "BDT %.0f", sales));
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {}
                });

        FirebaseHelper.getInstance().getFoodRef()
                .addValueEventListener(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        tvTotalFoods.setText(String.valueOf(snapshot.getChildrenCount()));
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {}
                });
    }
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/activities/ManageFoodActivity.java',
    name: 'ManageFoodActivity.java',
    category: 'activities',
    language: 'java',
    description: 'Admin food inventory CRUD screen using RecyclerView, search bar, FloatingActionButton to launch AddEditFoodActivity, and AlertDialog to confirm food deletion.',
    universityRequirementIds: [1, 2, 5, 6, 8],
    content: `package com.fooddash.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.EditText;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.fooddash.app.R;
import com.fooddash.app.adapters.FoodAdapter;
import com.fooddash.app.helpers.FirebaseHelper;
import com.fooddash.app.models.Food;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;
import java.util.ArrayList;
import java.util.List;

/**
 * Screen 12: ManageFoodActivity
 * Implements Requirement #6: Add, view, edit, delete (CRUD) with AlertDialog and FloatingActionButton.
 */
public class ManageFoodActivity extends AppCompatActivity implements FoodAdapter.OnFoodActionListener {

    private RecyclerView rvAdminFood;
    private EditText etAdminSearchFood;
    private FloatingActionButton fabAddFood;
    private FoodAdapter foodAdapter;
    private final List<Food> allFoods = new ArrayList<>();
    private final List<Food> filteredFoods = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_manage_food);

        rvAdminFood = findViewById(R.id.rvAdminFoodList);
        etAdminSearchFood = findViewById(R.id.etAdminSearchFood);
        fabAddFood = findViewById(R.id.fabAddFood);

        rvAdminFood.setLayoutManager(new LinearLayoutManager(this));
        foodAdapter = new FoodAdapter(this, filteredFoods, true, this);
        rvAdminFood.setAdapter(foodAdapter);

        // Requirement #6: FloatingActionButton launches AddEditFoodActivity for creating new food
        fabAddFood.setOnClickListener(v -> {
            Intent intent = new Intent(ManageFoodActivity.this, AddEditFoodActivity.class);
            startActivity(intent);
        });

        etAdminSearchFood.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterFoods();
            }
            @Override public void afterTextChanged(Editable s) {}
        });

        listenToFoodInventory();
    }

    private void listenToFoodInventory() {
        FirebaseHelper.getInstance().getFoodRef()
                .addValueEventListener(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        allFoods.clear();
                        for (DataSnapshot child : snapshot.getChildren()) {
                            Food food = child.getValue(Food.class);
                            if (food != null) {
                                allFoods.add(food);
                            }
                        }
                        filterFoods();
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {}
                });
    }

    private void filterFoods() {
        String q = etAdminSearchFood.getText() != null ? etAdminSearchFood.getText().toString().trim().toLowerCase() : "";
        filteredFoods.clear();
        for (Food food : allFoods) {
            if (q.isEmpty() || food.getName().toLowerCase().contains(q) || food.getCategory().toLowerCase().contains(q)) {
                filteredFoods.add(food);
            }
        }
        foodAdapter.updateList(filteredFoods);
    }

    @Override
    public void onFoodClick(Food food) {
        onEditClick(food);
    }

    @Override
    public void onAddToCartClick(Food food) {}

    @Override
    public void onEditClick(Food food) {
        Intent intent = new Intent(this, AddEditFoodActivity.class);
        intent.putExtra("EXTRA_EDIT_FOOD", food);
        startActivity(intent);
    }

    // Requirement #6: Delete food item with AlertDialog confirmation
    @Override
    public void onDeleteClick(Food food) {
        new AlertDialog.Builder(this)
                .setTitle("Delete Food Item")
                .setMessage("Are you sure you want to permanently delete '" + food.getName() + "' from the menu?")
                .setPositiveButton("Delete", (dialog, which) -> {
                    FirebaseHelper.getInstance().deleteFoodItem(food.getFoodId(), task -> {
                        if (task.isSuccessful()) {
                            Snackbar.make(rvAdminFood, food.getName() + " deleted", Snackbar.LENGTH_SHORT).show();
                        }
                    });
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    @Override
    public void onToggleAvailability(Food food) {
        boolean nextState = !food.isAvailable();
        food.setAvailable(nextState);
        FirebaseHelper.getInstance().saveFoodItem(food, task -> {
            if (task.isSuccessful()) {
                Toast.makeText(this, food.getName() + " marked as " + (nextState ? "Available" : "Sold Out"), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/activities/AddEditFoodActivity.java',
    name: 'AddEditFoodActivity.java',
    category: 'activities',
    language: 'java',
    description: 'Admin screen for creating or editing a food item with TextInputEditText validation, Camera/Gallery photo Intent, Firebase Storage upload, and Realtime Database persistence.',
    universityRequirementIds: [1, 2, 3, 6, 8, 10],
    content: `package com.fooddash.app.activities;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import com.bumptech.glide.Glide;
import com.fooddash.app.R;
import com.fooddash.app.helpers.FirebaseHelper;
import com.fooddash.app.helpers.ValidationHelper;
import com.fooddash.app.models.Food;
import com.google.android.material.textfield.TextInputEditText;
import java.util.UUID;

/**
 * Screen 13: AddEditFoodActivity
 * Supports adding new food items or editing existing ones with Camera/Gallery photo selection,
 * input validation, and Firebase Storage + Realtime Database persistence.
 */
public class AddEditFoodActivity extends AppCompatActivity {

    private TextView tvScreenTitle;
    private ImageView ivFoodPreview;
    private TextInputEditText etFoodName;
    private TextInputEditText etFoodDescription;
    private TextInputEditText etFoodPrice;
    private Spinner spinnerCategory;
    private CheckBox cbAvailable;
    private Button btnSaveFood;

    private Food editingFood;
    private Uri selectedImageUri;
    private final String[] categories = {"Burgers", "Pizza", "Biryani", "Drinks", "Desserts"};

    private final ActivityResultLauncher<Intent> imagePickerLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                    selectedImageUri = result.getData().getData();
                    ivFoodPreview.setImageURI(selectedImageUri);
                }
            }
    );

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_edit_food);

        tvScreenTitle = findViewById(R.id.tvAddEditFoodTitle);
        ivFoodPreview = findViewById(R.id.ivAddEditFoodPreview);
        etFoodName = findViewById(R.id.etFoodName);
        etFoodDescription = findViewById(R.id.etFoodDescription);
        etFoodPrice = findViewById(R.id.etFoodPrice);
        spinnerCategory = findViewById(R.id.spinnerFoodCategory);
        cbAvailable = findViewById(R.id.cbFoodAvailable);
        Button btnSelectImage = findViewById(R.id.btnPickFoodImage);
        btnSaveFood = findViewById(R.id.btnSaveFoodItem);

        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, categories);
        spinnerCategory.setAdapter(adapter);

        editingFood = (Food) getIntent().getSerializableExtra("EXTRA_EDIT_FOOD");
        if (editingFood != null) {
            tvScreenTitle.setText("Edit Food Product");
            etFoodName.setText(editingFood.getName());
            etFoodDescription.setText(editingFood.getDescription());
            etFoodPrice.setText(String.valueOf(editingFood.getPrice()));
            cbAvailable.setChecked(editingFood.isAvailable());

            for (int i = 0; i < categories.length; i++) {
                if (categories[i].equalsIgnoreCase(editingFood.getCategory())) {
                    spinnerCategory.setSelection(i);
                    break;
                }
            }
            if (editingFood.getImageUrl() != null && !editingFood.getImageUrl().isEmpty()) {
                Glide.with(this).load(editingFood.getImageUrl()).into(ivFoodPreview);
            }
        }

        // Requirement #10: Pick food photo from Gallery via Intent
        btnSelectImage.setOnClickListener(v -> {
            Intent pickIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            imagePickerLauncher.launch(pickIntent);
        });

        btnSaveFood.setOnClickListener(v -> validateAndSaveFood());
    }

    private void validateAndSaveFood() {
        boolean isValid = ValidationHelper.validateRequired(etFoodName, "Food name")
                & ValidationHelper.validateRequired(etFoodDescription, "Description")
                & ValidationHelper.validatePositivePrice(etFoodPrice);

        if (!isValid) return;

        final String name = etFoodName.getText().toString().trim();
        final String desc = etFoodDescription.getText().toString().trim();
        final double price = Double.parseDouble(etFoodPrice.getText().toString().trim());
        final String category = spinnerCategory.getSelectedItem().toString();
        final boolean available = cbAvailable.isChecked();

        btnSaveFood.setEnabled(false);

        if (selectedImageUri != null) {
            String fileId = editingFood != null ? editingFood.getFoodId() : UUID.randomUUID().toString();
            FirebaseHelper.getInstance().uploadImage(
                    FirebaseHelper.getInstance().getFoodImagesStorageRef(),
                    fileId,
                    selectedImageUri,
                    new FirebaseHelper.ImageUploadCallback() {
                        @Override
                        public void onSuccess(String downloadUrl) {
                            persistFoodRecord(name, desc, price, category, downloadUrl, available);
                        }

                        @Override
                        public void onError(String message) {
                            btnSaveFood.setEnabled(true);
                            Toast.makeText(AddEditFoodActivity.this, "Image upload failed: " + message, Toast.LENGTH_SHORT).show();
                        }
                    }
            );
        } else {
            String existingUrl = editingFood != null ? editingFood.getImageUrl() : "";
            persistFoodRecord(name, desc, price, category, existingUrl, available);
        }
    }

    private void persistFoodRecord(String name, String desc, double price, String category, String imageUrl, boolean available) {
        String foodId = editingFood != null ? editingFood.getFoodId() : "";
        Food food = new Food(foodId, name, desc, price, category, imageUrl, available);

        FirebaseHelper.getInstance().saveFoodItem(food, task -> {
            btnSaveFood.setEnabled(true);
            if (task.isSuccessful()) {
                Toast.makeText(this, "Food item saved successfully!", Toast.LENGTH_SHORT).show();
                finish();
            } else {
                Toast.makeText(this, "Failed to save food item", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/activities/AdminOrdersActivity.java',
    name: 'AdminOrdersActivity.java',
    category: 'activities',
    language: 'java',
    description: 'Admin incoming orders screen with AlertDialog for manual bKash/Nagad payment verification and order status progression (Accept, Prepare, Out for Delivery, Delivered, Reject).',
    universityRequirementIds: [1, 2, 5, 6, 8],
    content: `package com.fooddash.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.fooddash.app.R;
import com.fooddash.app.adapters.OrderAdapter;
import com.fooddash.app.helpers.FirebaseHelper;
import com.fooddash.app.models.Order;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Screen 14: AdminOrdersActivity
 * Allows Restaurant Admin to:
 * - View all incoming orders in real time
 * - Manually verify bKash / Nagad Transaction IDs (PENDING_VERIFICATION -> VERIFIED or REJECTED)
 * - Accept, reject, or update order status via AlertDialog
 */
public class AdminOrdersActivity extends AppCompatActivity implements OrderAdapter.OnOrderActionListener {

    private RecyclerView rvAdminOrders;
    private OrderAdapter orderAdapter;
    private final List<Order> allOrders = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin_orders);

        rvAdminOrders = findViewById(R.id.rvAdminOrders);
        rvAdminOrders.setLayoutManager(new LinearLayoutManager(this));
        orderAdapter = new OrderAdapter(this, allOrders, true, this);
        rvAdminOrders.setAdapter(orderAdapter);

        listenToAllOrders();
    }

    private void listenToAllOrders() {
        FirebaseHelper.getInstance().getOrdersRef()
                .addValueEventListener(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        allOrders.clear();
                        for (DataSnapshot child : snapshot.getChildren()) {
                            Order order = child.getValue(Order.class);
                            if (order != null) {
                                allOrders.add(order);
                            }
                        }
                        Collections.sort(allOrders, (a, b) -> Long.compare(b.getCreatedAt(), a.getCreatedAt()));
                        orderAdapter.notifyDataSetChanged();
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {}
                });
    }

    @Override
    public void onOrderClick(Order order) {
        Intent intent = new Intent(this, OrderDetailsActivity.class);
        intent.putExtra("EXTRA_ORDER_ID", order.getOrderId());
        startActivity(intent);
    }

    @Override
    public void onVerifyPaymentClick(Order order) {
        new AlertDialog.Builder(this)
                .setTitle("Verify " + order.getPaymentMethod() + " Payment")
                .setMessage("Customer: " + order.getCustomerName()
                        + "\nAmount: BDT " + order.getTotal()
                        + "\nSubmitted TrxID: " + order.getTransactionId()
                        + "\n\nHave you confirmed this Transaction ID in your restaurant "
                        + order.getPaymentMethod() + " statement?")
                .setPositiveButton("Mark VERIFIED", (dialog, which) -> {
                    FirebaseHelper.getInstance().verifyOrderPayment(order.getOrderId(), "VERIFIED", task -> {
                        Toast.makeText(this, "Payment verified for Order #" + order.getOrderId(), Toast.LENGTH_SHORT).show();
                    });
                })
                .setNegativeButton("Reject Payment", (dialog, which) -> {
                    FirebaseHelper.getInstance().verifyOrderPayment(order.getOrderId(), "REJECTED", task -> {
                        FirebaseHelper.getInstance().updateOrderStatus(order.getOrderId(), "REJECTED", null);
                        Toast.makeText(this, "Payment marked as REJECTED", Toast.LENGTH_SHORT).show();
                    });
                })
                .setNeutralButton("Cancel", null)
                .show();
    }

    @Override
    public void onUpdateStatusClick(Order order) {
        String[] statuses = {"ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "REJECTED"};
        new AlertDialog.Builder(this)
                .setTitle("Update Status · Order #" + order.getOrderId())
                .setItems(statuses, (dialog, which) -> {
                    String nextStatus = statuses[which];
                    FirebaseHelper.getInstance().updateOrderStatus(order.getOrderId(), nextStatus, task -> {
                        if (task.isSuccessful()) {
                            Toast.makeText(this, "Order status updated to " + nextStatus, Toast.LENGTH_SHORT).show();
                        }
                    });
                })
                .show();
    }
}
`
  }
];
