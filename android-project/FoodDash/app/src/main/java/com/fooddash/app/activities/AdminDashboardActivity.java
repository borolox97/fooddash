package com.fooddash.app.activities;

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
