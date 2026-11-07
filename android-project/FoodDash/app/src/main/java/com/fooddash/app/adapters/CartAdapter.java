package com.fooddash.app.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.fooddash.app.R;
import com.fooddash.app.models.CartItem;
import java.util.List;
import java.util.Locale;

/**
 * CartAdapter manages the RecyclerView inside CartActivity.
 */
public class CartAdapter extends RecyclerView.Adapter<CartAdapter.CartViewHolder> {

    public interface OnCartChangeListener {
        void onQuantityChanged(CartItem item, int newQuantity);
        void onRemoveItem(CartItem item);
    }

    private final Context context;
    private final List<CartItem> cartItems;
    private final OnCartChangeListener listener;

    public CartAdapter(Context context, List<CartItem> cartItems, OnCartChangeListener listener) {
        this.context = context;
        this.cartItems = cartItems;
        this.listener = listener;
    }

    @NonNull
    @Override
    public CartViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_cart, parent, false);
        return new CartViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CartViewHolder holder, int position) {
        CartItem item = cartItems.get(position);
        holder.tvName.setText(item.getName());
        holder.tvUnitPrice.setText(String.format(Locale.US, "BDT %.0f each", item.getPrice()));
        holder.tvQuantity.setText(String.valueOf(item.getQuantity()));
        holder.tvLineTotal.setText(String.format(Locale.US, "BDT %.0f", item.getLineTotal()));

        if (item.getImageUrl() != null && !item.getImageUrl().isEmpty()) {
            Glide.with(context)
                    .load(item.getImageUrl())
                    .placeholder(R.drawable.ic_fooddash_logo)
                    .into(holder.ivCartImage);
        }

        holder.btnPlus.setOnClickListener(v -> {
            if (listener != null) listener.onQuantityChanged(item, item.getQuantity() + 1);
        });

        holder.btnMinus.setOnClickListener(v -> {
            if (listener != null) {
                if (item.getQuantity() > 1) {
                    listener.onQuantityChanged(item, item.getQuantity() - 1);
                } else {
                    listener.onRemoveItem(item);
                }
            }
        });

        holder.btnRemove.setOnClickListener(v -> {
            if (listener != null) listener.onRemoveItem(item);
        });
    }

    @Override
    public int getItemCount() {
        return cartItems != null ? cartItems.size() : 0;
    }

    public static class CartViewHolder extends RecyclerView.ViewHolder {
        final ImageView ivCartImage;
        final TextView tvName;
        final TextView tvUnitPrice;
        final TextView tvQuantity;
        final TextView tvLineTotal;
        final Button btnMinus;
        final Button btnPlus;
        final Button btnRemove;

        public CartViewHolder(@NonNull View itemView) {
            super(itemView);
            ivCartImage = itemView.findViewById(R.id.ivCartFood);
            tvName = itemView.findViewById(R.id.tvCartFoodName);
            tvUnitPrice = itemView.findViewById(R.id.tvCartUnitPrice);
            tvQuantity = itemView.findViewById(R.id.tvCartQty);
            tvLineTotal = itemView.findViewById(R.id.tvCartLineTotal);
            btnMinus = itemView.findViewById(R.id.btnCartMinus);
            btnPlus = itemView.findViewById(R.id.btnCartPlus);
            btnRemove = itemView.findViewById(R.id.btnCartRemove);
        }
    }
}
