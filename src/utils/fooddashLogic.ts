export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface UserModel {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address: string;
  photoUrl: string;
}

export interface FoodModel {
  foodId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
  rating?: number;
  prepTimeMinutes?: number;
  popular?: boolean;
}

export interface CartItemModel {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string;
}

export type PaymentMethod = 'Cash on Delivery' | 'bKash' | 'Nagad';
export type PaymentStatus = 'COD_DUE' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'REJECTED';

export interface OrderModel {
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: CartItemModel[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  status: OrderStatus;
  deliveryAddress: string;
  createdAt: number;
}

export interface RestaurantSettings {
  bkashNumber: string;
  nagadNumber: string;
  supportPhone: string;
  websiteUrl: string;
  standardDeliveryFee: number;
  restaurantName: string;
  tagline: string;
}

export interface ValidationErrors {
  [field: string]: string;
}

export const DEFAULT_DELIVERY_FEE = 60;

/**
 * Mirrors ValidationHelper.java for TextInputEditText.setError()
 */
export function validateLoginInput(email: string, password: string): ValidationErrors {
  const errors: ValidationErrors = {};
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  return errors;
}

export function validateRegisterInput(
  name: string,
  email: string,
  phone: string,
  address: string,
  password: string
): ValidationErrors {
  const errors = validateLoginInput(email, password);
  if (!name || name.trim().length < 2) {
    errors.name = 'Full name is required (min 2 chars)';
  }
  const cleanPhone = phone.replace(/[\s-]/g, '');
  if (!cleanPhone) {
    errors.phone = 'Phone number is required';
  } else if (!/^(\+?8801|01)[3-9]\d{8}$/.test(cleanPhone) && !/^\+?\d{10,15}$/.test(cleanPhone)) {
    errors.phone = 'Enter a valid phone number (e.g. 01712345678)';
  }
  if (!address || address.trim().length < 5) {
    errors.address = 'Delivery address is required (min 5 chars)';
  }
  return errors;
}

export function validateFoodInput(
  name: string,
  description: string,
  priceStr: string,
  category: string
): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!name || name.trim().length < 2) {
    errors.name = 'Food name is required';
  }
  if (!description || description.trim().length < 6) {
    errors.description = 'Description must be at least 6 characters';
  }
  const parsedPrice = Number(priceStr);
  if (!priceStr || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
    errors.price = 'Enter a valid positive price';
  }
  if (!category || !category.trim()) {
    errors.category = 'Category is required';
  }
  return errors;
}

export function validateCheckoutInput(
  deliveryAddress: string,
  customerPhone: string,
  paymentMethod: PaymentMethod,
  transactionId: string
): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!deliveryAddress || deliveryAddress.trim().length < 5) {
    errors.deliveryAddress = 'Delivery address is required (min 5 chars)';
  }
  const cleanPhone = customerPhone.replace(/[\s-]/g, '');
  if (!cleanPhone || cleanPhone.length < 10) {
    errors.customerPhone = 'Valid phone number is required';
  }
  if (paymentMethod === 'bKash' || paymentMethod === 'Nagad') {
    const cleanTx = transactionId.trim();
    if (!cleanTx) {
      errors.transactionId = `Enter your ${paymentMethod} Transaction ID (TrxID)`;
    } else if (!/^[A-Za-z0-9]{6,20}$/.test(cleanTx)) {
      errors.transactionId = 'Transaction ID must be 6-20 alphanumeric characters';
    }
  }
  return errors;
}

/**
 * Cart operations matching CartActivity.java & CartAdapter.java
 */
export function addOrIncrementCartItem(
  cart: CartItemModel[],
  food: FoodModel,
  quantityToAdd = 1
): CartItemModel[] {
  const existingIndex = cart.findIndex((item) => item.foodId === food.foodId);
  if (existingIndex > -1) {
    return cart.map((item, idx) =>
      idx === existingIndex
        ? { ...item, quantity: item.quantity + quantityToAdd }
        : item
    );
  }
  return [
    ...cart,
    {
      foodId: food.foodId,
      name: food.name,
      price: food.price,
      quantity: quantityToAdd,
      imageUrl: food.imageUrl,
      category: food.category,
    },
  ];
}

