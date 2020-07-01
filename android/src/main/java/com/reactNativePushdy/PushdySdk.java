package com.reactNativePushdy;

import android.app.Notification;
import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
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


public class PushdySdk implements Pushdy.PushdyDelegate {
  private static PushdySdk instance = null;
  private ReactApplicationContext reactContext = null;

  private android.content.Context mainAppContext = null;
  private Integer smallIcon = null;

  /**
   * onRemoteNotificationRegistered fired when react context was not ready
   * OR when react-native-pushdy's JS thread have not subscribed to event
   * The result is your event will be fired and forgot,
   * Because of that, we change onRemoteNotificationRegistered to isRemoteNotificationRegistered
   */
  private boolean isRemoteNotificationRegistered = false;
  private boolean readyForHandlingNotification = true;

  /**
   * This is list of event name those JS was already subscribed
   * Save this list to ensure that event will be sent to JS successfully
   *
   * - If this set size = 0 then JS event handler was not ready
   * - A default `enableFlag` event was subscribed to ensure that Set size always > 0 if JS was ready to handle
   *   So If RNPushdyJS subscribe to no event, we will subscribe to default `enableFlag` event
   */
  private Set<String> subscribedEventNames = new HashSet<>();

  public static PushdySdk getInstance() {
    if (instance == null) instance = new PushdySdk();

    return instance;
  }

  public PushdySdk setReactContext(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;

    return this;
  }

  /**
   * Call initWithContext from MainApplication.java to init sdk
   */
  public void registerSdk(String clientKey, android.content.Context mainAppContext, Integer smallIcon) {
    Pushdy.setNullDeviceID();
    if (smallIcon != null) {
      Pushdy.initWith(mainAppContext, clientKey, this, smallIcon);
    } else {
      Pushdy.initWith(mainAppContext, clientKey, this);
    }
    Pushdy.registerForRemoteNotification();
    Pushdy.setBadgeOnForeground(true);
  }

  public void initPushdy(ReadableMap options) throws Exception {
    String deviceId = "";
    if (!options.hasKey("deviceId")) {
      throw new Exception("RNPushdy.initPushdy: Invalid param: options.deviceId is required");
    } else {
      deviceId = options.getString("deviceId");

      if (deviceId == null || deviceId == "") {
        throw new Exception("RNPushdy.initPushdy: Invalid param: options.deviceId cannot be empty");
      }
    }

    this.setDeviceId(deviceId);
  }

  private void sendEvent(String eventName) {
    this.sendEvent(eventName, null);
  }

  /**
   * Send event from native to JsThread
   * If the reactConetext has not available yet, => retry
   */
  private void sendEvent(String eventName, @Nullable WritableMap params) {
    sendEvent(eventName, params, 0);
  }

  private void sendEvent(String eventName, @Nullable WritableMap params, int retryCount) {
    long delayRetry = 1000L;
    int maxRetry = 5;
    if (this.reactContext != null) {
      /**
       * When you wake up your app from BG/closed state,
       * JS thread might not be available or ready to receive event
       */
      LifecycleState jsThreadState = this.reactContext.getLifecycleState();
      boolean reactActivated = this.reactContext.hasActiveCatalystInstance();
      boolean jsHandlerReady = this.subscribedEventNames.size() > 0;
      boolean jsSubscribeThisEvent = this.subscribedEventNames.contains(eventName);

      // Log.d("RNPushdy", "this.subscribedEventNames.size() = " + this.subscribedEventNames.size());
//       Log.d("RNPushdy", "jsThreadState = " + jsThreadState);
//       Log.d("RNPushdy", "reactActivated = " + Boolean.toString(reactActivated));
       Log.d("RNPushdy", "jsHandlerReady = " + Integer.toString(this.subscribedEventNames.size()));
       Log.d("RNPushdy", "subscribedEventNames = " + this.subscribedEventNames.toString());

      if (reactActivated && jsThreadState == LifecycleState.RESUMED) {
        if (jsHandlerReady) {
          // Delay for some second to ensure react context work
          if (jsSubscribeThisEvent) {
            // this.sendEventWithDelay(eventName, params, 0);
            this.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
            Log.d("RNPushdy", "sendEvent: Emitted: " + eventName);
          } else {
            Log.d("RNPushdy", "sendEvent: Skip because JS not register the " + eventName);
          }

          // exit function to Prevent retry
          return;
        } else {
          // Continue to Retry section
          // JS handle was ready so we increase the retry interval
          delayRetry = 300L;
          maxRetry = 100; // around 30 secs
        }
      } else {
        // if (!reactActivated) {
        //   // Reset if subscribedEventNames JS is not ready
        //   this.subscribedEventNames = new HashSet<>();
        // }
        // continue to retry section
      }
    }

    // ====== If cannot send then retry: ====

    Log.e("RNPushdy", "sendEvent: " + eventName + " was skipped because reactContext is null or not ready");

    // We decide to avoid retry
    // In case of app in BG, this will retry forever
    // I already implement retryCount to prevent retry over 5 times

    /**
     * Retry after 1s
     * NOTE: You must do this in non-blocking mode to ensure program
     * will continue to run without any dependant on this code
     */
    SentEventTimerTask task = new SentEventTimerTask() {
      public void run() {
        if (getRetryCount() >= getMaxRetryCount()) {
          Log.e("RNPushdy", "[" + Thread.currentThread().getName() + "] " + this.getEventName() + " skipped after " + getRetryCount() + "  times retry on: " + new Date());
        } else {
          Log.e("RNPushdy", "[" + Thread.currentThread().getName() + "] " + this.getEventName() + " performed (" + getRetryCount() + ") on: " + new Date());
          sendEvent(getEventName(), getParams(), getRetryCount() + 1);
        }
      }
    };
    task.setEventName(eventName);
    task.setParams(params);
    task.setRetryCount(retryCount);
    task.setMaxRetryCount(maxRetry);
    Timer timer = new Timer("SendEventRetry");
    timer.schedule(task, delayRetry); // delay in ms
  }

