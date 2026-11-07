import { AndroidSourceFile } from './modelsAndHelpersSource';

export const XML_AND_CONFIG_FILES: AndroidSourceFile[] = [
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'config',
    language: 'xml',
    description: 'Android application manifest registering all 14 Activities, custom FoodDash launcher icon, Material theme, and permissions for Internet, Camera, and Storage.',
    universityRequirementIds: [1, 10, 11, 12],
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.fooddash.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <uses-feature android:name="android.hardware.sensor.accelerometer" android:required="false" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />

    <application
        android:allowBackup="true"
        android:icon="@drawable/ic_fooddash_logo"
        android:label="@string/app_name"
        android:roundIcon="@drawable/ic_fooddash_logo"
        android:supportsRtl="true"
        android:theme="@style/Theme.FoodDash">

        <activity
            android:name=".activities.SplashActivity"
            android:exported="true"
            android:theme="@style/Theme.FoodDash.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <activity android:name=".activities.LoginActivity" android:exported="false" />
        <activity android:name=".activities.RegisterActivity" android:exported="false" />
        <activity android:name=".activities.CustomerHomeActivity" android:exported="false" />
        <activity android:name=".activities.FoodDetailsActivity" android:exported="false" />
        <activity android:name=".activities.CartActivity" android:exported="false" />
        <activity android:name=".activities.CheckoutActivity" android:exported="false" />
        <activity android:name=".activities.MyOrdersActivity" android:exported="false" />
        <activity android:name=".activities.OrderDetailsActivity" android:exported="false" />
        <activity android:name=".activities.ProfileActivity" android:exported="false" />
        <activity android:name=".activities.AdminDashboardActivity" android:exported="false" />
        <activity android:name=".activities.ManageFoodActivity" android:exported="false" />
        <activity android:name=".activities.AddEditFoodActivity" android:exported="false" />
        <activity android:name=".activities.AdminOrdersActivity" android:exported="false" />

    </application>
</manifest>
`
  },
  {
    path: 'app/build.gradle.kts',
    name: 'build.gradle.kts (Module: app)',
    category: 'config',
    language: 'kotlin',
    description: 'Gradle configuration targeting Java 17 source compatibility, Material Components, ConstraintLayout, CardView, RecyclerView, Firebase BOM (Auth, Realtime Database, Storage), Glide, and Gson.',
    universityRequirementIds: [2, 5, 7, 8],
    content: `plugins {
    id("com.android.application")
    id("com.google.gms.google-services")
}

android {
    namespace = "com.fooddash.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.fooddash.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.recyclerview:recyclerview:1.3.2")
    implementation("androidx.cardview:cardview:1.0.0")

    // Firebase BoM & SDKs
    implementation(platform("com.google.firebase:firebase-bom:33.5.1"))
    implementation("com.google.firebase:firebase-auth")
    implementation("com.google.firebase:firebase-database")
    implementation("com.google.firebase:firebase-storage")

    // Image loading & JSON serialization for SharedPreferences Cart
    implementation("com.github.bumptech.glide:glide:4.16.0")
    implementation("com.google.code.gson:gson:2.11.0")
}
`
  },
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts (Project Root)',
    category: 'config',
    language: 'kotlin',
    description: 'Root-level Gradle configuration declaring Android Application plugin and Google Services plugin versions.',
    universityRequirementIds: [1, 7, 8],
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.5.2" apply false
    id("com.google.gms.google-services") version "4.4.2" apply false
}
`
  },
  {
    path: 'settings.gradle.kts',
    name: 'settings.gradle.kts',
    category: 'config',
    language: 'kotlin',
    description: 'Gradle settings file configuring Google and MavenCentral repositories and including the :app module.',
    universityRequirementIds: [1],
    content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "FoodDash"
include(":app")
`
  },
  {
    path: 'gradle.properties',
    name: 'gradle.properties',
    category: 'config',
    language: 'kotlin',
    description: 'Gradle JVM arguments and AndroidX configuration required by Android Studio.',
    universityRequirementIds: [1],
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
`
  },
  {
    path: 'app/google-services.json',
    name: 'google-services.json (Starter Template)',
    category: 'config',
    language: 'json',
    description: 'Starter google-services.json for package com.fooddash.app so Gradle APK builds succeed immediately. Replace with your own google-services.json from Firebase Console for live cloud sync.',
    universityRequirementIds: [7, 8],
    content: `{
  "project_info": {
    "project_number": "123456789012",
    "firebase_url": "https://fooddash-default-rtdb.firebaseio.com",
    "project_id": "fooddash-university-lab",
    "storage_bucket": "fooddash-university-lab.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:123456789012:android:abcdef1234567890",
        "android_client_info": {
          "package_name": "com.fooddash.app"
        }
      },
      "oauth_client": [],
      "api_key": [
        {
          "current_key": "AIzaSyDummyKeyForInitialGradleCompilationOnly"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": []
        }
      }
    }
  ],
  "configuration_version": "1"
}
`
  },
  {
    path: '.github/workflows/build-apk.yml',
    name: 'build-apk.yml (Cloud APK Builder)',
    category: 'config',
    language: 'kotlin',
    description: 'GitHub Actions workflow that automatically compiles the Java + XML project into FoodDash-v1.0.apk in the cloud whenever you push to GitHub (no local Android Studio required to get the APK).',
    universityRequirementIds: [1, 7, 8],
    content: `name: Build FoodDash Android APK

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build-apk:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout FoodDash Source
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v3
        with:
          gradle-version: '8.7'

      - name: Build Debug APK
        run: gradle assembleDebug --stacktrace

      - name: Upload Compiled FoodDash APK
        uses: actions/upload-artifact@v4
        with:
          name: FoodDash-v1.0-APK
          path: app/build/outputs/apk/debug/app-debug.apk
`
  },
  {
    path: 'database.rules.json',
    name: 'database.rules.json',
    category: 'config',
    language: 'json',
    description: 'Firebase Realtime Database security rules enforcing strict role-based access control: customers cannot self-assign ADMIN role, only ADMIN can add/edit/delete food or verify payments.',
    universityRequirementIds: [7, 8],
    content: `{
  "rules": {
    "fooddash": {
      "users": {
        "$uid": {
          ".read": "auth != null && (auth.uid === $uid || root.child('fooddash/users').child(auth.uid).child('role').val() === 'ADMIN')",
          ".write": "auth != null && auth.uid === $uid && (!newData.child('role').exists() || newData.child('role').val() === 'CUSTOMER' || data.child('role').val() === 'ADMIN')"
        }
      },
      "food": {
        ".read": true,
        ".write": "auth != null && root.child('fooddash/users').child(auth.uid).child('role').val() === 'ADMIN'"
      },
      "categories": {
        ".read": true,
        ".write": "auth != null && root.child('fooddash/users').child(auth.uid).child('role').val() === 'ADMIN'"
      },
      "orders": {
        ".read": "auth != null",
        ".indexOn": ["customerId", "status", "paymentStatus"],
        "$orderId": {
          ".write": "auth != null && (!data.exists() && newData.child('customerId').val() === auth.uid || root.child('fooddash/users').child(auth.uid).child('role').val() === 'ADMIN')"
        }
      },
      "settings": {
        ".read": true,
        ".write": "auth != null && root.child('fooddash/users').child(auth.uid).child('role').val() === 'ADMIN'"
      }
    }
  }
}
`
  },
  {
    path: 'app/src/main/res/values/colors.xml',
    name: 'colors.xml',
    category: 'values',
    language: 'xml',
    description: 'FoodDash brand color palette (#F97316 Primary Orange, #EA580C Secondary Orange, #FFF9F4 Warm Background, #1F2937 Main Text, #16A34A Success Green, #17251F Admin Dark Green).',
    universityRequirementIds: [2],
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="fooddash_orange_primary">#F97316</color>
    <color name="fooddash_orange_secondary">#EA580C</color>
    <color name="fooddash_background">#FFF9F4</color>
    <color name="fooddash_text_main">#1F2937</color>
    <color name="fooddash_text_muted">#6B7280</color>
    <color name="fooddash_success">#16A34A</color>
    <color name="fooddash_warning">#D97706</color>
    <color name="fooddash_danger">#DC2626</color>
    <color name="fooddash_admin_bg">#17251F</color>
    <color name="fooddash_admin_card">#21352C</color>
    <color name="white">#FFFFFF</color>
</resources>
`
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    name: 'strings.xml',
    category: 'values',
    language: 'xml',
    description: 'String resources for FoodDash brand name, tagline ("Good Food. Easy Ordering. Fast Delivery."), labels, and hints.',
    universityRequirementIds: [2],
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">FoodDash</string>
    <string name="app_tagline">Good Food. Easy Ordering. Fast Delivery.</string>
    <string name="login_title">Welcome Back to FoodDash</string>
    <string name="register_title">Create Customer Account</string>
    <string name="admin_dashboard_title">FoodDash Restaurant Admin</string>
    <string name="shake_hint">Tip: Shake your phone anytime to refresh live menu &amp; orders</string>
</resources>
`
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    name: 'themes.xml',
    category: 'values',
    language: 'xml',
    description: 'MaterialComponents DayNight theme configured with FoodDash orange primary and secondary colors.',
    universityRequirementIds: [2],
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.FoodDash" parent="Theme.MaterialComponents.Light.DarkActionBar">
        <item name="colorPrimary">@color/fooddash_orange_primary</item>
        <item name="colorPrimaryVariant">@color/fooddash_orange_secondary</item>
        <item name="colorOnPrimary">@color/white</item>
        <item name="colorSecondary">@color/fooddash_orange_secondary</item>
        <item name="android:windowBackground">@color/fooddash_background</item>
        <item name="android:statusBarColor">@color/fooddash_orange_secondary</item>
    </style>

    <style name="Theme.FoodDash.NoActionBar" parent="Theme.FoodDash">
        <item name="windowActionBar">false</item>
        <item name="windowNoTitle">true</item>
    </style>
</resources>
`
  },
  {
    path: 'app/src/main/res/drawable/ic_fooddash_logo.xml',
    name: 'ic_fooddash_logo.xml',
    category: 'values',
    language: 'xml',
    description: 'Custom vector drawable launcher and brand icon for FoodDash.',
    universityRequirementIds: [2],
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#F97316"
        android:pathData="M24,0h60c13.25,0 24,10.75 24,24v60c0,13.25 -10.75,24 -24,24H24C10.75,108 0,97.25 0,84V24C0,10.75 10.75,0 24,0z"/>
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M30,48c0,-13.25 10.75,-24 24,-24s24,10.75 24,24H30zM26,54h56v8H26V54zM32,68h44c0,6.63 -5.37,12 -12,12H44C37.37,80 32,74.63 32,68z"/>
</vector>
`
  },
  {
    path: 'app/src/main/res/layout/activity_splash.xml',
    name: 'activity_splash.xml',
    category: 'layout',
    language: 'xml',
    description: 'ConstraintLayout splash screen with FoodDash custom vector logo, brand title, tagline, and indeterminate ProgressBar.',
    universityRequirementIds: [1, 2],
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/fooddash_orange_primary"
    android:padding="24dp">

    <ImageView
        android:id="@+id/ivSplashLogo"
        android:layout_width="96dp"
        android:layout_height="96dp"
        android:contentDescription="@string/app_name"
        android:src="@drawable/ic_fooddash_logo"
        app:layout_constraintBottom_toTopOf="@id/tvSplashBrand"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_chainStyle="packed" />

    <TextView
        android:id="@+id/tvSplashBrand"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:text="@string/app_name"
        android:textColor="@color/white"
        android:textSize="36sp"
        android:textStyle="bold"
        app:layout_constraintBottom_toTopOf="@id/tvSplashTagline"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@id/ivSplashLogo" />

    <TextView
        android:id="@+id/tvSplashTagline"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="8dp"
        android:text="@string/app_tagline"
        android:textColor="@color/white"
        android:textSize="15sp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@id/tvSplashBrand" />

</androidx.constraintlayout.widget.ConstraintLayout>
`
  },
  {
    path: 'app/src/main/res/layout/activity_login.xml',
    name: 'activity_login.xml',
    category: 'layout',
    language: 'xml',
    description: 'Login XML layout using ScrollView, LinearLayout, CardView, TextInputLayout/TextInputEditText, CheckBox for Remember Me, and Material Button.',
    universityRequirementIds: [1, 2, 3, 7, 9],
    content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/fooddash_background"
    android:fillViewport="true">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center_horizontal"
        android:orientation="vertical"
        android:padding="24dp">

        <ImageView
            android:layout_width="72dp"
            android:layout_height="72dp"
            android:layout_marginTop="24dp"
            android:contentDescription="@string/app_name"
            android:src="@drawable/ic_fooddash_logo" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="12dp"
            android:text="@string/login_title"
            android:textColor="@color/fooddash_text_main"
            android:textSize="24sp"
            android:textStyle="bold" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="4dp"
            android:text="@string/app_tagline"
            android:textColor="@color/fooddash_text_muted"
            android:textSize="14sp" />

        <androidx.cardview.widget.CardView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="24dp"
            app:cardCornerRadius="16dp"
            app:cardElevation="3dp">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="20dp">

                <com.google.android.material.textfield.TextInputLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="Email Address">

                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/etLoginEmail"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="textEmailAddress" />
                </com.google.android.material.textfield.TextInputLayout>

                <com.google.android.material.textfield.TextInputLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="12dp"
                    android:hint="Password"
                    app:passwordToggleEnabled="true">

                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/etLoginPassword"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="textPassword" />
                </com.google.android.material.textfield.TextInputLayout>

                <CheckBox
                    android:id="@+id/cbRememberMe"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="8dp"
                    android:checked="true"
                    android:text="Remember Me (Stay Signed In)" />

                <Button
                    android:id="@+id/btnLogin"
                    android:layout_width="match_parent"
                    android:layout_height="52dp"
                    android:layout_marginTop="16dp"
                    android:backgroundTint="@color/fooddash_orange_primary"
                    android:text="Sign In to FoodDash"
                    android:textColor="@color/white"
                    android:textStyle="bold" />

                <ProgressBar
                    android:id="@+id/loginProgressBar"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_gravity="center"
                    android:layout_marginTop="12dp"
                    android:visibility="gone" />
            </LinearLayout>
        </androidx.cardview.widget.CardView>

        <TextView
            android:id="@+id/tvGoToRegister"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="20dp"
            android:padding="8dp"
            android:text="New to FoodDash? Create a Customer Account"
            android:textColor="@color/fooddash_orange_secondary"
            android:textStyle="bold" />

    </LinearLayout>
</ScrollView>
`
  },
  {
    path: 'app/src/main/res/layout/activity_register.xml',
    name: 'activity_register.xml',
    category: 'layout',
    language: 'xml',
    description: 'Customer registration XML layout with TextInputEditText fields for Full Name, Email, Phone, Delivery Address, and Password.',
    universityRequirementIds: [1, 2, 3, 7],
    content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/fooddash_background">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="24dp">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/register_title"
            android:textColor="@color/fooddash_text_main"
            android:textSize="24sp"
            android:textStyle="bold" />

        <androidx.cardview.widget.CardView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            app:cardCornerRadius="16dp"
            app:cardElevation="3dp">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="20dp">

                <com.google.android.material.textfield.TextInputLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="Full Name">
                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/etRegName"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="textPersonName" />
                </com.google.android.material.textfield.TextInputLayout>

                <com.google.android.material.textfield.TextInputLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="10dp"
                    android:hint="Email Address">
                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/etRegEmail"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="textEmailAddress" />
                </com.google.android.material.textfield.TextInputLayout>

                <com.google.android.material.textfield.TextInputLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="10dp"
                    android:hint="Phone Number (01XXXXXXXXX)">
                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/etRegPhone"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="phone" />
                </com.google.android.material.textfield.TextInputLayout>

                <com.google.android.material.textfield.TextInputLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="10dp"
                    android:hint="Default Delivery Address">
                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/etRegAddress"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="textPostalAddress" />
                </com.google.android.material.textfield.TextInputLayout>

                <com.google.android.material.textfield.TextInputLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="10dp"
                    android:hint="Password (min 6 chars)"
                    app:passwordToggleEnabled="true">
                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/etRegPassword"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="textPassword" />
                </com.google.android.material.textfield.TextInputLayout>

                <Button
                    android:id="@+id/btnRegister"
                    android:layout_width="match_parent"
                    android:layout_height="52dp"
                    android:layout_marginTop="18dp"
                    android:backgroundTint="@color/fooddash_orange_primary"
                    android:text="Register &amp; Start Ordering"
                    android:textColor="@color/white"
                    android:textStyle="bold" />

                <ProgressBar
                    android:id="@+id/regProgressBar"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_gravity="center"
                    android:layout_marginTop="10dp"
                    android:visibility="gone" />
            </LinearLayout>
        </androidx.cardview.widget.CardView>

        <TextView
            android:id="@+id/tvGoToLogin"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center_horizontal"
            android:layout_marginTop="16dp"
            android:padding="8dp"
            android:text="Already have an account? Sign In"
            android:textColor="@color/fooddash_orange_secondary"
            android:textStyle="bold" />
    </LinearLayout>
</ScrollView>
`
  },
  {
    path: 'app/src/main/res/layout/activity_customer_home.xml',
    name: 'activity_customer_home.xml',
    category: 'layout',
    language: 'xml',
    description: 'Customer Home XML layout with greeting header, search input, horizontal category buttons, RecyclerView for food listings, and bottom action bar.',
    universityRequirementIds: [1, 2, 5, 11, 12],
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/fooddash_background"
    android:orientation="vertical"
    android:padding="16dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center_vertical"
        android:orientation="horizontal">

        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:orientation="vertical">

            <TextView
                android:id="@+id/tvCustomerGreeting"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Hello, Food Lover!"
                android:textColor="@color/fooddash_text_main"
                android:textSize="20sp"
                android:textStyle="bold" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="@string/shake_hint"
                android:textColor="@color/fooddash_text_muted"
                android:textSize="12sp" />
        </LinearLayout>

        <Button
            android:id="@+id/btnOpenCart"
            android:layout_width="wrap_content"
            android:layout_height="40dp"
            android:backgroundTint="@color/fooddash_orange_primary"
            android:text="Cart"
            android:textColor="@color/white" />
    </LinearLayout>

    <TextView
        android:id="@+id/tvCartBadge"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="4dp"
        android:text="Cart (0)"
        android:textColor="@color/fooddash_orange_secondary"
        android:textStyle="bold" />

    <EditText
        android:id="@+id/etSearchFood"
        android:layout_width="match_parent"
        android:layout_height="48dp"
        android:layout_marginTop="12dp"
        android:background="@android:drawable/edit_text"
        android:hint="Search burgers, biryani, pizza..."
        android:inputType="text"
        android:padding="12dp" />

    <HorizontalScrollView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="10dp"
        android:scrollbars="none">

        <LinearLayout
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:orientation="horizontal">

            <Button android:id="@+id/btnCatAll" android:layout_width="wrap_content" android:layout_height="40dp" android:layout_marginEnd="8dp" android:text="All" />
            <Button android:id="@+id/btnCatBurgers" android:layout_width="wrap_content" android:layout_height="40dp" android:layout_marginEnd="8dp" android:text="Burgers" />
            <Button android:id="@+id/btnCatPizza" android:layout_width="wrap_content" android:layout_height="40dp" android:layout_marginEnd="8dp" android:text="Pizza" />
            <Button android:id="@+id/btnCatBiryani" android:layout_width="wrap_content" android:layout_height="40dp" android:layout_marginEnd="8dp" android:text="Biryani" />
            <Button android:id="@+id/btnCatDrinks" android:layout_width="wrap_content" android:layout_height="40dp" android:text="Drinks" />
        </LinearLayout>
    </HorizontalScrollView>

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/rvCustomerFoods"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_marginTop="10dp"
        android:layout_weight="1" />

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="8dp"
        android:gravity="center"
        android:orientation="horizontal">

        <Button android:id="@+id/btnOpenMyOrders" style="?attr/materialButtonOutlinedStyle" android:layout_width="0dp" android:layout_height="44dp" android:layout_weight="1" android:text="Orders" />
        <Button android:id="@+id/btnOpenProfile" style="?attr/materialButtonOutlinedStyle" android:layout_width="0dp" android:layout_height="44dp" android:layout_marginStart="6dp" android:layout_weight="1" android:text="Profile" />
        <Button android:id="@+id/btnCallSupport" style="?attr/materialButtonOutlinedStyle" android:layout_width="0dp" android:layout_height="44dp" android:layout_marginStart="6dp" android:layout_weight="1" android:text="Call" />
        <Button android:id="@+id/btnOpenWebsite" style="?attr/materialButtonOutlinedStyle" android:layout_width="0dp" android:layout_height="44dp" android:layout_marginStart="6dp" android:layout_weight="1" android:text="Web" />
    </LinearLayout>
</LinearLayout>
`
  },
  {
    path: 'app/src/main/res/layout/activity_food_details.xml',
    name: 'activity_food_details.xml',
    category: 'layout',
    language: 'xml',
    description: 'Food Details XML layout with hero ImageView, category & price TextViews, quantity stepper, Add to Cart CTA, and Share button.',
    universityRequirementIds: [1, 2, 12],
    content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/fooddash_background">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="20dp">

        <ImageView
            android:id="@+id/ivDetailFoodImage"
            android:layout_width="match_parent"
            android:layout_height="220dp"
            android:scaleType="centerCrop"
            android:src="@drawable/ic_fooddash_logo" />

        <TextView
            android:id="@+id/tvDetailFoodCategory"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:text="Category"
            android:textColor="@color/fooddash_orange_secondary"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/tvDetailFoodName"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="4dp"
            android:text="Food Title"
            android:textColor="@color/fooddash_text_main"
            android:textSize="24sp"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/tvDetailFoodPrice"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="6dp"
            android:text="BDT 380"
            android:textColor="@color/fooddash_orange_primary"
            android:textSize="20sp"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/tvDetailFoodDescription"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="12dp"
            android:lineSpacingExtra="4dp"
            android:text="Full description of the dish..."
            android:textColor="@color/fooddash_text_muted"
            android:textSize="15sp" />

        <LinearLayout
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="20dp"
            android:gravity="center_vertical"
            android:orientation="horizontal">

            <Button
                android:id="@+id/btnDetailMinus"
                android:layout_width="48dp"
                android:layout_height="48dp"
                android:text="-" />

            <TextView
                android:id="@+id/tvDetailQuantity"
                android:layout_width="48dp"
                android:layout_height="wrap_content"
                android:gravity="center"
                android:text="1"
                android:textSize="18sp"
                android:textStyle="bold" />

            <Button
                android:id="@+id/btnDetailPlus"
                android:layout_width="48dp"
                android:layout_height="48dp"
                android:text="+" />
        </LinearLayout>

        <Button
            android:id="@+id/btnDetailAddToCart"
            android:layout_width="match_parent"
            android:layout_height="54dp"
            android:layout_marginTop="20dp"
            android:backgroundTint="@color/fooddash_orange_primary"
            android:text="Add to Cart"
            android:textColor="@color/white"
            android:textStyle="bold" />

        <Button
            android:id="@+id/btnShareFood"
            style="?attr/materialButtonOutlinedStyle"
            android:layout_width="match_parent"
            android:layout_height="48dp"
            android:layout_marginTop="10dp"
            android:text="Share This Dish with Friends" />

    </LinearLayout>
</ScrollView>
`
  },
  {
    path: 'app/src/main/res/layout/activity_cart.xml',
    name: 'activity_cart.xml',
    category: 'layout',
    language: 'xml',
    description: 'Shopping cart XML layout with RecyclerView and CardView summary box for Subtotal, Delivery Fee, and Total.',
    universityRequirementIds: [1, 2, 5],
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/fooddash_background"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Your FoodDash Cart"
        android:textColor="@color/fooddash_text_main"
        android:textSize="22sp"
        android:textStyle="bold" />

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/rvCartItems"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_marginTop="12dp"
        android:layout_weight="1" />

    <androidx.cardview.widget.CardView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="12dp"
        app:cardCornerRadius="16dp"
        app:cardElevation="4dp">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="16dp">

            <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="horizontal">
                <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:text="Subtotal" />
                <TextView android:id="@+id/tvCartSubtotal" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="BDT 0" android:textStyle="bold" />
            </LinearLayout>

            <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_marginTop="6dp" android:orientation="horizontal">
                <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:text="Delivery Fee" />
                <TextView android:id="@+id/tvCartDeliveryFee" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="BDT 60" android:textStyle="bold" />
            </LinearLayout>

            <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_marginTop="8dp" android:orientation="horizontal">
                <TextView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:text="Total" android:textSize="18sp" android:textStyle="bold" />
                <TextView android:id="@+id/tvCartTotalAmount" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="BDT 0" android:textColor="@color/fooddash_orange_primary" android:textSize="18sp" android:textStyle="bold" />
            </LinearLayout>

            <Button
                android:id="@+id/btnProceedToCheckout"
                android:layout_width="match_parent"
                android:layout_height="52dp"
                android:layout_marginTop="14dp"
                android:backgroundTint="@color/fooddash_orange_primary"
                android:text="Proceed to Checkout"
                android:textColor="@color/white"
                android:textStyle="bold" />
        </LinearLayout>
    </androidx.cardview.widget.CardView>
</LinearLayout>
`
  },
  {
    path: 'app/src/main/res/layout/activity_checkout.xml',
    name: 'activity_checkout.xml',
    category: 'layout',
    language: 'xml',
    description: 'Checkout XML layout with Delivery Address, Phone, RadioGroup for Cash on Delivery / bKash / Nagad, merchant payment instructions, and Transaction ID input.',
    universityRequirementIds: [1, 2, 3, 8],
    content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/fooddash_background">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="20dp">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Checkout &amp; Payment"
            android:textColor="@color/fooddash_text_main"
            android:textSize="24sp"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/tvCheckoutTotal"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:text="Total Payable: BDT 0"
            android:textColor="@color/fooddash_orange_primary"
            android:textSize="18sp"
            android:textStyle="bold" />

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:hint="Delivery Address">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etCheckoutAddress"
                android:layout_width="match_parent"
                android:layout_height="wrap_content" />
        </com.google.android.material.textfield.TextInputLayout>

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="12dp"
            android:hint="Customer Phone Number">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etCheckoutPhone"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="phone" />
        </com.google.android.material.textfield.TextInputLayout>

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="20dp"
            android:text="Select Payment Method"
            android:textColor="@color/fooddash_text_main"
            android:textSize="16sp"
            android:textStyle="bold" />

        <RadioGroup
            android:id="@+id/rgPaymentMethod"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp">

            <RadioButton
                android:id="@+id/rbCod"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:checked="true"
                android:text="1. Cash on Delivery (Pay when food arrives)" />

            <RadioButton
                android:id="@+id/rbBkash"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="2. bKash (Manual Transaction ID Verification)" />

            <RadioButton
                android:id="@+id/rbNagad"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="3. Nagad (Manual Transaction ID Verification)" />
        </RadioGroup>

        <LinearLayout
            android:id="@+id/layoutMobilePaymentBox"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="12dp"
            android:orientation="vertical"
            android:padding="12dp"
            android:visibility="gone">

            <TextView
                android:id="@+id/tvMerchantPaymentNumber"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Merchant Number: 01711-998877"
                android:textColor="@color/fooddash_orange_secondary"
                android:textStyle="bold" />

            <com.google.android.material.textfield.TextInputLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="8dp"
                android:hint="Enter bKash / Nagad Transaction ID (TrxID)">
                <com.google.android.material.textfield.TextInputEditText
                    android:id="@+id/etCheckoutTransactionId"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content" />
            </com.google.android.material.textfield.TextInputLayout>
        </LinearLayout>

        <Button
            android:id="@+id/btnPlaceOrder"
            android:layout_width="match_parent"
            android:layout_height="54dp"
            android:layout_marginTop="24dp"
            android:backgroundTint="@color/fooddash_success"
            android:text="Confirm &amp; Place Order"
            android:textColor="@color/white"
            android:textStyle="bold" />

    </LinearLayout>
</ScrollView>
`
  },
  {
    path: 'app/src/main/res/layout/activity_my_orders.xml',
    name: 'activity_my_orders.xml',
    category: 'layout',
    language: 'xml',
    description: 'Customer Order History XML layout with RecyclerView and real-time status hint.',
    universityRequirementIds: [1, 2, 5, 8],
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/fooddash_background"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="My Orders (Live Tracking)"
        android:textColor="@color/fooddash_text_main"
        android:textSize="22sp"
        android:textStyle="bold" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="4dp"
        android:text="Tap any order for full receipt · Shake phone to refresh"
        android:textColor="@color/fooddash_text_muted"
        android:textSize="13sp" />

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/rvMyOrders"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_marginTop="12dp" />
</LinearLayout>
`
  },
  {
    path: 'app/src/main/res/layout/activity_order_details.xml',
    name: 'activity_order_details.xml',
    category: 'layout',
    language: 'xml',
    description: 'Order Details XML layout with live status CardView, itemized receipt, Call Support button, and Share Receipt button.',
    universityRequirementIds: [1, 2, 8, 12],
    content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/fooddash_background">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="20dp">

        <TextView
            android:id="@+id/tvDetailOrderId"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Order #ORD-1001"
            android:textColor="@color/fooddash_text_main"
            android:textSize="22sp"
            android:textStyle="bold" />

        <androidx.cardview.widget.CardView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="14dp"
            app:cardCornerRadius="14dp"
            app:cardElevation="3dp">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="16dp">

                <TextView
                    android:id="@+id/tvDetailOrderStatus"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Delivery Status: PENDING"
                    android:textColor="@color/fooddash_orange_primary"
                    android:textSize="17sp"
                    android:textStyle="bold" />

                <TextView
                    android:id="@+id/tvDetailPaymentStatus"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="6dp"
                    android:text="Payment: PENDING_VERIFICATION" />

                <TextView
                    android:id="@+id/tvDetailDeliveryAddress"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="8dp"
                    android:text="Deliver to: Dhaka" />

                <TextView
                    android:id="@+id/tvDetailOrderedItems"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="12dp"
                    android:text="Items..."
                    android:textStyle="bold" />

                <TextView
                    android:id="@+id/tvDetailOrderTotals"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="12dp"
                    android:text="Total: BDT 0" />
            </LinearLayout>
        </androidx.cardview.widget.CardView>

        <Button
            android:id="@+id/btnCallHotline"
            android:layout_width="match_parent"
            android:layout_height="48dp"
            android:layout_marginTop="18dp"
            android:backgroundTint="@color/fooddash_orange_primary"
            android:text="Call Restaurant Hotline (Implicit Intent)"
            android:textColor="@color/white" />

        <Button
            android:id="@+id/btnShareOrderReceipt"
            style="?attr/materialButtonOutlinedStyle"
            android:layout_width="match_parent"
            android:layout_height="48dp"
            android:layout_marginTop="8dp"
            android:text="Share Receipt (Implicit Intent)" />
    </LinearLayout>
</ScrollView>
`
  },
  {
    path: 'app/src/main/res/layout/activity_profile.xml',
    name: 'activity_profile.xml',
    category: 'layout',
    language: 'xml',
    description: 'Customer Profile XML layout with circular/square profile ImageView, Camera/Gallery photo button, TextInputEditText fields, Shake-to-Refresh Switch, and Logout button.',
    universityRequirementIds: [1, 2, 3, 7, 9, 10],
    content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/fooddash_background">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center_horizontal"
        android:orientation="vertical"
        android:padding="20dp">

        <ImageView
            android:id="@+id/ivProfilePhoto"
            android:layout_width="104dp"
            android:layout_height="104dp"
            android:scaleType="centerCrop"
            android:src="@drawable/ic_fooddash_logo" />

        <Button
            android:id="@+id/btnChangeProfilePhoto"
            style="?attr/materialButtonOutlinedStyle"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:text="Take / Pick Profile Photo" />

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:hint="Full Name">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etProfileName"
                android:layout_width="match_parent"
                android:layout_height="wrap_content" />
        </com.google.android.material.textfield.TextInputLayout>

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="10dp"
            android:hint="Phone Number">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etProfilePhone"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="phone" />
        </com.google.android.material.textfield.TextInputLayout>

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="10dp"
            android:hint="Default Delivery Address">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etProfileAddress"
                android:layout_width="match_parent"
                android:layout_height="wrap_content" />
        </com.google.android.material.textfield.TextInputLayout>

        <Switch
            android:id="@+id/switchShakeToRefresh"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:checked="true"
            android:text="Enable Shake-to-Refresh Sensor (SharedPreferences)" />

        <Button
            android:id="@+id/btnSaveProfile"
            android:layout_width="match_parent"
            android:layout_height="50dp"
            android:layout_marginTop="16dp"
            android:backgroundTint="@color/fooddash_orange_primary"
            android:text="Save Profile Changes"
            android:textColor="@color/white" />

        <Button
            android:id="@+id/btnLogout"
            android:layout_width="match_parent"
            android:layout_height="50dp"
            android:layout_marginTop="10dp"
            android:backgroundTint="@color/fooddash_danger"
            android:text="Sign Out"
            android:textColor="@color/white" />
    </LinearLayout>
</ScrollView>
`
  },
  {
    path: 'app/src/main/res/layout/activity_admin_dashboard.xml',
    name: 'activity_admin_dashboard.xml',
    category: 'layout',
    language: 'xml',
    description: 'Dark-green (#17251F) Restaurant Admin Dashboard XML layout with CardViews for Total Orders, Pending Orders, Completed Orders, Total Food Products, and Sales Summary.',
    universityRequirementIds: [1, 2, 8],
    content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/fooddash_admin_bg">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="20dp">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/admin_dashboard_title"
            android:textColor="@color/white"
            android:textSize="24sp"
            android:textStyle="bold" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="4dp"
            android:text="Real-Time Kitchen, Inventory &amp; Payment Verification Console"
            android:textColor="#A7F3D0"
            android:textSize="13sp" />

        <androidx.cardview.widget.CardView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            app:cardBackgroundColor="@color/fooddash_admin_card"
            app:cardCornerRadius="16dp">
            <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="vertical" android:padding="16dp">
                <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="Total Revenue (Sales Summary)" android:textColor="#A7F3D0" />
                <TextView android:id="@+id/tvMetricSalesSummary" android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="4dp" android:text="BDT 0" android:textColor="@color/fooddash_orange_primary" android:textSize="28sp" android:textStyle="bold" />
            </LinearLayout>
        </androidx.cardview.widget.CardView>

        <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_marginTop="12dp" android:orientation="horizontal">
            <androidx.cardview.widget.CardView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_marginEnd="6dp" android:layout_weight="1" app:cardBackgroundColor="@color/fooddash_admin_card" app:cardCornerRadius="14dp">
                <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="vertical" android:padding="14dp">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="Total Orders" android:textColor="#D1FAE5" />
                    <TextView android:id="@+id/tvMetricTotalOrders" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="0" android:textColor="@color/white" android:textSize="22sp" android:textStyle="bold" />
                </LinearLayout>
            </androidx.cardview.widget.CardView>

            <androidx.cardview.widget.CardView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_marginStart="6dp" android:layout_weight="1" app:cardBackgroundColor="@color/fooddash_admin_card" app:cardCornerRadius="14dp">
                <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="vertical" android:padding="14dp">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="Pending Orders" android:textColor="#FDE68A" />
                    <TextView android:id="@+id/tvMetricPendingOrders" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="0" android:textColor="@color/white" android:textSize="22sp" android:textStyle="bold" />
                </LinearLayout>
            </androidx.cardview.widget.CardView>
        </LinearLayout>

        <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_marginTop="12dp" android:orientation="horizontal">
            <androidx.cardview.widget.CardView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_marginEnd="6dp" android:layout_weight="1" app:cardBackgroundColor="@color/fooddash_admin_card" app:cardCornerRadius="14dp">
                <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="vertical" android:padding="14dp">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="Completed Orders" android:textColor="#86EFAC" />
                    <TextView android:id="@+id/tvMetricCompletedOrders" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="0" android:textColor="@color/white" android:textSize="22sp" android:textStyle="bold" />
                </LinearLayout>
            </androidx.cardview.widget.CardView>

            <androidx.cardview.widget.CardView android:layout_width="0dp" android:layout_height="wrap_content" android:layout_marginStart="6dp" android:layout_weight="1" app:cardBackgroundColor="@color/fooddash_admin_card" app:cardCornerRadius="14dp">
                <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="vertical" android:padding="14dp">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="Total Food Products" android:textColor="#D1FAE5" />
                    <TextView android:id="@+id/tvMetricTotalFoods" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="0" android:textColor="@color/white" android:textSize="22sp" android:textStyle="bold" />
                </LinearLayout>
            </androidx.cardview.widget.CardView>
        </LinearLayout>

        <Button
            android:id="@+id/btnAdminManageFood"
            android:layout_width="match_parent"
            android:layout_height="54dp"
            android:layout_marginTop="24dp"
            android:backgroundTint="@color/fooddash_orange_primary"
            android:text="Manage Food Products (CRUD)"
            android:textColor="@color/white"
            android:textStyle="bold" />

        <Button
            android:id="@+id/btnAdminManageOrders"
            android:layout_width="match_parent"
            android:layout_height="54dp"
            android:layout_marginTop="12dp"
            android:backgroundTint="@color/fooddash_success"
            android:text="Incoming Orders &amp; Verify Payments"
            android:textColor="@color/white"
            android:textStyle="bold" />

        <Button
            android:id="@+id/btnAdminLogout"
            android:layout_width="match_parent"
            android:layout_height="48dp"
            android:layout_marginTop="16dp"
            android:backgroundTint="@color/fooddash_danger"
            android:text="Logout Admin"
            android:textColor="@color/white" />
    </LinearLayout>
</ScrollView>
`
  },
  {
    path: 'app/src/main/res/layout/activity_manage_food.xml',
    name: 'activity_manage_food.xml',
    category: 'layout',
    language: 'xml',
    description: 'Admin Food Management XML layout with search bar, RecyclerView, and FloatingActionButton (Requirement #6).',
    universityRequirementIds: [1, 2, 5, 6],
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/fooddash_background"
    android:padding="16dp">

    <EditText
        android:id="@+id/etAdminSearchFood"
        android:layout_width="0dp"
        android:layout_height="48dp"
        android:hint="Search inventory by name or category..."
        android:inputType="text"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/rvAdminFoodList"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:layout_marginTop="12dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@id/etAdminSearchFood" />

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fabAddFood"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_margin="16dp"
        android:contentDescription="Add Food Item"
        android:src="@android:drawable/ic_input_add"
        app:backgroundTint="@color/fooddash_orange_primary"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:tint="@color/white" />

</androidx.constraintlayout.widget.ConstraintLayout>
`
  },
  {
    path: 'app/src/main/res/layout/activity_add_edit_food.xml',
    name: 'activity_add_edit_food.xml',
    category: 'layout',
    language: 'xml',
    description: 'Add/Edit Food XML layout with image preview, gallery picker button, TextInputEditText fields for Name, Description, Price, Category Spinner, and Availability CheckBox.',
    universityRequirementIds: [1, 2, 3, 6, 10],
    content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/fooddash_background">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="20dp">

        <TextView
            android:id="@+id/tvAddEditFoodTitle"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Add New Food Product"
            android:textColor="@color/fooddash_text_main"
            android:textSize="22sp"
            android:textStyle="bold" />

        <ImageView
            android:id="@+id/ivAddEditFoodPreview"
            android:layout_width="match_parent"
            android:layout_height="180dp"
            android:layout_marginTop="12dp"
            android:scaleType="centerCrop"
            android:src="@drawable/ic_fooddash_logo" />

        <Button
            android:id="@+id/btnPickFoodImage"
            style="?attr/materialButtonOutlinedStyle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:text="Select Food Image from Gallery" />

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="12dp"
            android:hint="Food Name">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etFoodName"
                android:layout_width="match_parent"
                android:layout_height="wrap_content" />
        </com.google.android.material.textfield.TextInputLayout>

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="10dp"
            android:hint="Food Description">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etFoodDescription"
                android:layout_width="match_parent"
                android:layout_height="wrap_content" />
        </com.google.android.material.textfield.TextInputLayout>

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="10dp"
            android:hint="Price in BDT">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etFoodPrice"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:inputType="numberDecimal" />
        </com.google.android.material.textfield.TextInputLayout>

        <Spinner
            android:id="@+id/spinnerFoodCategory"
            android:layout_width="match_parent"
            android:layout_height="48dp"
            android:layout_marginTop="12dp" />

        <CheckBox
            android:id="@+id/cbFoodAvailable"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:checked="true"
            android:text="Available for Customer Ordering" />

        <Button
            android:id="@+id/btnSaveFoodItem"
            android:layout_width="match_parent"
            android:layout_height="52dp"
            android:layout_marginTop="18dp"
            android:backgroundTint="@color/fooddash_orange_primary"
            android:text="Save Food Product"
            android:textColor="@color/white"
            android:textStyle="bold" />

    </LinearLayout>
</ScrollView>
`
  },
  {
    path: 'app/src/main/res/layout/activity_admin_orders.xml',
    name: 'activity_admin_orders.xml',
    category: 'layout',
    language: 'xml',
    description: 'Admin Orders Management XML layout with RecyclerView for incoming orders, status progression, and payment verification.',
    universityRequirementIds: [1, 2, 5, 8],
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/fooddash_background"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Incoming Customer Orders"
        android:textColor="@color/fooddash_text_main"
        android:textSize="22sp"
        android:textStyle="bold" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="4dp"
        android:text="Verify bKash/Nagad Transaction IDs and update kitchen delivery status"
        android:textColor="@color/fooddash_text_muted"
        android:textSize="13sp" />

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/rvAdminOrders"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_marginTop="12dp" />
</LinearLayout>
`
  },
  {
    path: 'app/src/main/res/layout/item_food.xml',
    name: 'item_food.xml',
    category: 'layout',
    language: 'xml',
    description: 'RecyclerView item CardView layout for food items used by FoodAdapter in both CustomerHomeActivity and ManageFoodActivity.',
    universityRequirementIds: [2, 5],
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.cardview.widget.CardView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/cardFoodItem"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginBottom="12dp"
    app:cardCornerRadius="14dp"
    app:cardElevation="3dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:padding="12dp">

        <ImageView
            android:id="@+id/ivFoodImage"
            android:layout_width="88dp"
            android:layout_height="88dp"
            android:scaleType="centerCrop"
            android:src="@drawable/ic_fooddash_logo" />

        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginStart="12dp"
            android:layout_weight="1"
            android:orientation="vertical">

            <TextView
                android:id="@+id/tvFoodCategory"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Burgers"
                android:textColor="@color/fooddash_orange_secondary"
                android:textSize="12sp"
                android:textStyle="bold" />

            <TextView
                android:id="@+id/tvFoodName"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Smoky Beef Burger"
                android:textColor="@color/fooddash_text_main"
                android:textSize="16sp"
                android:textStyle="bold" />

            <TextView
                android:id="@+id/tvFoodDescription"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:maxLines="2"
                android:text="Double smashed beef patty..."
                android:textColor="@color/fooddash_text_muted"
                android:textSize="12sp" />

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="8dp"
                android:gravity="center_vertical"
                android:orientation="horizontal">

                <TextView
                    android:id="@+id/tvFoodPrice"
                    android:layout_width="0dp"
                    android:layout_height="wrap_content"
                    android:layout_weight="1"
                    android:text="BDT 380"
                    android:textColor="@color/fooddash_orange_primary"
                    android:textSize="15sp"
                    android:textStyle="bold" />

                <TextView
                    android:id="@+id/tvFoodAvailability"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginEnd="8dp"
                    android:text="Available"
                    android:textColor="@color/fooddash_success"
                    android:textSize="12sp" />

                <Button
                    android:id="@+id/btnFoodPrimaryAction"
                    android:layout_width="wrap_content"
                    android:layout_height="38dp"
                    android:backgroundTint="@color/fooddash_orange_primary"
                    android:text="Add"
                    android:textColor="@color/white"
                    android:textSize="12sp" />

                <Button
                    android:id="@+id/btnFoodDeleteAction"
                    android:layout_width="wrap_content"
                    android:layout_height="38dp"
                    android:layout_marginStart="6dp"
                    android:backgroundTint="@color/fooddash_danger"
                    android:text="Delete"
                    android:textColor="@color/white"
                    android:textSize="12sp"
                    android:visibility="gone" />
            </LinearLayout>
        </LinearLayout>
    </LinearLayout>
</androidx.cardview.widget.CardView>
`
  },
  {
    path: 'app/src/main/res/layout/item_cart.xml',
    name: 'item_cart.xml',
    category: 'layout',
    language: 'xml',
    description: 'RecyclerView item CardView layout for shopping cart line items with quantity minus/plus and remove buttons.',
    universityRequirementIds: [2, 5],
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.cardview.widget.CardView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginBottom="10dp"
    app:cardCornerRadius="12dp"
    app:cardElevation="2dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center_vertical"
        android:orientation="horizontal"
        android:padding="12dp">

        <ImageView
            android:id="@+id/ivCartFood"
            android:layout_width="64dp"
            android:layout_height="64dp"
            android:scaleType="centerCrop"
            android:src="@drawable/ic_fooddash_logo" />

        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginStart="12dp"
            android:layout_weight="1"
            android:orientation="vertical">

            <TextView
                android:id="@+id/tvCartFoodName"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Item Name"
                android:textColor="@color/fooddash_text_main"
                android:textSize="15sp"
                android:textStyle="bold" />

            <TextView
                android:id="@+id/tvCartUnitPrice"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="BDT 380 each"
                android:textColor="@color/fooddash_text_muted"
                android:textSize="12sp" />

            <TextView
                android:id="@+id/tvCartLineTotal"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="BDT 760"
                android:textColor="@color/fooddash_orange_primary"
                android:textStyle="bold" />
        </LinearLayout>

        <Button android:id="@+id/btnCartMinus" android:layout_width="38dp" android:layout_height="38dp" android:text="-" />
        <TextView android:id="@+id/tvCartQty" android:layout_width="32dp" android:layout_height="wrap_content" android:gravity="center" android:text="1" android:textStyle="bold" />
        <Button android:id="@+id/btnCartPlus" android:layout_width="38dp" android:layout_height="38dp" android:text="+" />
        <Button android:id="@+id/btnCartRemove" android:layout_width="wrap_content" android:layout_height="38dp" android:layout_marginStart="4dp" android:backgroundTint="@color/fooddash_danger" android:text="X" android:textColor="@color/white" />
    </LinearLayout>
</androidx.cardview.widget.CardView>
`
  },
  {
    path: 'app/src/main/res/layout/item_order.xml',
    name: 'item_order.xml',
    category: 'layout',
    language: 'xml',
    description: 'RecyclerView item CardView layout for orders used in MyOrdersActivity and AdminOrdersActivity.',
    universityRequirementIds: [2, 5, 8],
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.cardview.widget.CardView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/cardOrder"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginBottom="12dp"
    app:cardCornerRadius="14dp"
    app:cardElevation="3dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="14dp">

        <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="horizontal">
            <TextView android:id="@+id/tvOrderId" android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1" android:text="Order #1001" android:textColor="@color/fooddash_text_main" android:textSize="16sp" android:textStyle="bold" />
            <TextView android:id="@+id/tvOrderTotal" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="BDT 820" android:textColor="@color/fooddash_orange_primary" android:textSize="16sp" android:textStyle="bold" />
        </LinearLayout>

        <TextView android:id="@+id/tvOrderCustomerName" android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="4dp" android:text="Customer Name · Phone" android:textColor="@color/fooddash_text_main" />
        <TextView android:id="@+id/tvOrderDate" android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="Date" android:textColor="@color/fooddash_text_muted" android:textSize="12sp" />
        <TextView android:id="@+id/tvOrderStatus" android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="6dp" android:text="Status: PENDING" android:textColor="@color/fooddash_success" android:textStyle="bold" />
        <TextView android:id="@+id/tvOrderPaymentInfo" android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="2dp" android:text="bKash (PENDING_VERIFICATION) · TrxID: BKA98234X1" android:textSize="13sp" />

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="10dp"
            android:orientation="horizontal">

            <Button
                android:id="@+id/btnVerifyPayment"
                android:layout_width="0dp"
                android:layout_height="40dp"
                android:layout_marginEnd="6dp"
                android:layout_weight="1"
                android:backgroundTint="@color/fooddash_warning"
                android:text="Verify Payment"
                android:textColor="@color/white"
                android:textSize="12sp"
                android:visibility="gone" />

            <Button
                android:id="@+id/btnUpdateOrderStatus"
                android:layout_width="0dp"
                android:layout_height="40dp"
                android:layout_weight="1"
                android:backgroundTint="@color/fooddash_orange_primary"
                android:text="Update Status"
                android:textColor="@color/white"
                android:textSize="12sp"
                android:visibility="gone" />
        </LinearLayout>
    </LinearLayout>
</androidx.cardview.widget.CardView>
`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'docs',
    language: 'markdown',
    description: 'Complete GitHub repository README.md following Section 3 of the Final Lab Project instructions.',
    universityRequirementIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    content: `# FoodDash — Good Food. Easy Ordering. Fast Delivery.

**Course:** Mobile Application and Development Lab (0613-410)  
**Project Title:** FoodDash — Full-Stack Android Food Delivery Application (Customer + Restaurant Admin)  
**Student Name:** [Enter Your Name Here]  
**Student ID:** [Enter Your Student ID Here]  
**Package Name:** \`com.fooddash.app\`  
**Language & UI:** 100% Native Java + XML Layouts (Android Studio)  
**Backend:** Firebase Authentication, Firebase Realtime Database, Firebase Storage  

---

## 1. Overview & Problem Solved
Local restaurants and campus food vendors often struggle with fragmented phone orders, unverified mobile money transfers (bKash/Nagad), and lack of real-time order status tracking for customers. **FoodDash** solves this with a dual-role Android application:
- **Customer Role:** Browse food by category, search items, add to cart, pay via Cash on Delivery or bKash/Nagad (with Transaction ID submission), and track order status in real time.
- **Restaurant Admin Role:** View live kitchen metrics (Total Orders, Pending, Completed, Total Products, Sales Summary), perform full CRUD on food items with image uploads, verify bKash/Nagad Transaction IDs (\`PENDING_VERIFICATION\` -> \`VERIFIED\`), and update order statuses.

---

## 2. All 12 Mandatory University Features Implemented

| # | Required Feature | Android Studio Implementation in FoodDash |
|---|---|---|
| **1** | **At least 5 screens with navigation** | **14 Activities** (\`SplashActivity\`, \`LoginActivity\`, \`RegisterActivity\`, \`CustomerHomeActivity\`, \`FoodDetailsActivity\`, \`CartActivity\`, \`CheckoutActivity\`, \`MyOrdersActivity\`, \`OrderDetailsActivity\`, \`ProfileActivity\`, \`AdminDashboardActivity\`, \`ManageFoodActivity\`, \`AddEditFoodActivity\`, \`AdminOrdersActivity\`) using explicit \`Intent\` and \`putExtra()\`. |
| **2** | **Layouts and basic views** | \`ConstraintLayout\`, \`LinearLayout\`, \`ScrollView\`, \`TextView\`, \`ImageView\`, \`Button\`, \`CardView\` across 17 XML layout files. |
| **3** | **User input with validation** | \`TextInputEditText\` + \`setError()\` in \`ValidationHelper.java\` validating email, password, phone number, address, food price, and bKash/Nagad Transaction ID. |
| **4** | **Model class for your data** | 4 Java POJO classes (\`User.java\`, \`Food.java\`, \`Order.java\`, \`CartItem.java\`) with empty constructors and getters/setters. |
| **5** | **Scrolling list of records** | \`RecyclerView\` + \`Adapter\` + \`ViewHolder\` in \`FoodAdapter.java\`, \`CartAdapter.java\`, and \`OrderAdapter.java\`. |
| **6** | **Add, view, edit, delete (CRUD) with dialog & FAB** | \`FloatingActionButton\` in \`ManageFoodActivity\` to add food, \`AddEditFoodActivity\` to edit, and \`AlertDialog\` confirmation before deleting food or removing cart items. |
| **7** | **Firebase login: register, login, logout, stay logged in** | \`FirebaseAuth\` in \`FirebaseHelper.java\`, \`SplashActivity\`, \`LoginActivity\`, \`RegisterActivity\`, and \`ProfileActivity\`. |
| **8** | **Data saved in Firebase database, updates in real time** | \`FirebaseDatabase\` (\`fooddash/users\`, \`food\`, \`categories\`, \`orders\`, \`settings\`) with \`ValueEventListener\` for real-time menu and order tracking. |
| **9** | **Save a setting on the phone** | \`SharedPreferences\` in \`SessionManager.java\` saving "Remember Me", Shake-to-Refresh sensor toggle, and local shopping cart state. |
| **10** | **Take or pick a photo and show it** | Camera (\`MediaStore.ACTION_IMAGE_CAPTURE\`) & Gallery (\`Intent.ACTION_PICK\`) in \`ProfileActivity\` and \`AddEditFoodActivity\`. |
| **11** | **Use one sensor (Accelerometer)** | \`SensorManager\` + \`SensorEventListener\` in \`ShakeDetector.java\` providing **Shake-to-Refresh** on \`CustomerHomeActivity\` and \`MyOrdersActivity\`. |
| **12** | **Open another app (call, share, web link)** | Implicit \`Intent\`s: \`ACTION_DIAL\` (call hotline), \`ACTION_SEND\` (share dish & order receipt), and \`ACTION_VIEW\` (open restaurant website). |

---

## 3. How to Connect Your Firebase Project & Build the APK

1. **Open in Android Studio:**
   - Extract the downloaded FoodDash project folder and open it in **Android Studio Ladybug / Koala or newer**.
2. **Connect Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a project named \`FoodDash\`.
   - Register an Android app with package name **\`com.fooddash.app\`**.
   - Download \`google-services.json\` and place it inside the \`app/\` directory (\`FoodDash/app/google-services.json\`).
   - In Firebase Console, enable **Authentication -> Email/Password**.
   - Enable **Realtime Database** and paste the rules from \`database.rules.json\` into the **Rules** tab.
   - Enable **Firebase Storage** for profile and food images.
3. **Create an Admin Account:**
   - Register a user normally in the app, then in Firebase Realtime Database under \`fooddash/users/{uid}/role\`, change \`"CUSTOMER"\` to \`"ADMIN"\` (customers can never self-assign admin role from the client).
4. **Build Signed / Debug APK for GitHub Release v1.0:**
   - In Android Studio, select **Build -> Build Bundle(s) / APK(s) -> Build APK(s)**.
   - Locate the generated APK at \`app/build/outputs/apk/debug/app-debug.apk\`, rename it to \`FoodDash-v1.0.apk\`, and attach it to your **GitHub Release \`v1.0\`**.
`
  }
];
