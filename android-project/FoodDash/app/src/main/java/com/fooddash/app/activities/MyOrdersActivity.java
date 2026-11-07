package com.fooddash.app.activities;

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
