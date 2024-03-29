package com.reactNativePushdy;

import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import org.json.JSONArray;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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


    @ReactMethod
    public void makeCrash(Promise promise) throws Exception {
        throw new Exception("makeCrash from react-native-pushdy");
    }

    /**
     * ======= Reimplement all ios / android native api =======
     */
    @ReactMethod
    public void initPushdy(ReadableMap options, Promise promise) {
        try {
            pushdySdk.initPushdy(options);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("INIT_ERROR", e);
        }
    }

    @ReactMethod
    public void isRemoteNotificationRegistered(Promise promise) {
        promise.resolve(pushdySdk.isRemoteNotificationRegistered());
    }

    @ReactMethod
    public  void isAppOpenedFromPush(Promise promise) {
        promise.resolve(pushdySdk.isAppOpenedFromPush());
    }

    @ReactMethod
    public void isNotificationEnabled(Promise promise) {
        promise.resolve(pushdySdk.isNotificationEnabled());
    }

    @ReactMethod
    public void startHandleIncommingNotification(Promise promise) {
        pushdySdk.startHandleIncommingNotification();
        promise.resolve(true);
    }

    @ReactMethod
    public void stopHandleIncommingNotification(Promise promise) {
        pushdySdk.stopHandleIncommingNotification();
        promise.resolve(true);
    }

    @ReactMethod
    public void getReadyForHandlingNotification(Promise promise) {
        promise.resolve(pushdySdk.readyForHandlingNotification());
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
    public void useSDKHandler(Boolean enabled, Promise promise) {
        pushdySdk.useSDKHandler(enabled);
        promise.resolve(true);
    }

    @ReactMethod
    public void handleCustomInAppBannerPressed(String notificationId, Promise promise) {
        pushdySdk.handleCustomInAppBannerPressed(notificationId);
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
    public  void getInitialNotification(Promise promise) {
        promise.resolve(pushdySdk.getInitialNotification());
    }

    @ReactMethod
    public  void removeInitialNotification(Promise promise) {
        pushdySdk.removeInitialNotification();
        promise.resolve(true);
    }

    /**
     * Because react-native-bridge do not support to send Any type, we need to wrap Any type into a dict:
     * {data: "value here can be any type of obj, array, num, string, etc"}
     * This is only way we can send any type via bridge
     */
    @ReactMethod
    public void setAttributeFromValueContainer(String attr, ReadableMap valueContainer, Boolean commitImmediately, Promise promise) {
        Dynamic data = valueContainer.getDynamic("data");
        Object value = RNPushdyData.convertDynamicFieldToJavaType(data);
        pushdySdk.setAttribute(attr, value, commitImmediately);
        promise.resolve(true);
    }

    @ReactMethod
    public void pushAttributeArray(String attr, ReadableArray value, Boolean commitImmediately, Promise promise) {
        pushdySdk.pushAttribute(attr, value.toArrayList().toArray(), commitImmediately);
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
        pushdySdk.setSubscribedEvents(eventNames);

        promise.resolve(true);
    }

    @ReactMethod
    public void getPendingEvents(Integer count , Promise promise) {
        WritableArray events = Arguments.createArray();
        List<HashMap<String, Object>> list = pushdySdk.getPendingEvents(count);
        for (int i = 0; i < list.size(); i++) {
            WritableMap map = ReactNativeJson.convertMapToWritableMap(list.get(i));
            events.pushMap(map);
        }
        promise.resolve(events);
    }

    @ReactMethod
    public void setPendingEvents(ReadableArray events, Promise promise) {
        List<HashMap<String, Object>> list = new ArrayList<>();
        List eventsList = events.toArrayList();
        for (int i = 0; i < eventsList.size(); i++) {
            HashMap<String, Object> map = (HashMap<String, Object>) eventsList.get(i);
            list.add(map);
        }
        pushdySdk.setPendingEvents(list);
        promise.resolve(true);
    }

    @ReactMethod
    public void setApplicationId(String applicationId, Promise promise) {
        pushdySdk.setApplicationId(applicationId);
        promise.resolve(true);
    }

    @ReactMethod
    public void removePendingEvents(Integer count, Promise promise) {
        pushdySdk.removePendingEvents(count);
        promise.resolve(true);
    }

    @ReactMethod
    public void trackEvent(String eventName, ReadableMap eventProperties, Boolean immediate, Promise promise) {
        pushdySdk.trackEvent(eventName, eventProperties.toHashMap(), immediate);
        promise.resolve(true);
    }

    @ReactMethod
    public void
    pushPendingEvents( Promise promise) {
        pushdySdk.pushPendingEvents();
        promise.resolve(true);
    }

    @ReactMethod
    public void subscribe(Promise promise) {
        pushdySdk.subscribe();
        promise.resolve(true);
    }

    @ReactMethod
    public void getAllBanners(Promise promise) {
        JsonArray list = pushdySdk.getAllBanners();
        WritableArray banners = Arguments.createArray();
        if (list == null) {
            promise.resolve(banners);
            return;
        }
        for (int i = 0; i < list.size(); i++) {
            HashMap map = new Gson().fromJson(list.get(i), HashMap.class);

            WritableMap map1 = ReactNativeJson.convertMapToWritableMap(map);
            banners.pushMap(map1);
        }
        promise.resolve(banners);
    }

    @ReactMethod
    public void trackBanner(String bannerId, String type, Promise promise) {
        pushdySdk.trackBanner(bannerId, type);
        promise.resolve(true);
    }

    @ReactMethod
    public void getBannerData(String bannerId, Promise promise) {
        JsonObject data = pushdySdk.getBannerData(bannerId);
        // convert JsonObject to HashMap
        HashMap map = new Gson().fromJson(data, HashMap.class);

        WritableMap writableMap = ReactNativeJson.convertMapToWritableMap(map);

        promise.resolve(writableMap);
    }
}
