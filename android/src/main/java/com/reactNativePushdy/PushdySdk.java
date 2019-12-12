package com.reactNativePushdy;

import android.app.Notification;
import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableNativeMap;
import com.pushdy.Pushdy;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;


public class PushdySdk implements Pushdy.PushdyDelegate {
  private static PushdySdk instance = null;
  private ReactApplicationContext reactContext = null;

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

  public PushdySdk setReactContext(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;

    return this;
  }

  /**
   * Call initWithContext from MainApplication.java to init sdk
   */
  public void initWithContext(String clientKey, android.content.Context mainAppContext) {
    Pushdy.initWith(mainAppContext, clientKey, this);
    Pushdy.registerForRemoteNotification();
  }

  private void sendEvent(String eventName) {
    this.sendEvent(eventName, null);
  }

  /**
   * Send event from native to JsThread
   * If the reactConetext has not available yet, => retry
   */
  private void sendEvent(String eventName, @Nullable WritableMap params) {
    if (this.reactContext != null && this.reactContext.hasActiveCatalystInstance()) {
      this.reactContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, params);
    } else {
      Log.e("Pushdy", "sendEvent: " + eventName + " was skipped because reactContext is null or not ready");

      /**
       * Retry after 1s
       * NOTE: You must do this in non-blocking mode to ensure program
       * will continue to run without any dependant on this code
       */
      SentEventTimerTask task = new SentEventTimerTask() {
        public void run() {
          Log.d("Pushdy", "[" + Thread.currentThread().getName() + "] Task performed on: " + new Date());
          sendEvent(this.getEventName(), this.getParams());
        }
      };
      task.setEventName(eventName);
      task.setParams(params);
      Timer timer = new Timer("PushdySendEventRetry");
      timer.schedule(task, 200L); // delay in ms
    }
  }

  /**
   * ===================  Pushdy hook =============================
   */
  @Nullable
  @Override
  public Notification customNotification(@NotNull String s, @NotNull String s1, @NotNull String s2, @NotNull Map<String, ?> map) {
    return null;
  }

  @Override
  public void onNotificationOpened(@NotNull Map<String, ?> notification, @NotNull String fromState) {
    // WritableMap noti = ReactNativeJson.convertJavaMapToJson(notification);
    // TODO: Convert HashMap to WritableMap
    WritableMap noti = new WritableNativeMap();
    WritableMap params = Arguments.createMap();
    params.putString("fromState", fromState);
    params.putMap("notification", noti);
    sendEvent("onNotificationOpened", params);
  }

  @Override
  public void onNotificationReceived(@NotNull Map<String, ?> notification, @NotNull String fromState) {
    // TODO: Convert HashMap to WritableMap
    WritableMap noti = new WritableNativeMap();
    WritableMap params = Arguments.createMap();
    params.putString("fromState", fromState);
    params.putMap("notification", noti);
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
    WritableMap params = Arguments.createMap();
    params.putString("deviceToken", deviceToken);
    sendEvent("onRemoteNotificationRegistered", params);
  }

  @Override
  public boolean readyForHandlingNotification() {
    return false;
  }


  /**
   * ===========  Pushdy methods: Messaging ===========
   */
  public boolean isRemoteNotificationRegistered() {
    return this.isRemoteNotificationRegistered;
  }

  public boolean isNotificationEnabled() {
    return Pushdy.isNotificationEnabled();
  }

  public void setPushBannerAutoDismiss(boolean autoDismiss) {
    // Pushdy.setPushBannerAutoDismiss(autoDismiss);
  }

  public void setPushBannerDismissDuration(Float sec) {
    // Pushdy.setPushBannerDismissDuration(sec);
  }

  public void setCustomPushBanner(View view) {
    // Pushdy.setCustomPushBanner(view);
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

  public Map<String, Object> getPendingNotification() {
    return Pushdy.getPendingNotification();
  }

  public List<Map<String, Object>> getPendingNotifications() {
    return Pushdy.getPendingNotifications();
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
