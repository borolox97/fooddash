package com.fooddash.app.activities;

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
