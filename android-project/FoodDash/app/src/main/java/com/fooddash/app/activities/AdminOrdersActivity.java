package com.fooddash.app.activities;

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
                        + "
Amount: BDT " + order.getTotal()
                        + "
Submitted TrxID: " + order.getTransactionId()
                        + "

Have you confirmed this Transaction ID in your restaurant "
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