export function updateCartItemQuantity(
  cart: CartItemModel[],
  foodId: string,
  delta: number
): CartItemModel[] {
  return cart
    .map((item) =>
      item.foodId === foodId
        ? { ...item, quantity: item.quantity + delta }
        : item
    )
    .filter((item) => item.quantity > 0);
}

export function removeCartItem(
  cart: CartItemModel[],
  foodId: string
): CartItemModel[] {
  return cart.filter((item) => item.foodId !== foodId);
}

export function calculateSubtotal(cart: CartItemModel[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateDeliveryFee(
  subtotal: number,
  fee = DEFAULT_DELIVERY_FEE
): number {
  return subtotal > 0 ? fee : 0;
}

export function calculateTotal(subtotal: number, deliveryFee: number): number {
  return subtotal + deliveryFee;
}

/**
 * Order building logic matching CheckoutActivity.java
 */
export function createOrderObject(params: {
  orderId: string;
  user: UserModel;
  items: CartItemModel[];
  paymentMethod: PaymentMethod;
  transactionId: string;
  deliveryAddress: string;
  customerPhone: string;
  deliveryFee?: number;
  createdAt?: number;
}): OrderModel {
  const subtotal = calculateSubtotal(params.items);
  const deliveryFee = calculateDeliveryFee(
    subtotal,
    params.deliveryFee ?? DEFAULT_DELIVERY_FEE
  );
  const total = calculateTotal(subtotal, deliveryFee);
  const isMobileMoney =
    params.paymentMethod === 'bKash' || params.paymentMethod === 'Nagad';

  return {
    orderId: params.orderId,
    customerId: params.user.uid,
    customerName: params.user.name,
    customerPhone: params.customerPhone.trim(),
    items: params.items,
    subtotal,
    deliveryFee,
    total,
    paymentMethod: params.paymentMethod,
    paymentStatus: isMobileMoney ? 'PENDING_VERIFICATION' : 'COD_DUE',
    transactionId: isMobileMoney ? params.transactionId.trim().toUpperCase() : '',
    status: 'PENDING',
    deliveryAddress: params.deliveryAddress.trim(),
    createdAt: params.createdAt ?? Date.now(),
  };
}

/**
 * Admin Dashboard Metrics matching AdminDashboardActivity.java
 */
export interface AdminDashboardMetrics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalFoodProducts: number;
  availableFoodProducts: number;
  salesSummaryTotal: number;
  pendingPaymentVerifications: number;
}

export function computeAdminStats(
  orders: OrderModel[],
  foods: FoodModel[]
): AdminDashboardMetrics {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) =>
      o.status === 'PENDING' ||
      o.status === 'ACCEPTED' ||
      o.status === 'PREPARING' ||
      o.status === 'OUT_FOR_DELIVERY'
  ).length;
  const completedOrders = orders.filter((o) => o.status === 'DELIVERED').length;
  const totalFoodProducts = foods.length;
  const availableFoodProducts = foods.filter((f) => f.available).length;
  const salesSummaryTotal = orders
    .filter((o) => o.status !== 'REJECTED')
    .reduce((acc, o) => acc + o.total, 0);
  const pendingPaymentVerifications = orders.filter(
    (o) => o.paymentStatus === 'PENDING_VERIFICATION'
  ).length;

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    totalFoodProducts,
    availableFoodProducts,
    salesSummaryTotal,
    pendingPaymentVerifications,
  };
}

/**
 * Accelerometer Shake-to-Refresh G-Force math matching ShakeDetector.java
 */
export const EARTH_GRAVITY = 9.80665;
export const SHAKE_THRESHOLD_GRAVITY = 2.7;

export function calculateGForce(x: number, y: number, z: number): {
  gForce: number;
  isShake: boolean;
} {
  const gX = x / EARTH_GRAVITY;
  const gY = y / EARTH_GRAVITY;
  const gZ = z / EARTH_GRAVITY;
  const gForce = Math.sqrt(gX * gX + gY * gY + gZ * gZ);
  return {
    gForce: Number(gForce.toFixed(2)),
    isShake: gForce >= SHAKE_THRESHOLD_GRAVITY,
  };
}
