/**
 * Pure TypeScript PDF 1.4 Multi-Page Document Generator for FoodDash
 * Generates a standards-compliant, multi-page PDF document explaining:
 * - Project Architecture (Java + XML Android Studio structure)
 * - Firebase Setup & Role Security Rules
 * - Method 1: Step-by-Step Manual APK Build in Android Studio
 * - Method 2: Step-by-Step Cloud APK Build via GitHub Actions (.github/workflows/build-apk.yml)
 * - GitHub Release v1.0 & Mobile Installation Guide
 * - Lab Report Summary: All 12 Mandatory Features & Components vs. Alternatives Matrix
 */

export interface PdfGuideSection {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  steps?: {
    stepTitle: string;
    detail: string;
    codeSnippet?: string;
  }[];
}

export const APK_AND_LAB_REPORT_GUIDE_SECTIONS: PdfGuideSection[] = [
  {
    id: 'architecture',
    number: 'SECTION 1',
    title: 'FoodDash Android Studio Project Structure (Java + XML)',
    subtitle: 'Package: com.fooddash.app | Target SDK: 34 | Minimum SDK: 24 | Language: Java 17',
    paragraphs: [
      'FoodDash is architected strictly as a native Android Studio project using Java for all business logic and XML for all user interface layouts. No Kotlin application source code, Jetpack Compose, or hybrid web frameworks are used in the Android source tree.',
      'Before compiling the APK using either Method 1 (Android Studio) or Method 2 (GitHub Actions), ensure your extracted FoodDash/ directory contains the following canonical structure:'
    ],
    steps: [
      {
        stepTitle: '1.1 Root Gradle & Project Configuration Files',
        detail: 'Located at the root of the extracted FoodDash/ folder. These files configure Gradle 8.7, the Android Gradle Plugin (AGP 8.5.2), Google Services plugin (4.4.2), and AndroidX properties.',
        codeSnippet: `FoodDash/
├── build.gradle.kts               # Root project plugins (AGP 8.5.2, google-services 4.4.2)
├── settings.gradle.kts            # Configures Google & MavenCentral repos, includes :app
├── gradle.properties              # Enables AndroidX & sets JVM heap (-Xmx2048m)
├── database.rules.json            # Firebase Realtime Database security rules
├── README.md                      # University submission documentation
└── .github/workflows/build-apk.yml # Automated GitHub Actions Cloud APK Builder`
      },
      {
        stepTitle: '1.2 Application Module (app/) & Java Packages',
        detail: 'All 25 Java files are organized into 4 modular sub-packages under app/src/main/java/com/fooddash/app/ alongside 17 XML layout files under app/src/main/res/layout/.',
        codeSnippet: `FoodDash/app/
├── build.gradle.kts               # Module config (com.fooddash.app, Firebase BoM 33.5.1, Glide, Gson)
├── google-services.json           # Firebase configuration file (starter template included)
└── src/main/
    ├── AndroidManifest.xml        # Declares 14 Activities, permissions, & launcher intent
    ├── java/com/fooddash/app/
    │   ├── activities/            # All 14 Screen Activities (Splash, Login, CustomerHome, Admin...)
    │   ├── models/                # User.java, Food.java, Order.java, CartItem.java
    │   ├── adapters/              # FoodAdapter.java, CartAdapter.java, OrderAdapter.java
    │   └── helpers/               # FirebaseHelper.java, SessionManager.java, ValidationHelper.java, ShakeDetector.java
    └── res/
        ├── layout/                # 14 Activity XML files + 3 RecyclerView item XML files
        ├── drawable/              # ic_fooddash_logo.xml custom vector icon
        └── values/                # colors.xml, strings.xml, themes.xml`
      }
    ]
  },
  {
    id: 'firebase-setup',
    number: 'SECTION 2',
    title: 'Firebase Configuration & Security Rules Setup',
    subtitle: 'Connecting Firebase Authentication, Realtime Database, and Storage to com.fooddash.app',
    paragraphs: [
      'The exported FoodDash project includes a valid starter app/google-services.json file so that Gradle can compile a debug APK immediately without throwing a missing-file error. To connect the compiled APK to your live Firebase cloud backend for your lab demonstration, follow these steps:'
    ],
    steps: [
      {
        stepTitle: 'Step 1: Create Project & Register Android Package',
        detail: 'Open https://console.firebase.google.com/, click "Add project", and name it FoodDash. Click the Android icon to register a new app using the exact package name com.fooddash.app.'
      },
      {
        stepTitle: 'Step 2: Replace app/google-services.json',
        detail: 'Download the generated google-services.json file from Firebase Console and overwrite FoodDash/app/google-services.json.'
      },
      {
        stepTitle: 'Step 3: Enable Email/Password Authentication',
        detail: 'In Firebase Console, navigate to Build -> Authentication -> Sign-in method, select Email/Password, toggle Enable, and click Save.'
      },
      {
        stepTitle: 'Step 4: Provision Realtime Database & Publish Security Rules',
        detail: 'Navigate to Build -> Realtime Database -> Create Database. Open the Rules tab and paste the contents of database.rules.json. This rule ensures customers cannot self-assign the ADMIN role.',
        codeSnippet: `"users": {
  "$uid": {
    ".read": "auth != null && (auth.uid === $uid || root.child('fooddash/users').child(auth.uid).child('role').val() === 'ADMIN')",
    ".write": "auth != null && auth.uid === $uid && (!newData.child('role').exists() || newData.child('role').val() === 'CUSTOMER' || data.child('role').val() === 'ADMIN')"
  }
}`
      },
      {
        stepTitle: 'Step 5: Provision Restaurant Admin Account',
        detail: 'Register a normal user account in the app, then open Firebase Realtime Database console at fooddash/users/{uid}/role and change the value from "CUSTOMER" to "ADMIN". When that user logs in on LoginActivity, FoodDash automatically routes them to AdminDashboardActivity.'
      }
    ]
  },
  {
    id: 'method-1-manual-android-studio',
    number: 'SECTION 3',
    title: 'Method 1: Manual APK Compilation in Android Studio',
    subtitle: 'Standard Lab Procedure for Compiling, Debugging, and Installing app-debug.apk on a Local PC',
    paragraphs: [
      'Use Method 1 when working on your personal laptop or university lab PC with Android Studio installed. This workflow compiles the Java 17 source code and XML resources into an installable Android Package (.apk).'
    ],
    steps: [
      {
        stepTitle: 'Step 1: Export & Extract the FoodDash Project Archive',
        detail: 'Click "Export Android Project" in the FoodDash web workspace to download FoodDash-AndroidStudio-Java-XML.tar. Extract the archive using WinRAR, 7-Zip, macOS Archive Utility, or terminal:',
        codeSnippet: `tar -xvf FoodDash-AndroidStudio-Java-XML.tar`
      },
      {
        stepTitle: 'Step 2: Open Project in Android Studio & Configure JDK 17',
        detail: 'Launch Android Studio (Koala / Ladybug or newer), select File -> Open, and choose the extracted FoodDash/ directory. Verify that File -> Settings -> Build, Execution, Deployment -> Build Tools -> Gradle -> Gradle JDK is set to JDK 17 (jbr-17).'
      },
      {
        stepTitle: 'Step 3: Run Gradle Sync',
        detail: 'Click "Sync Project with Gradle Files" (the elephant icon in the top toolbar). Gradle will download AndroidX AppCompat, Material Components 1.12.0, ConstraintLayout, RecyclerView, CardView, Firebase BoM 33.5.1, Glide 4.16.0, and Gson 2.11.0.'
      },
      {
        stepTitle: 'Step 4: Trigger Build APK(s) from the Menu or Terminal',
        detail: 'In the Android Studio top menu bar, select Build -> Build Bundle(s) / APK(s) -> Build APK(s). Alternatively, run the Gradle assembleDebug task in the Android Studio Terminal:',
        codeSnippet: `./gradlew assembleDebug    # On macOS / Linux
gradlew.bat assembleDebug  # On Windows`
      },
      {
        stepTitle: 'Step 5: Locate & Install the Generated APK on Your Phone',
        detail: 'Once the build finishes ("BUILD SUCCESSFUL"), click "locate" in the bottom-right notification balloon or navigate to the output path below. Enable "Install unknown apps" on your Android phone and tap the APK to install, or install directly via USB Debugging:',
        codeSnippet: `# Output APK Location:
FoodDash/app/build/outputs/apk/debug/app-debug.apk

# Optional Direct USB Installation via ADB:
adb install -r app/build/outputs/apk/debug/app-debug.apk`
      }
    ]
  },
  {
    id: 'method-2-github-actions-cloud',
    number: 'SECTION 4',
    title: 'Method 2: Automated Cloud APK Build via GitHub Actions',
    subtitle: 'Zero-Local-Setup Compilation Using .github/workflows/build-apk.yml & GitHub Release v1.0',
    paragraphs: [
      'If your personal computer has limited RAM or trouble running Android Studio locally, Method 2 compiles the exact same Java + XML project on GitHub’s cloud servers (ubuntu-latest) automatically whenever you push code to your repository.',
      'This method also directly fulfills Section 3 of the Final Lab Project instructions: maintaining a public GitHub repository with regular commits and attaching the compiled APK to GitHub Release v1.0.'
    ],
    steps: [
      {
        stepTitle: 'Step 1: Initialize Git & Push FoodDash to a Public GitHub Repository',
        detail: 'Create a new public repository named FoodDash-Android on GitHub. Open a terminal inside the extracted FoodDash/ directory and push all 55 project files:',
        codeSnippet: `cd FoodDash
git init
git add .
git commit -m "Feat: Complete FoodDash Java + XML Android Studio project with 14 Activities"
git branch -M main
git remote add origin https://github.com/<your-username>/FoodDash-Android.git
git push -u origin main`
      },
      {
        stepTitle: 'Step 2: Understand the Included .github/workflows/build-apk.yml Pipeline',
        detail: 'The exported project includes .github/workflows/build-apk.yml. As soon as git push completes, GitHub Actions provisions an Ubuntu runner, installs Eclipse Temurin JDK 17, configures Gradle 8.7, executes gradle assembleDebug, and uploads the compiled APK as a downloadable artifact:',
        codeSnippet: `name: Build FoodDash Android APK
on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:
jobs:
  build-apk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - uses: gradle/actions/setup-gradle@v3
        with:
          gradle-version: '8.7'
      - run: gradle assembleDebug --stacktrace
      - uses: actions/upload-artifact@v4
        with:
          name: FoodDash-v1.0-APK
          path: app/build/outputs/apk/debug/app-debug.apk`
      },
      {
        stepTitle: 'Step 3: Download the Compiled APK from GitHub Actions',
        detail: '1. Open your GitHub repository in any browser (on PC or mobile).\n2. Click the "Actions" tab at the top.\n3. Click the latest green workflow run ("Build FoodDash Android APK").\n4. Scroll down to the "Artifacts" section and click "FoodDash-v1.0-APK" to download the ZIP containing app-debug.apk.'
      },
      {
        stepTitle: 'Step 4: Publish GitHub Release v1.0 (Required Lab Deliverable)',
        detail: '1. On your GitHub repository main page, click "Releases" -> "Create a new release" in the right sidebar.\n2. Click "Choose a tag", type v1.0, and select "Create new tag: v1.0 on publish".\n3. Set Release Title to "FoodDash v1.0 — Final Lab Submission".\n4. Drag and drop your compiled FoodDash-v1.0.apk (renamed from app-debug.apk) into the binaries box.\n5. Click "Publish release".'
      }
    ]
  },
  {
    id: 'verification-and-viva',
    number: 'SECTION 5',
    title: 'Post-Installation Testing Checklist & Viva Defense Summary',
    subtitle: 'Verifying All 12 Mandatory University Lab Features on Your Physical Android Device',
    paragraphs: [
      'After installing FoodDash-v1.0.apk on your Android smartphone, walk through this 6-point checklist before your final lab demonstration and viva:'
    ],
    steps: [
      {
        stepTitle: 'Check 1: Input Validation & Firebase Authentication (Reqs #1, #3, #7, #9)',
        detail: 'Tap Sign In on LoginActivity with an empty email to demonstrate TextInputEditText.setError(). Then register a new Customer account on RegisterActivity, verify "Remember Me" persistence in SharedPreferences by closing and reopening the app via SplashActivity.'
      },
      {
        stepTitle: 'Check 2: RecyclerView Menu, Categories & Search (Reqs #2, #4, #5, #8)',
        detail: 'On CustomerHomeActivity, filter dishes by Burgers / Biryani / Pizza, search by keyword, and tap a dish to open FoodDetailsActivity via Explicit Intent with Serializable Food extra.'
      },
      {
        stepTitle: 'Check 3: Cart & Manual bKash / Nagad Payment Reference (Section 5)',
        detail: 'Add items to CartActivity, adjust quantities, proceed to CheckoutActivity, select bKash or Nagad, observe the displayed merchant number, enter a 6-20 character alphanumeric Transaction ID (e.g., BKA948271X), and place the order. Confirm that paymentStatus is saved as PENDING_VERIFICATION.'
      },
      {
        stepTitle: 'Check 4: Hardware Accelerometer Shake-to-Refresh (Req #11)',
        detail: 'Physically shake your Android phone on CustomerHomeActivity or MyOrdersActivity. ShakeDetector.java computes gForce = sqrt(gX^2 + gY^2 + gZ^2) > 2.7g and refreshes the Firebase Realtime Database listener with a Toast confirmation.'
      },
      {
        stepTitle: 'Check 5: Camera / Gallery Intent & Implicit Intents (Reqs #10, #12)',
        detail: 'Open ProfileActivity to capture a photo with the Camera or select from Gallery. Test the Call Support button (ACTION_DIAL), Share Dish/Receipt button (ACTION_SEND), and Website button (ACTION_VIEW).'
      },
      {
        stepTitle: 'Check 6: Admin Dashboard, Food CRUD & Payment Verification (Reqs #6, #8)',
        detail: 'Log into the Restaurant Admin account to view AdminDashboardActivity (Total Orders, Pending, Completed, Total Foods, Sales Summary). Open ManageFoodActivity to add a dish via FloatingActionButton or delete a dish via AlertDialog. Open AdminOrdersActivity to verify the customer’s bKash Transaction ID (PENDING_VERIFICATION -> VERIFIED) and update order status to DELIVERED.'
      }
    ]
  }
];

