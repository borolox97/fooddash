export interface ComponentJustification {
  component: string;
  usedInFiles: string;
  whatItDoesInFoodDash: string;
  alternatives: string;
  whyChosen: string;
}

export interface UniversityRequirementItem {
  id: number;
  title: string;
  howToDoItSpec: string;
  implementedInFiles: string[];
  verificationSummary: string;
  simulatorActionLabel: string;
  targetActivity: string;
}

export interface VivaQuestion {
  question: string;
  category: string;
  answer: string;
  codeReference: string;
}

export const UNIVERSITY_12_REQUIREMENTS: UniversityRequirementItem[] = [
  {
    id: 1,
    title: 'At least 5 screens with navigation (Splash, Login, Register, Home, Add/Edit)',
    howToDoItSpec: 'Activities + Intent, pass data with putExtra() if needed',
    implementedInFiles: [
      'SplashActivity.java',
      'LoginActivity.java',
      'RegisterActivity.java',
      'CustomerHomeActivity.java',
      'FoodDetailsActivity.java',
      'CartActivity.java',
      'CheckoutActivity.java',
      'MyOrdersActivity.java',
      'OrderDetailsActivity.java',
      'ProfileActivity.java',
      'AdminDashboardActivity.java',
      'ManageFoodActivity.java',
      'AddEditFoodActivity.java',
      'AdminOrdersActivity.java',
    ],
    verificationSummary:
      'Implemented 14 distinct Java Activities registered in AndroidManifest.xml. Data objects (Food, Order ID) are passed between Activities via explicit Intent.putExtra("EXTRA_FOOD", food) and Intent.getSerializableExtra().',
    simulatorActionLabel: 'Inspect All 14 Activities',
    targetActivity: 'CustomerHomeActivity',
  },
  {
    id: 2,
    title: 'Layouts and basic views (text, image, button, card)',
    howToDoItSpec: 'ConstraintLayout / LinearLayout, TextView, ImageView, Button, CardView',
    implementedInFiles: [
      'activity_splash.xml',
      'activity_customer_home.xml',
      'activity_admin_dashboard.xml',
      'item_food.xml',
      'item_order.xml',
    ],
    verificationSummary:
      'Built 17 XML layouts combining ConstraintLayout, LinearLayout, ScrollView, CardView (rounded 14dp-16dp food & KPI cards), TextView, ImageView, RadioGroup, Spinner, and Material Button.',
    simulatorActionLabel: 'View XML Layouts',
    targetActivity: 'CustomerHomeActivity',
  },
  {
    id: 3,
    title: 'User input with validation (no crash on empty/wrong input)',
    howToDoItSpec: 'TextInputEditText + setError()',
    implementedInFiles: [
      'ValidationHelper.java',
      'LoginActivity.java',
      'RegisterActivity.java',
      'CheckoutActivity.java',
      'AddEditFoodActivity.java',
    ],
    verificationSummary:
      'ValidationHelper.java validates email format, password length (>=6), BD phone numbers, positive food prices, and 6-20 char alphanumeric bKash/Nagad Transaction IDs using TextInputEditText.setError() and requestFocus().',
    simulatorActionLabel: 'Test Input Validation',
    targetActivity: 'LoginActivity',
  },
  {
    id: 4,
    title: 'Model class for your data',
    howToDoItSpec: 'Java class with getters/setters',
    implementedInFiles: [
      'User.java',
      'Food.java',
      'Order.java',
      'CartItem.java',
    ],
    verificationSummary:
      'Created 4 POJO model classes implementing Serializable with no-argument constructors (required by Firebase DataSnapshot.getValue()) and complete getters and setters.',
    simulatorActionLabel: 'View Java Models',
    targetActivity: 'CustomerHomeActivity',
  },
  {
    id: 5,
    title: 'Scrolling list of records',
    howToDoItSpec: 'RecyclerView + Adapter + ViewHolder',
    implementedInFiles: [
      'FoodAdapter.java',
      'CartAdapter.java',
      'OrderAdapter.java',
      'item_food.xml',
      'item_cart.xml',
      'item_order.xml',
    ],
    verificationSummary:
      'Implemented 3 custom RecyclerView.Adapter classes with inner static ViewHolder classes binding Food, CartItem, and Order lists efficiently with LinearLayoutManager.',
    simulatorActionLabel: 'Browse Food RecyclerView',
    targetActivity: 'CustomerHomeActivity',
  },
  {
    id: 6,
    title: 'Add, view, edit, delete (CRUD) with dialog and FAB',
    howToDoItSpec: 'AlertDialog, FloatingActionButton',
    implementedInFiles: [
      'ManageFoodActivity.java',
      'AddEditFoodActivity.java',
      'CartActivity.java',
      'AdminOrdersActivity.java',
    ],
    verificationSummary:
      'ManageFoodActivity uses FloatingActionButton (fabAddFood) to add new dishes, item click to edit in AddEditFoodActivity, and AlertDialog.Builder to confirm deletion and verify bKash/Nagad payments.',
    simulatorActionLabel: 'Test Admin Food CRUD',
    targetActivity: 'ManageFoodActivity',
  },
  {
    id: 7,
    title: 'Firebase login: register, login, logout, stay logged in',
    howToDoItSpec: 'Tools -> Firebase -> Authentication; FirebaseAuth',
    implementedInFiles: [
      'FirebaseHelper.java',
      'SplashActivity.java',
      'LoginActivity.java',
      'RegisterActivity.java',
      'ProfileActivity.java',
    ],
    verificationSummary:
      'Uses FirebaseAuth.getInstance() for createUserWithEmailAndPassword(), signInWithEmailAndPassword(), signOut(), and getCurrentUser() in SplashActivity for persistent login.',
    simulatorActionLabel: 'Test Auth & Roles',
    targetActivity: 'LoginActivity',
  },
  {
    id: 8,
    title: 'Data saved in Firebase database, list updates in real time',
    howToDoItSpec: 'Firebase Realtime Database + a data change listener',
    implementedInFiles: [
      'FirebaseHelper.java',
      'CustomerHomeActivity.java',
      'MyOrdersActivity.java',
      'AdminDashboardActivity.java',
      'AdminOrdersActivity.java',
    ],
    verificationSummary:
      'All data is persisted under fooddash/{users, food, categories, orders, settings} and synchronized live across Customer and Admin screens via ValueEventListener.onDataChange().',
    simulatorActionLabel: 'View Live Orders',
    targetActivity: 'AdminOrdersActivity',
  },
  {
    id: 9,
    title: 'Save a setting on the phone (e.g. remember me)',
    howToDoItSpec: 'SharedPreferences',
    implementedInFiles: [
      'SessionManager.java',
      'LoginActivity.java',
      'ProfileActivity.java',
    ],
    verificationSummary:
      'SessionManager.java uses SharedPreferences ("FoodDashPrefs") to persist Remember Me checkbox state, saved login email, cached user role, Shake-to-Refresh toggle, and local cart items.',
    simulatorActionLabel: 'Test SharedPreferences',
    targetActivity: 'ProfileActivity',
  },
  {
    id: 10,
    title: 'Take or pick a photo and show it',
    howToDoItSpec: 'Camera / Gallery Intent',
    implementedInFiles: [
      'ProfileActivity.java',
      'AddEditFoodActivity.java',
    ],
    verificationSummary:
      'Uses MediaStore.ACTION_IMAGE_CAPTURE (Camera) and Intent.ACTION_PICK (Gallery) with ActivityResultLauncher to capture or pick profile photos and food product images, displaying them in ImageView and uploading to Firebase Storage.',
    simulatorActionLabel: 'Test Photo Picker',
    targetActivity: 'ProfileActivity',
  },
  {
    id: 11,
    title: 'Use one sensor (e.g. shake, proximity)',
    howToDoItSpec: 'SensorManager + SensorEventListener',
    implementedInFiles: [
      'ShakeDetector.java',
      'CustomerHomeActivity.java',
      'MyOrdersActivity.java',
    ],
    verificationSummary:
      'ShakeDetector implements SensorEventListener on Sensor.TYPE_ACCELEROMETER, computing 3-axis g-force (sqrt(gX²+gY²+gZ²) > 2.7g) to trigger Shake-to-Refresh on the menu and order tracker.',
    simulatorActionLabel: 'Simulate Device Shake',
    targetActivity: 'CustomerHomeActivity',
  },
  {
    id: 12,
    title: 'Open another app (call, share, web link)',
    howToDoItSpec: 'Implicit Intent (ACTION_DIAL, ACTION_SEND, ACTION_VIEW)',
    implementedInFiles: [
      'CustomerHomeActivity.java',
      'FoodDetailsActivity.java',
      'OrderDetailsActivity.java',
    ],
    verificationSummary:
      'Implements all three Implicit Intents: Intent.ACTION_DIAL (call restaurant support hotline), Intent.ACTION_SEND (share dish & order receipt via chooser), and Intent.ACTION_VIEW (open restaurant website).',
    simulatorActionLabel: 'Test Implicit Intents',
    targetActivity: 'OrderDetailsActivity',
  },
];

