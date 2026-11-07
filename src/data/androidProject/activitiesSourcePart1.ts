import { AndroidSourceFile } from './modelsAndHelpersSource';

export const ACTIVITIES_PART1_FILES: AndroidSourceFile[] = [
  {
    path: 'app/src/main/java/com/fooddash/app/activities/SplashActivity.java',
    name: 'SplashActivity.java',
    category: 'activities',
    language: 'java',
    description: 'Launch screen checking FirebaseAuth persistent session and routing directly to CustomerHomeActivity, AdminDashboardActivity, or LoginActivity.',
    universityRequirementIds: [1, 7, 9],
    content: `package com.fooddash.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.fooddash.app.R;
import com.fooddash.app.helpers.FirebaseHelper;
import com.fooddash.app.helpers.SessionManager;
import com.fooddash.app.models.User;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

/**
 * Screen 1: SplashActivity
 * Checks persistent FirebaseAuth session and routes by role ("CUSTOMER" vs "ADMIN").
 */
public class SplashActivity extends AppCompatActivity {
    private static final long SPLASH_DELAY_MS = 1800L;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        new Handler(Looper.getMainLooper()).postDelayed(this::checkSessionAndNavigate, SPLASH_DELAY_MS);
    }

    private void checkSessionAndNavigate() {
        FirebaseUser currentUser = FirebaseHelper.getInstance().getCurrentUser();
        SessionManager sessionManager = new SessionManager(this);

        if (currentUser != null && sessionManager.isRememberMeEnabled()) {
            FirebaseHelper.getInstance().getUsersRef().child(currentUser.getUid())
                    .addListenerForSingleValueEvent(new ValueEventListener() {
                        @Override
                        public void onDataChange(@NonNull DataSnapshot snapshot) {
                            User user = snapshot.getValue(User.class);
                            if (user != null && user.isAdmin()) {
                                sessionManager.saveUserSession(user.getName(), "ADMIN");
                                startActivity(new Intent(SplashActivity.this, AdminDashboardActivity.class));
                            } else {
                                if (user != null) {
                                    sessionManager.saveUserSession(user.getName(), "CUSTOMER");
                                }
                                startActivity(new Intent(SplashActivity.this, CustomerHomeActivity.class));
                            }
                            finish();
                        }

                        @Override
                        public void onCancelled(@NonNull DatabaseError error) {
                            startActivity(new Intent(SplashActivity.this, LoginActivity.class));
                            finish();
                        }
                    });
        } else {
            startActivity(new Intent(SplashActivity.this, LoginActivity.class));
            finish();
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/activities/LoginActivity.java',
    name: 'LoginActivity.java',
    category: 'activities',
    language: 'java',
    description: 'User login screen with TextInputEditText + setError() validation, Remember Me SharedPreferences checkbox, FirebaseAuth signInWithEmailAndPassword, and role-based routing.',
    universityRequirementIds: [1, 2, 3, 7, 9],
    content: `package com.fooddash.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.fooddash.app.R;
import com.fooddash.app.helpers.FirebaseHelper;
import com.fooddash.app.helpers.SessionManager;
import com.fooddash.app.helpers.ValidationHelper;
import com.fooddash.app.models.User;
import com.google.android.material.snackbar.Snackbar;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

/**
 * Screen 2: LoginActivity
 * Implements Requirement #3 (TextInputEditText + setError), Requirement #7 (FirebaseAuth),
 * and Requirement #9 (SharedPreferences Remember Me).
 */
public class LoginActivity extends AppCompatActivity {

    private TextInputEditText etEmail;
    private TextInputEditText etPassword;
    private CheckBox cbRememberMe;
    private Button btnLogin;
    private TextView tvGoToRegister;
    private ProgressBar progressBar;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        sessionManager = new SessionManager(this);

        etEmail = findViewById(R.id.etLoginEmail);
        etPassword = findViewById(R.id.etLoginPassword);
        cbRememberMe = findViewById(R.id.cbRememberMe);
        btnLogin = findViewById(R.id.btnLogin);
        tvGoToRegister = findViewById(R.id.tvGoToRegister);
        progressBar = findViewById(R.id.loginProgressBar);

        if (sessionManager.isRememberMeEnabled()) {
            cbRememberMe.setChecked(true);
            etEmail.setText(sessionManager.getSavedEmail());
        }

        btnLogin.setOnClickListener(v -> attemptLogin());
        tvGoToRegister.setOnClickListener(v -> {
            startActivity(new Intent(LoginActivity.this, RegisterActivity.class));
        });
    }

    private void attemptLogin() {
        if (!ValidationHelper.validateEmail(etEmail) | !ValidationHelper.validatePassword(etPassword)) {
            return;
        }

        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString();

        progressBar.setVisibility(View.VISIBLE);
        btnLogin.setEnabled(false);

        FirebaseHelper.getInstance().getAuth()
                .signInWithEmailAndPassword(email, password)
                .addOnCompleteListener(this, task -> {
                    if (task.isSuccessful()) {
                        sessionManager.setRememberMe(cbRememberMe.isChecked(), email);
                        FirebaseUser fbUser = FirebaseHelper.getInstance().getCurrentUser();
                        if (fbUser != null) {
                            fetchRoleAndRedirect(fbUser.getUid());
                        }
                    } else {
                        progressBar.setVisibility(View.GONE);
                        btnLogin.setEnabled(true);
                        String msg = task.getException() != null ? task.getException().getMessage() : "Authentication failed";
                        Snackbar.make(btnLogin, "Login error: " + msg, Snackbar.LENGTH_LONG).show();
                    }
                });
    }

    private void fetchRoleAndRedirect(String uid) {
        FirebaseHelper.getInstance().getUsersRef().child(uid)
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        progressBar.setVisibility(View.GONE);
                        btnLogin.setEnabled(true);

                        User user = snapshot.getValue(User.class);
                        if (user != null && user.isAdmin()) {
                            sessionManager.saveUserSession(user.getName(), "ADMIN");
                            Toast.makeText(LoginActivity.this, "Welcome Admin: " + user.getName(), Toast.LENGTH_SHORT).show();
                            startActivity(new Intent(LoginActivity.this, AdminDashboardActivity.class));
                        } else {
                            String name = user != null ? user.getName() : "Customer";
                            sessionManager.saveUserSession(name, "CUSTOMER");
                            Toast.makeText(LoginActivity.this, "Welcome back, " + name + "!", Toast.LENGTH_SHORT).show();
                            startActivity(new Intent(LoginActivity.this, CustomerHomeActivity.class));
                        }
                        finish();
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {
                        progressBar.setVisibility(View.GONE);
                        btnLogin.setEnabled(true);
                        Toast.makeText(LoginActivity.this, "Database error: " + error.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                });
    }
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/activities/RegisterActivity.java',
    name: 'RegisterActivity.java',
    category: 'activities',
    language: 'java',
    description: 'Customer registration Activity with TextInputEditText validation, FirebaseAuth createUserWithEmailAndPassword, and Realtime Database profile creation.',
    universityRequirementIds: [1, 2, 3, 4, 7, 8],
    content: `package com.fooddash.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.fooddash.app.R;
import com.fooddash.app.helpers.FirebaseHelper;
import com.fooddash.app.helpers.SessionManager;
import com.fooddash.app.helpers.ValidationHelper;
import com.fooddash.app.models.User;
import com.google.android.material.snackbar.Snackbar;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.auth.FirebaseUser;

/**
 * Screen 3: RegisterActivity
 * Registers new CUSTOMER accounts in Firebase Auth & Realtime Database.
 * Note: Role is strictly hardcoded to "CUSTOMER" and enforced by Firebase Security Rules.
 */
public class RegisterActivity extends AppCompatActivity {

    private TextInputEditText etName;
    private TextInputEditText etEmail;
    private TextInputEditText etPhone;
    private TextInputEditText etAddress;
    private TextInputEditText etPassword;
    private Button btnRegister;
    private TextView tvGoToLogin;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        etName = findViewById(R.id.etRegName);
        etEmail = findViewById(R.id.etRegEmail);
        etPhone = findViewById(R.id.etRegPhone);
        etAddress = findViewById(R.id.etRegAddress);
        etPassword = findViewById(R.id.etRegPassword);
        btnRegister = findViewById(R.id.btnRegister);
        tvGoToLogin = findViewById(R.id.tvGoToLogin);
        progressBar = findViewById(R.id.regProgressBar);

        btnRegister.setOnClickListener(v -> registerCustomer());
        tvGoToLogin.setOnClickListener(v -> finish());
    }

    private void registerCustomer() {
        boolean isValid = ValidationHelper.validateRequired(etName, "Full name")
                & ValidationHelper.validateEmail(etEmail)
                & ValidationHelper.validatePhone(etPhone)
                & ValidationHelper.validateRequired(etAddress, "Delivery address")
                & ValidationHelper.validatePassword(etPassword);

        if (!isValid) {
            return;
        }

        final String name = etName.getText().toString().trim();
        final String email = etEmail.getText().toString().trim();
        final String phone = etPhone.getText().toString().trim();
        final String address = etAddress.getText().toString().trim();
        final String password = etPassword.getText().toString();

        progressBar.setVisibility(View.VISIBLE);
        btnRegister.setEnabled(false);

        FirebaseHelper.getInstance().getAuth()
                .createUserWithEmailAndPassword(email, password)
                .addOnCompleteListener(this, task -> {
                    if (task.isSuccessful()) {
                        FirebaseUser fbUser = FirebaseHelper.getInstance().getCurrentUser();
                        if (fbUser != null) {
                            User newUser = new User(
                                    fbUser.getUid(),
                                    name,
                                    email,
                                    phone,
                                    "CUSTOMER", // Customers can never self-assign ADMIN
                                    address,
                                    ""
                            );
                            FirebaseHelper.getInstance().saveUserProfile(newUser, dbTask -> {
                                progressBar.setVisibility(View.GONE);
                                btnRegister.setEnabled(true);
                                if (dbTask.isSuccessful()) {
                                    new SessionManager(RegisterActivity.this).saveUserSession(name, "CUSTOMER");
                                    Toast.makeText(RegisterActivity.this, "Account created! Welcome to FoodDash.", Toast.LENGTH_SHORT).show();
                                    Intent intent = new Intent(RegisterActivity.this, CustomerHomeActivity.class);
                                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                                    startActivity(intent);
                                } else {
                                    Snackbar.make(btnRegister, "Failed to save user profile.", Snackbar.LENGTH_LONG).show();
                                }
                            });
                        }
                    } else {
                        progressBar.setVisibility(View.GONE);
                        btnRegister.setEnabled(true);
                        String error = task.getException() != null ? task.getException().getMessage() : "Registration error";
                        Snackbar.make(btnRegister, error, Snackbar.LENGTH_LONG).show();
                    }
                });
    }
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/activities/CustomerHomeActivity.java',
    name: 'CustomerHomeActivity.java',
    category: 'activities',
    language: 'java',
    description: 'Customer dashboard with real-time Firebase ValueEventListener, category filters, search bar, RecyclerView food list, ShakeDetector accelerometer refresh, and Implicit Intents.',
    universityRequirementIds: [1, 2, 5, 8, 9, 11, 12],
    content: `package com.fooddash.app.activities;

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
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/activities/FoodDetailsActivity.java',
    name: 'FoodDetailsActivity.java',
    category: 'activities',
    language: 'java',
    description: 'Detailed view for a selected food item receiving data via Intent.getSerializableExtra(), supporting quantity selection, Add to Cart, and ACTION_SEND share intent.',
    universityRequirementIds: [1, 2, 12],
    content: `package com.fooddash.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.bumptech.glide.Glide;
import com.fooddash.app.R;
import com.fooddash.app.helpers.SessionManager;
import com.fooddash.app.models.CartItem;
import com.fooddash.app.models.Food;
import java.util.List;
import java.util.Locale;

/**
 * Screen 5: FoodDetailsActivity
 * Displays full food description, image, price, quantity stepper, Add to Cart button,
 * and an Implicit Share Intent (ACTION_SEND - Requirement #12).
 */
public class FoodDetailsActivity extends AppCompatActivity {

    private Food food;
    private int selectedQuantity = 1;
    private TextView tvQuantity;
    private TextView tvTotalButtonPrice;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_food_details);

        food = (Food) getIntent().getSerializableExtra("EXTRA_FOOD");
        if (food == null) {
            finish();
            return;
        }

        ImageView ivFood = findViewById(R.id.ivDetailFoodImage);
        TextView tvName = findViewById(R.id.tvDetailFoodName);
        TextView tvCategory = findViewById(R.id.tvDetailFoodCategory);
        TextView tvPrice = findViewById(R.id.tvDetailFoodPrice);
        TextView tvDesc = findViewById(R.id.tvDetailFoodDescription);
        tvQuantity = findViewById(R.id.tvDetailQuantity);
        tvTotalButtonPrice = findViewById(R.id.btnDetailAddToCart);
        Button btnMinus = findViewById(R.id.btnDetailMinus);
        Button btnPlus = findViewById(R.id.btnDetailPlus);
        Button btnShare = findViewById(R.id.btnShareFood);

        tvName.setText(food.getName());
        tvCategory.setText(food.getCategory());
        tvPrice.setText(String.format(Locale.US, "BDT %.0f", food.getPrice()));
        tvDesc.setText(food.getDescription());
        updateQuantityUI();

        if (food.getImageUrl() != null && !food.getImageUrl().isEmpty()) {
            Glide.with(this)
                    .load(food.getImageUrl())
                    .placeholder(R.drawable.ic_fooddash_logo)
                    .into(ivFood);
        }

        btnMinus.setOnClickListener(v -> {
            if (selectedQuantity > 1) {
                selectedQuantity--;
                updateQuantityUI();
            }
        });

        btnPlus.setOnClickListener(v -> {
            selectedQuantity++;
            updateQuantityUI();
        });

        tvTotalButtonPrice.setOnClickListener(v -> addSelectedQuantityToCart());

        // Requirement #12: Implicit Intent ACTION_SEND to share a food item with friends
        btnShare.setOnClickListener(v -> {
            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("text/plain");
            String shareBody = "Check out " + food.getName() + " for BDT " + food.getPrice()
                    + " on FoodDash! " + food.getDescription();
            shareIntent.putExtra(Intent.EXTRA_SUBJECT, "FoodDash Recommendation");
            shareIntent.putExtra(Intent.EXTRA_TEXT, shareBody);
            startActivity(Intent.createChooser(shareIntent, "Share Food via"));
        });
    }

    private void updateQuantityUI() {
        tvQuantity.setText(String.valueOf(selectedQuantity));
        double total = food.getPrice() * selectedQuantity;
        tvTotalButtonPrice.setText(String.format(Locale.US, "Add %d to Cart · BDT %.0f", selectedQuantity, total));
    }

    private void addSelectedQuantityToCart() {
        SessionManager sessionManager = new SessionManager(this);
        List<CartItem> cart = sessionManager.getCartItems();
        boolean updated = false;
        for (CartItem item : cart) {
            if (item.getFoodId().equals(food.getFoodId())) {
                item.setQuantity(item.getQuantity() + selectedQuantity);
                updated = true;
                break;
            }
        }
        if (!updated) {
            cart.add(new CartItem(food.getFoodId(), food.getName(), food.getPrice(), selectedQuantity, food.getImageUrl()));
        }
        sessionManager.saveCartItems(cart);
        Toast.makeText(this, "Added " + selectedQuantity + "x " + food.getName() + " to Cart", Toast.LENGTH_SHORT).show();
        finish();
    }
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/activities/CartActivity.java',
    name: 'CartActivity.java',
    category: 'activities',
    language: 'java',
    description: 'Shopping cart screen displaying CartAdapter RecyclerView, real-time subtotal/delivery fee/total calculation, AlertDialog confirmation for item removal, and Checkout button.',
    universityRequirementIds: [1, 2, 5, 6, 9],
    content: `package com.fooddash.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.fooddash.app.R;
import com.fooddash.app.adapters.CartAdapter;
import com.fooddash.app.helpers.SessionManager;
import com.fooddash.app.models.CartItem;
import java.util.List;
import java.util.Locale;

/**
 * Screen 6: CartActivity
 * Allows updating cart item quantities, removing items via AlertDialog,
 * and proceeding to CheckoutActivity.
 */
public class CartActivity extends AppCompatActivity implements CartAdapter.OnCartChangeListener {

    private static final double DELIVERY_FEE = 60.0;

    private RecyclerView rvCart;
    private TextView tvSubtotal;
    private TextView tvDeliveryFee;
    private TextView tvTotal;
    private Button btnProceedCheckout;

    private SessionManager sessionManager;
    private List<CartItem> cartItems;
    private CartAdapter cartAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cart);

        sessionManager = new SessionManager(this);
        cartItems = sessionManager.getCartItems();

        rvCart = findViewById(R.id.rvCartItems);
        tvSubtotal = findViewById(R.id.tvCartSubtotal);
        tvDeliveryFee = findViewById(R.id.tvCartDeliveryFee);
        tvTotal = findViewById(R.id.tvCartTotalAmount);
        btnProceedCheckout = findViewById(R.id.btnProceedToCheckout);

        rvCart.setLayoutManager(new LinearLayoutManager(this));
        cartAdapter = new CartAdapter(this, cartItems, this);
        rvCart.setAdapter(cartAdapter);

        recalculateTotals();

        btnProceedCheckout.setOnClickListener(v -> {
            if (cartItems.isEmpty()) {
                Toast.makeText(this, "Your cart is empty! Add delicious food first.", Toast.LENGTH_SHORT).show();
                return;
            }
            startActivity(new Intent(this, CheckoutActivity.class));
        });
    }

    private void recalculateTotals() {
        double subtotal = 0;
        for (CartItem item : cartItems) {
            subtotal += item.getLineTotal();
        }
        double fee = subtotal > 0 ? DELIVERY_FEE : 0;
        double total = subtotal + fee;

        tvSubtotal.setText(String.format(Locale.US, "BDT %.0f", subtotal));
        tvDeliveryFee.setText(String.format(Locale.US, "BDT %.0f", fee));
        tvTotal.setText(String.format(Locale.US, "BDT %.0f", total));
    }

    @Override
    public void onQuantityChanged(CartItem item, int newQuantity) {
        item.setQuantity(newQuantity);
        sessionManager.saveCartItems(cartItems);
        cartAdapter.notifyDataSetChanged();
        recalculateTotals();
    }

    @Override
    public void onRemoveItem(CartItem item) {
        new AlertDialog.Builder(this)
                .setTitle("Remove Item")
                .setMessage("Remove " + item.getName() + " from your cart?")
                .setPositiveButton("Remove", (dialog, which) -> {
                    cartItems.remove(item);
                    sessionManager.saveCartItems(cartItems);
                    cartAdapter.notifyDataSetChanged();
                    recalculateTotals();
                })
                .setNegativeButton("Cancel", null)
                .show();
    }
}
`
  },
  {
    path: 'app/src/main/java/com/fooddash/app/activities/CheckoutActivity.java',
    name: 'CheckoutActivity.java',
    category: 'activities',
    language: 'java',
    description: 'Checkout screen supporting Cash on Delivery, bKash, and Nagad with merchant number display, manual Transaction ID input validation, and PENDING_VERIFICATION status.',
    universityRequirementIds: [1, 2, 3, 7, 8, 9],
    content: `package com.fooddash.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.fooddash.app.R;
