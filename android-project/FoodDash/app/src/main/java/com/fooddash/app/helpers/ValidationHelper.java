package com.fooddash.app.helpers;

import android.util.Patterns;
import com.google.android.material.textfield.TextInputEditText;

/**
 * ValidationHelper satisfies Requirement #3: User input with validation
 * using TextInputEditText + setError() so the app never crashes on empty or invalid input.
 */
public class ValidationHelper {

    public static boolean validateRequired(TextInputEditText editText, String fieldName) {
        String text = editText.getText() != null ? editText.getText().toString().trim() : "";
        if (text.isEmpty()) {
            editText.setError(fieldName + " is required");
            editText.requestFocus();
            return false;
        }
        editText.setError(null);
        return true;
    }

    public static boolean validateEmail(TextInputEditText emailInput) {
        String email = emailInput.getText() != null ? emailInput.getText().toString().trim() : "";
        if (email.isEmpty()) {
            emailInput.setError("Email address is required");
            emailInput.requestFocus();
            return false;
        }
        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            emailInput.setError("Please enter a valid email address");
            emailInput.requestFocus();
            return false;
        }
        emailInput.setError(null);
        return true;
    }

    public static boolean validatePassword(TextInputEditText passwordInput) {
        String password = passwordInput.getText() != null ? passwordInput.getText().toString() : "";
        if (password.isEmpty()) {
            passwordInput.setError("Password is required");
            passwordInput.requestFocus();
            return false;
        }
        if (password.length() < 6) {
            passwordInput.setError("Password must be at least 6 characters");
            passwordInput.requestFocus();
            return false;
        }
        passwordInput.setError(null);
        return true;
    }

    public static boolean validatePhone(TextInputEditText phoneInput) {
        String phone = phoneInput.getText() != null ? phoneInput.getText().toString().trim() : "";
        if (phone.isEmpty()) {
            phoneInput.setError("Phone number is required");
            phoneInput.requestFocus();
            return false;
        }
        if (!phone.matches("^(\+?8801|01)[3-9]\d{8}$") && phone.length() < 10) {
            phoneInput.setError("Enter a valid phone number (e.g. 01712345678)");
            phoneInput.requestFocus();
            return false;
        }
        phoneInput.setError(null);
        return true;
    }

    public static boolean validatePositivePrice(TextInputEditText priceInput) {
        String raw = priceInput.getText() != null ? priceInput.getText().toString().trim() : "";
        if (raw.isEmpty()) {
            priceInput.setError("Price is required");
            priceInput.requestFocus();
            return false;
        }
        try {
            double value = Double.parseDouble(raw);
            if (value <= 0) {
                priceInput.setError("Price must be greater than 0");
                priceInput.requestFocus();
                return false;
            }
        } catch (NumberFormatException e) {
            priceInput.setError("Enter a valid numeric price");
            priceInput.requestFocus();
            return false;
        }
        priceInput.setError(null);
        return true;
    }

    public static boolean validateTransactionId(TextInputEditText trxInput, String paymentMethod) {
        String trx = trxInput.getText() != null ? trxInput.getText().toString().trim() : "";
        if (trx.isEmpty()) {
            trxInput.setError("Enter your " + paymentMethod + " Transaction ID");
            trxInput.requestFocus();
            return false;
        }
        if (!trx.matches("^[A-Za-z0-9]{6,20}$")) {
            trxInput.setError("Transaction ID must be 6-20 alphanumeric characters");
            trxInput.requestFocus();
            return false;
        }
        trxInput.setError(null);
        return true;
    }
}
