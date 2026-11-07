package com.fooddash.app.activities;

import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.net.Uri;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.fooddash.app.R;
import com.fooddash.app.adapters.FoodAdapter;
import com.fooddash.app.helpers.FirebaseHelper;
import com.fooddash.app.helpers.SessionManager;
import com.fooddash.app.helpers.ShakeDetector;
import com.fooddash.app.models.CartItem;
import com.fooddash.app.models.Food;
import com.google.android.material.snackbar.Snackbar;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;
import java.util.ArrayList;
import java.util.List;

/**
 * Screen 4: CustomerHomeActivity
 * Displays food categories, search bar, real-time food RecyclerView,
 * Accelerometer Shake-to-Refresh (Requirement #11), and Implicit Intents (Requirement #12).
 */
public class CustomerHomeActivity extends AppCompatActivity implements FoodAdapter.OnFoodActionListener {

    private RecyclerView rvFoods;
    private FoodAdapter foodAdapter;
    private final List<Food> allFoods = new ArrayList<>();
    private final List<Food> filteredFoods = new ArrayList<>();

    private EditText etSearch;
    private TextView tvGreeting;
    private TextView tvCartCountBadge;
    private String selectedCategory = "All";

    private SensorManager sensorManager;
    private Sensor accelerometer;
    private ShakeDetector shakeDetector;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_customer_home);

        sessionManager = new SessionManager(this);

        tvGreeting = findViewById(R.id.tvCustomerGreeting);
        tvCartCountBadge = findViewById(R.id.tvCartBadge);
        etSearch = findViewById(R.id.etSearchFood);
        rvFoods = findViewById(R.id.rvCustomerFoods);

        String name = sessionManager.getUserName();
        tvGreeting.setText("Hello, " + (name.isEmpty() ? "Food Lover" : name) + "!");

        rvFoods.setLayoutManager(new LinearLayoutManager(this));
        foodAdapter = new FoodAdapter(this, filteredFoods, false, this);
        rvFoods.setAdapter(foodAdapter);

        setupCategoryButtons();
        setupNavigationButtons();
        setupSearchListener();
        setupShakeSensor();
        listenToRealtimeFoodMenu();
    }

    private void setupCategoryButtons() {
        int[] btnIds = {R.id.btnCatAll, R.id.btnCatBurgers, R.id.btnCatPizza, R.id.btnCatBiryani, R.id.btnCatDrinks};
        String[] categories = {"All", "Burgers", "Pizza", "Biryani", "Drinks"};

        for (int i = 0; i < btnIds.length; i++) {
            final String category = categories[i];
            Button btn = findViewById(btnIds[i]);
            if (btn != null) {
                btn.setOnClickListener(v -> {
                    selectedCategory = category;
                    applyFilters();
                });
            }
        }
    }

    private void setupNavigationButtons() {
        findViewById(R.id.btnOpenCart).setOnClickListener(v ->
                startActivity(new Intent(this, CartActivity.class)));

        findViewById(R.id.btnOpenMyOrders).setOnClickListener(v ->
                startActivity(new Intent(this, MyOrdersActivity.class)));

        findViewById(R.id.btnOpenProfile).setOnClickListener(v ->
                startActivity(new Intent(this, ProfileActivity.class)));

        // Requirement #12: Implicit Intent to call restaurant support (ACTION_DIAL)
        findViewById(R.id.btnCallSupport).setOnClickListener(v -> {
            Intent dialIntent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:+8801711002233"));
            startActivity(dialIntent);
        });

        // Requirement #12: Implicit Intent to open FoodDash website (ACTION_VIEW)
        findViewById(R.id.btnOpenWebsite).setOnClickListener(v -> {
            Intent webIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://fooddash.com.bd"));
            startActivity(webIntent);
        });
    }

    private void setupSearchListener() {
        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                applyFilters();
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void setupShakeSensor() {
        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        if (sensorManager != null) {
            accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
            shakeDetector = new ShakeDetector(() -> {
                if (sessionManager.isShakeToRefreshEnabled()) {
                    Toast.makeText(this, "Device shaken! Refreshing live menu & daily deals...", Toast.LENGTH_SHORT).show();
                    listenToRealtimeFoodMenu();
                }
            });
        }
    }

    private void listenToRealtimeFoodMenu() {
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
                        applyFilters();
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {
                        Toast.makeText(CustomerHomeActivity.this, "Error loading menu: " + error.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void applyFilters() {
        String query = etSearch.getText() != null ? etSearch.getText().toString().trim().toLowerCase() : "";
        filteredFoods.clear();
        for (Food food : allFoods) {
            boolean matchesCategory = "All".equalsIgnoreCase(selectedCategory)
                    || selectedCategory.equalsIgnoreCase(food.getCategory());
            boolean matchesQuery = query.isEmpty()
                    || food.getName().toLowerCase().contains(query)
                    || food.getDescription().toLowerCase().contains(query);
            if (matchesCategory && matchesQuery) {
                filteredFoods.add(food);
            }
        }
        foodAdapter.updateList(filteredFoods);
    }

    private void updateCartBadge() {
        List<CartItem> items = sessionManager.getCartItems();
        int count = 0;
        for (CartItem item : items) {
            count += item.getQuantity();
        }
        tvCartCountBadge.setText("Cart (" + count + ")");
    }

    @Override
    protected void onResume() {
        super.onResume();
        updateCartBadge();
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
    public void onFoodClick(Food food) {
        Intent intent = new Intent(this, FoodDetailsActivity.class);
        intent.putExtra("EXTRA_FOOD", food);
        startActivity(intent);
    }

    @Override
    public void onAddToCartClick(Food food) {
        List<CartItem> cart = sessionManager.getCartItems();
        boolean found = false;
        for (CartItem item : cart) {
            if (item.getFoodId().equals(food.getFoodId())) {
                item.setQuantity(item.getQuantity() + 1);
                found = true;
                break;
            }
        }
        if (!found) {
            cart.add(new CartItem(food.getFoodId(), food.getName(), food.getPrice(), 1, food.getImageUrl()));
        }
        sessionManager.saveCartItems(cart);
        updateCartBadge();
        Snackbar.make(rvFoods, food.getName() + " added to cart", Snackbar.LENGTH_SHORT)
                .setAction("VIEW CART", v -> startActivity(new Intent(this, CartActivity.class)))
                .show();
    }

    @Override public void onEditClick(Food food) {}
    @Override public void onDeleteClick(Food food) {}
    @Override public void onToggleAvailability(Food food) {}
}
