import { useState } from 'react';
import { Download } from 'lucide-react';
import {
  INITIAL_CATEGORIES,
  INITIAL_FOODS,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
  INITIAL_USERS,
} from './data/seedData';
import {
  addOrIncrementCartItem,
  CartItemModel,
  createOrderObject,
  FoodModel,
  OrderModel,
  OrderStatus,
  PaymentMethod,
  removeCartItem,
  updateCartItemQuantity,
  UserModel,
} from './utils/fooddashLogic';
import {
  ActivityName,
  AndroidDeviceSimulator,
} from './components/AndroidDeviceSimulator';
import { SourceCodeStudio } from './components/SourceCodeStudio';
import { FirebaseDatabaseInspector } from './components/FirebaseDatabaseInspector';
import { LabReportAndDeliverables } from './components/LabReportAndDeliverables';
import { buildAndroidProjectTarBlob } from './data/androidProject';
import { downloadFoodDashGuidePdf } from './utils/pdfReportGenerator';

type WorkspaceView = 'SIMULATOR' | 'SOURCE_CODE' | 'FIREBASE_DB' | 'LAB_REPORT';

export default function App() {
  const [activeView, setActiveView] = useState<WorkspaceView>('SIMULATOR');
  const [activeActivity, setActiveActivity] = useState<ActivityName>(
    'CustomerHomeActivity'
  );
  const [selectedSourceFile, setSelectedSourceFile] =
    useState<string>('CustomerHomeActivity.java');

  // Firebase Realtime Database simulated state (fooddash/{users, food, categories, orders, settings})
  const [users, setUsers] =
    useState<Record<string, UserModel>>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('usr_cust_1');
  const [foods, setFoods] = useState<FoodModel[]>(INITIAL_FOODS);
  const [categories] = useState<string[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<OrderModel[]>(INITIAL_ORDERS);
  const [settings] = useState(INITIAL_SETTINGS);

  // SharedPreferences simulated state (SessionManager.java)
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [shakeToRefreshEnabled, setShakeToRefreshEnabled] =
    useState<boolean>(true);
  const [cart, setCart] = useState<CartItemModel[]>([
    {
      foodId: 'food_101',
      name: 'Smoky Double Smash Beef Burger',
      price: 390,
      quantity: 1,
      imageUrl: 'svg_burger',
      category: 'Burgers',
    },
  ]);

  const [showApkGuideModal, setShowApkGuideModal] = useState<boolean>(false);

  const currentUser = users[currentUserId] || INITIAL_USERS.usr_cust_1;

  const handleSwitchUserRole = (role: 'CUSTOMER' | 'ADMIN') => {
    if (role === 'ADMIN') {
      setCurrentUserId('usr_admin_1');
    } else {
      setCurrentUserId('usr_cust_1');
    }
  };

  const handleUpdateUserProfile = (updated: UserModel) => {
    setUsers((prev) => ({
      ...prev,
      [updated.uid]: updated,
    }));
  };

  const handleRegisterNewCustomer = (newUser: UserModel) => {
    // Enforce customer role security rule
    const safeCustomer: UserModel = { ...newUser, role: 'CUSTOMER' };
    setUsers((prev) => ({
      ...prev,
      [safeCustomer.uid]: safeCustomer,
    }));
    setCurrentUserId(safeCustomer.uid);
  };

  const handleSaveFood = (food: FoodModel) => {
    setFoods((prev) => {
      const exists = prev.some((f) => f.foodId === food.foodId);
      if (exists) {
        return prev.map((f) => (f.foodId === food.foodId ? food : f));
      }
      return [food, ...prev];
    });
  };

  const handleDeleteFood = (foodId: string) => {
    setFoods((prev) => prev.filter((f) => f.foodId !== foodId));
  };

  const handleToggleFoodAvailability = (foodId: string) => {
    setFoods((prev) =>
      prev.map((f) =>
        f.foodId === foodId ? { ...f, available: !f.available } : f
      )
    );
  };

  const handleAddToCart = (food: FoodModel, quantity: number) => {
    setCart((prev) => addOrIncrementCartItem(prev, food, quantity));
  };

  const handleUpdateCartQty = (foodId: string, delta: number) => {
    setCart((prev) => updateCartItemQuantity(prev, foodId, delta));
  };

  const handleRemoveCartItem = (foodId: string) => {
    setCart((prev) => removeCartItem(prev, foodId));
  };

  const handlePlaceOrder = (params: {
    paymentMethod: PaymentMethod;
    transactionId: string;
    deliveryAddress: string;
    customerPhone: string;
  }): OrderModel => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = createOrderObject({
      orderId,
      user: currentUser,
      items: cart,
      paymentMethod: params.paymentMethod,
      transactionId: params.transactionId,
      deliveryAddress: params.deliveryAddress,
      customerPhone: params.customerPhone,
    });
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  const handleVerifyPayment = (orderId: string, verified: boolean) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              paymentStatus: verified ? 'VERIFIED' : 'REJECTED',
              status: verified ? 'ACCEPTED' : 'REJECTED',
            }
          : o
      )
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
    );
  };

  const handleExportAndroidProject = () => {
    const blob = buildAndroidProjectTarBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FoodDash-AndroidStudio-Java-XML.tar';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#1F2937]">
      {/* Strict 3-Zone Top Navigation Bar Contract */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 bg-white border-b border-stone-200 sticky top-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('SIMULATOR');
          }}
          className="text-xl font-extrabold tracking-tight text-[#F97316] whitespace-nowrap shrink-0"
        >
          FoodDash
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="flex items-center gap-6 text-sm font-semibold text-stone-600 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveView('SIMULATOR')}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeView === 'SIMULATOR'
                ? 'text-stone-900 border-b-2 border-[#F97316]'
                : ''
            }`}
          >
            Device Simulator
          </button>
          <button
            type="button"
            onClick={() => setActiveView('SOURCE_CODE')}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeView === 'SOURCE_CODE'
                ? 'text-stone-900 border-b-2 border-[#F97316]'
                : ''
            }`}
          >
            Java &amp; XML Source
          </button>
          <button
            type="button"
            onClick={() => setActiveView('FIREBASE_DB')}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeView === 'FIREBASE_DB'
                ? 'text-stone-900 border-b-2 border-[#F97316]'
                : ''
            }`}
          >
            Firebase DB Tree
          </button>
          <button
            type="button"
            onClick={() => setActiveView('LAB_REPORT')}
            className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeView === 'LAB_REPORT'
                ? 'text-stone-900 border-b-2 border-[#F97316]'
                : ''
            }`}
          >
            Lab Report &amp; Viva
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleExportAndroidProject}
            className="px-4 py-2 text-xs font-bold text-white bg-[#F97316] hover:bg-[#EA580C] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Android Project</span>
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Transparent Architecture & APK Guide Banner */}
        <section className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-stone-500">
              Android Studio Project (<code className="font-mono text-[#EA580C]">com.fooddash.app</code>) · Java + XML Layouts · Firebase Realtime Database · Course 0613-410
            </div>
            <p className="text-xs text-stone-600">
              Includes complete <strong>Java + XML Android Studio project</strong> + automated <strong>GitHub Actions Cloud APK Builder</strong> (<code className="font-mono">.github/workflows/build-apk.yml</code>) so you can install the native <code className="font-mono">.apk</code> on any Android phone even without a local Android Studio setup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={downloadFoodDashGuidePdf}
              className="px-3 py-1.5 rounded-lg bg-[#F97316] text-white text-xs font-bold hover:bg-[#EA580C] whitespace-nowrap flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download APK Build Guide (.pdf)</span>
            </button>
            <button
              type="button"
              onClick={() => setShowApkGuideModal(true)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-800 hover:bg-stone-100 whitespace-nowrap"
            >
              How to Install APK on Phone
            </button>
            <button
              type="button"
              onClick={() => setActiveView('LAB_REPORT')}
              className="px-3 py-1.5 rounded-lg bg-[#17251F] text-white text-xs font-semibold hover:bg-stone-900 whitespace-nowrap"
            >
              12 Lab Requirements &amp; Report
            </button>
          </div>
        </section>

        {/* How to Get & Install APK on Mobile Modal */}
        {showApkGuideModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h2 className="text-lg font-extrabold text-stone-900">
                  How to Install &amp; Use FoodDash as an APK on Your Android Phone
                </h2>
                <button
                  type="button"
                  onClick={() => setShowApkGuideModal(false)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 space-y-1.5">
                  <div className="text-sm font-bold text-[#EA580C]">
                    Method 1: Build APK in Android Studio (Official Lab Method)
                  </div>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>
                      Click <strong>"Export Android Project"</strong> in the top-right corner to download <code className="font-mono">FoodDash-AndroidStudio-Java-XML.tar</code> and extract the <code className="font-mono">FoodDash/</code> folder.
                    </li>
                    <li>
                      Open the <code className="font-mono">FoodDash/</code> folder in <strong>Android Studio</strong> (all root Gradle files and a starter <code className="font-mono">app/google-services.json</code> are already included so it compiles immediately).
                    </li>
                    <li>
                      In Android Studio menu, click <strong>Build → Build Bundle(s) / APK(s) → Build APK(s)</strong>.
                    </li>
                    <li>
                      Copy <code className="font-mono">app/build/outputs/apk/debug/app-debug.apk</code> to your Android phone via USB or Google Drive and tap to install!
                    </li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="text-sm font-bold text-[#17251F]">
                    Method 2: Automatic Cloud APK Builder on GitHub (No PC Android Studio Needed!)
                  </div>
                  <p>
                    If your laptop struggles to run Android Studio, we included an automated GitHub Actions workflow (<code className="font-mono">.github/workflows/build-apk.yml</code>) inside the exported project:
                  </p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>
                      Extract the downloaded <code className="font-mono">FoodDash/</code> folder and push it to your public <strong>GitHub repository</strong>.
                    </li>
                    <li>
                      Open your repository on GitHub and click the <strong>"Actions"</strong> tab at the top.
                    </li>
                    <li>
                      GitHub's cloud servers automatically compile your Java + XML code using JDK 17 + Android SDK and produce <strong>FoodDash-v1.0-APK</strong> (<code className="font-mono">app-debug.apk</code>) ready to download to your phone and attach to <strong>GitHub Release v1.0</strong>!
                    </li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 space-y-1.5">
                  <div className="text-sm font-bold text-stone-900">
                    Method 3: Instant Mobile Phone Web-App Mode (Zero Build Wait)
                  </div>
                  <p>
                    You can also open this live application link directly in <strong>Chrome on your Android phone</strong> and tap <strong>Menu (⋮) → "Add to Home screen"</strong> to launch and demo all 14 screens interactively on your mobile screen right now.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    downloadFoodDashGuidePdf();
                    setShowApkGuideModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#17251F] hover:bg-stone-900 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Download Step-by-Step PDF Guide (.pdf)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleExportAndroidProject();
                    setShowApkGuideModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Android Project (.tar) Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active View Content */}
        {activeView === 'SIMULATOR' && (
          <AndroidDeviceSimulator
            activeActivity={activeActivity}
            onSelectActivity={setActiveActivity}
            currentUser={currentUser}
            onSwitchUserRole={handleSwitchUserRole}
            onUpdateUserProfile={handleUpdateUserProfile}
            onRegisterNewCustomer={handleRegisterNewCustomer}
            foods={foods}
            categories={categories}
            onSaveFood={handleSaveFood}
            onDeleteFood={handleDeleteFood}
            onToggleFoodAvailability={handleToggleFoodAvailability}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveCartItem={handleRemoveCartItem}
            orders={orders}
            onPlaceOrder={handlePlaceOrder}
            onVerifyPayment={handleVerifyPayment}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            settings={settings}
            rememberMe={rememberMe}
            onToggleRememberMe={setRememberMe}
            shakeToRefreshEnabled={shakeToRefreshEnabled}
            onToggleShakeToRefresh={setShakeToRefreshEnabled}
            onInspectSourceFile={(fileName) => {
              setSelectedSourceFile(fileName);
              setActiveView('SOURCE_CODE');
            }}
          />
        )}

        {activeView === 'SOURCE_CODE' && (
          <SourceCodeStudio
            selectedFileName={selectedSourceFile}
            onSelectFileName={setSelectedSourceFile}
          />
        )}

        {activeView === 'FIREBASE_DB' && (
          <FirebaseDatabaseInspector
            users={users}
            foods={foods}
            categories={categories}
            orders={orders}
            settings={settings}
            rememberMe={rememberMe}
            shakeToRefreshEnabled={shakeToRefreshEnabled}
            currentUser={currentUser}
            cart={cart}
          />
        )}

        {activeView === 'LAB_REPORT' && (
          <LabReportAndDeliverables
            onLaunchActivityInSimulator={(activity) => {
              setActiveActivity(activity);
              setActiveView('SIMULATOR');
            }}
            onInspectSourceFile={(fileName) => {
              setSelectedSourceFile(fileName);
              setActiveView('SOURCE_CODE');
            }}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-stone-200 bg-white px-6 py-4 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>
          FoodDash · Good Food. Easy Ordering. Fast Delivery. · Package: com.fooddash.app
        </span>
        <span>
          Mobile Application and Development Lab (0613-410) · 100% Native Java + XML Android Studio Project
        </span>
      </footer>
    </div>
  );
}