export const COMPONENT_COMPARISON_TABLE: ComponentJustification[] = [
  {
    component: 'ConstraintLayout & LinearLayout',
    usedInFiles: 'activity_splash.xml, activity_manage_food.xml, activity_customer_home.xml',
    whatItDoesInFoodDash:
      'Positions UI elements such as the floating action button, search bar, category strips, and responsive form sections across all 14 screens.',
    alternatives: 'RelativeLayout, FrameLayout, TableLayout',
    whyChosen:
      'ConstraintLayout flattens deep view hierarchies for complex overlays like FAB over RecyclerView, while LinearLayout with layout_weight provides clean, predictable vertical and horizontal stacking for forms and KPI rows.',
  },
  {
    component: 'RecyclerView + Adapter + ViewHolder',
    usedInFiles: 'FoodAdapter.java, CartAdapter.java, OrderAdapter.java',
    whatItDoesInFoodDash:
      'Renders scrolling lists of food products, shopping cart items, and customer/admin orders with view recycling.',
    alternatives: 'ListView + ArrayAdapter, GridView, ScrollView with dynamic views',
    whyChosen:
      'RecyclerView enforces the ViewHolder pattern to recycle item views off-screen, preventing memory thrashing and lag when scrolling through food photos and real-time order updates.',
  },
  {
    component: 'CardView (androidx.cardview.widget.CardView)',
    usedInFiles: 'item_food.xml, item_cart.xml, item_order.xml, activity_admin_dashboard.xml',
    whatItDoesInFoodDash:
      'Wraps individual food listings, order receipts, login forms, and Admin KPI metrics in rounded (14dp–16dp) elevated containers.',
    alternatives: 'Plain ViewGroup with custom shape drawable background',
    whyChosen:
      'CardView provides consistent Material Design elevation shadows and corner radius clipping across Android API levels without requiring boilerplate XML shape drawables.',
  },
  {
    component: 'TextInputLayout + TextInputEditText + setError()',
    usedInFiles: 'ValidationHelper.java, LoginActivity.java, RegisterActivity.java, CheckoutActivity.java, AddEditFoodActivity.java',
    whatItDoesInFoodDash:
      'Captures user credentials, phone numbers, food prices, and bKash/Nagad Transaction IDs while displaying inline validation errors.',
    alternatives: 'Plain EditText with Toast alerts on invalid input',
    whyChosen:
      'TextInputEditText with setError() highlights the exact invalid field with a floating label and inline error icon, preventing app crashes from NumberFormatException or empty Firebase writes.',
  },
  {
    component: 'Activities + Explicit Intents (putExtra)',
    usedInFiles: 'All 14 Activities in com.fooddash.app.activities.*',
    whatItDoesInFoodDash:
      'Handles screen-to-screen navigation and passes Serializable Food objects and Order IDs between Customer and Admin workflows.',
    alternatives: 'Single-Activity Architecture with Fragments + Jetpack Navigation Component',
    whyChosen:
      'Separate Activities provide clear lifecycle boundaries for each screen (e.g., isolating Admin screens from Customer screens and managing SensorManager registration in onResume/onPause) as required by the lab specification.',
  },
  {
    component: 'Implicit Intents (ACTION_DIAL, ACTION_SEND, ACTION_VIEW)',
    usedInFiles: 'CustomerHomeActivity.java, FoodDetailsActivity.java, OrderDetailsActivity.java',
    whatItDoesInFoodDash:
      'Launches the phone dialer for restaurant support, opens the system share sheet to share dishes/receipts, and opens the restaurant website in a browser.',
    alternatives: 'WebView for web links, custom in-app dialer/share APIs',
    whyChosen:
      'Implicit Intents delegate phone calls, social sharing, and web browsing to the user’s preferred native Android apps without requiring dangerous CALL_PHONE permissions.',
  },
  {
    component: 'AlertDialog (androidx.appcompat.app.AlertDialog)',
    usedInFiles: 'ManageFoodActivity.java, AdminOrdersActivity.java, CartActivity.java, ProfileActivity.java',
    whatItDoesInFoodDash:
      'Prompts confirmation before deleting food items, verifies bKash/Nagad Transaction IDs, selects order status updates, and chooses between Camera or Gallery.',
    alternatives: 'BottomSheetDialogFragment, PopupWindow, separate confirmation Activity',
    whyChosen:
      'AlertDialog interrupts destructive or critical actions (like permanent food deletion or payment verification) synchronously with zero extra layout boilerplate.',
  },
  {
    component: 'FloatingActionButton (FAB)',
    usedInFiles: 'activity_manage_food.xml, ManageFoodActivity.java',
    whatItDoesInFoodDash:
      'Provides a prominent primary action button in ManageFoodActivity to launch AddEditFoodActivity for creating new menu items.',
    alternatives: 'Standard Toolbar menu item or bottom Button',
    whyChosen:
      'FloatingActionButton follows Material Design guidelines by floating above the scrolling RecyclerView, keeping the primary "Create Food" CRUD action reachable at all times.',
  },
  {
    component: 'Firebase Authentication (FirebaseAuth)',
    usedInFiles: 'FirebaseHelper.java, SplashActivity.java, LoginActivity.java, RegisterActivity.java',
    whatItDoesInFoodDash:
      'Manages customer and admin registration, email/password sign-in, persistent user sessions, and secure sign-out.',
    alternatives: 'Custom REST API with JWT tokens, Google Sign-In, Phone OTP',
    whyChosen:
      'FirebaseAuth handles password hashing, token refresh, and persistent session caching out of the box, integrating directly with Firebase Realtime Database security rules via auth.uid.',
  },
  {
    component: 'Firebase Realtime Database + ValueEventListener',
    usedInFiles: 'FirebaseHelper.java, CustomerHomeActivity.java, MyOrdersActivity.java, AdminDashboardActivity.java, AdminOrdersActivity.java',
    whatItDoesInFoodDash:
      'Stores users, food catalog, categories, orders, and payment settings in a cloud JSON tree and pushes real-time updates to connected devices.',
    alternatives: 'SQLite, Room Persistence Library, Cloud Firestore, MySQL via REST',
    whyChosen:
      'Unlike local-only SQLite/Room, Firebase Realtime Database synchronizes orders and menu availability instantly between the Customer’s phone and the Restaurant Admin’s dashboard via ValueEventListener.',
  },
  {
    component: 'Firebase Storage',
    usedInFiles: 'FirebaseHelper.java, ProfileActivity.java, AddEditFoodActivity.java',
    whatItDoesInFoodDash:
      'Uploads and hosts user profile photos and restaurant food product images in the cloud, returning HTTPS download URLs.',
    alternatives: 'Base64 strings in Realtime Database, AWS S3, Cloudinary',
    whyChosen:
      'Storing binary images in Firebase Storage keeps the Realtime Database JSON lightweight and fast while providing reliable download URLs for Glide.',
  },
  {
    component: 'SharedPreferences (SessionManager)',
    usedInFiles: 'SessionManager.java, LoginActivity.java, ProfileActivity.java, CartActivity.java',
    whatItDoesInFoodDash:
      'Saves lightweight key-value preferences locally on the phone: Remember Me state, saved email, Shake-to-Refresh toggle, and local cart JSON.',
    alternatives: 'SQLite, Room Database, Jetpack DataStore, internal file storage',
    whyChosen:
      'SharedPreferences provides instant synchronous read/write access for simple boolean flags and user session preferences without the schema overhead of SQLite or Room.',
  },
  {
    component: 'Camera & Gallery Intent (ActivityResultLauncher)',
    usedInFiles: 'ProfileActivity.java, AddEditFoodActivity.java',
    whatItDoesInFoodDash:
      'Captures a new photo using the device camera (ACTION_IMAGE_CAPTURE) or picks an existing image from the gallery (ACTION_PICK) and displays it in an ImageView.',
    alternatives: 'CameraX library, Camera2 API',
    whyChosen:
      'MediaStore Camera and Gallery Intents leverage the device’s built-in camera and photo picker apps with minimal code complexity and high compatibility across Android devices.',
  },
  {
    component: 'SensorManager + SensorEventListener (Accelerometer)',
    usedInFiles: 'ShakeDetector.java, CustomerHomeActivity.java, MyOrdersActivity.java',
    whatItDoesInFoodDash:
      'Detects physical phone shake gestures (gForce > 2.7g) to refresh live food listings and order statuses.',
    alternatives: 'Proximity sensor, Gyroscope sensor, Light sensor',
    whyChosen:
      'The Accelerometer sensor is universally available on virtually all Android phones and enables an intuitive "Shake-to-Refresh" gesture for checking live order updates.',
  },
  {
    component: 'Git + GitHub (with Release v1.0)',
    usedInFiles: 'Repository root, README.md, .gitignore',
    whatItDoesInFoodDash:
      'Tracks source code version history, hosts the public repository, and distributes the compiled FoodDash-v1.0.apk via GitHub Releases.',
    alternatives: 'GitLab, Bitbucket, manual ZIP backups',
    whyChosen:
      'GitHub is the industry standard for version control and provides built-in Releases to package tagged source code alongside the installable Android APK.',
  },
];

