package com.reactNativePushdy;

import android.app.Notification;
import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
//import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.modules.core.DeviceEventManagerModule;
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
import java.util.concurrent.TimeUnit;

/**
 * Expose api to Android
 *
 * NOTE: There must be no different between iOS & android api
 */
public class PushdyModule extends ReactContextBaseJavaModule implements Pushdy.PushdyDelegate {
    private static String TAG = "RNPushdyModule";
    // private static ReactApplicationContext reactContext;
    private static PushdyModule instance = null;
    private final PushdySdk pushdySdk;

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

    public PushdyModule(ReactApplicationContext context) {
        super(context);

        instance = this;

        this.pushdySdk = PushdySdk.getInstance()
            .setReactBaseModule(this)
            .setReactContext(context)
            .initNativeSDK();

        Log.d(TAG, "PushdyModule: construct done");
    }

    public static PushdyModule getInstance() {
        // if (instance == null) instance = new PushdyModule(reactContext);
        Log.e(TAG, "getInstance: ");
        return instance;
    }

    @Override
    public String getName() {
        return "RNPushdy";
    }

    /**
     * Call initWithContext from MainApplication.java to init sdk
     */
    public void initWithContext(String clientKey, android.content.Context mainAppContext) {
        Pushdy.initWith(mainAppContext, clientKey, this);
        Pushdy.registerForRemoteNotification();
        Pushdy.setBadgeOnForeground(true);
    }

    public void initWithContext(String clientKey, android.content.Context mainAppContext, Integer smallIcon) {
        Pushdy.initWith(mainAppContext, clientKey, this, smallIcon);
        Pushdy.registerForRemoteNotification();
        Pushdy.setBadgeOnForeground(true);
    }


    @ReactMethod
    public void sampleMethod(String stringArgument, int numberArgument, Promise promise) {
        Log.d("Pushdy", "sampleMethod: " + stringArgument + " | " + numberArgument);
        // Fake heavy work that take some seconds to completed
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            promise.reject("SAMPLE_ERROR", e);
            e.printStackTrace();
        }

        WritableNativeArray a = new WritableNativeArray();
        a.pushString("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
        a.pushInt(numberArgument * 2);

        promise.resolve(a);
    }

    /**
     * ======= Reimplement all ios / android native api =======
     */
//    @ReactMethod
//    public void init(String clientKey, Callback callback) {
//        pushdySdk.initWith(clientKey);
//    }

    @ReactMethod
    public void isRemoteNotificationRegistered(Promise promise) {
        promise.resolve(pushdySdk.isRemoteNotificationRegistered());
    }

    @ReactMethod
    public void isNotificationEnabled(Promise promise) {
        promise.resolve(pushdySdk.isNotificationEnabled());
    }

    @ReactMethod
    public void startHandleIncommingNotification(Promise promise) {
        this.startHandleIncommingNotification();
        promise.resolve(true);
    }

    @ReactMethod
    public void stopHandleIncommingNotification(Promise promise) {
        this.stopHandleIncommingNotification();
        promise.resolve(true);
    }

    @ReactMethod
    public void getReadyForHandlingNotification(Promise promise) {
        promise.resolve(this.readyForHandlingNotification());
    }

    @ReactMethod
    public void setPushBannerAutoDismiss(boolean autoDismiss, Promise promise) {
        pushdySdk.setPushBannerAutoDismiss(autoDismiss);
        promise.resolve(true);
    }

    @ReactMethod
    public void setPushBannerDismissDuration(Float sec, Promise promise) {
        pushdySdk.setPushBannerDismissDuration(sec);
        promise.resolve(true);
    }

    @ReactMethod
    public void setCustomPushBanner(String viewType, Promise promise) {
        Log.d("Pushdy", "setCustomPushBanner: ");
//        View banner = null;
//
//        switch (viewType) {
//            case "largeIconAsBigImage":
//                banner = null;
//                break;
//            case "todo":
//                banner = null;
//                break;
//            default:
//                Log.d("Pushdy", "setCustomPushBanner: Invalid viewType: " + viewType);
//        }
//
//        pushdySdk.setCustomPushBanner(banner);
        promise.resolve(true);
    }

    @ReactMethod
    public void setCustomMediaKey(String mediaKey, Promise promise) {
        pushdySdk.setCustomMediaKey(mediaKey);
        promise.resolve(true);
    }

