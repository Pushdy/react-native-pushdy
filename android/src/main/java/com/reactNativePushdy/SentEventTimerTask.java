package com.reactNativePushdy;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;

import java.util.Date;
import java.util.TimerTask;

/*
Usage
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
 */
public class SentEventTimerTask extends TimerTask {
  private String eventName = "";
  private WritableMap params;
  private int retryCount = 0;
  private int maxRetryCount = 5;
  private int delay = 0;
  private ReactApplicationContext reactContext = null;

  public String getEventName() {
    return eventName;
  }

  public WritableMap getParams() {
    return params;
  }

  public int getRetryCount() {
    return retryCount;
  }

  public void setEventName(String eName) {
    this.eventName = eName;
  }

  public void setParams(WritableMap params) {
    this.params = params;
  }

  public void setRetryCount(int retryCount) {
    this.retryCount = retryCount;
  }

  public int getMaxRetryCount() {
    return maxRetryCount;
  }

  public void setMaxRetryCount(int maxRetryCount) {
    this.maxRetryCount = maxRetryCount;
  }

  public ReactApplicationContext getReactContext() {
    return reactContext;
  }

  public void setReactContext(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
  }

  public int getDelay() {
    return delay;
  }

  public void setDelay(int delay) {
    this.delay = delay;
  }

  public void run() {
    Log.d("Pushdy", "[Default run()] Task performed on: " + new Date() + " | " + "Thread's name: " + Thread.currentThread().getName());
  }
}
