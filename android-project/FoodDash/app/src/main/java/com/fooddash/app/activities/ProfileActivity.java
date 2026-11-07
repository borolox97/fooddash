package com.fooddash.app.activities;

import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Switch;
import android.widget.Toast;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import com.bumptech.glide.Glide;
import com.fooddash.app.R;
import com.fooddash.app.helpers.FirebaseHelper;
import com.fooddash.app.helpers.SessionManager;
import com.fooddash.app.helpers.ValidationHelper;
import com.fooddash.app.models.User;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

/**
 * Screen 10: ProfileActivity
 * Implements Requirement #9 (SharedPreferences settings), Requirement #10 (Camera / Gallery Intent),
 * Requirement #3 (TextInputEditText validation), and Requirement #7 (Firebase Logout).
 */
public class ProfileActivity extends AppCompatActivity {

    private ImageView ivProfilePhoto;
    private TextInputEditText etName;
    private TextInputEditText etPhone;
    private TextInputEditText etAddress;
    private Switch switchShakeRefresh;

    private Uri selectedPhotoUri;
    private User currentUserProfile;
    private SessionManager sessionManager;

    private final ActivityResultLauncher<Intent> galleryLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                    selectedPhotoUri = result.getData().getData();
                    ivProfilePhoto.setImageURI(selectedPhotoUri);
                    uploadProfilePhotoIfSelected();
                }
            }
    );

    private final ActivityResultLauncher<Intent> cameraLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK && result.getData() != null && result.getData().getExtras() != null) {
                    Bitmap bitmap = (Bitmap) result.getData().getExtras().get("data");
                    if (bitmap != null) {
                        ivProfilePhoto.setImageBitmap(bitmap);
                        Toast.makeText(this, "Camera photo captured!", Toast.LENGTH_SHORT).show();
                    }
                }
            }
    );

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        sessionManager = new SessionManager(this);

        ivProfilePhoto = findViewById(R.id.ivProfilePhoto);
        etName = findViewById(R.id.etProfileName);
        etPhone = findViewById(R.id.etProfilePhone);
        etAddress = findViewById(R.id.etProfileAddress);
        switchShakeRefresh = findViewById(R.id.switchShakeToRefresh);
        Button btnPickPhoto = findViewById(R.id.btnChangeProfilePhoto);
        Button btnSaveProfile = findViewById(R.id.btnSaveProfile);
        Button btnLogout = findViewById(R.id.btnLogout);

        switchShakeRefresh.setChecked(sessionManager.isShakeToRefreshEnabled());
        switchShakeRefresh.setOnCheckedChangeListener((buttonView, isChecked) -> {
            sessionManager.setShakeToRefreshEnabled(isChecked);
            Toast.makeText(this, "Shake-to-refresh setting saved in SharedPreferences", Toast.LENGTH_SHORT).show();
        });

        btnPickPhoto.setOnClickListener(v -> showPhotoSourceDialog());
        btnSaveProfile.setOnClickListener(v -> saveProfileChanges());
        btnLogout.setOnClickListener(v -> performLogout());

        loadUserProfile();
    }

    // Requirement #10: Take or pick a photo and show it using Camera / Gallery Intent
    private void showPhotoSourceDialog() {
        String[] options = {"Take Photo with Camera", "Choose from Gallery"};
        new AlertDialog.Builder(this)
                .setTitle("Update Profile Photo")
                .setItems(options, (dialog, which) -> {
                    if (which == 0) {
                        Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                        cameraLauncher.launch(cameraIntent);
                    } else {
                        Intent galleryIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                        galleryLauncher.launch(galleryIntent);
                    }
                })
                .show();
    }

    private void uploadProfilePhotoIfSelected() {
        FirebaseUser fbUser = FirebaseHelper.getInstance().getCurrentUser();
        if (fbUser == null || selectedPhotoUri == null) return;

        FirebaseHelper.getInstance().uploadImage(
                FirebaseHelper.getInstance().getProfileImagesStorageRef(),
                fbUser.getUid(),
                selectedPhotoUri,
                new FirebaseHelper.ImageUploadCallback() {
                    @Override
                    public void onSuccess(String downloadUrl) {
                        FirebaseHelper.getInstance().getUsersRef()
                                .child(fbUser.getUid())
                                .child("photoUrl")
                                .setValue(downloadUrl);
                        Toast.makeText(ProfileActivity.this, "Profile photo uploaded to Firebase Storage", Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onError(String message) {
                        Toast.makeText(ProfileActivity.this, "Upload error: " + message, Toast.LENGTH_SHORT).show();
                    }
                }
        );
    }

    private void loadUserProfile() {
        FirebaseUser fbUser = FirebaseHelper.getInstance().getCurrentUser();
        if (fbUser == null) return;

        FirebaseHelper.getInstance().getUsersRef().child(fbUser.getUid())
                .addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        currentUserProfile = snapshot.getValue(User.class);
                        if (currentUserProfile != null) {
                            etName.setText(currentUserProfile.getName());
                            etPhone.setText(currentUserProfile.getPhone());
                            etAddress.setText(currentUserProfile.getAddress());
                            if (currentUserProfile.getPhotoUrl() != null && !currentUserProfile.getPhotoUrl().isEmpty()) {
                                Glide.with(ProfileActivity.this)
                                        .load(currentUserProfile.getPhotoUrl())
                                        .into(ivProfilePhoto);
                            }
                        }
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {}
                });
    }

    private void saveProfileChanges() {
        if (!ValidationHelper.validateRequired(etName, "Name")
                | !ValidationHelper.validatePhone(etPhone)
                | !ValidationHelper.validateRequired(etAddress, "Address")) {
            return;
        }

        if (currentUserProfile == null) return;
        currentUserProfile.setName(etName.getText().toString().trim());
        currentUserProfile.setPhone(etPhone.getText().toString().trim());
        currentUserProfile.setAddress(etAddress.getText().toString().trim());

        FirebaseHelper.getInstance().saveUserProfile(currentUserProfile, task -> {
            if (task.isSuccessful()) {
                sessionManager.saveUserSession(currentUserProfile.getName(), currentUserProfile.getRole());
                Toast.makeText(this, "Profile updated in Firebase!", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void performLogout() {
        FirebaseHelper.getInstance().getAuth().signOut();
        sessionManager.clearSessionOnLogout();
        Intent intent = new Intent(this, LoginActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}