    @ReactMethod
    public void setDeviceId(String deviceId, Promise promise) {
        pushdySdk.setDeviceId(deviceId);
        promise.resolve(true);
    }

    @ReactMethod
    public void getDeviceId(Promise promise) {
        promise.resolve(pushdySdk.getDeviceId());
    }

    @ReactMethod
    public void getDeviceToken(Promise promise) {
        String deviceToken = pushdySdk.getDeviceToken();
        // Log.d("Pushdy", "getDeviceToken: " + deviceToken);
        promise.resolve(deviceToken);
    }

    @ReactMethod
    public void getPendingNotification(Promise promise) {
        promise.resolve(pushdySdk.getPendingNotification());
    }

    @ReactMethod
    public void getPendingNotifications(Promise promise) {
        promise.resolve(pushdySdk.getPendingNotifications());
    }

    @ReactMethod
    public void setAttribute(String attr, Object value, Promise promise) {
        pushdySdk.setAttribute(attr, value);
        promise.resolve(true);
    }

    @ReactMethod
    public void pushAttribute(String attr, Object value, boolean commitImmediately, Promise promise) {
        pushdySdk.pushAttribute(attr, value, commitImmediately);
        promise.resolve(true);
    }

    @ReactMethod
    public void getPlayerID(Promise promise) {
        promise.resolve(pushdySdk.getPlayerID());
    }


    @ReactMethod
    public void setBadgeOnForeground(boolean enable, Promise promise) {
        pushdySdk.setBadgeOnForeground(enable);
        promise.resolve(true);
    }

    // https://facebook.github.io/react-native/docs/native-modules-android#argument-types
    @ReactMethod
    public void setSubscribedEvents(ReadableArray subscribedEventNames, Promise promise) {
        ArrayList<String> eventNames = new ArrayList<>();
        for (int i = 0; i < subscribedEventNames.size(); i++) {
            if (subscribedEventNames.getType(i) == ReadableType.String) {
                String str = subscribedEventNames.getString(i);
                eventNames.add(str);
            }
        }
        this.setSubscribedEvents(eventNames);

        promise.resolve(true);
    }

    /**
     * ===================  Pushdy hook =============================
     */
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

         ReactApplicationContext reactContext = getReactApplicationContext();
        if (reactContext != null) {
            /**
             * When you wake up your app from BG/closed state,
             * JS thread might not be available or ready to receive event
             */
            LifecycleState jsThreadState = reactContext.getLifecycleState();
            boolean reactActivated = reactContext.hasActiveCatalystInstance();
            boolean jsHandlerReady = this.subscribedEventNames.size() > 0;
            boolean jsSubscribeThisEvent = this.subscribedEventNames.contains(eventName);

            // Log.d("RNPushdy", "this.subscribedEventNames.size() = " + this.subscribedEventNames.size());

            if (reactActivated && jsThreadState == LifecycleState.RESUMED) {
//            if (reactActivated && true) {
//                if (true) {
                if (jsHandlerReady) {
                    // Delay for some second to ensure react context work
                    if (jsSubscribeThisEvent) {
//                    if (true) {
                        // this.sendEventWithDelay(eventName, params, 0);
                        reactContext
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
                    maxRetry = 10;
                }
            } else {
                // Reset if subscribedEventNames JS is not ready
                // This is on subscribedEventNames
                this.subscribedEventNames = new HashSet<>();
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
        } catch (JSONException e) {
            e.printStackTrace();
            Log.e("RNPushdy", "onNotificationReceived Exception " + e.getMessage());
        }

        WritableMap params = Arguments.createMap();
        params.putString("fromState", fromState);
        params.putMap("notification", RNPushdyData.toRNPushdyStructure(noti));

        sendEvent("onNotificationOpened", params);
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
        pushdySdk.setRemoteNotificationRegistered(true);

        WritableMap params = Arguments.createMap();
        params.putString("deviceToken", deviceToken);
        sendEvent("onRemoteNotificationRegistered", params);
    }

    @Override
    public boolean readyForHandlingNotification() {
        return readyForHandlingNotification;
    }

    public void startHandleIncommingNotification() {
        readyForHandlingNotification = true;
    }

    public void stopHandleIncommingNotification() {
        readyForHandlingNotification = false;
    }

    public void setSubscribedEvents(ArrayList<String> subscribedEventNames) {
        this.subscribedEventNames = new HashSet<String>(subscribedEventNames);
    }
}