  /**
   * Send event to JS thread and retry
   *
   * @deprecated
   *
   * @param eventName
   * @param params
   * @param retryCount
   */
  private void sendEventWithDelay(String eventName, @Nullable WritableMap params, int retryCount) {
//          this.reactContext
//              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//              .emit(eventName, params);
//          Log.d("RNPushdy", "sendEvent: Emitted: " + eventName);
    SentEventTimerTask task = new SentEventTimerTask() {
      public void run() {
        this.getReactContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(getEventName(), getParams());
        Log.d("RNPushdy", "sendEvent: Emitted: " + getEventName());
      }
    };
    task.setEventName(eventName);
    task.setParams(params);
    task.setReactContext(this.reactContext);

    Timer timer = new Timer("EmitEvent");
    timer.schedule(task, 50L); // delay in ms
  }

  /**
   * ===================  Pushdy hook =============================
   */

  /*========================
  Tried to support initPushdy SDK from JS whenever we want, without success.
  I stored the draft version here, to remind anyone who wanna init the SDK from JS,
  It's not possible at the moment, depend on PushdySDK and its working flow.
  // the OLD flow is:
  // 1. Init PushdySDK to do some required work (see the SDK)
  // 2. Whenever you wanna start Pushdy (often on JS App mounting), call setDeviceId, Pushdy SDK will create a `Player` on the dashboard
  // 3. From now on, PushdySDK is ready to work.
  Currently, the flow is:
  1. registerSdk to init native SDK and prepare
  2. Whenever you wanna start Pushdy (often on JS App mounting), call initPushdy, Pushdy SDK will create a `Player` on the dashboard
  3. From now on, PushdySDK is ready to work.

  public void old_registerSdk(android.content.Context mainAppContext, Integer smallIcon) {
    this.mainAppContext = mainAppContext;
    this.smallIcon = smallIcon;

    // Listen to activity change
    Pushdy.registerActivityLifecycle(mainAppContext);
  }

  public void old_initPushdy(ReadableMap options) throws Exception {
    String clientKey = "";
    if (!options.hasKey("clientKey")) {
      throw new Exception("RNPushdy.initPushdy: Invalid param: options.clientKey is required");
    } else {
      clientKey = options.getString("clientKey");

      if (clientKey == null) {
        throw new Exception("RNPushdy.initPushdy: Invalid param: options.clientKey cannot be empty");
      }
    }

    if (options.hasKey("deviceId")) {
      this.setDeviceId(options.getString("deviceId"));
    }

    if (this.smallIcon != null) {
      Pushdy.initWith(this.mainAppContext, clientKey, this, this.smallIcon);
    } else {
      Pushdy.initWith(this.mainAppContext, clientKey, this);
    }
    Pushdy.registerForRemoteNotification();
    Pushdy.setBadgeOnForeground(true);
  }
  ======================== */

