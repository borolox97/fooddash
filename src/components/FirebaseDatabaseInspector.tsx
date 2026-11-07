import React, { useState } from 'react';
import { Database, Shield, HardDrive, Copy, Check } from 'lucide-react';
import {
  FoodModel,
  OrderModel,
  RestaurantSettings,
  UserModel,
  CartItemModel,
} from '../utils/fooddashLogic';
import { XML_AND_CONFIG_FILES } from '../data/androidProject/xmlLayoutsSource';

interface FirebaseDatabaseInspectorProps {
  users: Record<string, UserModel>;
  foods: FoodModel[];
  categories: string[];
  orders: OrderModel[];
  settings: RestaurantSettings;
  rememberMe: boolean;
  shakeToRefreshEnabled: boolean;
  currentUser: UserModel;
  cart: CartItemModel[];
}

export const FirebaseDatabaseInspector: React.FC<
  FirebaseDatabaseInspectorProps
> = ({
  users,
  foods,
  categories,
  orders,
  settings,
  rememberMe,
  shakeToRefreshEnabled,
  currentUser,
  cart,
}) => {
  const [selectedNode, setSelectedNode] = useState<
    'ALL' | 'users' | 'food' | 'categories' | 'orders' | 'settings' | 'rules'
  >('ALL');
  const [copied, setCopied] = useState<boolean>(false);

  const foodMap: Record<string, FoodModel> = {};
  foods.forEach((f) => {
    foodMap[f.foodId] = f;
  });

  const ordersMap: Record<string, OrderModel> = {};
  orders.forEach((o) => {
    ordersMap[o.orderId] = o;
  });

  const fullDatabaseTree = {
    fooddash: {
      users,
      food: foodMap,
      categories,
      orders: ordersMap,
      settings,
    },
  };

  const rulesFile = XML_AND_CONFIG_FILES.find(
    (f) => f.name === 'database.rules.json'
  );

  const getDisplayedJson = () => {
    if (selectedNode === 'rules') {
      return rulesFile?.content || '';
    }
    if (selectedNode === 'ALL') {
      return JSON.stringify(fullDatabaseTree, null, 2);
    }
    return JSON.stringify(
      { [selectedNode]: fullDatabaseTree.fooddash[selectedNode] },
      null,
      2
    );
  };

  const sharedPreferencesSnapshot = {
    PREF_NAME: 'FoodDashPrefs (Context.MODE_PRIVATE)',
    remember_me: rememberMe,
    saved_email: rememberMe ? currentUser.email : '',
    user_role: currentUser.role,
    user_name: currentUser.name,
    shake_to_refresh_enabled: shakeToRefreshEnabled,
    cart_items_json: cart,
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(getDisplayedJson());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-5">
        <h2 className="text-xl font-bold text-stone-900">
          Firebase Realtime Database &amp; SharedPreferences Inspector
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Every action performed in the Android simulator updates this live{' '}
          <code className="font-mono text-[#EA580C]">fooddash/</code> tree and{' '}
          <code className="font-mono text-[#EA580C]">SharedPreferences</code>{' '}
          storage in real time (Requirements #7, #8, #9). You can also export this JSON to seed your own Firebase Console directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Node Selector & SharedPreferences */}
        <div className="lg:col-span-5 space-y-5">
          {/* Node Filter Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
              <Database className="w-4 h-4 text-[#F97316]" />
              <span>Realtime Database Nodes (fooddash/)</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'ALL', label: 'fooddash/ (Full Tree)' },
                { id: 'users', label: `users/ (${Object.keys(users).length})` },
                { id: 'food', label: `food/ (${foods.length})` },
                { id: 'categories', label: `categories/ (${categories.length})` },
                { id: 'orders', label: `orders/ (${orders.length})` },
                { id: 'settings', label: 'settings/' },
              ].map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNode(node.id as typeof selectedNode)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold text-left transition-colors ${
                    selectedNode === node.id
                      ? 'bg-[#F97316] text-white'
                      : 'bg-stone-50 text-stone-800 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {node.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedNode('rules')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                selectedNode === 'rules'
                  ? 'bg-[#17251F] text-white'
                  : 'bg-emerald-50 text-emerald-950 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Shield className="w-4 h-4 text-[#16A34A]" />
              <span>View Firebase Security Rules (database.rules.json)</span>
            </button>
          </div>

          {/* Requirement #9 SharedPreferences Live State */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
              <HardDrive className="w-4 h-4 text-[#EA580C]" />
              <span>SharedPreferences (SessionManager.java)</span>
            </div>
            <p className="text-xs text-stone-500">
              Local phone storage XML file:{' '}
              <code className="font-mono">
                /data/data/com.fooddash.app/shared_prefs/FoodDashPrefs.xml
              </code>
            </p>
            <pre className="p-3.5 rounded-xl bg-stone-900 text-stone-100 text-xs font-mono overflow-x-auto">
              <code>{JSON.stringify(sharedPreferencesSnapshot, null, 2)}</code>
            </pre>
          </div>
        </div>

        {/* Right Column: Live JSON Tree / Security Rules */}
        <div className="lg:col-span-7 bg-stone-950 text-stone-100 rounded-2xl border border-stone-800 overflow-hidden">
          <div className="px-5 py-3.5 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
            <div className="text-xs font-mono font-bold text-amber-400">
              {selectedNode === 'rules'
                ? 'database.rules.json (Role-Based Security Rules)'
                : `https://fooddash-default-rtdb.firebaseio.com/fooddash/${
                    selectedNode === 'ALL' ? '' : selectedNode
                  }.json`}
            </div>
            <button
              type="button"
              onClick={handleCopyJson}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied JSON</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-5 text-xs font-mono leading-relaxed overflow-x-auto max-h-[580px] overflow-y-auto text-emerald-300">
            <code>{getDisplayedJson()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
