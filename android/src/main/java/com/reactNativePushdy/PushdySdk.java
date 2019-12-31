package com.reactNativePushdy;

import android.app.Notification;
import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.common.LifecycleState;
import com.pushdy.Pushdy;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Timer;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;


public class PushdySdk {
  private static String TAG = "RNPushdySdk";
  private static PushdySdk instance = null;

  private ReactApplicationContext reactContext = null;
  private ReactContextBaseJavaModule baseJavaModule = null;

  /**
   * Lazy info
   */
  private String clientKey;
  private android.content.Context mainAppContext;
  private Integer smallIcon;

  /**
   * onRemoteNotificationRegistered fired when react context was not ready
   * OR when react-native-pushdy's JS thread have not subscribed to event
   * The result is your event will be fired and forgot,
   * Because of that, we change onRemoteNotificationRegistered to isRemoteNotificationRegistered
   */
  private boolean isRemoteNotificationRegistered = false;

  public static PushdySdk getInstance() {
    if (instance == null) instance = new PushdySdk();

    return instance;
  }

  public PushdySdk setReactBaseModule(ReactContextBaseJavaModule module) {
    this.baseJavaModule = module;

    return this;
  }

  public PushdySdk setReactContext(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;

    return this;
  }

  public PushdySdk initNativeSDK() {
    Log.d(TAG, "initNativeSDK: ");
    if (this.smallIcon != null) {
      this.initWithContext(this.clientKey, this.mainAppContext, this.smallIcon);
    } else {
      this.initWithContext(this.clientKey, this.mainAppContext);
    }

    return this;
  }

  public void lazyInitWithContext(String clientKey, android.content.Context mainAppContext, Integer smallIcon) {
    Log.e(TAG, "lazyInitWithContext: lazyInitWithContext");
    this.clientKey = clientKey;
    this.mainAppContext = mainAppContext;
    this.smallIcon = smallIcon;
  }

  /**
   * Call initWithContext from MainApplication.java to init sdk
   */
  public void initWithContext(String clientKey, android.content.Context mainAppContext) {
//    Pushdy.initWith(mainAppContext, clientKey, this);
//    Pushdy.registerForRemoteNotification();
//    Pushdy.setBadgeOnForeground(true);
    PushdyModule instance = PushdyModule.getInstance();
    if (instance != null) {
      // instance.initWithContext(clientKey, mainAppContext);
      instance.initWithContext(clientKey, mainAppContext);
    } else {
      Log.e(TAG, "initWithContext: Native module was not initialized");
    }
  }

  public void initWithContext(String clientKey, android.content.Context mainAppContext, Integer smallIcon) {
//    Pushdy.initWith(mainAppContext, clientKey, this, smallIcon);
//    Pushdy.registerForRemoteNotification();
//    Pushdy.setBadgeOnForeground(true);
    PushdyModule instance = PushdyModule.getInstance();
    if (instance != null) {
      instance.initWithContext(clientKey, mainAppContext, smallIcon);
    } else {
      Log.e(TAG, "initWithContext: Native module was not initialized");
    }
  }

  /**
   * ===========  Pushdy methods: Messaging ===========
   */

  public boolean isRemoteNotificationRegistered() {
    return this.isRemoteNotificationRegistered;
  }
  public void setRemoteNotificationRegistered(boolean enable) {
    this.isRemoteNotificationRegistered = enable;
  }

  public boolean isNotificationEnabled() {
    Log.d("RNPushdy", "isNotificationEnabled: And event subscribers is ready");
    return Pushdy.isNotificationEnabled();
  }

  public void setBadgeOnForeground(boolean enable) {
    Pushdy.setBadgeOnForeground(enable);
  }

  public void setPushBannerAutoDismiss(boolean autoDismiss) {
     Pushdy.setPushBannerAutoDismiss(autoDismiss);
  }

  public void setPushBannerDismissDuration(Float sec) {
     Pushdy.setPushBannerDismissDuration(sec);
  }

  public void setCustomPushBanner(View view) {
     Pushdy.setCustomPushBanner(view);
  }

  public void setCustomMediaKey(String mediaKey) {
     // Pushdy.setCustomMediaKey(mediaKey);
  }

  /**
   * ========= Pushdy methods: Anylytics + tracking =============
   */
  public void setDeviceId(String deviceId) {
    Pushdy.setDeviceID(deviceId);
  }

  public String getDeviceId() {
    return Pushdy.getDeviceID();
  }

  public String getDeviceToken() {
    return Pushdy.getDeviceToken();
  }

  public WritableMap getPendingNotification() {
    String notification = Pushdy.getPendingNotification();

    if (notification == null) {
      return null;
    }

    WritableMap data = new WritableNativeMap();

    try {
      JSONObject jo = new JSONObject(notification);
      data = ReactNativeJson.convertJsonToMap(jo);
    } catch (JSONException e) {
      e.printStackTrace();
      Log.e("RNPushdy", "getPendingNotification Exception " + e.getMessage());
    }

    return data;
  }

  public List<WritableMap> getPendingNotifications() {
    List<String> notifications = Pushdy.getPendingNotifications();
    List<WritableMap> items = new ArrayList();
    for (String notification : notifications) {
      WritableMap data = new WritableNativeMap();
      try {
        JSONObject jo = new JSONObject(notification);
        data = ReactNativeJson.convertJsonToMap(jo);
      } catch (JSONException e) {
        e.printStackTrace();
        Log.e("RNPushdy", "getPendingNotification Exception " + e.getMessage());
      }

      items.add(data);
    }

    return items;
  }

  public void setAttribute(String attr, Object value) {
    Pushdy.setAttribute(attr, value);
  }

  public void pushAttribute(String attr, Object value, boolean commitImmediately) {
    Pushdy.pushAttribute(attr, value, commitImmediately);
  }

  public String getPlayerID() {
    return Pushdy.getPlayerID();
  }
}
