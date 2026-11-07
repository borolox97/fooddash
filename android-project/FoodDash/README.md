# FoodDash — Good Food. Easy Ordering. Fast Delivery.

**Course:** Mobile Application and Development Lab (0613-410)  
**Project Title:** FoodDash — Full-Stack Android Food Delivery Application (Customer + Restaurant Admin)  
**Student Name:** [Enter Your Name Here]  
**Student ID:** [Enter Your Student ID Here]  
**Package Name:** `com.fooddash.app`  
**Language & UI:** 100% Native Java + XML Layouts (Android Studio)  
**Backend:** Firebase Authentication, Firebase Realtime Database, Firebase Storage  

---

## 1. Overview & Problem Solved
Local restaurants and campus food vendors often struggle with fragmented phone orders, unverified mobile money transfers (bKash/Nagad), and lack of real-time order status tracking for customers. **FoodDash** solves this with a dual-role Android application:
- **Customer Role:** Browse food by category, search items, add to cart, pay via Cash on Delivery or bKash/Nagad (with Transaction ID submission), and track order status in real time.
- **Restaurant Admin Role:** View live kitchen metrics (Total Orders, Pending, Completed, Total Products, Sales Summary), perform full CRUD on food items with image uploads, verify bKash/Nagad Transaction IDs (`PENDING_VERIFICATION` -> `VERIFIED`), and update order statuses.

---

## 2. All 12 Mandatory University Features Implemented

| # | Required Feature | Android Studio Implementation in FoodDash |
|---|---|---|
| **1** | **At least 5 screens with navigation** | **14 Activities** (`SplashActivity`, `LoginActivity`, `RegisterActivity`, `CustomerHomeActivity`, `FoodDetailsActivity`, `CartActivity`, `CheckoutActivity`, `MyOrdersActivity`, `OrderDetailsActivity`, `ProfileActivity`, `AdminDashboardActivity`, `ManageFoodActivity`, `AddEditFoodActivity`, `AdminOrdersActivity`) using explicit `Intent` and `putExtra()`. |
| **2** | **Layouts and basic views** | `ConstraintLayout`, `LinearLayout`, `ScrollView`, `TextView`, `ImageView`, `Button`, `CardView` across 17 XML layout files. |
| **3** | **User input with validation** | `TextInputEditText` + `setError()` in `ValidationHelper.java` validating email, password, phone number, address, food price, and bKash/Nagad Transaction ID. |
| **4** | **Model class for your data** | 4 Java POJO classes (`User.java`, `Food.java`, `Order.java`, `CartItem.java`) with empty constructors and getters/setters. |
| **5** | **Scrolling list of records** | `RecyclerView` + `Adapter` + `ViewHolder` in `FoodAdapter.java`, `CartAdapter.java`, and `OrderAdapter.java`. |
| **6** | **Add, view, edit, delete (CRUD) with dialog & FAB** | `FloatingActionButton` in `ManageFoodActivity` to add food, `AddEditFoodActivity` to edit, and `AlertDialog` confirmation before deleting food or removing cart items. |
| **7** | **Firebase login: register, login, logout, stay logged in** | `FirebaseAuth` in `FirebaseHelper.java`, `SplashActivity`, `LoginActivity`, `RegisterActivity`, and `ProfileActivity`. |
| **8** | **Data saved in Firebase database, updates in real time** | `FirebaseDatabase` (`fooddash/users`, `food`, `categories`, `orders`, `settings`) with `ValueEventListener` for real-time menu and order tracking. |
| **9** | **Save a setting on the phone** | `SharedPreferences` in `SessionManager.java` saving "Remember Me", Shake-to-Refresh sensor toggle, and local shopping cart state. |
| **10** | **Take or pick a photo and show it** | Camera (`MediaStore.ACTION_IMAGE_CAPTURE`) & Gallery (`Intent.ACTION_PICK`) in `ProfileActivity` and `AddEditFoodActivity`. |
| **11** | **Use one sensor (Accelerometer)** | `SensorManager` + `SensorEventListener` in `ShakeDetector.java` providing **Shake-to-Refresh** on `CustomerHomeActivity` and `MyOrdersActivity`. |
| **12** | **Open another app (call, share, web link)** | Implicit `Intent`s: `ACTION_DIAL` (call hotline), `ACTION_SEND` (share dish & order receipt), and `ACTION_VIEW` (open restaurant website). |

---

## 3. How to Connect Your Firebase Project & Build the APK

1. **Open in Android Studio:**
   - Extract the downloaded FoodDash project folder and open it in **Android Studio Ladybug / Koala or newer**.
2. **Connect Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a project named `FoodDash`.
   - Register an Android app with package name **`com.fooddash.app`**.
   - Download `google-services.json` and place it inside the `app/` directory (`FoodDash/app/google-services.json`).
   - In Firebase Console, enable **Authentication -> Email/Password**.
   - Enable **Realtime Database** and paste the rules from `database.rules.json` into the **Rules** tab.
   - Enable **Firebase Storage** for profile and food images.
3. **Create an Admin Account:**
   - Register a user normally in the app, then in Firebase Realtime Database under `fooddash/users/{uid}/role`, change `"CUSTOMER"` to `"ADMIN"` (customers can never self-assign admin role from the client).
4. **Build Signed / Debug APK for GitHub Release v1.0:**
   - In Android Studio, select **Build -> Build Bundle(s) / APK(s) -> Build APK(s)**.
   - Locate the generated APK at `app/build/outputs/apk/debug/app-debug.apk`, rename it to `FoodDash-v1.0.apk`, and attach it to your **GitHub Release `v1.0`**.
