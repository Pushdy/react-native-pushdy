package com.reactNativePushdy;

import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableNativeArray;

import java.util.concurrent.TimeUnit;

/**
 * Expose api to Android
 *
 * NOTE: There must be no different between iOS & android api
 */
public class PushdyModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private final PushdySdk pushdySdk;

    public PushdyModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.pushdySdk = PushdySdk.getInstance().setReactContext(reactContext);
    }

    @Override
    public String getName() {
        return "RNPushdy";
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
        View banner = null;

        switch (viewType) {
            case "largeIconAsBigImage":
                banner = null;
                break;
            case "todo":
                banner = null;
                break;
            default:
                Log.d("Pushdy", "setCustomPushBanner: Invalid viewType: " + viewType);
        }

        pushdySdk.setCustomPushBanner(banner);
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
}
