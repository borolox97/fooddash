package com.fooddash.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.EditText;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.fooddash.app.R;
import com.fooddash.app.adapters.FoodAdapter;
import com.fooddash.app.helpers.FirebaseHelper;
import com.fooddash.app.models.Food;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;
import java.util.ArrayList;
import java.util.List;

/**
 * Screen 12: ManageFoodActivity
 * Implements Requirement #6: Add, view, edit, delete (CRUD) with AlertDialog and FloatingActionButton.
 */
public class ManageFoodActivity extends AppCompatActivity implements FoodAdapter.OnFoodActionListener {

    private RecyclerView rvAdminFood;
    private EditText etAdminSearchFood;
    private FloatingActionButton fabAddFood;
    private FoodAdapter foodAdapter;
    private final List<Food> allFoods = new ArrayList<>();
    private final List<Food> filteredFoods = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_manage_food);

        rvAdminFood = findViewById(R.id.rvAdminFoodList);
        etAdminSearchFood = findViewById(R.id.etAdminSearchFood);
        fabAddFood = findViewById(R.id.fabAddFood);

        rvAdminFood.setLayoutManager(new LinearLayoutManager(this));
        foodAdapter = new FoodAdapter(this, filteredFoods, true, this);
        rvAdminFood.setAdapter(foodAdapter);

        // Requirement #6: FloatingActionButton launches AddEditFoodActivity for creating new food
        fabAddFood.setOnClickListener(v -> {
            Intent intent = new Intent(ManageFoodActivity.this, AddEditFoodActivity.class);
            startActivity(intent);
        });

        etAdminSearchFood.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterFoods();
            }
            @Override public void afterTextChanged(Editable s) {}
        });

        listenToFoodInventory();
    }

    private void listenToFoodInventory() {
        FirebaseHelper.getInstance().getFoodRef()
                .addValueEventListener(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        allFoods.clear();
                        for (DataSnapshot child : snapshot.getChildren()) {
                            Food food = child.getValue(Food.class);
                            if (food != null) {
                                allFoods.add(food);
                            }
                        }
                        filterFoods();
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {}
                });
    }

    private void filterFoods() {
        String q = etAdminSearchFood.getText() != null ? etAdminSearchFood.getText().toString().trim().toLowerCase() : "";
        filteredFoods.clear();
        for (Food food : allFoods) {
            if (q.isEmpty() || food.getName().toLowerCase().contains(q) || food.getCategory().toLowerCase().contains(q)) {
                filteredFoods.add(food);
            }
        }
        foodAdapter.updateList(filteredFoods);
    }

    @Override
    public void onFoodClick(Food food) {
        onEditClick(food);
    }

    @Override
    public void onAddToCartClick(Food food) {}

    @Override
    public void onEditClick(Food food) {
        Intent intent = new Intent(this, AddEditFoodActivity.class);
        intent.putExtra("EXTRA_EDIT_FOOD", food);
        startActivity(intent);
    }

    // Requirement #6: Delete food item with AlertDialog confirmation
    @Override
    public void onDeleteClick(Food food) {
        new AlertDialog.Builder(this)
                .setTitle("Delete Food Item")
                .setMessage("Are you sure you want to permanently delete '" + food.getName() + "' from the menu?")
                .setPositiveButton("Delete", (dialog, which) -> {
                    FirebaseHelper.getInstance().deleteFoodItem(food.getFoodId(), task -> {
                        if (task.isSuccessful()) {
                            Snackbar.make(rvAdminFood, food.getName() + " deleted", Snackbar.LENGTH_SHORT).show();
                        }
                    });
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    @Override
    public void onToggleAvailability(Food food) {
        boolean nextState = !food.isAvailable();
        food.setAvailable(nextState);
        FirebaseHelper.getInstance().saveFoodItem(food, task -> {
            if (task.isSuccessful()) {
                Toast.makeText(this, food.getName() + " marked as " + (nextState ? "Available" : "Sold Out"), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