import com.fooddash.app.helpers.FirebaseHelper;
import com.fooddash.app.helpers.SessionManager;
import com.fooddash.app.helpers.ValidationHelper;
import com.fooddash.app.models.CartItem;
import com.fooddash.app.models.Order;
import com.fooddash.app.models.User;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;
import java.util.List;
import java.util.Locale;

/**
 * Screen 7: CheckoutActivity
 * Implements Section 5 Payment Methods:
 * 1. Cash on Delivery
 * 2. bKash (Displays configured merchant number, requires Transaction ID, sets PENDING_VERIFICATION)
 * 3. Nagad (Displays configured merchant number, requires Transaction ID, sets PENDING_VERIFICATION)
 */
public class CheckoutActivity extends AppCompatActivity {

    private static final double DELIVERY_FEE = 60.0;
    private String bkashMerchantNumber = "01711-998877 (bKash Merchant)";
    private String nagadMerchantNumber = "01819-554433 (Nagad Merchant)";

    private TextInputEditText etDeliveryAddress;
    private TextInputEditText etCustomerPhone;
    private TextInputEditText etTransactionId;
    private RadioGroup rgPaymentMethod;
    private LinearLayout layoutMobilePaymentBox;
    private TextView tvMerchantPaymentNumber;
    private TextView tvSummaryTotal;
    private Button btnPlaceOrder;

