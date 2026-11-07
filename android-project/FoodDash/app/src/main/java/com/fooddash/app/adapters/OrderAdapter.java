package com.fooddash.app.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;
import com.fooddash.app.R;
import com.fooddash.app.models.Order;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * OrderAdapter renders orders in both MyOrdersActivity (Customer) and AdminOrdersActivity (Admin).
 */
public class OrderAdapter extends RecyclerView.Adapter<OrderAdapter.OrderViewHolder> {

    public interface OnOrderActionListener {
        void onOrderClick(Order order);
        void onVerifyPaymentClick(Order order);
        void onUpdateStatusClick(Order order);
    }

    private final Context context;
    private final List<Order> orderList;
    private final boolean isAdminMode;
    private final OnOrderActionListener listener;
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.US);

    public OrderAdapter(Context context, List<Order> orderList, boolean isAdminMode, OnOrderActionListener listener) {
        this.context = context;
        this.orderList = orderList;
        this.isAdminMode = isAdminMode;
        this.listener = listener;
    }

    @NonNull
    @Override
    public OrderViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_order, parent, false);
        return new OrderViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull OrderViewHolder holder, int position) {
        Order order = orderList.get(position);
        holder.tvOrderId.setText("Order #" + order.getOrderId());
        holder.tvCustomerName.setText(order.getCustomerName() + " · " + order.getCustomerPhone());
        holder.tvOrderDate.setText(dateFormat.format(new Date(order.getCreatedAt())));
        holder.tvOrderStatus.setText("Status: " + order.getStatus());

        String paymentDetails = order.getPaymentMethod() + " (" + order.getPaymentStatus() + ")";
        if (order.getTransactionId() != null && !order.getTransactionId().isEmpty()) {
            paymentDetails += " · TrxID: " + order.getTransactionId();
        }
        holder.tvPaymentInfo.setText(paymentDetails);
        holder.tvTotalAmount.setText(String.format(Locale.US, "BDT %.0f", order.getTotal()));

        holder.cardOrder.setOnClickListener(v -> {
            if (listener != null) listener.onOrderClick(order);
        });

        if (isAdminMode) {
            holder.btnUpdateStatus.setVisibility(View.VISIBLE);
            holder.btnUpdateStatus.setOnClickListener(v -> {
                if (listener != null) listener.onUpdateStatusClick(order);
            });

            if ("PENDING_VERIFICATION".equals(order.getPaymentStatus())) {
                holder.btnVerifyPayment.setVisibility(View.VISIBLE);
                holder.btnVerifyPayment.setOnClickListener(v -> {
                    if (listener != null) listener.onVerifyPaymentClick(order);
                });
            } else {
                holder.btnVerifyPayment.setVisibility(View.GONE);
            }
        } else {
            holder.btnUpdateStatus.setVisibility(View.GONE);
            holder.btnVerifyPayment.setVisibility(View.GONE);
        }
    }

    @Override
    public int getItemCount() {
        return orderList != null ? orderList.size() : 0;
    }

    public static class OrderViewHolder extends RecyclerView.ViewHolder {
        final CardView cardOrder;
        final TextView tvOrderId;
        final TextView tvCustomerName;
        final TextView tvOrderDate;
        final TextView tvOrderStatus;
        final TextView tvPaymentInfo;
        final TextView tvTotalAmount;
        final Button btnVerifyPayment;
        final Button btnUpdateStatus;

        public OrderViewHolder(@NonNull View itemView) {
            super(itemView);
            cardOrder = itemView.findViewById(R.id.cardOrder);
            tvOrderId = itemView.findViewById(R.id.tvOrderId);
            tvCustomerName = itemView.findViewById(R.id.tvOrderCustomerName);
            tvOrderDate = itemView.findViewById(R.id.tvOrderDate);
            tvOrderStatus = itemView.findViewById(R.id.tvOrderStatus);
            tvPaymentInfo = itemView.findViewById(R.id.tvOrderPaymentInfo);
            tvTotalAmount = itemView.findViewById(R.id.tvOrderTotal);
            btnVerifyPayment = itemView.findViewById(R.id.btnVerifyPayment);
            btnUpdateStatus = itemView.findViewById(R.id.btnUpdateOrderStatus);
        }
    }
}