function escapePdfText(str: string): string {
  return str
    .replace(/[^\x20-\x7E]/g, (ch) => {
      if (ch === '—' || ch === '–') return '-';
      if (ch === '→') return '->';
      if (ch === '’' || ch === '‘') return "'";
      if (ch === '“' || ch === '”') return '"';
      if (ch === '·' || ch === '•') return '*';
      if (ch === '├' || ch === '└' || ch === '│') return '|';
      if (ch === '─') return '-';
      return ' ';
    })
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapTextToLines(text: string, maxCharsPerLine: number): string[] {
  const result: string[] = [];
  const paragraphs = text.split('\n');
  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      result.push('');
      continue;
    }
    let current = words[0];
    for (let i = 1; i < words.length; i++) {
      if ((current + ' ' + words[i]).length <= maxCharsPerLine) {
        current += ' ' + words[i];
      } else {
        result.push(current);
        current = words[i];
      }
    }
    if (current) result.push(current);
  }
  return result;
}

interface PdfLineItem {
  text: string;
  font: 'F1' | 'F2' | 'F3'; // F1 = Helvetica, F2 = Helvetica-Bold, F3 = Courier
  size: number;
  lineHeight: number;
  indent?: number;
  colorRgb?: [number, number, number];
}

/**
 * Builds a valid, multi-page binary PDF 1.4 document containing the complete
 * FoodDash APK Compilation Guide (Method 1 & Method 2) and Lab Report Reference.
 */
