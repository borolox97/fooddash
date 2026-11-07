import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateLoginInput,
  validateRegisterInput,
  validateCheckoutInput,
  addOrIncrementCartItem,
  updateCartItemQuantity,
  calculateSubtotal,
  calculateDeliveryFee,
  calculateTotal,
  createOrderObject,
  computeAdminStats,
  calculateGForce,
  FoodModel,
  UserModel,
} from './fooddashLogic';

const sampleFood: FoodModel = {
  foodId: 'food_1',
  name: 'Smoky Beef Cheese Burger',
  description: 'Double smashed patty with cheddar and house sauce',
  price: 380,
  category: 'Burgers',
  imageUrl: 'drawable/food_burger',
  available: true,
};

const sampleUser: UserModel = {
  uid: 'usr_cust_1',
  name: 'Tanvir Ahmed',
  email: 'tanvir@student.edu.bd',
  phone: '01712345678',
  role: 'CUSTOMER',
  address: 'House 14, Road 7, Dhanmondi, Dhaka',
  photoUrl: '',
};

test('validateLoginInput catches empty and malformed credentials', () => {
  const errEmpty = validateLoginInput('', '');
  assert.ok(errEmpty.email);
  assert.ok(errEmpty.password);

  const errShort = validateLoginInput('invalid-email', '123');
  assert.equal(errShort.email, 'Enter a valid email address');
  assert.equal(errShort.password, 'Password must be at least 6 characters');

  const valid = validateLoginInput('customer@fooddash.com', 'secret123');
  assert.equal(Object.keys(valid).length, 0);
});

test('validateRegisterInput validates phone and address', () => {
  const err = validateRegisterInput('A', 'bad', '123', 'abc', '123');
  assert.ok(err.name);
  assert.ok(err.email);
  assert.ok(err.phone);
  assert.ok(err.address);
  assert.ok(err.password);

  const ok = validateRegisterInput(
    'Tanvir Ahmed',
    'tanvir@fooddash.com',
    '01712345678',
    'Dhanmondi 27, Dhaka',
    'password123'
  );
  assert.equal(Object.keys(ok).length, 0);
});

test('cart calculations and quantity updates work accurately', () => {
  let cart = addOrIncrementCartItem([], sampleFood, 2);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 2);

  cart = addOrIncrementCartItem(cart, sampleFood, 1);
  assert.equal(cart[0].quantity, 3);

  const subtotal = calculateSubtotal(cart);
  assert.equal(subtotal, 380 * 3);

  const fee = calculateDeliveryFee(subtotal);
  assert.equal(fee, 60);
  assert.equal(calculateTotal(subtotal, fee), 1200);

  cart = updateCartItemQuantity(cart, 'food_1', -3);
  assert.equal(cart.length, 0);
  assert.equal(calculateDeliveryFee(calculateSubtotal(cart)), 0);
});

test('bKash and Nagad orders require transactionId and set PENDING_VERIFICATION', () => {
  const missingTxErrors = validateCheckoutInput(
    'House 14, Dhanmondi',
    '01712345678',
    'bKash',
    ''
  );
  assert.ok(missingTxErrors.transactionId);

  const validTxErrors = validateCheckoutInput(
    'House 14, Dhanmondi',
    '01712345678',
    'bKash',
    'BKA98234X1'
  );
  assert.equal(Object.keys(validTxErrors).length, 0);

  const cart = addOrIncrementCartItem([], sampleFood, 1);
  const bkashOrder = createOrderObject({
    orderId: 'ORD-1001',
    user: sampleUser,
    items: cart,
    paymentMethod: 'bKash',
    transactionId: 'bka98234x1',
    deliveryAddress: sampleUser.address,
    customerPhone: sampleUser.phone,
  });

  assert.equal(bkashOrder.paymentStatus, 'PENDING_VERIFICATION');
  assert.equal(bkashOrder.transactionId, 'BKA98234X1');
  assert.equal(bkashOrder.total, 440);

  const codOrder = createOrderObject({
    orderId: 'ORD-1002',
    user: sampleUser,
    items: cart,
    paymentMethod: 'Cash on Delivery',
    transactionId: '',
    deliveryAddress: sampleUser.address,
    customerPhone: sampleUser.phone,
  });
  assert.equal(codOrder.paymentStatus, 'COD_DUE');
  assert.equal(codOrder.transactionId, '');
});

test('computeAdminStats aggregates orders and sales accurately', () => {
  const cart = addOrIncrementCartItem([], sampleFood, 2);
  const o1 = createOrderObject({
    orderId: 'ORD-1',
    user: sampleUser,
    items: cart,
    paymentMethod: 'bKash',
    transactionId: 'TRX123456',
    deliveryAddress: sampleUser.address,
    customerPhone: sampleUser.phone,
  });
  const o2 = {
    ...createOrderObject({
      orderId: 'ORD-2',
      user: sampleUser,
      items: cart,
      paymentMethod: 'Cash on Delivery',
      transactionId: '',
      deliveryAddress: sampleUser.address,
      customerPhone: sampleUser.phone,
    }),
    status: 'DELIVERED' as const,
  };

  const stats = computeAdminStats([o1, o2], [sampleFood]);
  assert.equal(stats.totalOrders, 2);
  assert.equal(stats.pendingOrders, 1);
  assert.equal(stats.completedOrders, 1);
  assert.equal(stats.totalFoodProducts, 1);
  assert.equal(stats.pendingPaymentVerifications, 1);
  assert.equal(stats.salesSummaryTotal, o1.total + o2.total);
});

test('calculateGForce detects shake threshold >= 2.7g', () => {
  const rest = calculateGForce(0, 9.81, 0);
  assert.equal(rest.isShake, false);

  const shake = calculateGForce(22.0, 15.5, 12.0);
  assert.equal(shake.isShake, true);
  assert.ok(shake.gForce >= 2.7);
});
