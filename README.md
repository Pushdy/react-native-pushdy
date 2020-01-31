# react-native-pushdy (RNPushdy)
## Table of contents
- [Table of contents](#table-of-contents)
- [Getting started](#getting-started)
  - [Installing](#installing)
  - [Linking](#linking)
  - [Update new RNPushdy version (if needed)](#update-new-rnpushdy-version-if-needed)
- [Additional setup:](#additional-setup)
  - [Android](#android)
  - [iOS](#ios)
- [Pushdy configuration](#pushdy-configuration)
- [Usage](#usage)
- [Common use case](#common-use-case)
  - [1. Initialization in react-native](#1-initialization-in-react-native)
  - [2. Subscribe to notification open event](#2-subscribe-to-notification-open-event)
  - [3. And Subscribe to new notification](#3-and-subscribe-to-new-notification)
  - [4. Ensure permission](#4-ensure-permission)
  - [5. Handle user click on notification in notification tray](#5-handle-user-click-on-notification-in-notification-tray)
- [API References](#api-references)
  - [setTimeout(ttl)](#settimeoutttl)
  - [sampleMethod(str, num)](#samplemethodstr-num)
  - [isRemoteNotificationRegistered()](#isremotenotificationregistered)
  - [ios_registerForPushNotification()](#ios_registerforpushnotification)
  - [isNotificationEnabled()](#isnotificationenabled)
  - [enablePushdyInAppBanner(enable)](#enablepushdyinappbannerenable)
  - [methodFoo(...args)](#methodfooargs)
- [Version compatible](#version-compatible)
- [Common issues](#common-issues)
  - [ios Setup](#ios-setup)

TOC was generated [here](https://magnetikonline.github.io/markdown-toc-generate/)

## Getting started

#### Installing
using yarn or npm:
```
$ npm install react-native-pushdy --save
$ yarn add react-native-pushdy
```

#### Linking
- For react-native@0.60.x and above: Autolink was introduce, you don't need to do anything further, for more detail: https://github.com/react-native-community/cli/blob/master/docs/autolinking.md
- For react-native@0.5x.x, run:
```
$ react-native link react-native-pushdy
```

#### Update new RNPushdy version (if needed)
Fetch new version from npm:
```
yarn upgrade react-native-pushdy
```

Then update Pushdy's native library:
```
Android Studio: File > Sync project with graddle files (don't need this if you using react-native run-android)
ios: run `pod install`
```

## Additional setup:
Push notification require very deep integration, additional setup is required to support handy feature:

NOTE: You need to complete [Pushdy configuration](#Pushdy-configuration) to receive push notification


#### Android

android/app/src/main/java/**/MainApplication.java
```
    // Import RNPushdy
    import com.reactNativePushdy.PushdySdk;
    ...

    @Override
    public void onCreate() {
      ...

      // ----- Add Pushdy module
      // Add Pushdy init at the end of `onCreate`
      String pushdyClientKey = BuildConfig.DEBUG
          ? "debug_client_key_copied_from_pushdy"
          : "prod_client_key_copied_from_pushdy";

      PushdySdk.getInstance().initWithContext(pushdyClientKey, this, R.mipmap.ic_notification);
      // ----- Add Pushdy module
    }
```


Override your MainActivity (ussually MainActivity.java)
```
  // Add this fn to MainActivity
  @Override
  public void onNewIntent(Intent intent) {
    setIntent(intent);
    super.onNewIntent(intent);
  }
  ...
```

#### iOS
Pre-requisite:
- react-native@0.61.x and above. The reason:
    - 0.5x was not tested yet, and too old to support
    - 0.60.x does not support `use_frameworks!`
- Swift enabled, support `use_frameworks!` in your Podfile



AppDelegate.m
```
#import <react_native_pushdy/react_native_pushdy-Swift.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  ...

  // ----- Add Pushdy module
  NSString *clientKey;
  #if DEBUG
    clientKey = @"debug_client_key_copied_from_pushdy";
  #else
    clientKey = @"prod_client_key_copied_from_pushdy";
  #endif

  [RNPushdy initWithClientKey:clientKey delegate:self launchOptions:launchOptions];
  // ----- End add Pushdy module

  ...
  return YES;
}
```



Next steps:
- [Pushdy dashboard configuration](#Pushdy-configuration)
- [Common use case > Initialization in React-native](#Common-use-case)


## Pushdy configuration
Để nhận được push bạn cần cấu hình trên dashboard của Pushdy trước:

iOS:  
[Hướng dẫn tích hợp Pushdy mobile push cho iOS app](https://guide.pushdy.com/i/cai-dat-mobile-push/ios)  
> Chú ý: bỏ qua bước **3. Cài đặt SDK cho iOS app**

Android:  
[Hướng dẫn tích hợp Pushdy mobile push cho Android app.](https://guide.pushdy.com/i/cai-dat-mobile-push/android)  
> Chú ý: bỏ qua bước **3. Cài đặt SDK cho Android app**


Để đảm bảo push được nhận từ background nhanh chóng, cần sửa main activity `launchMode="singleTop"`:
```
<activity
          android:name=".MainActivity"
          android:label="@string/app_name"
          ...
          android:launchMode="singleTop"     <----- Add this line
          ...
          android:windowSoftInputMode="adjustResize">
```
Như vậy, mỗi khi open app từ backround lên app sẽ không bị recreate lại JS thread, vẫn dùng JS thread cũ, sẽ không bị miss các message từ Native truyền qua.


## Usage
```javascript
import Pushdy from 'react-native-pushdy';

const [msg, x2num] = await Pushdy.sampleMethod('Hello from JS with', 500);
```
See more at [API References](#API-References) and **common use case** section bellow.

Checkout RNPushdy in this example project: react-native-pushdy-example: 
https://github.com/Pushdy/react-native-pushdy-example

and `react-native-pushdy-example/src/services/Pushdy/PushdyMessaging.js`

## Common use case
Bellow is common use cases, for api references, please see [API References](#API-References) section

[WIP] This usage guide has not completed yet.

#### 1. Initialization in react-native

Initialization flow:
- PushdySDK (native ios/android sdk) connect to FCM / APNS and get the push token
- RNPushdy (react-native-pushdy) register some needed event listeners to handle events sent by PushdySDK to JS


```
  async register() {
    // Remember to subscribe event first
    const _this = this;
    Pushdy.startSubscribers({
      onNotificationOpened: _this.onNotificationOpened.bind(_this),
      onNotificationReceived: _this.onNotificationReceived.bind(_this),
      onRemoteNotificationFailedToRegister: _this.onRemoteNotificationFailedToRegister.bind(_this),
      onRemoteNotificationRegistered: _this.onRemoteNotificationRegistered.bind(_this),
      onTokenUpdated: _this.onTokenUpdated.bind(_this),
    });

    // After setting up subscribers, you can continue to work with Pushdy
    // Pushdy token was handled by Pushdy SDK, if you don't need to read it, just comment out this getDeviceToken() section.
    this.ensurePermission().then(enabled => {});

    // Check for non-executed push on app opening
    this.handleInitialNotification();
  }

  unregister() {
    Pushdy.stopSubscribers();
  }
```
Done.

Now go to https://dashboard.pushdy.com/#/application/your_project_id/notification and create a new notification.

A notification should appear on your device.

You may take a look at [Common issues](#Common-issues) section in the future.


#### 2. Subscribe to notification open event
#### 3. And Subscribe to new notification
```
Pushdy.startSubscribers({
  onNotificationOpened: _this.onNotificationOpened.bind(_this),
  onNotificationReceived: _this.onNotificationReceived.bind(_this),
  onRemoteNotificationFailedToRegister: _this.onRemoteNotificationFailedToRegister.bind(_this),
  onRemoteNotificationRegistered: _this.onRemoteNotificationRegistered.bind(_this),
  onTokenUpdated: _this.onTokenUpdated.bind(_this),
});
```

See [docs](#) for more details

#### 4. Ensure permission

    Permission was automatically request permission while ios requires you to request manually:
    ```
    await Pushdy.ios_registerForPushNotification();
    ```

#### 5. Handle user click on notification in notification tray

    If app is closed, click on a notification will open app, you need to manually get the clicked notification and handle it.

    When your app is in closed state (not background), incomming notification message will be handled and show by OS, you can find it in the OS's notification center
    Then user press the notification, the app will be opened with that notification data, that data called pendingPushNotification

    After JS thread was ready, PushdySDK was ready, you need to check if there is a pendingPushNotification and handle it
    In some other SDK, pendingPushNotifications also known as initialNotifications

    ```
      async handleInitialNotification() {
        // Get the clicked push notification while app is closed or in background
        const pendingNotification = await Pushdy.getPendingNotification();

        if (pendingNotification) {
          /**
           * Handle the bug if notification was re-handle if Codepush.restart()
           */
          const lastInitialId = getLastNotiIdFromLocalStorage();
          const initialId = pendingNotification._notificationId;
          if (lastInitialId && lastInitialId === initialId) {
            // Ignore if this notification have been handled
            console.log('Notification was already handled in last session, skip:  notificationId: ', lastInitialId);
            return
          }

          setLastNotiIdFromLocalStorage(initialId);

          this.handleMyAppPushAction(pendingNotification, 'background')
        }
      }
    ```


## API References
Bellow is RNPushdy's API References, for common use cases, please see [Common use case](#Common-use-case) section


##### setTimeout(ttl)
Signature: 
```
/**
* @param {Number} ttl Time to live in miliseconds. Default to 10,000 ms
*/
setTimeout(ttl)
```

Desc: 
> Set timeout for all function execution, if a Pushdy's function does not response after `ttl` milisecs then async function will return a Promise<undefined>
>

Usage:
```
Pushdy.setTimeout(5000);
```

##### sampleMethod(str, num)
Signature: 
```
async sampleMethod(str, num)
```

Desc: 
> If sampleMethod work then RNPushdy was correctly installed and working.

Usage:
```
const [msg, x2num] = await Pushdy.sampleMethod('Hello from JS with', 500);
```


##### isRemoteNotificationRegistered()
Signature: 
```
 /**
   * @returns {Promise<Boolean>}
   */
  async isRemoteNotificationRegistered()
```

Desc:
> Android only:
>
> On android:
>    registerForPushNotification was called automatically after PushdySDK's initilization
>    true mean registered, false mean registering or failed.
>
> On iOS:
> you need to call ios_registerForPushNotification manually from JS, that mean JS context was already be ready,
>    so that you can listen to onRemoteNotificationRegistered event perfectly
>    Or you can use isRemoteNotificationRegistered variable, it's depend!

Usage:
```
const isRegistered = await Pushdy.isRemoteNotificationRegistered();
```

##### ios_registerForPushNotification()
Signature: 
```
/**
 * @returns {Promise<void>}
 */
async ios_registerForPushNotification()
```

Desc: 
> See [isRemoteNotificationRegistered](#isRemoteNotificationRegistered) above.
>
> And https://guide.pushdy.com/i/tham-chieu-sdk-api/ios-native-sdk#registerforpushnotification

Usage:
```
await Pushdy.ios_registerForPushNotification();

```


##### isNotificationEnabled()
Signature: 
```
/**
   * @returns {Promise<Boolean>}
   */
  async isNotificationEnabled()
```

Desc: 
> Kiểm tra xem người dùng có bật Push Notification cho App của bạn hay không.
> Nếu người dùng chưa bật push, bạn nên hiện popup yêu cầu user bật push bằng cách truy cập Cài đặt push trong OS Setting menu
> Ref: https://guide.pushdy.com/i/tham-chieu-sdk-api/android-native-sdk#isnotificationenabled

Usage:
```
const enabled = await Pushdy.isNotificationEnabled();
```




##### enablePushdyInAppBanner(enable)
Signature: 
```
/**
*
* @param enable 
* @returns {Promise<void>}
*/
async enablePushdyInAppBanner(enable)
```

Desc: 
> Turn on or off Pushdy built-in InAppBanner
> 
> @param enable
> 	When you receive a notification in foreground:
> 	- If enable: Pushdy SDK will show a notification in a built-in InAppBanner UI
> 	- If NOT enable: Default to OS behavior
> 
> Default to `true` on both android and ios

Usage:
```
const result = await Pushdy.methodFoo();
```





##### methodFoo(...args)
Signature: 
```
async methodFoo(...args)
```

Desc: 
methodFoo...

Usage:
```
const result = await Pushdy.methodFoo();
```


## Version compatible

We've maintained compatible version here.
Versioning use `semver` since RNPushdy version 1.x (0.x is development stage)

react-native@0.61.x and above
* RNPushdy | android-pushdy-sdk | ios-pushdy-sdk | Note |
* --     | --     | --     | develoment stage
* @0.0.4-rn0_60 | 0.0.6  | 0.0.6  | develoment stage: android sdk change data structure
* @0.0.4 | 0.0.6  | 0.0.6  | develoment stage: android sdk change data structure
* latest | latest | latest | develoment stage

react-native@0.60.x and bellow
*  RNPushdy | android-pushdy-sdk | ios-pushdy-sdk | Note |
*  --     | --     | --     | develoment stage
*  @0.0.4 | 0.0.6  | 0.0.6  | develoment stage: android sdk change data structure
*  @0.0.6 | 0.0.6  | 0.0.9  | develoment stage: ios sdk breaking change
*  latest | latest | latest | develoment stage


## Common issues

Almost issue comes from miss-configuration.

You should re-check the step by step installation, pre-requirement first

#### ios Setup
> xCode Compile ERROR: react_native_pushdy-Swift.h not found

Check hỗ trợ swift theo hướng dẫn:
https://medium.com/ios-os-x-development/swift-and-objective-c-interoperability-2add8e6d6887

Lưu ý: Cần phải Setting Defines module cho cả project chính và project react-native-pushdy (đã setup sẵn)

![Enable module](assets/Packaging.png "xCode config Enable module")


More error: [README_SETUP_ERROR.md](README_SETUP_ERROR.md)