export const VIVA_PREPARATION_QA: VivaQuestion[] = [
  {
    question: 'How does FoodDash prevent a Customer from making themselves a Restaurant Admin?',
    category: 'Security & Role Architecture',
    answer:
      'In RegisterActivity.java, every newly registered account is hardcoded with role = "CUSTOMER". More importantly, in database.rules.json under fooddash/users/$uid, the .write rule enforces (!newData.child("role").exists() || newData.child("role").val() === "CUSTOMER" || data.child("role").val() === "ADMIN"), which means even if a malicious user modifies the client code, Firebase rejects any write attempting to change role to ADMIN. Furthermore, AdminDashboardActivity.java verifies user.isAdmin() on launch.',
    codeReference: 'RegisterActivity.java:78, AdminDashboardActivity.java:65, database.rules.json:7',
  },
  {
    question: 'How does manual bKash and Nagad payment verification work without a live payment gateway?',
    category: 'Payment Workflow',
    answer:
      'In CheckoutActivity.java, when the user selects bKash or Nagad, the app displays the restaurant’s configured merchant number from fooddash/settings and reveals a TextInputEditText for the Transaction ID. ValidationHelper.validateTransactionId() ensures a 6–20 character alphanumeric TrxID is entered. The order is saved to Firebase with paymentStatus = "PENDING_VERIFICATION". In AdminOrdersActivity.java, the Admin sees a "Verify Payment" button that opens an AlertDialog showing the customer’s TrxID, allowing the Admin to mark paymentStatus as "VERIFIED" or "REJECTED".',
    codeReference: 'CheckoutActivity.java:104-135, AdminOrdersActivity.java:67-90',
  },
  {
    question: 'Explain how the Accelerometer Shake-to-Refresh sensor works and why you unregister it in onPause().',
    category: 'Android Sensors & Lifecycle',
    answer:
      'ShakeDetector.java implements SensorEventListener and reads event.values[0..2] (X, Y, Z acceleration in m/s²). It divides each axis by SensorManager.GRAVITY_EARTH (9.81 m/s²) and calculates gForce = sqrt(gX² + gY² + gZ²). When gForce exceeds 2.7F (with a 750ms debounce), it fires onShake(). In CustomerHomeActivity and MyOrdersActivity, we register the listener in onResume() and unregister it in onPause() so the accelerometer does not drain the battery or trigger callbacks when the Activity is in the background.',
    codeReference: 'ShakeDetector.java:28-55, CustomerHomeActivity.java:162-176',
  },
  {
    question: 'Why did you use RecyclerView instead of ListView, and what is the role of ViewHolder?',
    category: 'UI & Performance',
    answer:
      'ListView creates or inflates views inefficiently unless manually optimized, and lacks built-in layout managers or item animations. RecyclerView decouples layout positioning into LinearLayoutManager and mandates the ViewHolder pattern (FoodViewHolder, CartViewHolder, OrderViewHolder), which caches findViewById() references so scrolling through dozens of food items or orders runs at 60fps without repeated DOM/view lookups.',
    codeReference: 'FoodAdapter.java:46-118',
  },
  {
    question: 'What is the difference between Explicit and Implicit Intents in FoodDash?',
    category: 'Android Intents',
    answer:
      'An Explicit Intent specifies the exact target Activity class inside our app—for example, new Intent(this, FoodDetailsActivity.class) with intent.putExtra("EXTRA_FOOD", food). An Implicit Intent declares a general action and URI—such as new Intent(Intent.ACTION_DIAL, Uri.parse("tel:+8801711002233")), Intent.ACTION_SEND for sharing a dish, or Intent.ACTION_VIEW for opening the restaurant website—allowing the Android OS to open the user’s phone dialer, messaging app, or browser.',
    codeReference: 'CustomerHomeActivity.java:86-98, FoodDetailsActivity.java:82-91',
  },
  {
    question: 'How does real-time synchronization work between Customer and Admin devices?',
    category: 'Firebase Realtime Database',
    answer:
      'Instead of one-time HTTP requests, FoodDash attaches a ValueEventListener to DatabaseReference nodes (fooddash/food and fooddash/orders). Whenever the Admin adds a dish or changes an order status from PENDING to PREPARING in AdminOrdersActivity, Firebase pushes the updated DataSnapshot over WebSockets to CustomerHomeActivity and MyOrdersActivity within milliseconds, triggering onDataChange() and adapter.notifyDataSetChanged().',
    codeReference: 'MyOrdersActivity.java:58-82, AdminOrdersActivity.java:41-60',
  },
];
