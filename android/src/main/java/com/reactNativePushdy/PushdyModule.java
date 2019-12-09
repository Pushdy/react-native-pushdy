package com.reactNativePushdy;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.util.concurrent.TimeUnit;

public class PushdyModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private final PushdySdk pushdySdk;

    public PushdyModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.pushdySdk = new PushdySdk();
    }

    @Override
    public String getName() {
        return "Pushdy";
    }

    @ReactMethod
    public void sampleMethod(String stringArgument, int numberArgument, Callback callback) {
        // Fake heavy work that take some seconds to completed
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument, numberArgument * 2);
    }

    /**
     * ======= TODO: Reimplement all ios / android native api =======
     */
//    @ReactMethod
//    public void init(String clientKey, Callback callback) {
//        pushdySdk.initWith(clientKey);
//    }

    @ReactMethod
    public void isNotificationEnabled(Callback callback) {
        callback.invoke(pushdySdk.isNotificationEnabled());
    }
    @ReactMethod
    public void getDeviceToken(Callback callback) {
        String deviceToken = pushdySdk.getDeviceToken();
        Log.d("Pushdy", "getDeviceToken: " + deviceToken);
        callback.invoke(deviceToken);
    }
}
