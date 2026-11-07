package com.fooddash.app.activities;

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
