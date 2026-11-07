package com.fooddash.app.activities;

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
                                  .append("
");
                            }
                        }
                        tvItemsList.setText(sb.toString().trim());

                        tvTotals.setText(String.format(Locale.US,
                                "Subtotal: BDT %.0f
Delivery Fee: BDT %.0f
Total: BDT %.0f",
                                currentOrder.getSubtotal(),
                                currentOrder.getDeliveryFee(),
                                currentOrder.getTotal()));
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {}
                });
    }
}
