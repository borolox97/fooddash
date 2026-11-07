package com.fooddash.app.activities;

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
