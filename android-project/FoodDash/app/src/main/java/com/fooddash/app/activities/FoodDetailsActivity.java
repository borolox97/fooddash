package com.fooddash.app.activities;

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
