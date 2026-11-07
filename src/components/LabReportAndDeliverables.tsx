import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileCode,
  Play,
  BookOpen,
  HelpCircle,
  Terminal,
  FileText,
} from 'lucide-react';
import {
  UNIVERSITY_12_REQUIREMENTS,
  COMPONENT_COMPARISON_TABLE,
  VIVA_PREPARATION_QA,
} from '../data/androidProject/labReportAndVivaData';
import {
  APK_AND_LAB_REPORT_GUIDE_SECTIONS,
  downloadFoodDashGuidePdf,
} from '../utils/pdfReportGenerator';
import { ActivityName } from './AndroidDeviceSimulator';

interface LabReportAndDeliverablesProps {
  onLaunchActivityInSimulator: (activity: ActivityName) => void;
  onInspectSourceFile: (fileName: string) => void;
}

export const LabReportAndDeliverables: React.FC<
  LabReportAndDeliverablesProps
> = ({ onLaunchActivityInSimulator, onInspectSourceFile }) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'APK_PDF_GUIDE' | 'REQUIREMENTS' | 'COMPONENTS_TABLE' | 'VIVA_AND_APK'
  >('APK_PDF_GUIDE');

  const generateFullLabReportMarkdown = (): string => {
    const componentRows = COMPONENT_COMPARISON_TABLE.map(
      (c) =>
        `| **${c.component}** | \`${c.usedInFiles}\` | ${c.whatItDoesInFoodDash} | ${c.alternatives} | ${c.whyChosen} |`
    ).join('\n');

    const reqRows = UNIVERSITY_12_REQUIREMENTS.map(
      (r) =>
        `| **${r.id}** | ${r.title} | \`${r.howToDoItSpec}\` | ${r.implementedInFiles.join(', ')} | ${r.verificationSummary} |`
    ).join('\n');

    const vivaSection = VIVA_PREPARATION_QA.map(
      (v, idx) =>
        `### Q${idx + 1}: ${v.question}\n- **Category:** ${v.category}\n- **Code Reference:** \`${v.codeReference}\`\n- **Answer:** ${v.answer}\n`
    ).join('\n');

    return `# FINAL LAB REPORT — MOBILE APPLICATION AND DEVELOPMENT LAB (0613-410)

## 1. Cover Page
- **Course Code & Title:** 0613-410 · Mobile Application and Development Lab
- **Project Title:** FoodDash — Dual-Role Android Food Delivery & Restaurant Management Application
- **Application Package Name:** \`com.fooddash.app\`
- **Development Stack:** Native Java + XML Layouts in Android Studio + Firebase (Authentication, Realtime Database, Storage)
- **Student Name:** [Enter Your Full Name]
- **Student ID:** [Enter Your University ID]
- **Submission Date:** November 2026

---

## 2. Introduction: The Problem and FoodDash's Goal
### 2.1 Problem Statement
University students and local urban residents frequently order meals from nearby restaurants that lack a dedicated digital ordering system. Orders placed over phone calls or social media messages suffer from:
1. Inaccurate menu availability and outdated pricing.
2. Friction in verifying mobile money payments (**bKash** and **Nagad**), where customers send money to a merchant number but have no structured way to submit and track their Transaction ID (\`TrxID\`).
3. Zero real-time visibility into whether an order is \`PENDING\`, \`ACCEPTED\`, \`PREPARING\`, \`OUT_FOR_DELIVERY\`, or \`DELIVERED\`.

### 2.2 Project Goal
**FoodDash** ("Good Food. Easy Ordering. Fast Delivery.") solves these problems with a native Android application written 100% in **Java** and **XML** with two secure account roles:
- **Customer Role:** Browse dishes by category, search in real time, manage cart quantities, checkout using **Cash on Delivery**, **bKash**, or **Nagad** (with manual \`TrxID\` submission and \`PENDING_VERIFICATION\` state), shake the phone to refresh live status via the hardware accelerometer, and contact support via Implicit Intents.
- **Restaurant Admin Role:** View a real-time dark-green (\`#17251F\`) kitchen dashboard with Total Orders, Pending Orders, Completed Orders, Total Food Products, and Sales Summary; perform full CRUD on food items using \`FloatingActionButton\` and \`AlertDialog\`; and manually verify customer **bKash/Nagad** transaction references.

---

## 3. All 12 Required University Features & Screen Breakdown

| # | Feature Requirement | Specification | Implemented Files in FoodDash | How It Works in FoodDash |
|---|---|---|---|---|
${reqRows}

---

## 4. Components Used, Alternatives, and Why We Chose Them (Main Part of the Report)

| Component Used | Files in FoodDash | What It Does in FoodDash | Alternatives | Why We Chose It for FoodDash (2–3 Lines) |
|---|---|---|---|---|
${componentRows}

---

## 5. Firebase Realtime Database Structure & Security Rules

\`\`\`
fooddash/
 ├── users/
 │    └── {uid}/
 │         ├── uid: "usr_cust_1"
 │         ├── name: "Tanvir Ahmed"
 │         ├── email: "tanvir@student.edu.bd"
 │         ├── phone: "01712345678"
 │         ├── role: "CUSTOMER" | "ADMIN"
 │         ├── address: "House 14, Road 7, Dhanmondi, Dhaka"
 │         └── photoUrl: "https://..."
 ├── food/
 │    └── {foodId}/
 │         ├── foodId: "food_101"
 │         ├── name: "Smoky Double Smash Beef Burger"
 │         ├── description: "..."
 │         ├── price: 390.0
 │         ├── category: "Burgers"
 │         ├── imageUrl: "https://..."
 │         └── available: true
 ├── categories/
 ├── orders/
 │    └── {orderId}/
 │         ├── orderId: "ORD-8492"
 │         ├── customerId: "usr_cust_1"
 │         ├── customerName: "Tanvir Ahmed"
 │         ├── items: [ ... ]
 │         ├── subtotal: 1120.0
 │         ├── deliveryFee: 60.0
 │         ├── total: 1180.0
 │         ├── paymentMethod: "bKash" | "Nagad" | "Cash on Delivery"
 │         ├── paymentStatus: "PENDING_VERIFICATION" | "VERIFIED" | "COD_DUE"
 │         ├── transactionId: "BKA948271X"
 │         ├── status: "PENDING" | "ACCEPTED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED"
 │         ├── deliveryAddress: "..."
 │         └── createdAt: 1762540000000
 └── settings/
      ├── bkashNumber: "01711-998877 (FoodDash Merchant)"
      └── nagadNumber: "01819-554433 (FoodDash Merchant)"
\`\`\`

---

## 6. GitHub Repository & Release v1.0 Workflow
- **Public Repository URL:** \`https://github.com/<your-username>/FoodDash-Android\`
- **Release Tag:** \`v1.0\` (with compiled \`FoodDash-v1.0.apk\` attached)

---

## 7. Problems Faced and How We Solved Them
1. **Preventing Privilege Escalation (Customer -> Admin):** Solved by hardcoding \`"CUSTOMER"\` in \`RegisterActivity.java\` and enforcing server-side role validation in \`database.rules.json\` so only existing Admins can hold the \`ADMIN\` role.
2. **Handling Asynchronous bKash/Nagad Verification:** Instead of pretending to auto-verify mobile money without a merchant API gateway, we designed a transparent \`PENDING_VERIFICATION\` state in \`CheckoutActivity.java\` paired with an Admin verification \`AlertDialog\` in \`AdminOrdersActivity.java\`.
3. **Preventing Accelerometer Battery Drain & Multiple Triggers:** Added a 750ms debounce window (\`SHAKE_SLOP_TIME_MS\`) in \`ShakeDetector.java\` and unregistered \`SensorManager\` in \`onPause()\`.

---

## 8. Viva Preparation Questions & Answers
${vivaSection}

---

## 9. Conclusion & References
FoodDash successfully implements a commercial-grade Android food delivery platform using pure Java and XML layouts, fulfilling all 12 university lab requirements.
- Android Developer Documentation: https://developer.android.com/guide
- Firebase Realtime Database for Android: https://firebase.google.com/docs/database/android/start
- Material Design Components for Android: https://m3.material.io/
`;
  };

  const handleDownloadLabReport = () => {
    const content = generateFullLabReportMarkdown();
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FoodDash_Final_Lab_Report_12_Pages.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">
            University Final Lab Deliverables &amp; Step-by-Step APK PDF Guide
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Step-by-step PDF manual for Method 1 (Android Studio Manual APK Build) &amp; Method 2 (GitHub Actions Cloud APK Build), all 12 mandatory features, and the Section 4 Components vs. Alternatives matrix.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={downloadFoodDashGuidePdf}
            className="px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs flex items-center gap-2 shrink-0 whitespace-nowrap shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Download APK Build Guide (.pdf)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadLabReport}
            className="px-4 py-2.5 rounded-xl bg-[#17251F] hover:bg-stone-900 text-white font-bold text-xs flex items-center gap-2 shrink-0 whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-[#F97316]" />
            <span>Download Full Lab Report (.md)</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('APK_PDF_GUIDE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            activeSubTab === 'APK_PDF_GUIDE'
              ? 'bg-[#F97316] text-white'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. APK Compilation PDF Guide (Method 1 &amp; Method 2)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('REQUIREMENTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            activeSubTab === 'REQUIREMENTS'
              ? 'bg-[#F97316] text-white'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>2. All 12 Mandatory Features (40 Marks)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('COMPONENTS_TABLE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            activeSubTab === 'COMPONENTS_TABLE'
              ? 'bg-[#F97316] text-white'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>3. Components Used vs. Alternatives Table (15 Marks)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('VIVA_AND_APK')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            activeSubTab === 'VIVA_AND_APK'
              ? 'bg-[#F97316] text-white'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>4. Viva Q&amp;A &amp; Defense Guide</span>
        </button>
      </div>

      {/* Tab 0: Step-by-Step APK Compilation PDF Guide (Method 1 & Method 2) */}
      {activeSubTab === 'APK_PDF_GUIDE' && (
        <div className="space-y-5">
          {APK_AND_LAB_REPORT_GUIDE_SECTIONS.map((section) => (
            <article
              key={section.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4"
            >
              <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-[#EA580C]">
                    {section.number}
                  </span>
                  <h3 className="text-lg font-extrabold text-stone-900 mt-0.5">
                    {section.title}
                  </h3>
                  <p className="text-xs font-mono text-stone-500 mt-0.5">
                    {section.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={downloadFoodDashGuidePdf}
                  className="px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#EA580C] border border-orange-200 text-xs font-bold flex items-center gap-1.5 self-start sm:self-center shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save as PDF</span>
                </button>
              </div>

              <div className="space-y-2 text-sm text-stone-700 leading-relaxed">
                {section.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {section.steps && (
                <div className="space-y-3 pt-1">
                  {section.steps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="rounded-xl bg-stone-50 border border-stone-200/80 p-4 space-y-2"
                    >
                      <h4 className="text-sm font-bold text-stone-900">
                        {step.stepTitle}
                      </h4>
                      <p className="text-xs text-stone-700 whitespace-pre-line leading-relaxed">
                        {step.detail}
                      </p>
                      {step.codeSnippet && (
                        <pre className="p-3.5 rounded-xl bg-stone-900 text-emerald-300 text-xs font-mono overflow-x-auto leading-relaxed">
                          <code>{step.codeSnippet}</code>
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Tab 1: All 12 Mandatory Requirements */}
      {activeSubTab === 'REQUIREMENTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {UNIVERSITY_12_REQUIREMENTS.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-[#EA580C]">
                    Requirement #{req.id}
                  </span>
                  <span className="text-xs font-mono text-stone-500">
                    {req.howToDoItSpec}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900">
                  {req.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {req.verificationSummary}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {req.implementedInFiles.slice(0, 4).map((file) => (
                    <button
                      key={file}
                      type="button"
                      onClick={() => onInspectSourceFile(file)}
                      className="text-[11px] font-mono text-stone-700 bg-stone-100 hover:bg-orange-100 hover:text-[#EA580C] px-2 py-0.5 rounded transition-colors"
                    >
                      {file}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() =>
                    onInspectSourceFile(req.implementedInFiles[0])
                  }
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Inspect Source</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onLaunchActivityInSimulator(
                      req.targetActivity as ActivityName
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3" />
                  <span>{req.simulatorActionLabel}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Section 4 Components Used, Alternatives, and Why Chosen */}
      {activeSubTab === 'COMPONENTS_TABLE' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="p-5 border-b border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              Lab Report Section 4: Components Used, Alternatives, and Why Chosen
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Directly formatted for your 10–15 page PDF lab report and viva defense.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-700">
                  <th className="p-3.5">Component Used</th>
                  <th className="p-3.5">What It Does in FoodDash</th>
                  <th className="p-3.5">Alternatives</th>
                  <th className="p-3.5">Why We Chose It (2–3 Lines)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-xs">
                {COMPONENT_COMPARISON_TABLE.map((row) => (
                  <tr key={row.component} className="hover:bg-stone-50/80">
                    <td className="p-3.5 align-top font-bold text-stone-900 w-48">
                      <div>{row.component}</div>
                      <div className="text-[11px] font-mono font-normal text-[#EA580C] mt-1">
                        {row.usedInFiles}
                      </div>
                    </td>
                    <td className="p-3.5 align-top text-stone-700 w-64">
                      {row.whatItDoesInFoodDash}
                    </td>
                    <td className="p-3.5 align-top font-mono text-stone-600 w-48">
                      {row.alternatives}
                    </td>
                    <td className="p-3.5 align-top text-stone-700 leading-relaxed">
                      {row.whyChosen}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Viva Q&A & APK Build Instructions */}
      {activeSubTab === 'VIVA_AND_APK' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              Viva Examination Defense Guide
            </h3>
            {VIVA_PREPARATION_QA.map((qa, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono text-[#EA580C]">
                  <span>{qa.category}</span>
                  <span>{qa.codeReference}</span>
                </div>
                <h4 className="text-sm font-bold text-stone-900">
                  Q{i + 1}: {qa.question}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {qa.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 bg-[#17251F] text-white rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
              <Terminal className="w-4 h-4" />
              <span>Android Studio APK &amp; GitHub Release v1.0 Guide</span>
            </div>

            <div className="space-y-3 text-xs text-emerald-100 leading-relaxed">
              <div>
                <strong className="text-white block">
                  Step 1: Export &amp; Open in Android Studio
                </strong>
                Click "Download Complete Project (.tar)" in the Source Code tab, extract the <code className="font-mono text-amber-300">FoodDash/</code> folder, and open it in Android Studio.
              </div>

              <div>
                <strong className="text-white block">
                  Step 2: Connect Your Firebase Project
                </strong>
                In Firebase Console, create a project, register package{' '}
                <code className="font-mono text-amber-300">
                  com.fooddash.app
                </code>
                , download <code className="font-mono text-amber-300">google-services.json</code> into <code className="font-mono">app/</code>, enable Email/Password Auth, and paste <code className="font-mono">database.rules.json</code> into Realtime Database Rules.
              </div>

              <div>
                <strong className="text-white block">
                  Step 3: Push to Public GitHub Repository
                </strong>
                <pre className="mt-1.5 p-3 rounded-xl bg-black/40 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                  {`git init
git add .
git commit -m "Initial commit: FoodDash Java + XML project"
git branch -M main
git remote add origin https://github.com/YOUR_USER/FoodDash.git
git push -u origin main`}
                </pre>
              </div>

              <div>
                <strong className="text-white block">
                  Step 4: Build APK &amp; Create Release v1.0
                </strong>
                In Android Studio, go to{' '}
                <strong>Build → Build Bundle(s) / APK(s) → Build APK(s)</strong>.
                Upload <code className="font-mono text-amber-300">app-debug.apk</code> to GitHub Releases tagged as <code className="font-mono text-amber-300">v1.0</code>.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
