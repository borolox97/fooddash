package com.fooddash.app.activities;

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
