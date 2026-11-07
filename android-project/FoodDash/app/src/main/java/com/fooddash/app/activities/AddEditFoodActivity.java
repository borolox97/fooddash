package com.fooddash.app.activities;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import com.bumptech.glide.Glide;
import com.fooddash.app.R;
import com.fooddash.app.helpers.FirebaseHelper;
import com.fooddash.app.helpers.ValidationHelper;
import com.fooddash.app.models.Food;
import com.google.android.material.textfield.TextInputEditText;
import java.util.UUID;

/**
 * Screen 13: AddEditFoodActivity
 * Supports adding new food items or editing existing ones with Camera/Gallery photo selection,
 * input validation, and Firebase Storage + Realtime Database persistence.
 */
public class AddEditFoodActivity extends AppCompatActivity {

    private TextView tvScreenTitle;
    private ImageView ivFoodPreview;
    private TextInputEditText etFoodName;
    private TextInputEditText etFoodDescription;
    private TextInputEditText etFoodPrice;
    private Spinner spinnerCategory;
    private CheckBox cbAvailable;
    private Button btnSaveFood;

    private Food editingFood;
    private Uri selectedImageUri;
    private final String[] categories = {"Burgers", "Pizza", "Biryani", "Drinks", "Desserts"};

    private final ActivityResultLauncher<Intent> imagePickerLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                    selectedImageUri = result.getData().getData();
                    ivFoodPreview.setImageURI(selectedImageUri);
                }
            }
    );

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_edit_food);

        tvScreenTitle = findViewById(R.id.tvAddEditFoodTitle);
        ivFoodPreview = findViewById(R.id.ivAddEditFoodPreview);
        etFoodName = findViewById(R.id.etFoodName);
        etFoodDescription = findViewById(R.id.etFoodDescription);
        etFoodPrice = findViewById(R.id.etFoodPrice);
        spinnerCategory = findViewById(R.id.spinnerFoodCategory);
        cbAvailable = findViewById(R.id.cbFoodAvailable);
        Button btnSelectImage = findViewById(R.id.btnPickFoodImage);
        btnSaveFood = findViewById(R.id.btnSaveFoodItem);

        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, categories);
        spinnerCategory.setAdapter(adapter);

        editingFood = (Food) getIntent().getSerializableExtra("EXTRA_EDIT_FOOD");
        if (editingFood != null) {
            tvScreenTitle.setText("Edit Food Product");
            etFoodName.setText(editingFood.getName());
            etFoodDescription.setText(editingFood.getDescription());
            etFoodPrice.setText(String.valueOf(editingFood.getPrice()));
            cbAvailable.setChecked(editingFood.isAvailable());

            for (int i = 0; i < categories.length; i++) {
                if (categories[i].equalsIgnoreCase(editingFood.getCategory())) {
                    spinnerCategory.setSelection(i);
                    break;
                }
            }
            if (editingFood.getImageUrl() != null && !editingFood.getImageUrl().isEmpty()) {
                Glide.with(this).load(editingFood.getImageUrl()).into(ivFoodPreview);
            }
        }

        // Requirement #10: Pick food photo from Gallery via Intent
        btnSelectImage.setOnClickListener(v -> {
            Intent pickIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            imagePickerLauncher.launch(pickIntent);
        });

        btnSaveFood.setOnClickListener(v -> validateAndSaveFood());
    }

    private void validateAndSaveFood() {
        boolean isValid = ValidationHelper.validateRequired(etFoodName, "Food name")
                & ValidationHelper.validateRequired(etFoodDescription, "Description")
                & ValidationHelper.validatePositivePrice(etFoodPrice);

        if (!isValid) return;

        final String name = etFoodName.getText().toString().trim();
        final String desc = etFoodDescription.getText().toString().trim();
        final double price = Double.parseDouble(etFoodPrice.getText().toString().trim());
        final String category = spinnerCategory.getSelectedItem().toString();
        final boolean available = cbAvailable.isChecked();

        btnSaveFood.setEnabled(false);

        if (selectedImageUri != null) {
            String fileId = editingFood != null ? editingFood.getFoodId() : UUID.randomUUID().toString();
            FirebaseHelper.getInstance().uploadImage(
                    FirebaseHelper.getInstance().getFoodImagesStorageRef(),
                    fileId,
                    selectedImageUri,
                    new FirebaseHelper.ImageUploadCallback() {
                        @Override
                        public void onSuccess(String downloadUrl) {
                            persistFoodRecord(name, desc, price, category, downloadUrl, available);
                        }

                        @Override
                        public void onError(String message) {
                            btnSaveFood.setEnabled(true);
                            Toast.makeText(AddEditFoodActivity.this, "Image upload failed: " + message, Toast.LENGTH_SHORT).show();
                        }
                    }
            );
        } else {
            String existingUrl = editingFood != null ? editingFood.getImageUrl() : "";
            persistFoodRecord(name, desc, price, category, existingUrl, available);
        }
    }

    private void persistFoodRecord(String name, String desc, double price, String category, String imageUrl, boolean available) {
        String foodId = editingFood != null ? editingFood.getFoodId() : "";
        Food food = new Food(foodId, name, desc, price, category, imageUrl, available);

        FirebaseHelper.getInstance().saveFoodItem(food, task -> {
            btnSaveFood.setEnabled(true);
            if (task.isSuccessful()) {
                Toast.makeText(this, "Food item saved successfully!", Toast.LENGTH_SHORT).show();
                finish();
            } else {
                Toast.makeText(this, "Failed to save food item", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
