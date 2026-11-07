import React, { useState, useRef } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  Phone,
  Share2,
  Globe,
  Camera,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  User,
  LogOut,
  ShieldCheck,
  Edit3,
  Package,
  RefreshCw,
  FileCode,
} from 'lucide-react';
import {
  FoodModel,
  CartItemModel,
  OrderModel,
  UserModel,
  RestaurantSettings,
  PaymentMethod,
  OrderStatus,
  ValidationErrors,
  validateLoginInput,
  validateRegisterInput,
  validateFoodInput,
  validateCheckoutInput,
  calculateSubtotal,
  calculateDeliveryFee,
  calculateTotal,
  computeAdminStats,
} from '../utils/fooddashLogic';
import { FoodSvgIllustration } from './FoodSvgIllustration';

export type ActivityName =
  | 'SplashActivity'
  | 'LoginActivity'
  | 'RegisterActivity'
  | 'CustomerHomeActivity'
  | 'FoodDetailsActivity'
  | 'CartActivity'
  | 'CheckoutActivity'
  | 'MyOrdersActivity'
  | 'OrderDetailsActivity'
  | 'ProfileActivity'
  | 'AdminDashboardActivity'
  | 'ManageFoodActivity'
  | 'AddEditFoodActivity'
  | 'AdminOrdersActivity';

export const ALL_14_ACTIVITIES: {
  id: ActivityName;
  label: string;
  role: 'SHARED' | 'CUSTOMER' | 'ADMIN';
  xmlLayout: string;
}[] = [
  { id: 'SplashActivity', label: '1. SplashActivity', role: 'SHARED', xmlLayout: 'activity_splash.xml' },
  { id: 'LoginActivity', label: '2. LoginActivity', role: 'SHARED', xmlLayout: 'activity_login.xml' },
  { id: 'RegisterActivity', label: '3. RegisterActivity', role: 'CUSTOMER', xmlLayout: 'activity_register.xml' },
  { id: 'CustomerHomeActivity', label: '4. CustomerHomeActivity', role: 'CUSTOMER', xmlLayout: 'activity_customer_home.xml' },
  { id: 'FoodDetailsActivity', label: '5. FoodDetailsActivity', role: 'CUSTOMER', xmlLayout: 'activity_food_details.xml' },
  { id: 'CartActivity', label: '6. CartActivity', role: 'CUSTOMER', xmlLayout: 'activity_cart.xml' },
  { id: 'CheckoutActivity', label: '7. CheckoutActivity', role: 'CUSTOMER', xmlLayout: 'activity_checkout.xml' },
  { id: 'MyOrdersActivity', label: '8. MyOrdersActivity', role: 'CUSTOMER', xmlLayout: 'activity_my_orders.xml' },
  { id: 'OrderDetailsActivity', label: '9. OrderDetailsActivity', role: 'SHARED', xmlLayout: 'activity_order_details.xml' },
  { id: 'ProfileActivity', label: '10. ProfileActivity', role: 'CUSTOMER', xmlLayout: 'activity_profile.xml' },
  { id: 'AdminDashboardActivity', label: '11. AdminDashboardActivity', role: 'ADMIN', xmlLayout: 'activity_admin_dashboard.xml' },
  { id: 'ManageFoodActivity', label: '12. ManageFoodActivity', role: 'ADMIN', xmlLayout: 'activity_manage_food.xml' },
  { id: 'AddEditFoodActivity', label: '13. AddEditFoodActivity', role: 'ADMIN', xmlLayout: 'activity_add_edit_food.xml' },
  { id: 'AdminOrdersActivity', label: '14. AdminOrdersActivity', role: 'ADMIN', xmlLayout: 'activity_admin_orders.xml' },
];

interface AndroidDeviceSimulatorProps {
  activeActivity: ActivityName;
  onSelectActivity: (activity: ActivityName) => void;
  currentUser: UserModel;
  onSwitchUserRole: (role: 'CUSTOMER' | 'ADMIN') => void;
  onUpdateUserProfile: (updated: UserModel) => void;
  onRegisterNewCustomer: (user: UserModel) => void;
  foods: FoodModel[];
  categories: string[];
  onSaveFood: (food: FoodModel) => void;
  onDeleteFood: (foodId: string) => void;
  onToggleFoodAvailability: (foodId: string) => void;
  cart: CartItemModel[];
  onAddToCart: (food: FoodModel, quantity: number) => void;
  onUpdateCartQty: (foodId: string, delta: number) => void;
  onRemoveCartItem: (foodId: string) => void;
  orders: OrderModel[];
  onPlaceOrder: (params: {
    paymentMethod: PaymentMethod;
    transactionId: string;
    deliveryAddress: string;
    customerPhone: string;
  }) => OrderModel;
  onVerifyPayment: (orderId: string, verified: boolean) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  settings: RestaurantSettings;
  rememberMe: boolean;
  onToggleRememberMe: (val: boolean) => void;
  shakeToRefreshEnabled: boolean;
  onToggleShakeToRefresh: (val: boolean) => void;
  onInspectSourceFile: (fileName: string) => void;
}