  @Nullable
  @Override
  public Notification customNotification(@NotNull String s, @NotNull String s1, @NotNull String s2, @NotNull Map<String, ?> map) {
    return null;
  }

  @Override
  public void onNotificationOpened(@NotNull String notification, @NotNull String fromState) {
    Log.d("RNPushdy", "onNotificationOpened: notification: " + notification);

    WritableMap noti = new WritableNativeMap();
    try {
      JSONObject jo = new JSONObject(notification);
      noti = ReactNativeJson.convertJsonToMap(jo);
      if (reactContext != null) {
        RNPushdyData.setString(reactContext, "initialNotification", notification);
      }
    } catch (JSONException e) {
      e.printStackTrace();
      Log.e("RNPushdy", "onNotificationReceived Exception " + e.getMessage());
    }

    WritableMap params = Arguments.createMap();
    params.putString("fromState", fromState);
    params.putMap("notification", RNPushdyData.toRNPushdyStructure(noti));

    sendEvent("onNotificationOpened", params);
  }

  /**
   * Flow here:
   * When clicking notification from background or foreground. onNotificationOpened is triggered then
   * notification is saved.
   * getInitialNotification is used to re-trigger open notification when app restarts.
   * If you handled initicalNotification successful, please call removeInitalNotification.
   * For more info: https://github.com/Pushdy/react-native-pushdy/issues/3
   * @return WritableMap
   */
  public WritableMap getInitialNotification() {
    WritableMap data = new WritableNativeMap();

    // fix wrong behavior when getInitialNotification always return {} when intialNotification is null
    // expected value when got no data: null
    data = null;
    try {
      String initialNotification = null;
      if (reactContext != null) {
        initialNotification = RNPushdyData.getString(reactContext, "initialNotification");
      }
      if (initialNotification != null) {
        JSONObject jo = new JSONObject(initialNotification);
        data = ReactNativeJson.convertJsonToMap(jo);
      }
    } catch (JSONException e) {
      e.printStackTrace();
      Log.e("RNPushdy", "getPendingNotification Exception " + e.getMessage());
    }

    return data;
  }

  public void removeInitialNotification() {
    RNPushdyData.removeString(reactContext, "initialNotification");
  }


  @Override
  public void onNotificationReceived(@NotNull String notification, @NotNull String fromState) {
    Log.d("RNPushdy", "onNotificationReceived: notification: " + notification);

    WritableMap noti = new WritableNativeMap();
    try {
      JSONObject jo = new JSONObject(notification);
      noti = ReactNativeJson.convertJsonToMap(jo);
    } catch (JSONException e) {
      e.printStackTrace();
      Log.e("RNPushdy", "onNotificationReceived Exception " + e.getMessage());
    }

    WritableMap params = Arguments.createMap();
    params.putString("fromState", fromState);
    params.putMap("notification", RNPushdyData.toRNPushdyStructure(noti));

    sendEvent("onNotificationReceived", params);
  }

  @Override
  public void onRemoteNotificationFailedToRegister(@NotNull Exception e) {
    WritableMap params = Arguments.createMap();
    params.putString("exceptionMessage", e.getMessage());
    sendEvent("onRemoteNotificationFailedToRegister", params);
  }

  @Override
  public void onRemoteNotificationRegistered(@NotNull String deviceToken) {
    this.isRemoteNotificationRegistered = true;

    WritableMap params = Arguments.createMap();
    params.putString("deviceToken", deviceToken);
    sendEvent("onRemoteNotificationRegistered", params);
  }

  @Override
  public boolean readyForHandlingNotification() {
    return readyForHandlingNotification;
  }


  /**
   * ===========  Pushdy methods: Messaging ===========
   */
  public void startHandleIncommingNotification() {
    readyForHandlingNotification = true;
  }

  public void stopHandleIncommingNotification() {
    readyForHandlingNotification = false;
  }

  public boolean isRemoteNotificationRegistered() {
    return this.isRemoteNotificationRegistered;
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
    List<WritableMap> items = new ArrayList<>();
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

  public void pushAttribute(String attr, Object[] value) {
    Pushdy.pushAttribute(attr, value);
  }

  public String getPlayerID() {
    return Pushdy.getPlayerID();
  }

  public void setSubscribedEvents(ArrayList<String> subscribedEventNames) {
    this.subscribedEventNames = new HashSet<String>(subscribedEventNames);
  }
}
