package com.fooddash.app.helpers;

import android.content.Context;
import android.content.SharedPreferences;
import com.fooddash.app.models.CartItem;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

/**
 * SessionManager satisfies Requirement #9: Save settings on the phone using SharedPreferences.
 * Stores Remember Me, cached user role, last delivery address, shake-to-refresh toggle, and cart items.
 */
public class SessionManager {
    private static final String PREF_NAME = "FoodDashPrefs";
    private static final String KEY_REMEMBER_ME = "remember_me";
    private static final String KEY_SAVED_EMAIL = "saved_email";
    private static final String KEY_USER_ROLE = "user_role";
    private static final String KEY_USER_NAME = "user_name";
    private static final String KEY_SHAKE_ENABLED = "shake_to_refresh_enabled";
    private static final String KEY_CART_JSON = "cart_items_json";

    private final SharedPreferences prefs;
    private final SharedPreferences.Editor editor;
    private final Gson gson;

    public SessionManager(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = prefs.edit();
        gson = new Gson();
    }

    public void setRememberMe(boolean remember, String email) {
        editor.putBoolean(KEY_REMEMBER_ME, remember);
        editor.putString(KEY_SAVED_EMAIL, remember ? email : "");
        editor.apply();
    }

    public boolean isRememberMeEnabled() {
        return prefs.getBoolean(KEY_REMEMBER_ME, true);
    }

    public String getSavedEmail() {
        return prefs.getString(KEY_SAVED_EMAIL, "");
    }

    public void saveUserSession(String name, String role) {
        editor.putString(KEY_USER_NAME, name);
        editor.putString(KEY_USER_ROLE, role);
        editor.apply();
    }

    public String getUserRole() {
        return prefs.getString(KEY_USER_ROLE, "CUSTOMER");
    }

    public String getUserName() {
        return prefs.getString(KEY_USER_NAME, "");
    }

    public void setShakeToRefreshEnabled(boolean enabled) {
        editor.putBoolean(KEY_SHAKE_ENABLED, enabled);
        editor.apply();
    }

    public boolean isShakeToRefreshEnabled() {
        return prefs.getBoolean(KEY_SHAKE_ENABLED, true);
    }

    public void saveCartItems(List<CartItem> items) {
        editor.putString(KEY_CART_JSON, gson.toJson(items));
        editor.apply();
    }

    public List<CartItem> getCartItems() {
        String json = prefs.getString(KEY_CART_JSON, null);
        if (json == null || json.isEmpty()) {
            return new ArrayList<>();
        }
        Type type = new TypeToken<ArrayList<CartItem>>() {}.getType();
        return gson.fromJson(json, type);
    }

    public void clearCart() {
        editor.remove(KEY_CART_JSON).apply();
    }

    public void clearSessionOnLogout() {
        boolean remember = isRememberMeEnabled();
        String savedEmail = getSavedEmail();
        editor.clear();
        editor.putBoolean(KEY_REMEMBER_ME, remember);
        editor.putString(KEY_SAVED_EMAIL, savedEmail);
        editor.apply();
    }
}
