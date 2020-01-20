# react-native-pushdy (RNPushdy)

## Getting started

**Installing** using yarn or npm:
```
$ npm install react-native-pushdy --save
$ yarn add react-native-pushdy
```

**Linking**
- For react-native@0.60.x and above: Autolink was introduce, you don't need to do anything further, for more detail: https://github.com/react-native-community/cli/blob/master/docs/autolinking.md
- For react-native@0.5x.x, run:
```
$ react-native link react-native-pushdy
```

Additional setup:
Push notification require very deep integration, additional setup is required to support handy feature:

### Android
TODO:

```
  MainApplication
  

  // Add this fn to MainActivity
  @Override
  public void onNewIntent(Intent intent) {
    setIntent(intent);
    super.onNewIntent(intent);
  }
```

### iOS
TODO:

```
```




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
http://git.mobiletech.vn/MobileTech/react-native-pushdy-example

and `react-native-pushdy-example/src/services/Pushdy/PushdyMessaging.js`

TODO: Move react-native-pushdy-example to github

### Common use case
Bellow is common use cases, for api references, please see [API References](#API-References) section

[WIP] This usage guide has not completed yet.

**Initialization**
Initialization flow:
1. PushdySDK (native ios/android sdk) connect to FCM / APNS and get the push token
1. RNPushdy (react-native-pushdy) register some needed event listeners to handle events sent by PushdySDK to JS

```

```


### API References
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
> On android:
>    registerForPushNotification was called automatically after PushdySDK's initilization
>    true mean registered, false mean registering or failed.
> On iOS:
>    you need to call ios_registerForPushNotification manually from JS, that mean JS context was already be ready,
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
*  latest | latest | latest | develoment stage