export const AndroidDeviceSimulator: React.FC<AndroidDeviceSimulatorProps> = ({
  activeActivity,
  onSelectActivity,
  currentUser,
  onSwitchUserRole,
  onUpdateUserProfile,
  onRegisterNewCustomer,
  foods,
  categories,
  onSaveFood,
  onDeleteFood,
  onToggleFoodAvailability,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onRemoveCartItem,
  orders,
  onPlaceOrder,
  onVerifyPayment,
  onUpdateOrderStatus,
  settings,
  rememberMe,
  onToggleRememberMe,
  shakeToRefreshEnabled,
  onToggleShakeToRefresh,
  onInspectSourceFile,
}) => {
  // Navigation & Intent Extras state
  const [selectedFood, setSelectedFood] = useState<FoodModel>(foods[0]);
  const [detailQty, setDetailQty] = useState<number>(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders[0]?.orderId || 'ORD-8492'
  );
  const [editingFood, setEditingFood] = useState<FoodModel | null>(null);

  // Filter & Search state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [adminSearchQuery, setAdminSearchQuery] = useState<string>('');

  // Form states & TextInputEditText.setError() states
  const [loginEmail, setLoginEmail] = useState<string>(currentUser.email);
  const [loginPassword, setLoginPassword] = useState<string>('fooddash123');
  const [loginErrors, setLoginErrors] = useState<ValidationErrors>({});

  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regAddress, setRegAddress] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regErrors, setRegErrors] = useState<ValidationErrors>({});

  const [checkoutAddress, setCheckoutAddress] = useState<string>(
    currentUser.address
  );
  const [checkoutPhone, setCheckoutPhone] = useState<string>(currentUser.phone);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('bKash');
  const [transactionId, setTransactionId] = useState<string>('');
  const [checkoutErrors, setCheckoutErrors] = useState<ValidationErrors>({});

  const [foodFormName, setFoodFormName] = useState<string>('');
  const [foodFormDesc, setFoodFormDesc] = useState<string>('');
  const [foodFormPrice, setFoodFormPrice] = useState<string>('');
  const [foodFormCategory, setFoodFormCategory] = useState<string>('Burgers');
  const [foodFormImageKey, setFoodFormImageKey] =
    useState<string>('svg_burger');
  const [foodFormAvailable, setFoodFormAvailable] = useState<boolean>(true);
  const [foodFormErrors, setFoodFormErrors] = useState<ValidationErrors>({});

  const [profileName, setProfileName] = useState<string>(currentUser.name);
  const [profilePhone, setProfilePhone] = useState<string>(currentUser.phone);
  const [profileAddress, setProfileAddress] = useState<string>(
    currentUser.address
  );
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>(
    currentUser.photoUrl
  );
  const [profileErrors, setProfileErrors] = useState<ValidationErrors>({});

  // Android Toast / Snackbar & AlertDialog & Sensor simulation state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [lastGForce, setLastGForce] = useState<number>(1.0);
  const [implicitIntentLog, setImplicitIntentLog] = useState<{
    action: string;
    dataUri: string;
    description: string;
  } | null>(null);

  // Android AlertDialog state (Requirement #6)
  const [alertDialog, setAlertDialog] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    secondaryLabel?: string;
    onConfirm: () => void;
    onSecondary?: () => void;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoTarget, setPhotoTarget] = useState<'PROFILE' | 'FOOD'>('PROFILE');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Requirement #11: Accelerometer Shake-to-Refresh simulation
  const triggerAccelerometerShake = () => {
    setIsShaking(true);
    setLastGForce(3.24);
    setTimeout(() => {
      setIsShaking(false);
      setLastGForce(1.0);
    }, 650);

    if (!shakeToRefreshEnabled) {
      showToast(
        'Accelerometer detected 3.24g shake (Shake-to-Refresh is disabled in SharedPreferences)'
      );
      return;
    }
    showToast(
      'ShakeDetector (3.24g > 2.7g): Synced live Firebase Realtime Database menu & orders!'
    );
  };

  // Requirement #12: Implicit Intents
  const triggerImplicitIntent = (
    action: 'ACTION_DIAL' | 'ACTION_SEND' | 'ACTION_VIEW',
    dataUri: string,
    description: string
  ) => {
    setImplicitIntentLog({ action, dataUri, description });
    showToast(`Implicit Intent launched: Intent.${action}`);
  };

  // Requirement #10: Camera / Gallery Intent
  const openPhotoPickerIntent = (target: 'PROFILE' | 'FOOD') => {
    setPhotoTarget(target);
    setAlertDialog({
      title:
        target === 'PROFILE'
          ? 'Update Profile Photo (Intent)'
          : 'Select Food Photo (Intent)',
      message:
        'Choose image source via MediaStore.ACTION_IMAGE_CAPTURE (Camera) or Intent.ACTION_PICK (Gallery):',
      confirmLabel: 'Upload from Gallery',
      secondaryLabel: 'Use Camera Capture',
      onConfirm: () => {
        setAlertDialog(null);
        fileInputRef.current?.click();
      },
      onSecondary: () => {
        setAlertDialog(null);
        // Generate an instant SVG data URL representing a fresh camera capture
        const cameraSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="220" viewBox="0 0 300 220"><rect width="300" height="220" fill="#EA580C"/><circle cx="150" cy="110" r="65" fill="#FFF9F4"/><text x="150" y="116" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1F2937" text-anchor="middle">CAMERA CAPTURED</text></svg>`;
        const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(cameraSvg)}`;
        if (target === 'PROFILE') {
          setProfilePhotoUrl(dataUrl);
          onUpdateUserProfile({ ...currentUser, photoUrl: dataUrl });
        } else {
          setFoodFormImageKey(dataUrl);
        }
        showToast(
          'MediaStore.ACTION_IMAGE_CAPTURE: Photo captured and loaded into ImageView!'
        );
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (photoTarget === 'PROFILE') {
        setProfilePhotoUrl(result);
        onUpdateUserProfile({ ...currentUser, photoUrl: result });
        showToast(
          'Intent.ACTION_PICK: Profile photo updated & uploaded to Firebase Storage!'
        );
      } else {
        setFoodFormImageKey(result);
        showToast('Intent.ACTION_PICK: Food photo loaded into ImageView!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Start Add or Edit Food Activity
  const openAddFoodActivity = () => {
    setEditingFood(null);
    setFoodFormName('');
    setFoodFormDesc('');
    setFoodFormPrice('');
    setFoodFormCategory('Burgers');
    setFoodFormImageKey('svg_burger');
    setFoodFormAvailable(true);
    setFoodFormErrors({});
    onSelectActivity('AddEditFoodActivity');
  };

  const openEditFoodActivity = (food: FoodModel) => {
    setEditingFood(food);
    setFoodFormName(food.name);
    setFoodFormDesc(food.description);
    setFoodFormPrice(String(food.price));
    setFoodFormCategory(food.category);
    setFoodFormImageKey(food.imageUrl);
    setFoodFormAvailable(food.available);
    setFoodFormErrors({});
    onSelectActivity('AddEditFoodActivity');
  };

  // Filtered foods for Customer & Admin
  const customerFilteredFoods = foods.filter((f) => {
    const matchesCat =
      selectedCategory === 'All' ||
      f.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const adminFilteredFoods = foods.filter((f) => {
    if (!adminSearchQuery.trim()) return true;
    const q = adminSearchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
    );
  });

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = calculateSubtotal(cart);
  const cartDeliveryFee = calculateDeliveryFee(cartSubtotal);
  const cartTotal = calculateTotal(cartSubtotal, cartDeliveryFee);
  const adminStats = computeAdminStats(orders, foods);

  const activeOrder =
    orders.find((o) => o.orderId === selectedOrderId) || orders[0];

  const isAdminScreen = [
    'AdminDashboardActivity',
    'ManageFoodActivity',
    'AddEditFoodActivity',
    'AdminOrdersActivity',
  ].includes(activeActivity);

  const currentActivityMeta =
    ALL_14_ACTIVITIES.find((a) => a.id === activeActivity) ||
    ALL_14_ACTIVITIES[3];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Hidden file input for Camera/Gallery Intent simulation */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Left Column (5 cols): 14-Activity Navigator & Hardware/Sensor Controls */}
      <div className="lg:col-span-5 space-y-5">
        {/* Role & Active Session Switcher */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-500">
              Firebase Auth Active Role
            </span>
            <span className="text-xs font-mono text-stone-600">
              {currentUser.role} · {currentUser.uid}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onSwitchUserRole('CUSTOMER');
                setLoginEmail('tanvir@student.edu.bd');
                onSelectActivity('CustomerHomeActivity');
                showToast('Switched to Customer account (Tanvir Ahmed)');
              }}
              className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
                currentUser.role === 'CUSTOMER' && !isAdminScreen
                  ? 'bg-[#F97316] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>Customer View</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSwitchUserRole('ADMIN');
                setLoginEmail('admin@fooddash.com.bd');
                onSelectActivity('AdminDashboardActivity');
                showToast('Switched to Restaurant Admin (Chef Rafiqul)');
              }}
              className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
                currentUser.role === 'ADMIN' || isAdminScreen
                  ? 'bg-[#17251F] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>

        {/* All 14 Activities Quick-Selector */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-stone-900">
              All 14 Java Activities (Requirement #1)
            </h2>
            <button
              type="button"
              onClick={() =>
                onInspectSourceFile(`${activeActivity}.java`)
              }
              className="text-xs font-semibold text-[#EA580C] hover:underline flex items-center gap-1 whitespace-nowrap"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>View {activeActivity}.java</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 max-h-[310px] overflow-y-auto pr-1">
            {ALL_14_ACTIVITIES.map((act) => {
              const isSelected = act.id === activeActivity;
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => {
                    if (act.role === 'ADMIN' && currentUser.role !== 'ADMIN') {
                      onSwitchUserRole('ADMIN');
                    } else if (
                      act.role === 'CUSTOMER' &&
                      currentUser.role === 'ADMIN'
                    ) {
                      onSwitchUserRole('CUSTOMER');
                    }
                    onSelectActivity(act.id);
                  }}
                  className={`text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-colors truncate ${
                    isSelected
                      ? act.role === 'ADMIN'
                        ? 'bg-[#17251F] text-white font-semibold'
                        : 'bg-[#F97316] text-white font-semibold'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/70'
                  }`}
                >
                  {act.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hardware Sensors & Implicit Intents Test Bench (Req #10, #11, #12) */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">
              Hardware Sensor &amp; Implicit Intents
            </h3>
            <span className="text-xs font-mono text-stone-500 tabular-nums">
              gForce: {lastGForce.toFixed(2)}g
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={triggerAccelerometerShake}
              className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
              <span>Shake Phone (Req #11)</span>
            </button>

            <button
              type="button"
              onClick={() => openPhotoPickerIntent('PROFILE')}
              className="px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold hover:bg-stone-100 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Camera className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
              <span>Camera/Gallery (Req #10)</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() =>
                triggerImplicitIntent(
                  'ACTION_DIAL',
                  `tel:${settings.supportPhone}`,
                  'Opens native Android Phone Dialer with FoodDash hotline number'
                )
              }
              className="px-2.5 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-100 flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <Phone className="w-3 h-3 text-[#16A34A]" />
              <span>ACTION_DIAL</span>
            </button>

            <button
              type="button"
              onClick={() =>
                triggerImplicitIntent(
                  'ACTION_SEND',
                  `Check out ${selectedFood.name} (BDT ${selectedFood.price}) on FoodDash!`,
                  'Launches Android Sharesheet (Intent.createChooser) to share food/receipt'
                )
              }
              className="px-2.5 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-100 flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <Share2 className="w-3 h-3 text-[#F97316]" />
              <span>ACTION_SEND</span>
            </button>

            <button
              type="button"
              onClick={() =>
                triggerImplicitIntent(
                  'ACTION_VIEW',
                  settings.websiteUrl,
                  'Opens https://fooddash.com.bd in the default mobile browser'
                )
              }
              className="px-2.5 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-100 flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <Globe className="w-3 h-3 text-blue-600" />
              <span>ACTION_VIEW</span>
            </button>
          </div>

          {implicitIntentLog && (
            <div className="p-2.5 rounded-lg bg-stone-900 text-stone-100 text-xs font-mono space-y-1">
              <div className="flex items-center justify-between text-amber-400">
                <span>Intent.{implicitIntentLog.action}</span>
                <button
                  type="button"
                  onClick={() => setImplicitIntentLog(null)}
                  className="text-stone-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
              <div className="text-stone-300 break-all">
                URI/Payload: {implicitIntentLog.dataUri}
              </div>
              <div className="text-stone-400 text-[11px]">
                {implicitIntentLog.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column (7 cols): Interactive Android Device Viewport */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div
          className={`w-full max-w-[430px] rounded-[34px] border-[7px] border-stone-900 bg-[#FFF9F4] shadow-xl overflow-hidden flex flex-col min-h-[710px] max-h-[760px] relative transition-transform duration-150 ${
            isShaking ? 'translate-x-2 -translate-y-1 rotate-1' : ''
          }`}
        >
          {/* Android Status Bar */}
          <div
            className={`px-5 py-2 text-[11px] font-mono flex items-center justify-between shrink-0 ${
              isAdminScreen
                ? 'bg-[#17251F] text-emerald-100'
                : 'bg-[#EA580C] text-white'
            }`}
          >
            <span>12:30 · com.fooddash.app</span>
            <span className="truncate max-w-[180px]">
              {currentActivityMeta.xmlLayout}
            </span>
          </div>

          {/* Android App Bar / Toolbar */}
          {activeActivity !== 'SplashActivity' && (
            <div
              className={`px-4 py-3 flex items-center justify-between gap-2 shrink-0 border-b ${
                isAdminScreen
                  ? 'bg-[#17251F] text-white border-emerald-900/60'
                  : 'bg-[#F97316] text-white border-orange-600/30'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {activeActivity !== 'CustomerHomeActivity' &&
                  activeActivity !== 'AdminDashboardActivity' &&
                  activeActivity !== 'LoginActivity' && (
                    <button
                      type="button"
                      aria-label="Navigate Back"
                      onClick={() => {
                        if (isAdminScreen) {
                          onSelectActivity('AdminDashboardActivity');
                        } else {
                          onSelectActivity('CustomerHomeActivity');
                        }
                      }}
                      className="p-1 rounded-lg hover:bg-black/10"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                <div className="truncate">
                  <div className="text-sm font-bold leading-tight truncate">
                    {activeActivity}
                  </div>
                  <div className="text-[11px] opacity-85 truncate">
                    {isAdminScreen
                      ? 'Restaurant Admin Console'
                      : 'Good Food. Easy Ordering. Fast Delivery.'}
                  </div>
                </div>
              </div>

              {!isAdminScreen &&
                activeActivity !== 'LoginActivity' &&
                activeActivity !== 'RegisterActivity' && (
                  <button
                    type="button"
                    onClick={() => onSelectActivity('CartActivity')}
                    className="px-2.5 py-1.5 rounded-lg bg-white text-[#EA580C] text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="tabular-nums">Cart ({cartCount})</span>
                  </button>
                )}
            </div>
          )}

          {/* Main Activity Content Area */}
          <div
            className={`flex-1 overflow-y-auto pb-14 ${
              activeActivity === 'AdminDashboardActivity'
                ? 'bg-[#17251F] text-white'
                : 'bg-[#FFF9F4] text-[#1F2937]'
            }`}
          >
            {/* 1. SPLASH ACTIVITY */}
            {activeActivity === 'SplashActivity' && (
              <div className="h-full min-h-[640px] bg-gradient-to-b from-[#F97316] to-[#EA580C] text-white flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-xs flex items-center justify-center mb-5 border border-white/25 shadow-lg">
                  <ShoppingBag className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  FoodDash
                </h2>
                <p className="text-sm text-orange-100 mt-2 max-w-[250px]">
                  Good Food. Easy Ordering. Fast Delivery.
                </p>
                <div className="mt-8 text-xs font-mono bg-black/20 px-3.5 py-2 rounded-lg">
                  FirebaseAuth.getInstance().getCurrentUser()
                </div>
                <div className="mt-6 flex flex-col gap-2 w-full max-w-[240px]">
                  <button
                    type="button"
                    onClick={() => onSelectActivity('CustomerHomeActivity')}
                    className="w-full py-2.5 rounded-xl bg-white text-[#EA580C] font-bold text-xs shadow-sm hover:bg-orange-50"
                  >
                    Continue as Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSwitchUserRole('ADMIN');
                      onSelectActivity('AdminDashboardActivity');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#17251F] text-white font-bold text-xs shadow-sm hover:bg-stone-900"
                  >
                    Continue as Restaurant Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectActivity('LoginActivity')}
                    className="w-full py-2 rounded-xl border border-white/40 text-white font-semibold text-xs hover:bg-white/10"
                  >
                    Go to LoginActivity
                  </button>
                </div>
              </div>
            )}

            {/* 2. LOGIN ACTIVITY */}
            {activeActivity === 'LoginActivity' && (
              <div className="p-5 space-y-4">
                <div className="text-center pt-2">
                  <h3 className="text-xl font-bold text-stone-900">
                    Welcome Back to FoodDash
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Sign in with Firebase Authentication (Req #3 &amp; #7)
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3.5">
                  <div>
                    <label
                      htmlFor="login-email-input"
                      className="block text-xs font-semibold text-stone-700 mb-1"
                    >
                      Email Address (TextInputEditText)
                    </label>
                    <input
                      id="login-email-input"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        setLoginErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      placeholder="tanvir@student.edu.bd"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        loginErrors.email
                          ? 'border-red-600 bg-red-50/40'
                          : 'border-stone-300'
                      }`}
                    />
                    {loginErrors.email && (
                      <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>setError: "{loginErrors.email}"</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="login-password-input"
                      className="block text-xs font-semibold text-stone-700 mb-1"
                    >
                      Password (TextInputEditText)
                    </label>
                    <input
                      id="login-password-input"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setLoginErrors((prev) => ({ ...prev, password: '' }));
                      }}
                      placeholder="••••••"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        loginErrors.password
                          ? 'border-red-600 bg-red-50/40'
                          : 'border-stone-300'
                      }`}
                    />
                    {loginErrors.password && (
                      <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>setError: "{loginErrors.password}"</span>
                      </p>
                    )}
                  </div>

                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => onToggleRememberMe(e.target.checked)}
                      className="rounded text-[#F97316]"
                    />
                    <span>Remember Me (Saved in SharedPreferences)</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const errs = validateLoginInput(
                        loginEmail,
                        loginPassword
                      );
                      setLoginErrors(errs);
                      if (Object.keys(errs).length > 0) {
                        showToast('TextInputEditText.setError() triggered!');
                        return;
                      }
                      if (loginEmail.toLowerCase().includes('admin')) {
                        onSwitchUserRole('ADMIN');
                        onSelectActivity('AdminDashboardActivity');
                        showToast('Signed in as Restaurant Admin!');
                      } else {
                        onSwitchUserRole('CUSTOMER');
                        onSelectActivity('CustomerHomeActivity');
                        showToast('Signed in as Customer!');
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm transition-colors"
                  >
                    Sign In to FoodDash
                  </button>

                  <div className="pt-1 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail('');
                        setLoginPassword('12');
                        setLoginErrors(validateLoginInput('', '12'));
                      }}
                      className="text-stone-500 hover:text-stone-800 underline"
                    >
                      Demo Empty/Invalid Input
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectActivity('RegisterActivity')}
                      className="text-[#EA580C] font-bold hover:underline"
                    >
                      Create Account →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. REGISTER ACTIVITY */}
            {activeActivity === 'RegisterActivity' && (
              <div className="p-5 space-y-3.5">
                <h3 className="text-lg font-bold text-stone-900">
                  Create Customer Account
                </h3>
                <p className="text-xs text-stone-500">
                  Role is strictly enforced as "CUSTOMER" in Firebase Security
                  Rules.
                </p>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Nusrat Jahan"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    />
                    {regErrors.name && (
                      <p className="text-xs text-red-600 mt-1">
                        {regErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nusrat@student.edu.bd"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    />
                    {regErrors.email && (
                      <p className="text-xs text-red-600 mt-1">
                        {regErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="01712345678"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    />
                    {regErrors.phone && (
                      <p className="text-xs text-red-600 mt-1">
                        {regErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Default Delivery Address
                    </label>
                    <input
                      type="text"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="Road 12, Uttara Sector 4, Dhaka"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    />
                    {regErrors.address && (
                      <p className="text-xs text-red-600 mt-1">
                        {regErrors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                    />
                    {regErrors.password && (
                      <p className="text-xs text-red-600 mt-1">
                        {regErrors.password}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const errs = validateRegisterInput(
                        regName,
                        regEmail,
                        regPhone,
                        regAddress,
                        regPassword
                      );
                      setRegErrors(errs);
                      if (Object.keys(errs).length > 0) return;

                      onRegisterNewCustomer({
                        uid: `usr_${Date.now().toString().slice(-4)}`,
                        name: regName.trim(),
                        email: regEmail.trim(),
                        phone: regPhone.trim(),
                        role: 'CUSTOMER',
                        address: regAddress.trim(),
                        photoUrl: '',
                      });
                      showToast(
                        'Customer registered in Firebase Auth & fooddash/users!'
                      );
                      onSelectActivity('CustomerHomeActivity');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#F97316] text-white font-bold text-sm"
                  >
                    Register &amp; Start Ordering
                  </button>
                </div>
              </div>
            )}

            {/* 4. CUSTOMER HOME ACTIVITY */}
            {activeActivity === 'CustomerHomeActivity' && (
              <div className="p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      Hello, {currentUser.name.split(' ')[0]}!
                    </h3>
                    <p className="text-xs text-stone-500">
                      Delivering to: {currentUser.address}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={triggerAccelerometerShake}
                    className="px-2.5 py-1 rounded-lg bg-orange-100 text-[#EA580C] text-[11px] font-semibold flex items-center gap-1 shrink-0"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Shake Refresh</span>
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    aria-label="Search food items"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search burgers, kacchi biryani, pizza..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:border-[#F97316]"
                  />
                </div>

                {/* Category Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-[#F97316] text-white'
                          : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Food RecyclerView List */}
                <div className="space-y-2.5">
                  {customerFilteredFoods.map((food) => (
                    <div
                      key={food.foodId}
                      className="bg-white rounded-2xl border border-stone-200/90 p-3 flex gap-3 shadow-xs hover:border-orange-300 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFood(food);
                          setDetailQty(1);
                          onSelectActivity('FoodDetailsActivity');
                        }}
                        className="w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-orange-50"
                      >
                        <FoodSvgIllustration
                          imageKey={food.imageUrl}
                          name={food.name}
                        />
                      </button>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="text-[11px] font-semibold text-[#EA580C]">
                            {food.category} · {food.available ? 'Available' : 'Sold Out'}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFood(food);
                              setDetailQty(1);
                              onSelectActivity('FoodDetailsActivity');
                            }}
                            className="text-sm font-bold text-stone-900 hover:text-[#F97316] text-left truncate block w-full"
                          >
                            {food.name}
                          </button>
                          <p className="text-xs text-stone-500 line-clamp-1">
                            {food.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1.5">
                          <span className="text-sm font-extrabold text-stone-900 tabular-nums">
                            BDT {food.price}
                          </span>
                          <button
                            type="button"
                            disabled={!food.available}
                            onClick={() => {
                              onAddToCart(food, 1);
                              showToast(`${food.name} added to Cart!`);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                              food.available
                                ? 'bg-[#F97316] text-white hover:bg-[#EA580C]'
                                : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                            }`}
                          >
                            {food.available ? '+ Add to Cart' : 'Sold Out'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Navigation Bar */}
                <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => onSelectActivity('MyOrdersActivity')}
                    className="py-2 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    My Orders ({orders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectActivity('ProfileActivity')}
                    className="py-2 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      triggerImplicitIntent(
                        'ACTION_DIAL',
                        `tel:${settings.supportPhone}`,
                        'Dialing restaurant support hotline'
                      )
                    }
                    className="py-2 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Call Support
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      triggerImplicitIntent(
                        'ACTION_VIEW',
                        settings.websiteUrl,
                        'Opening FoodDash official website'
                      )
                    }
                    className="py-2 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Website
                  </button>
                </div>
              </div>
            )}

            {/* 5. FOOD DETAILS ACTIVITY */}
            {activeActivity === 'FoodDetailsActivity' && (
              <div className="p-4 space-y-4">
                <div className="w-full h-44 rounded-2xl overflow-hidden border border-stone-200 bg-orange-50">
                  <FoodSvgIllustration
                    imageKey={selectedFood.imageUrl}
                    name={selectedFood.name}
                  />
                </div>

                <div>
                  <div className="text-xs font-bold text-[#EA580C]">
                    {selectedFood.category} · Prep {selectedFood.prepTimeMinutes || 20} mins
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-900 mt-0.5">
                    {selectedFood.name}
                  </h3>
                  <div className="text-lg font-extrabold text-[#F97316] mt-1 tabular-nums">
                    BDT {selectedFood.price}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed mt-2">
                    {selectedFood.description}
                  </p>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-xs font-bold text-stone-700">
                    Select Quantity
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setDetailQty((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold tabular-nums">
                      {detailQty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setDetailQty((q) => q + 1)}
                      className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(selectedFood, detailQty);
                    showToast(
                      `Added ${detailQty}x ${selectedFood.name} to Cart`
                    );
                    onSelectActivity('CartActivity');
                  }}
                  className="w-full py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm shadow-xs"
                >
                  Add {detailQty} to Cart · BDT {selectedFood.price * detailQty}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    triggerImplicitIntent(
                      'ACTION_SEND',
                      `Check out ${selectedFood.name} for BDT ${selectedFood.price} on FoodDash!`,
                      'Sharing dish via Android Intent.ACTION_SEND'
                    )
                  }
                  className="w-full py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share This Dish (Implicit Intent)</span>
                </button>
              </div>
            )}

            {/* 6. CART ACTIVITY */}
            {activeActivity === 'CartActivity' && (
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-bold text-stone-900">
                  Shopping Cart (CartAdapter)
                </h3>

                {cart.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3">
                    <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto" />
                    <p className="text-sm font-semibold text-stone-700">
                      Your FoodDash cart is empty
                    </p>
                    <button
                      type="button"
                      onClick={() => onSelectActivity('CustomerHomeActivity')}
                      className="px-4 py-2 rounded-xl bg-[#F97316] text-white text-xs font-bold"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2.5">
                      {cart.map((item) => (
                        <div
                          key={item.foodId}
                          className="bg-white rounded-xl border border-stone-200 p-3 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-stone-900 truncate">
                              {item.name}
                            </div>
                            <div className="text-xs text-stone-500 tabular-nums">
                              BDT {item.price} each · Line: BDT{' '}
                              {item.price * item.quantity}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              aria-label={`Decrease ${item.name}`}
                              onClick={() => onUpdateCartQty(item.foodId, -1)}
                              className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase ${item.name}`}
                              onClick={() => onUpdateCartQty(item.foodId, 1)}
                              className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Remove ${item.name}`}
                              onClick={() => {
                                setAlertDialog({
                                  title: 'Remove Cart Item',
                                  message: `Remove ${item.name} from your cart?`,
                                  confirmLabel: 'Remove',
                                  onConfirm: () => {
                                    onRemoveCartItem(item.foodId);
                                    setAlertDialog(null);
                                    showToast(`${item.name} removed from cart`);
                                  },
                                });
                              }}
                              className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2">
                      <div className="flex justify-between text-xs text-stone-600">
                        <span>Subtotal</span>
                        <span className="font-semibold tabular-nums">
                          BDT {cartSubtotal}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-stone-600">
                        <span>Delivery Fee</span>
                        <span className="font-semibold tabular-nums">
                          BDT {cartDeliveryFee}
                        </span>
                      </div>
                      <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                        <span>Total Payable</span>
                        <span className="text-[#F97316] tabular-nums">
                          BDT {cartTotal}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectActivity('CheckoutActivity')}
                        className="w-full mt-3 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 7. CHECKOUT ACTIVITY */}
            {activeActivity === 'CheckoutActivity' && (
              <div className="p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-stone-900">
                    Checkout &amp; Payment
                  </h3>
                  <span className="text-sm font-extrabold text-[#F97316] tabular-nums">
                    BDT {cartTotal}
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
                  <div>
                    <label
                      htmlFor="checkout-address"
                      className="block text-xs font-semibold text-stone-700 mb-1"
                    >
                      Delivery Address
                    </label>
                    <input
                      id="checkout-address"
                      type="text"
                      value={checkoutAddress}
                      onChange={(e) => setCheckoutAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                    />
                    {checkoutErrors.deliveryAddress && (
                      <p className="text-xs text-red-600 mt-1">
                        {checkoutErrors.deliveryAddress}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-phone"
                      className="block text-xs font-semibold text-stone-700 mb-1"
                    >
                      Customer Phone Number
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                    />
                    {checkoutErrors.customerPhone && (
                      <p className="text-xs text-red-600 mt-1">
                        {checkoutErrors.customerPhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-stone-800 mb-2">
                      Select Payment Method (Section 5)
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        ['Cash on Delivery', 'bKash', 'Nagad'] as PaymentMethod[]
                      ).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => {
                            setPaymentMethod(method);
                            setCheckoutErrors({});
                          }}
                          className={`py-2 px-2 rounded-xl border text-xs font-bold transition-colors ${
                            paymentMethod === method
                              ? 'bg-[#F97316] text-white border-[#F97316]'
                              : 'bg-stone-50 text-stone-700 border-stone-200'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(paymentMethod === 'bKash' || paymentMethod === 'Nagad') && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                      <div className="text-xs font-bold text-amber-950">
                        {paymentMethod} Merchant Number:{' '}
                        <span className="font-mono">
                          {paymentMethod === 'bKash'
                            ? settings.bkashNumber
                            : settings.nagadNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        Send BDT {cartTotal} and enter your Transaction ID below.
                        Payment status will be set to{' '}
                        <strong className="font-mono">
                          PENDING_VERIFICATION
                        </strong>{' '}
                        for Admin review.
                      </p>
                      <div>
                        <label
                          htmlFor="trx-id-input"
                          className="block text-xs font-semibold text-amber-950 mb-1"
                        >
                          {paymentMethod} Transaction ID (TrxID)
                        </label>
                        <input
                          id="trx-id-input"
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="e.g. BKA98234X1"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-amber-300 text-xs font-mono uppercase"
                        />
                        {checkoutErrors.transactionId && (
                          <p className="text-xs text-red-600 font-semibold mt-1">
                            setError: "{checkoutErrors.transactionId}"
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (cart.length === 0) {
                        showToast('Cart is empty!');
                        return;
                      }
                      const errs = validateCheckoutInput(
                        checkoutAddress,
                        checkoutPhone,
                        paymentMethod,
                        transactionId
                      );
                      setCheckoutErrors(errs);
                      if (Object.keys(errs).length > 0) {
                        showToast(
                          'Validation error: Please check required fields'
                        );
                        return;
                      }
                      const created = onPlaceOrder({
                        paymentMethod,
                        transactionId,
                        deliveryAddress: checkoutAddress,
                        customerPhone: checkoutPhone,
                      });
                      setTransactionId('');
                      setSelectedOrderId(created.orderId);
                      showToast(
                        `Order #${created.orderId} saved to Firebase (${created.paymentStatus})!`
                      );
                      onSelectActivity('MyOrdersActivity');
                    }}
                    className="w-full py-3 rounded-xl bg-[#16A34A] hover:bg-green-700 text-white font-bold text-sm shadow-xs"
                  >
                    Confirm &amp; Place Order
                  </button>
                </div>
              </div>
            )}

            {/* 8. MY ORDERS ACTIVITY */}
            {activeActivity === 'MyOrdersActivity' && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-stone-900">
                    My Orders (Real-Time Listener)
                  </h3>
                  <button
                    type="button"
                    onClick={triggerAccelerometerShake}
                    className="text-xs font-semibold text-[#EA580C] hover:underline"
                  >
                    Shake to Refresh
                  </button>
                </div>

                <div className="space-y-2.5">
                  {orders.map((order) => (
                    <button
                      key={order.orderId}
                      type="button"
                      onClick={() => {
                        setSelectedOrderId(order.orderId);
                        onSelectActivity('OrderDetailsActivity');
                      }}
                      className="w-full text-left bg-white rounded-2xl border border-stone-200 p-3.5 space-y-1.5 hover:border-[#F97316] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-stone-900 font-mono">
                          Order #{order.orderId}
                        </span>
                        <span className="text-sm font-extrabold text-[#F97316] tabular-nums">
                          BDT {order.total}
                        </span>
                      </div>
                      <div className="text-xs text-stone-600">
                        Status:{' '}
                        <strong className="text-[#16A34A]">
                          {order.status}
                        </strong>{' '}
                        · Payment:{' '}
                        <strong className="font-mono">
                          {order.paymentStatus}
                        </strong>
                      </div>
                      <div className="text-xs text-stone-500 truncate">
                        {order.paymentMethod}
                        {order.transactionId
                          ? ` · TrxID: ${order.transactionId}`
                          : ''}{' '}
                        · {order.items.length} item(s)
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 9. ORDER DETAILS ACTIVITY */}
            {activeActivity === 'OrderDetailsActivity' && activeOrder && (
              <div className="p-4 space-y-4">
                <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-stone-900 font-mono">
                      Order #{activeOrder.orderId}
                    </h3>
                    <span className="text-xs font-bold text-[#16A34A]">
                      {activeOrder.status}
                    </span>
                  </div>

                  <div className="text-xs text-stone-600 space-y-1">
                    <div>
                      Customer: <strong>{activeOrder.customerName}</strong> (
                      {activeOrder.customerPhone})
                    </div>
                    <div>Address: {activeOrder.deliveryAddress}</div>
                    <div>
                      Payment: <strong>{activeOrder.paymentMethod}</strong> ·{' '}
                      <span className="font-mono font-semibold text-amber-800">
                        {activeOrder.paymentStatus}
                      </span>
                    </div>
                    {activeOrder.transactionId && (
                      <div>
                        Transaction ID:{' '}
                        <span className="font-mono font-bold">
                          {activeOrder.transactionId}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-stone-200 pt-2.5 space-y-1.5">
                    <div className="text-xs font-bold text-stone-800">
                      Ordered Items:
                    </div>
                    {activeOrder.items.map((item) => (
                      <div
                        key={item.foodId}
                        className="flex justify-between text-xs text-stone-700"
                      >
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-mono tabular-nums">
                          BDT {item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-extrabold text-stone-900">
                    <span>Total Paid / Due (incl. BDT 60 delivery)</span>
                    <span className="text-[#F97316] tabular-nums">
                      BDT {activeOrder.total}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      triggerImplicitIntent(
                        'ACTION_DIAL',
                        `tel:${settings.supportPhone}`,
                        'Calling FoodDash Delivery Hotline'
                      )
                    }
                    className="py-2.5 rounded-xl bg-[#F97316] text-white font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Hotline</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      triggerImplicitIntent(
                        'ACTION_SEND',
                        `FoodDash Order #${activeOrder.orderId} | Status: ${activeOrder.status} | Total: BDT ${activeOrder.total}`,
                        'Sharing Order Receipt via ACTION_SEND'
                      )
                    }
                    className="py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Receipt</span>
                  </button>
                </div>
              </div>
            )}

            {/* 10. PROFILE ACTIVITY */}
            {activeActivity === 'ProfileActivity' && (
              <div className="p-4 space-y-4">
                <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-orange-100 border-2 border-[#F97316] flex items-center justify-center mb-2">
                    {profilePhotoUrl &&
                    profilePhotoUrl.startsWith('data:image') ? (
                      <img
                        src={profilePhotoUrl}
                        alt={profileName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-[#F97316]" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => openPhotoPickerIntent('PROFILE')}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Take / Pick Profile Photo (Req #10)</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                    />
                    {profileErrors.name && (
                      <p className="text-xs text-red-600 mt-1">
                        {profileErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                    />
                  </div>

                  <label className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs font-semibold text-stone-800 cursor-pointer">
                    <span>Enable Shake-to-Refresh (SharedPreferences)</span>
                    <input
                      type="checkbox"
                      checked={shakeToRefreshEnabled}
                      onChange={(e) =>
                        onToggleShakeToRefresh(e.target.checked)
                      }
                      className="rounded text-[#F97316]"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      if (!profileName.trim()) {
                        setProfileErrors({ name: 'Name is required' });
                        return;
                      }
                      setProfileErrors({});
                      onUpdateUserProfile({
                        ...currentUser,
                        name: profileName.trim(),
                        phone: profilePhone.trim(),
                        address: profileAddress.trim(),
                        photoUrl: profilePhotoUrl,
                      });
                      showToast('Profile saved to Firebase users node!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#F97316] text-white font-bold text-xs"
                  >
                    Save Profile Changes
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectActivity('LoginActivity');
                      showToast('FirebaseAuth.getInstance().signOut() complete');
                    }}
                    className="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* 11. ADMIN DASHBOARD ACTIVITY (Dark Green #17251F) */}
            {activeActivity === 'AdminDashboardActivity' && (
              <div className="p-5 space-y-4">
                <div>
                  <div className="text-xs font-mono text-emerald-300">
                    Role Verified: ADMIN ({currentUser.name})
                  </div>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">
                    Restaurant Admin Dashboard
                  </h3>
                </div>

                {/* Sales Summary Hero Card */}
                <div className="rounded-2xl bg-[#21352C] border border-emerald-800/60 p-4">
                  <div className="text-xs text-emerald-200">
                    Sales Summary (Total Revenue)
                  </div>
                  <div className="text-2xl font-extrabold text-[#F97316] mt-1 tabular-nums">
                    BDT {adminStats.salesSummaryTotal}
                  </div>
                  <div className="text-[11px] text-emerald-300/80 mt-1">
                    {adminStats.pendingPaymentVerifications} order(s) awaiting
                    manual bKash/Nagad TrxID verification
                  </div>
                </div>

                {/* 4 KPI Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#21352C] border border-emerald-800/50 p-3.5">
                    <div className="text-xs text-emerald-200">Total Orders</div>
                    <div className="text-xl font-extrabold text-white mt-1 tabular-nums">
                      {adminStats.totalOrders}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#21352C] border border-emerald-800/50 p-3.5">
                    <div className="text-xs text-amber-300">Pending Orders</div>
                    <div className="text-xl font-extrabold text-white mt-1 tabular-nums">
                      {adminStats.pendingOrders}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#21352C] border border-emerald-800/50 p-3.5">
                    <div className="text-xs text-emerald-300">
                      Completed Orders
                    </div>
                    <div className="text-xl font-extrabold text-white mt-1 tabular-nums">
                      {adminStats.completedOrders}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[#21352C] border border-emerald-800/50 p-3.5">
                    <div className="text-xs text-emerald-200">
                      Total Food Products
                    </div>
                    <div className="text-xl font-extrabold text-white mt-1 tabular-nums">
                      {adminStats.totalFoodProducts}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectActivity('ManageFoodActivity')}
                    className="w-full py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>Manage Food Products (CRUD + FAB)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectActivity('AdminOrdersActivity')}
                    className="w-full py-3 rounded-xl bg-[#16A34A] hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      Incoming Orders &amp; Verify Payments ({orders.length})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectActivity('LoginActivity')}
                    className="w-full py-2.5 rounded-xl bg-red-600/90 text-white font-bold text-xs"
                  >
                    Logout Admin
                  </button>
                </div>
              </div>
            )}

            {/* 12. MANAGE FOOD ACTIVITY (Admin CRUD + FAB + AlertDialog) */}
            {activeActivity === 'ManageFoodActivity' && (
              <div className="p-4 space-y-3 relative pb-20">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-900">
                    Food Inventory (Requirement #6 CRUD)
                  </h3>
                  <button
                    type="button"
                    onClick={openAddFoodActivity}
                    className="px-3 py-1.5 rounded-lg bg-[#F97316] text-white text-xs font-bold"
                  >
                    + Add Food
                  </button>
                </div>

                <input
                  type="text"
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  placeholder="Search food inventory by name or category..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs"
                />

                <div className="space-y-2.5">
                  {adminFilteredFoods.map((food) => (
                    <div
                      key={food.foodId}
                      className="bg-white rounded-xl border border-stone-200 p-3 flex items-center gap-3"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <FoodSvgIllustration
                          imageKey={food.imageUrl}
                          name={food.name}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-stone-900 truncate">
                          {food.name}
                        </div>
                        <div className="text-[11px] text-stone-500 tabular-nums">
                          {food.category} · BDT {food.price}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              onToggleFoodAvailability(food.foodId);
                              showToast(
                                `Toggled ${food.name} availability in Firebase!`
                              );
                            }}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              food.available
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {food.available ? 'Available' : 'Sold Out'}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditFoodActivity(food)}
                            className="px-2 py-0.5 rounded bg-orange-50 text-[#EA580C] border border-orange-200 text-[11px] font-semibold flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setAlertDialog({
                                title: 'Delete Food Item (AlertDialog)',
                                message: `Are you sure you want to permanently delete "${food.name}" from fooddash/food?`,
                                confirmLabel: 'Delete',
                                onConfirm: () => {
                                  onDeleteFood(food.foodId);
                                  setAlertDialog(null);
                                  showToast(`${food.name} deleted from Firebase`);
                                },
                              });
                            }}
                            className="px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 text-[11px] font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FloatingActionButton (FAB) */}
                <button
                  type="button"
                  aria-label="FloatingActionButton Add Food"
                  onClick={openAddFoodActivity}
                  className="fixed lg:absolute bottom-5 right-5 w-12 h-12 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white shadow-lg flex items-center justify-center"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* 13. ADD / EDIT FOOD ACTIVITY */}
            {activeActivity === 'AddEditFoodActivity' && (
              <div className="p-4 space-y-3.5">
                <h3 className="text-lg font-bold text-stone-900">
                  {editingFood ? 'Edit Food Product' : 'Add New Food Product'}
                </h3>

                <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
                  <div className="w-full h-32 rounded-xl overflow-hidden bg-orange-50 border border-stone-200">
                    <FoodSvgIllustration
                      imageKey={foodFormImageKey}
                      name={foodFormName || 'Preview'}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => openPhotoPickerIntent('FOOD')}
                    className="w-full py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center justify-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Pick Food Image from Camera / Gallery (Req #10)</span>
                  </button>

                  <div>
                    <label
                      htmlFor="food-name-input"
                      className="block text-xs font-semibold text-stone-700 mb-1"
                    >
                      Food Name
                    </label>
                    <input
                      id="food-name-input"
                      type="text"
                      value={foodFormName}
                      onChange={(e) => setFoodFormName(e.target.value)}
                      placeholder="e.g. Dhaka Naga Beef Tehari"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                    />
                    {foodFormErrors.name && (
                      <p className="text-xs text-red-600 mt-1">
                        setError: "{foodFormErrors.name}"
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="food-desc-input"
                      className="block text-xs font-semibold text-stone-700 mb-1"
                    >
                      Food Description
                    </label>
                    <textarea
                      id="food-desc-input"
                      rows={2}
                      value={foodFormDesc}
                      onChange={(e) => setFoodFormDesc(e.target.value)}
                      placeholder="Aromatic mustard oil beef tehari with green chilies..."
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                    />
                    {foodFormErrors.description && (
                      <p className="text-xs text-red-600 mt-1">
                        setError: "{foodFormErrors.description}"
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        htmlFor="food-price-input"
                        className="block text-xs font-semibold text-stone-700 mb-1"
                      >
                        Price (BDT)
                      </label>
                      <input
                        id="food-price-input"
                        type="number"
                        value={foodFormPrice}
                        onChange={(e) => setFoodFormPrice(e.target.value)}
                        placeholder="350"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                      />
                      {foodFormErrors.price && (
                        <p className="text-xs text-red-600 mt-1">
                          setError: "{foodFormErrors.price}"
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="food-cat-select"
                        className="block text-xs font-semibold text-stone-700 mb-1"
                      >
                        Category
                      </label>
                      <select
                        id="food-cat-select"
                        value={foodFormCategory}
                        onChange={(e) => setFoodFormCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white"
                      >
                        {categories
                          .filter((c) => c !== 'All')
                          .map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-stone-700">
                    <input
                      type="checkbox"
                      checked={foodFormAvailable}
                      onChange={(e) => setFoodFormAvailable(e.target.checked)}
                    />
                    <span>Available for Customer Ordering</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const errs = validateFoodInput(
                        foodFormName,
                        foodFormDesc,
                        foodFormPrice,
                        foodFormCategory
                      );
                      setFoodFormErrors(errs);
                      if (Object.keys(errs).length > 0) return;

                      onSaveFood({
                        foodId:
                          editingFood?.foodId ||
                          `food_${Date.now().toString().slice(-4)}`,
                        name: foodFormName.trim(),
                        description: foodFormDesc.trim(),
                        price: Number(foodFormPrice),
                        category: foodFormCategory,
                        imageUrl: foodFormImageKey,
                        available: foodFormAvailable,
                      });
                      showToast(
                        editingFood
                          ? 'Food item updated in Firebase!'
                          : 'New food item added to Firebase!'
                      );
                      onSelectActivity('ManageFoodActivity');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#F97316] text-white font-bold text-xs"
                  >
                    Save Food Product to Firebase
                  </button>
                </div>
              </div>
            )}

            {/* 14. ADMIN ORDERS ACTIVITY */}
            {activeActivity === 'AdminOrdersActivity' && (
              <div className="p-4 space-y-3">
                <h3 className="text-base font-bold text-stone-900">
                  Incoming Orders &amp; Payment Verification
                </h3>

                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="bg-white rounded-2xl border border-stone-200 p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-stone-900 font-mono">
                          #{order.orderId} · {order.customerName}
                        </span>
                        <span className="text-sm font-extrabold text-[#F97316] tabular-nums">
                          BDT {order.total}
                        </span>
                      </div>

                      <div className="text-xs text-stone-600">
                        Phone: {order.customerPhone} · {order.deliveryAddress}
                      </div>

                      <div className="text-xs text-stone-700 font-medium">
                        Status:{' '}
                        <span className="font-bold text-[#16A34A]">
                          {order.status}
                        </span>{' '}
                        · Payment:{' '}
                        <span className="font-mono font-bold text-amber-800">
                          {order.paymentMethod} ({order.paymentStatus})
                        </span>
                        {order.transactionId && (
                          <span className="block font-mono text-xs text-stone-900 mt-0.5">
                            Submitted TrxID: {order.transactionId}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {order.paymentStatus === 'PENDING_VERIFICATION' && (
                          <button
                            type="button"
                            onClick={() => {
                              setAlertDialog({
                                title: `Verify ${order.paymentMethod} Payment`,
                                message: `Customer: ${order.customerName}\nTotal: BDT ${order.total}\nSubmitted TrxID: ${order.transactionId}\n\nConfirm this transaction reference in your ${order.paymentMethod} merchant statement?`,
                                confirmLabel: 'Mark VERIFIED',
                                secondaryLabel: 'Reject Payment',
                                onConfirm: () => {
                                  onVerifyPayment(order.orderId, true);
                                  setAlertDialog(null);
                                  showToast(
                                    `Order #${order.orderId} payment marked VERIFIED!`
                                  );
                                },
                                onSecondary: () => {
                                  onVerifyPayment(order.orderId, false);
                                  setAlertDialog(null);
                                  showToast(
                                    `Order #${order.orderId} payment REJECTED`
                                  );
                                },
                              });
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold"
                          >
                            Verify TrxID ({order.transactionId})
                          </button>
                        )}

                        {(
                          [
                            'ACCEPTED',
                            'PREPARING',
                            'OUT_FOR_DELIVERY',
                            'DELIVERED',
                            'REJECTED',
                          ] as OrderStatus[]
                        ).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => {
                              onUpdateOrderStatus(order.orderId, st);
                              showToast(
                                `Order #${order.orderId} updated to ${st}`
                              );
                            }}
                            className={`px-2 py-1 rounded-lg text-[11px] font-semibold border ${
                              order.status === st
                                ? 'bg-[#17251F] text-white border-[#17251F]'
                                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Android AlertDialog Overlay (Requirement #6) */}
          {alertDialog && (
            <div
              role="dialog"
              aria-modal="true"
              className="absolute inset-0 bg-black/55 flex items-center justify-center p-5 z-20"
            >
              <div className="bg-white rounded-2xl p-5 w-full max-w-[340px] shadow-xl space-y-3">
                <h4 className="text-base font-bold text-stone-900">
                  {alertDialog.title}
                </h4>
                <p className="text-xs text-stone-600 whitespace-pre-line leading-relaxed">
                  {alertDialog.message}
                </p>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAlertDialog(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  {alertDialog.secondaryLabel && alertDialog.onSecondary && (
                    <button
                      type="button"
                      onClick={alertDialog.onSecondary}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 text-white text-xs font-semibold"
                    >
                      {alertDialog.secondaryLabel}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={alertDialog.onConfirm}
                    className="px-3.5 py-1.5 rounded-lg bg-[#F97316] text-white text-xs font-bold"
                  >
                    {alertDialog.confirmLabel}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Android Toast / Snackbar Message */}
          {toastMessage && (
            <div className="absolute bottom-12 left-4 right-4 bg-stone-900/95 text-white text-xs font-medium px-3.5 py-2.5 rounded-xl shadow-lg flex items-center justify-between z-10">
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Android System Navigation Pill */}
          <div className="py-2 bg-stone-900 flex justify-center shrink-0">
            <div className="w-28 h-1 rounded-full bg-stone-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