    private SessionManager sessionManager;
    private List<CartItem> cartItems;
    private double subtotal = 0.0;
    private double totalAmount = 0.0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_checkout);

        sessionManager = new SessionManager(this);
        cartItems = sessionManager.getCartItems();

        etDeliveryAddress = findViewById(R.id.etCheckoutAddress);
        etCustomerPhone = findViewById(R.id.etCheckoutPhone);
        etTransactionId = findViewById(R.id.etCheckoutTransactionId);
        rgPaymentMethod = findViewById(R.id.rgPaymentMethod);
        layoutMobilePaymentBox = findViewById(R.id.layoutMobilePaymentBox);
        tvMerchantPaymentNumber = findViewById(R.id.tvMerchantPaymentNumber);
        tvSummaryTotal = findViewById(R.id.tvCheckoutTotal);
        btnPlaceOrder = findViewById(R.id.btnPlaceOrder);

        for (CartItem item : cartItems) {
            subtotal += item.getLineTotal();
        }
        totalAmount = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0);
        tvSummaryTotal.setText(String.format(Locale.US, "Total Payable: BDT %.0f", totalAmount));

        loadCustomerProfileAndSettings();

        rgPaymentMethod.setOnCheckedChangeListener((group, checkedId) -> {
            if (checkedId == R.id.rbBkash) {
                layoutMobilePaymentBox.setVisibility(View.VISIBLE);
                tvMerchantPaymentNumber.setText("Send Money / Payment to bKash: " + bkashMerchantNumber
                        + "\nStatus will be set to PENDING_VERIFICATION until Admin verifies your TrxID.");
            } else if (checkedId == R.id.rbNagad) {
                layoutMobilePaymentBox.setVisibility(View.VISIBLE);
                tvMerchantPaymentNumber.setText("Send Money / Payment to Nagad: " + nagadMerchantNumber
                        + "\nStatus will be set to PENDING_VERIFICATION until Admin verifies your TrxID.");
            } else {
                layoutMobilePaymentBox.setVisibility(View.GONE);
                etTransactionId.setError(null);
            }
        });

        btnPlaceOrder.setOnClickListener(v -> submitOrder());
    }

    private void loadCustomerProfileAndSettings() {
        FirebaseUser fbUser = FirebaseHelper.getInstance().getCurrentUser();
        if (fbUser != null) {
            FirebaseHelper.getInstance().getUsersRef().child(fbUser.getUid())
                    .addListenerForSingleValueEvent(new ValueEventListener() {
                        @Override
                        public void onDataChange(@NonNull DataSnapshot snapshot) {
                            User user = snapshot.getValue(User.class);
                            if (user != null) {
                                etDeliveryAddress.setText(user.getAddress());
                                etCustomerPhone.setText(user.getPhone());
                            }
                        }
                        @Override public void onCancelled(@NonNull DatabaseError error) {}
                    });
        }

        FirebaseHelper.getInstance().getSettingsRef()
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        String bkash = snapshot.child("bkashNumber").getValue(String.class);
                        String nagad = snapshot.child("nagadNumber").getValue(String.class);
                        if (bkash != null && !bkash.isEmpty()) bkashMerchantNumber = bkash;
                        if (nagad != null && !nagad.isEmpty()) nagadMerchantNumber = nagad;
                    }
                    @Override public void onCancelled(@NonNull DatabaseError error) {}
                });
    }

    private void submitOrder() {
        if (!ValidationHelper.validateRequired(etDeliveryAddress, "Delivery address")
                | !ValidationHelper.validatePhone(etCustomerPhone)) {
            return;
        }

        int checkedId = rgPaymentMethod.getCheckedRadioButtonId();
        String paymentMethod = "Cash on Delivery";
        String paymentStatus = "COD_DUE";
        String transactionId = "";

        if (checkedId == R.id.rbBkash) {
            paymentMethod = "bKash";
            paymentStatus = "PENDING_VERIFICATION";
            if (!ValidationHelper.validateTransactionId(etTransactionId, "bKash")) return;
            transactionId = etTransactionId.getText().toString().trim().toUpperCase();
        } else if (checkedId == R.id.rbNagad) {
            paymentMethod = "Nagad";
            paymentStatus = "PENDING_VERIFICATION";
            if (!ValidationHelper.validateTransactionId(etTransactionId, "Nagad")) return;
            transactionId = etTransactionId.getText().toString().trim().toUpperCase();
        }

        FirebaseUser fbUser = FirebaseHelper.getInstance().getCurrentUser();
        String uid = fbUser != null ? fbUser.getUid() : "guest_uid";
        String customerName = sessionManager.getUserName().isEmpty() ? "Customer" : sessionManager.getUserName();

        Order order = new Order(
                "",
                uid,
                customerName,
                etCustomerPhone.getText().toString().trim(),
                cartItems,
                subtotal,
                DELIVERY_FEE,
                totalAmount,
                paymentMethod,
                paymentStatus,
                transactionId,
                "PENDING",
                etDeliveryAddress.getText().toString().trim(),
                System.currentTimeMillis()
        );

        btnPlaceOrder.setEnabled(false);
        FirebaseHelper.getInstance().placeOrder(order, task -> {
            btnPlaceOrder.setEnabled(true);
            if (task.isSuccessful()) {
                sessionManager.clearCart();
                Toast.makeText(this, "Order Placed Successfully!", Toast.LENGTH_LONG).show();
                Intent intent = new Intent(this, MyOrdersActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(intent);
                finish();
            } else {
                Toast.makeText(this, "Failed to place order. Try again.", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
`
  }
];
