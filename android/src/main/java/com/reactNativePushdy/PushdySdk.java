package com.reactNativePushdy;

import android.app.Notification;

import com.pushdy.Pushdy;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.Map;

public class PushdySdk implements Pushdy.PushdyDelegate {
  private static PushdySdk instance = null;

  public static PushdySdk getInstance() {
    if (instance == null) instance = new PushdySdk();

    return instance;
  }

  /**
   * ===================  Pushdy implement methods 2 =============================
   */
  @Nullable
  @Override
  public Notification customNotification(@NotNull String s, @NotNull String s1, @NotNull String s2, @NotNull Map<String, ?> map) {
    return null;
  }

  @Override
  public void onNotificationOpened(@NotNull Map<String, ?> map, @NotNull String s) {

  }

  @Override
  public void onNotificationReceived(@NotNull Map<String, ?> map, @NotNull String s) {

  }

  @Override
  public void onRemoteNotificationFailedToRegister(@NotNull Exception e) {

  }

  @Override
  public void onRemoteNotificationRegistered(@NotNull String s) {

  }

  @Override
  public boolean readyForHandlingNotification() {
    return false;
  }

  /**
   * Call initWithContext from MainApplication.java to init sdk
   */
  public void initWithContext(String clientKey, android.content.Context mainAppContext) {
    Pushdy.initWith(mainAppContext, clientKey, this);
  }

  public boolean isNotificationEnabled() {
    return Pushdy.isNotificationEnabled();
  }

  public String getDeviceToken() {
    return Pushdy.getDeviceToken();
  }
}