export function generateFoodDashGuidePdfBytes(): Uint8Array {
  const lines: PdfLineItem[] = [];

  // Title Banner Lines
  lines.push({
    text: 'FOODDASH — ANDROID STUDIO APK COMPILATION & LAB REPORT GUIDE',
    font: 'F2',
    size: 15,
    lineHeight: 22,
    colorRgb: [0.91, 0.35, 0.05]
  });
  lines.push({
    text: 'Course: Mobile Application and Development Lab (0613-410) | Package: com.fooddash.app',
    font: 'F2',
    size: 10,
    lineHeight: 15,
    colorRgb: [0.09, 0.15, 0.12]
  });
  lines.push({
    text: 'Stack: 100% Native Java + XML Layouts | Backend: Firebase Auth, Realtime DB & Storage',
    font: 'F1',
    size: 9.5,
    lineHeight: 16,
    colorRgb: [0.35, 0.35, 0.35]
  });
  lines.push({ text: '', font: 'F1', size: 8, lineHeight: 10 });

  for (const section of APK_AND_LAB_REPORT_GUIDE_SECTIONS) {
    lines.push({
      text: `${section.number}: ${section.title}`,
      font: 'F2',
      size: 12,
      lineHeight: 18,
      colorRgb: [0.91, 0.35, 0.05]
    });
    lines.push({
      text: section.subtitle,
      font: 'F2',
      size: 9,
      lineHeight: 14,
      colorRgb: [0.15, 0.25, 0.2]
    });

    for (const p of section.paragraphs) {
      const wrapped = wrapTextToLines(p, 92);
      for (const w of wrapped) {
        lines.push({
          text: w,
          font: 'F1',
          size: 9.5,
          lineHeight: 13.5,
          colorRgb: [0.12, 0.16, 0.22]
        });
      }
      lines.push({ text: '', font: 'F1', size: 6, lineHeight: 6 });
    }

    if (section.steps) {
      for (const step of section.steps) {
        lines.push({
          text: step.stepTitle,
          font: 'F2',
          size: 10,
          lineHeight: 15,
          colorRgb: [0.09, 0.15, 0.12]
        });
        const detailLines = wrapTextToLines(step.detail, 90);
        for (const dl of detailLines) {
          lines.push({
            text: dl,
            font: 'F1',
            size: 9.2,
            lineHeight: 13,
            indent: 8,
            colorRgb: [0.18, 0.22, 0.28]
          });
        }
        if (step.codeSnippet) {
          const rawCodeLines = step.codeSnippet.split('\n');
          for (const cl of rawCodeLines) {
            lines.push({
              text: cl.slice(0, 96),
              font: 'F3',
              size: 8.2,
              lineHeight: 11.5,
              indent: 14,
              colorRgb: [0.1, 0.32, 0.22]
            });
          }
        }
        lines.push({ text: '', font: 'F1', size: 6, lineHeight: 7 });
      }
    }
    lines.push({ text: '', font: 'F1', size: 8, lineHeight: 10 });
  }

  // Paginate lines (Letter / A4 height: 792pt, top margin 54pt, bottom margin 54pt)
  const PAGE_HEIGHT = 792;
  const TOP_START_Y = PAGE_HEIGHT - 54;
  const BOTTOM_LIMIT_Y = 56;

  const pages: PdfLineItem[][] = [];
  let currentPage: PdfLineItem[] = [];
  let currentY = TOP_START_Y;

  for (const item of lines) {
    if (currentY - item.lineHeight < BOTTOM_LIMIT_Y) {
      pages.push(currentPage);
      currentPage = [];
      currentY = TOP_START_Y;
    }
    currentPage.push(item);
    currentY -= item.lineHeight;
  }
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  // Construct PDF 1.4 objects
  // Obj 1: Catalog, Obj 2: Pages, Obj 3: Helvetica (F1), Obj 4: Helvetica-Bold (F2), Obj 5: Courier (F3)
  const objects: string[] = [];
  const totalPages = pages.length;
  const firstPageObjNum = 6;

  const pageObjNums: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    pageObjNums.push(firstPageObjNum + i * 2);
  }

  objects.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
  objects.push(
    `2 0 obj\n<< /Type /Pages /Kids [${pageObjNums
      .map((n) => `${n} 0 R`)
      .join(' ')}] /Count ${totalPages} >>\nendobj\n`
  );
  objects.push(
    `3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`
  );
  objects.push(
    `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`
  );
  objects.push(
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n`
  );

  for (let pIdx = 0; pIdx < totalPages; pIdx++) {
    const pageObjId = firstPageObjNum + pIdx * 2;
    const contentObjId = pageObjId + 1;
    const pageItems = pages[pIdx];

    let stream = 'BT\n';
    let y = TOP_START_Y;

    for (const item of pageItems) {
      const x = 48 + (item.indent || 0);
      const [r, g, b] = item.colorRgb || [0.1, 0.1, 0.1];
      if (item.text.trim().length > 0) {
        stream += `${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} rg\n`;
        stream += `/${item.font} ${item.size} Tf\n`;
        stream += `1 0 0 1 ${x} ${y.toFixed(1)} Tm\n`;
        stream += `(${escapePdfText(item.text)}) Tj\n`;
      }
      y -= item.lineHeight;
    }

    // Footer with page number
    stream += `0.45 0.45 0.45 rg\n/F1 8.5 Tf\n1 0 0 1 48 32 Tm\n`;
    stream += `(FoodDash Lab Report & APK Compilation Guide \(com.fooddash.app\) - Page ${
      pIdx + 1
    } of ${totalPages}) Tj\n`;
    stream += 'ET\n';

    objects.push(
      `${pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${contentObjId} 0 R >>\nendobj\n`
    );
    objects.push(
      `${contentObjId} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}endstream\nendobj\n`
    );
  }

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return new TextEncoder().encode(pdf);
}

export function downloadFoodDashGuidePdf(): void {
  const bytes = generateFoodDashGuidePdfBytes();
  const blob = new Blob([bytes as unknown as BlobPart], {
    type: 'application/pdf'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'FoodDash_APK_Compilation_and_Lab_Report_Guide.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
