package com.fooddash.app.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.fooddash.app.R;
import com.fooddash.app.models.Food;
import java.util.List;
import java.util.Locale;

/**
 * FoodAdapter satisfies Requirement #5: RecyclerView + Adapter + ViewHolder.
 * Supports both Customer browsing and Admin CRUD actions.
 */
public class FoodAdapter extends RecyclerView.Adapter<FoodAdapter.FoodViewHolder> {

    public interface OnFoodActionListener {
        void onFoodClick(Food food);
        void onAddToCartClick(Food food);
        void onEditClick(Food food);
        void onDeleteClick(Food food);
        void onToggleAvailability(Food food);
    }

    private final Context context;
    private List<Food> foodList;
    private final boolean isAdminMode;
    private final OnFoodActionListener listener;

    public FoodAdapter(Context context, List<Food> foodList, boolean isAdminMode, OnFoodActionListener listener) {
        this.context = context;
        this.foodList = foodList;
        this.isAdminMode = isAdminMode;
        this.listener = listener;
    }

    public void updateList(List<Food> updated) {
        this.foodList = updated;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public FoodViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_food, parent, false);
        return new FoodViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull FoodViewHolder holder, int position) {
        Food food = foodList.get(position);
        holder.tvName.setText(food.getName());
        holder.tvCategory.setText(food.getCategory());
        holder.tvDescription.setText(food.getDescription());
        holder.tvPrice.setText(String.format(Locale.US, "BDT %.0f", food.getPrice()));
        holder.tvAvailability.setText(food.isAvailable() ? "Available" : "Sold Out");

        if (food.getImageUrl() != null && !food.getImageUrl().isEmpty()) {
            Glide.with(context)
                    .load(food.getImageUrl())
                    .placeholder(R.drawable.ic_fooddash_logo)
                    .into(holder.ivFood);
        }

        holder.cardView.setOnClickListener(v -> {
            if (listener != null) listener.onFoodClick(food);
        });

        if (isAdminMode) {
            holder.btnPrimaryAction.setText("Edit");
            holder.btnPrimaryAction.setOnClickListener(v -> {
                if (listener != null) listener.onEditClick(food);
            });
            holder.btnDeleteAction.setVisibility(View.VISIBLE);
            holder.btnDeleteAction.setOnClickListener(v -> {
                if (listener != null) listener.onDeleteClick(food);
            });
            holder.tvAvailability.setOnClickListener(v -> {
                if (listener != null) listener.onToggleAvailability(food);
            });
        } else {
            holder.btnDeleteAction.setVisibility(View.GONE);
            holder.btnPrimaryAction.setText(food.isAvailable() ? "Add to Cart" : "Unavailable");
            holder.btnPrimaryAction.setEnabled(food.isAvailable());
            holder.btnPrimaryAction.setOnClickListener(v -> {
                if (listener != null && food.isAvailable()) listener.onAddToCartClick(food);
            });
        }
    }

    @Override
    public int getItemCount() {
        return foodList != null ? foodList.size() : 0;
    }

    public static class FoodViewHolder extends RecyclerView.ViewHolder {
        final CardView cardView;
        final ImageView ivFood;
        final TextView tvName;
        final TextView tvCategory;
        final TextView tvDescription;
        final TextView tvPrice;
        final TextView tvAvailability;
        final Button btnPrimaryAction;
        final Button btnDeleteAction;

        public FoodViewHolder(@NonNull View itemView) {
            super(itemView);
            cardView = itemView.findViewById(R.id.cardFoodItem);
            ivFood = itemView.findViewById(R.id.ivFoodImage);
            tvName = itemView.findViewById(R.id.tvFoodName);
            tvCategory = itemView.findViewById(R.id.tvFoodCategory);
            tvDescription = itemView.findViewById(R.id.tvFoodDescription);
            tvPrice = itemView.findViewById(R.id.tvFoodPrice);
            tvAvailability = itemView.findViewById(R.id.tvFoodAvailability);
            btnPrimaryAction = itemView.findViewById(R.id.btnFoodPrimaryAction);
            btnDeleteAction = itemView.findViewById(R.id.btnFoodDeleteAction);
        }
    }
}
