package com.fooddash.app.activities;

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
                        + "
Status will be set to PENDING_VERIFICATION until Admin verifies your TrxID.");
            } else if (checkedId == R.id.rbNagad) {
                layoutMobilePaymentBox.setVisibility(View.VISIBLE);
                tvMerchantPaymentNumber.setText("Send Money / Payment to Nagad: " + nagadMerchantNumber
                        + "
Status will be set to PENDING_VERIFICATION until Admin verifies your TrxID.");
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
