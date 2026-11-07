import {
  FoodModel,
  OrderModel,
  RestaurantSettings,
  UserModel,
} from '../utils/fooddashLogic';

export const INITIAL_USERS: Record<string, UserModel> = {
  usr_cust_1: {
    uid: 'usr_cust_1',
    name: 'Tanvir Ahmed',
    email: 'tanvir@student.edu.bd',
    phone: '01712345678',
    role: 'CUSTOMER',
    address: 'House 14, Road 7, Dhanmondi, Dhaka 1205',
    photoUrl: 'avatar_customer',
  },
  usr_admin_1: {
    uid: 'usr_admin_1',
    name: 'Chef Rafiqul Islam (Admin)',
    email: 'admin@fooddash.com.bd',
    phone: '01711002233',
    role: 'ADMIN',
    address: 'FoodDash Central Kitchen, Banani Road 11, Dhaka',
    photoUrl: 'avatar_admin',
  },
};

export const INITIAL_CATEGORIES: string[] = [
  'All',
  'Burgers',
  'Biryani',
  'Pizza',
  'Platters',
  'Drinks',
];

export const INITIAL_FOODS: FoodModel[] = [
  {
    foodId: 'food_101',
    name: 'Smoky Double Smash Beef Burger',
    description:
      'Two 120g flame-seared prime beef patties, aged sharp cheddar, caramelized onion jam, house chipotle aioli, and toasted brioche bun.',
    price: 390,
    category: 'Burgers',
    imageUrl: 'svg_burger',
    available: true,
    rating: 4.9,
    prepTimeMinutes: 18,
    popular: true,
  },
  {
    foodId: 'food_102',
    name: 'Old Dhaka Shahi Kacchi Biryani',
    description:
      'Slow-cooked chinigura aromatic rice layered with tender marinated mutton, saffron, potato, prunes, and roasted cashews.',
    price: 480,
    category: 'Biryani',
    imageUrl: 'svg_biryani',
    available: true,
    rating: 4.95,
    prepTimeMinutes: 25,
    popular: true,
  },
  {
    foodId: 'food_103',
    name: 'Wood-Fired Pepperoni & Hot Honey Pizza',
    description:
      '12-inch hand-stretched sourdough crust, San Marzano tomato sauce, fresh mozzarella, crispy beef pepperoni, and chili-infused wildflower honey.',
    price: 650,
    category: 'Pizza',
    imageUrl: 'svg_pizza',
    available: true,
    rating: 4.8,
    prepTimeMinutes: 22,
    popular: true,
  },
  {
    foodId: 'food_104',
    name: 'Crispy Naga Nashville Hot Chicken Burger',
    description:
      'Buttermilk-brined crispy chicken thigh glazed in fiery Sylheti Naga chili oil, pickles, and cooling ranch slaw.',
    price: 340,
    category: 'Burgers',
    imageUrl: 'svg_chicken_burger',
    available: true,
    rating: 4.75,
    prepTimeMinutes: 15,
    popular: false,
  },
  {
    foodId: 'food_105',
    name: 'Peri-Peri Grilled Chicken Rice Platter',
    description:
      'Quarter flame-grilled peri-peri chicken served over buttered Mexican herb rice, grilled corn ribs, and garlic white sauce.',
    price: 420,
    category: 'Platters',
    imageUrl: 'svg_platter',
    available: true,
    rating: 4.85,
    prepTimeMinutes: 20,
    popular: true,
  },
  {
    foodId: 'food_106',
    name: 'Artisanal Mango Saffron Lassi & Mint Cooler',
    description:
      'Chilled Rajshahi Himsagar mango yogurt smoothie blended with cardamom and a touch of Kashmiri saffron.',
    price: 160,
    category: 'Drinks',
    imageUrl: 'svg_drink',
    available: true,
    rating: 4.9,
    prepTimeMinutes: 8,
    popular: false,
  },
];

export const INITIAL_ORDERS: OrderModel[] = [
  {
    orderId: 'ORD-8492',
    customerId: 'usr_cust_1',
    customerName: 'Tanvir Ahmed',
    customerPhone: '01712345678',
    items: [
      {
        foodId: 'food_102',
        name: 'Old Dhaka Shahi Kacchi Biryani',
        price: 480,
        quantity: 2,
        imageUrl: 'svg_biryani',
        category: 'Biryani',
      },
      {
        foodId: 'food_106',
        name: 'Artisanal Mango Saffron Lassi & Mint Cooler',
        price: 160,
        quantity: 1,
        imageUrl: 'svg_drink',
        category: 'Drinks',
      },
    ],
    subtotal: 1120,
    deliveryFee: 60,
    total: 1180,
    paymentMethod: 'bKash',
    paymentStatus: 'PENDING_VERIFICATION',
    transactionId: 'BKA948271X',
    status: 'PENDING',
    deliveryAddress: 'House 14, Road 7, Dhanmondi, Dhaka 1205',
    createdAt: Date.now() - 1000 * 60 * 14,
  },
  {
    orderId: 'ORD-8485',
    customerId: 'usr_cust_1',
    customerName: 'Tanvir Ahmed',
    customerPhone: '01712345678',
    items: [
      {
        foodId: 'food_101',
        name: 'Smoky Double Smash Beef Burger',
        price: 390,
        quantity: 1,
        imageUrl: 'svg_burger',
        category: 'Burgers',
      },
    ],
    subtotal: 390,
    deliveryFee: 60,
    total: 450,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'VERIFIED',
    transactionId: '',
    status: 'DELIVERED',
    deliveryAddress: 'House 14, Road 7, Dhanmondi, Dhaka 1205',
    createdAt: Date.now() - 1000 * 60 * 180,
  },
];

export const INITIAL_SETTINGS: RestaurantSettings = {
  bkashNumber: '01711-998877 (FoodDash Merchant)',
  nagadNumber: '01819-554433 (FoodDash Merchant)',
  supportPhone: '+8801711002233',
  websiteUrl: 'https://fooddash.com.bd',
  standardDeliveryFee: 60,
  restaurantName: 'FoodDash Kitchens BD',
  tagline: 'Good Food. Easy Ordering. Fast Delivery.',
};
