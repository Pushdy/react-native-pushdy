import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue';

if (__DEV__) {
  MessageQueue.spy((msg) => {
    if (
      msg.module === "RNPushdy" ||
      (msg.module === null && msg.method.toString().indexOf('RNPushdy') >= 0)
    ) {
      const fromTo = msg.type === 0 ? '[To JS]' : '[To Native]';
      const color = msg.type === 0 ? '#693' : '#639';
      console.log('%c' + fromTo + ' msg:', 'color: ' + color, msg)
    } else if (msg.module === "RCTDeviceEventEmitter") {
      return;

      // Ignore websocketMessage
      if (msg.args && msg.args[0] === "websocketMessage") {
        return;
      }

      const fromTo = msg.type === 0 ? '[To JS]' : '[To Native]';
      const color = msg.type === 0 ? '#693' : '#639';
      console.log('%c' + fromTo + ' args, msg:', 'color: ' + color, msg.args, msg)
    }
  })
  console.log('{PushdyMessaging} Spy enabled: ', );
} else {
  console.log('{PushdyMessaging} Spy disabled: ', );
}

const { RNPushdy } = NativeModules;
console.log('{react-native-pushdy/index} RNPushdy: ', RNPushdy);

const isIos = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';
const logStyle = {
  warning: 'background: orange',
  error: 'background: red',
}

/**
 * Wrapper to Pushdy native module
 *
 * [x] Implement TimeToLive feature
 * [x] Use Promise style instead of traditional callback ==> Did it on native side
 * [x] Keep same api interface between iOS & Android => Handle it on native side
 * [x] User can catch promise, do not cast all result to resolve
 */

/*
const pushdy_sdk_notification = {
  notificationId: "0:1577159649441365%fa61a713fa61a713",

  title: "Anh Vượng dự định bán tivi",
  subtitle: undefined,
  body: "Hãng xe tỷ phú Phạm Nhật Vượng vừa có thoả thuận lịch sử, lại rò rỉ tin mới về tivi. Hãng xe tỷ phú Phạm Nhật Vượng vừa có thoả thuận lịch sử, lại rò rỉ tin mới về tivi. Hãng xe tỷ phú Phạm Nhật Vượng vừa có thoả thuận lịch sử, lại rò rỉ tin mới về tivi",
  sound: "default",
  ...,

  // Custom data from user
  data: {
    // Android push mở từ background sẽ k lấy được title và body nên cần nhét title + body và data
    title: "Bão số 6 hướng đi khó lường",
    body: "Ít nhất 7 tỉnh thành sẽ bị ảnh hưởng, cần sẵn sàng tinh thần ứng phó",
    image: "https://vortex.accuweather.com/adc2010/images/icons-numbered/01-l.png",
    push_action: "navigate_to_article_detail",
    push_data: { article_id: 179269 },
  },

  // Replace platformOption by ios & android
  // platformOption: {},
  ios: {},
  android: {},
};

const react_native_pushdy_notification = {
  // Main notification data
  notificationId: "0:1577159649441365%fa61a713fa61a713",
  title: "Anh Vượng dự định bán tivi",
  subtitle: undefined,
  body: "Hãng xe tỷ phú Phạm Nhật Vượng vừa có thoả thuận lịch sử, lại rò rỉ tin mới về tivi. Hãng xe tỷ phú Phạm Nhật Vượng vừa có thoả thuận lịch sử, lại rò rỉ tin mới về tivi. Hãng xe tỷ phú Phạm Nhật Vượng vừa có thoả thuận lịch sử, lại rò rỉ tin mới về tivi",
  sound: "default",
  ...,

  // Custom data from user
  data: {
    title: "Bão số 6 hướng đi khó lường",
    image: "https://vortex.accuweather.com/adc2010/images/icons-numbered/01-l.png",
    body: "Ít nhất 7 tỉnh thành sẽ bị ảnh hưởng, cần sẵn sàng tinh thần ứng phó",
    push_action: "navigate_to_article_detail",
    push_data: { article_id: 179269 },
  },

  // PushdySDK's additional props
  _notification_id: "573e507b-822d-4357-b91a-4daf7cd046f8",
  _nms_image: "https://znews-photo.zadn.vn/w660/Uploaded/cqdhmdxwp/2019_08_14/kuncherry90_67233597_965480387137244_1646091755794003933_n_copy.jpg",
  _nms_payload: "eyJub3RpZmljYXRpb24iOnsidGl0bGUiOiJBbmggVsaw4bujbmcgZOG7sSDEkeG7i25oIGLDoW4gdGl2aSIsImJvZHkiOiJIw6NuZyB4ZSB04bu3IHBow7ogUGjhuqFtIE5o4bqtdCBWxrDhu6NuZyB24burYSBjw7MgdGhv4bqjIHRodeG6rW4gbOG7i2NoIHPhu60sIGzhuqFpIHLDsiBy4buJIHRpbiBt4bubaSB24buBIHRpdmkuIEjDo25nIHhlIHThu7cgcGjDuiBQaOG6oW0gTmjhuq10IFbGsOG7o25nIHbhu6thIGPDsyB0aG/huqMgdGh14bqtbiBs4buLY2ggc+G7rSwgbOG6oWkgcsOyIHLhu4kgdGluIG3hu5tpIHbhu4EgdGl2aS4gSMOjbmcgeGUgdOG7tyBwaMO6IFBo4bqhbSBOaOG6rXQgVsaw4bujbmcgduG7q2EgY8OzIHRob+G6oyB0aHXhuq1uIGzhu4tjaCBz4butLCBs4bqhaSByw7IgcuG7iSB0aW4gbeG7m2kgduG7gSB0aXZpIn0sImRhdGEiOnsicHVzaF9pZCI6IjEiLCJwdXNoX3R5cGUiOiJtYW51YWwiLCJwdXNoX2FjdGlvbiI6Im5hdmlnYXRlX3RvX2FydGljbGVfZGV0YWlsIiwicHVzaF9kYXRhIjp7ImFydGljbGVfaWQiOjE3OTI2OX0sInRpdGxlIjoiQsOjbyBz4buRIDYgaMaw4bubbmcgxJFpIGtow7MgbMaw4budbmciLCJib2R5Ijoiw410IG5o4bqldCA3IHThu4luaCB0aMOgbmggc+G6vSBi4buLIOG6o25oIGjGsOG7n25nLCBj4bqnbiBz4bq1biBzw6BuZyB0aW5oIHRo4bqnbiDhu6luZyBwaMOzIiwiaW1hZ2UiOiJodHRwczovL3ZvcnRleC5hY2N1d2VhdGhlci5jb20vYWRjMjAxMC9pbWFnZXMvaWNvbnMtbnVtYmVyZWQvMDEtbC5wbmciLCJfbm90aWZpY2F0aW9uX2lkIjoiNTczZTUwN2ItODIyZC00MzU3LWI5MWEtNGRhZjdjZDA0NmY4In19",

  // ios specific option
  ios: {
    alertAction: "(...)",
    attachments: "(...)",
    badge: "(...)",
    category: "(...)",
    hasAction: "(...)",
    launchImage: "(...)",
    threadIdentifier: "(...)",
    complete: "(...)",
  },

  // Android specific option
  android: {
    actions: "(...)",
    autoCancel: "(...)",
    badgeIconType: "(...)",
    bigPicture: "(...)",
    bigText: "(...)",
    category: "(...)",
    channelId: "(...)",
    clickAction: "(...)",
    color: "(...)",
    colorized: "(...)",
    contentInfo: "(...)",
    defaults: "(...)",
    group: "(...)",
    groupAlertBehaviour: "(...)",
    groupSummary: "(...)",
    largeIcon: "(...)",
    lights: "(...)",
    localOnly: "(...)",
    number: "(...)",
    ongoing: "(...)",
    onlyAlertOnce: "(...)",
    people: "(...)",
    priority: "(...)",
    progress: "(...)",
    remoteInputHistory: "(...)",
    shortcutId: "(...)",
    showWhen: "(...)",
    smallIcon: "(...)",
    sortKey: "(...)",
    tag: "(...)",
    ticker: "(...)",
    timeoutAfter: "(...)",
    usesChronometer: "(...)",
    vibrate: "(...)",
    visibility: "(...)",
    when: "(...)",
  },
};


// ============================================================
const android_notification_from_PushdySDK = {
  "data": {
    "_notification_id": "2a2a5a61-b011-4a39-a1a9-4bc15fe243d8",
    "title": "Bão số 6 hướng đi khó lường",
    "image": "https://vortex.accuweather.com/adc2010/images/icons-numbered/01-l.png",
    "_nms_image": "https://znews-photo.zadn.vn/w660/Uploaded/cqdhmdxwp/2019_08_14/kuncherry90_67233597_965480387137244_1646091755794003933_n_copy.jpg",
    "_nms_payload": "eyJub3RpZmljYXRpb24iOnsidGl0bGUiOiJBbmggVsaw4bujbmcgZOG7sSDEkeG7i25oIGLDoW4gdGl2aSIsImJvZHkiOiJIw6NuZyB4ZSB04bu3IHBow7ogUGjhuqFtIE5o4bqtdCBWxrDhu6NuZyB24burYSBjw7MgdGhv4bqjIHRodeG6rW4gbOG7i2NoIHPhu60sIGzhuqFpIHLDsiBy4buJIHRpbiBt4bubaSB24buBIHRpdmkuIEjDo25nIHhlIHThu7cgcGjDuiBQaOG6oW0gTmjhuq10IFbGsOG7o25nIHbhu6thIGPDsyB0aG/huqMgdGh14bqtbiBs4buLY2ggc+G7rSwgbOG6oWkgcsOyIHLhu4kgdGluIG3hu5tpIHbhu4EgdGl2aS4gSMOjbmcgeGUgdOG7tyBwaMO6IFBo4bqhbSBOaOG6rXQgVsaw4bujbmcgduG7q2EgY8OzIHRob+G6oyB0aHXhuq1uIGzhu4tjaCBz4butLCBs4bqhaSByw7IgcuG7iSB0aW4gbeG7m2kgduG7gSB0aXZpIn0sImRhdGEiOnsicHVzaF9hY3Rpb24iOiJuYXZfdG9fYXJ0aWNsZV9kZXRhaWwiLCJwdXNoX2RhdGEiOnsiYXJ0aWNsZV9pZCI6MTc5MjY5fSwidGl0bGUiOiJCw6NvIHPhu5EgNiBoxrDhu5tuZyDEkWkga2jDsyBsxrDhu51uZyIsImJvZHkiOiLDjXQgbmjhuqV0IDcgdOG7iW5oIHRow6BuaCBz4bq9IGLhu4sg4bqjbmggaMaw4bufbmcsIGPhuqduIHPhurVuIHPDoG5nIHRpbmggdGjhuqduIOG7qW5nIHBow7MiLCJpbWFnZSI6Imh0dHBzOi8vdm9ydGV4LmFjY3V3ZWF0aGVyLmNvbS9hZGMyMDEwL2ltYWdlcy9pY29ucy1udW1iZXJlZC8wMS1sLnBuZyIsIl9ub3RpZmljYXRpb25faWQiOiIyYTJhNWE2MS1iMDExLTRhMzktYTFhOS00YmMxNWZlMjQzZDgifX0=",
    "push_data": "{\"article_id\":179269}",
    "body": "Ít nhất 7 tỉnh thành sẽ bị ảnh hưởng, cần sẵn sàng tinh thần ứng phó",
    "push_action": "nav_to_article_detail"
  },
  "body": "Ít nhất 7 tỉnh thành sẽ bị ảnh hưởng, cần sẵn sàng tinh thần ứng phó",
  "title": "Bão số 6 hướng đi khó lường"
}

const ios_notification_from_PushdySDK = {
  // Origin aps message receive from APNs
  "aps": {
    "alert": {
      "title": "Anh Vượng dự định bán tivi",
      "body": "Hãng xe tỷ phú Phạm Nhật Vượng vừa có thoả thuận lịch sử, lại rò rỉ tin mới về tivi. Hãng xe tỷ phú Phạm Nhật Vượng vừa có thoả thuận lịch sử, lại rò rỉ tin mới về tivi. Hãng xe tỷ phú Phạm Nhật Vượng vừa có thoả thuận lịch sử, lại rò rỉ tin mới về tivi"
    },
    "mutable-content": 1,
    "sound": {
      "volume": 10,
      "name": "default",
      "critical": 1
    }
  },

  // Pushdy SDK field
  "_notification_id": "d2afa827-da9b-4403-8c01-3f8d70fabad3",
  "_nms_image": "https://znews-photo.zadn.vn/w660/Uploaded/cqdhmdxwp/2019_08_14/kuncherry90_67233597_965480387137244_1646091755794003933_n_copy.jpg",

  // ==== bellow is payload.data when you post payload to https://api.pushdi.com/notification ====
  "title": "Bão số 6 hướng đi khó lường",
  "body": "Ít nhất 7 tỉnh thành sẽ bị ảnh hưởng, cần sẵn sàng tinh thần ứng phó",
  "image": "https://vortex.accuweather.com/adc2010/images/icons-numbered/01-l.png",
  "push_action": "nav_to_article_detail",
  "push_data": {
    "article_id": 179269
  },
}
 */
class RNPushdyWrapper {
  // Promise will reject if execution time is over this value in milisecs
  ttl = 10000;
  subscribers = {};

  /**
   * @param {Number} ttl Time to live in miliseconds. Default to 10,000 ms
   */
  setTimeout(ttl) {
    this.ttl = ttl;
  }

  async sampleMethod(str, num) {
    return this.callNative(RNPushdy.sampleMethod, str, num);
  }

  /**
   * Android only:
   * On android:
   *    registerForPushNotification was called automatically after PushdySDK's initilization
   *    true mean registered, false mean registering or failed.
   * On iOS:
   *    you need to call ios_registerForPushNotification manually from JS, that mean JS context was already be ready,
   *    so that you can listen to onRemoteNotificationRegistered event perfectly
   *    Or you can use isRemoteNotificationRegistered variable, it's depend!
   */
  async isRemoteNotificationRegistered() {
    return this.callNative(RNPushdy.isRemoteNotificationRegistered);
  }

  /**
   * https://guide.pushdy.com/i/tham-chieu-sdk-api/ios-native-sdk#registerforpushnotification
   *
   * @returns {Promise<void>}
   */
  async ios_registerForPushNotification() {
    if (isIos) {
      return this.callNative(RNPushdy.registerForPushNotifications);
    } else {
      console.log('%c{RnPushdy.ios_registerForPushNotification} support iOS only: ', logStyle.warning);
      return false;
    }
  }

  async isNotificationEnabled() {
    return this.callNative(RNPushdy.isNotificationEnabled);
  }

  /**
   * Turn on or off Pushdy built-in InAppBanner
   *
   * When you receive a notification in foreground:
   * - If enable: Pushdy SDK will show a notification in a built-in InAppBanner UI
   * - If NOT enable: Default to OS behavior
   *
   * Default to `true` on both android and ios
   *
   */
  async enablePushdyInAppBanner(enable) {
    if (isAndroid) {
      return this.callNative(RNPushdy.setBadgeOnForeground, enable);
    }
    else {
      console.error("[WIP] TODO: Check if this function is supported on iOS. For now, You should use this function on Android only");
      return false;
    }
  }

  async setPushBannerAutoDismiss(autoDismiss: boolean) {
    return this.callNative(RNPushdy.setPushBannerAutoDismiss, autoDismiss);
  }

  async setPushBannerDismissDuration(sec: number) {
    return this.callNative(RNPushdy.setPushBannerDismissDuration, sec);
  }

  async setCustomPushBanner(viewType: String) {
    return this.callNative(RNPushdy.setCustomPushBanner, viewType);
  }

  /**
   *
   * @deprecated
   */
  async setCustomMediaKey(mediaKey: String) {
    console.error("Do not supported");
    return false;
    return this.callNative(RNPushdy.setCustomMediaKey, mediaKey);
  }

  async setDeviceId(id: String) {
    return this.callNative(RNPushdy.setDeviceId, id);
  }

  async getDeviceId() {
    return this.callNative(RNPushdy.getDeviceId);
  }

  async getDeviceToken() {
    return this.callNative(RNPushdy.getDeviceToken);
  }

  async setReadyForHandlingNotification(enable) {
    return enable
      ? this.startHandleIncommingNotification()
      : this.stopHandleIncommingNotification();
  }

  async getReadyForHandlingNotification() {
    return this.callNative(RNPushdy.getReadyForHandlingNotification);
  }

  async startHandleIncommingNotification() {
    return this.callNative(RNPushdy.startHandleIncommingNotification);
  }

  async stopHandleIncommingNotification() {
    return this.callNative(RNPushdy.stopHandleIncommingNotification);
  }

  async getPendingNotification() {
    const a = await this.callNative(RNPushdy.getPendingNotification);
    return a ? PushdyNotification.from(a) : undefined;
  }

  async getPendingNotifications() {
    const items = await this.callNative(RNPushdy.getPendingNotifications);
    return items.map(i => new PushdyNotification(i));
  }

  async setAttribute(attr: String, value) {
    return this.callNative(RNPushdy.setAttribute, attr, value);
  }

  async pushAttribute(attr: String, value, commitImmediately: boolean) {
    return this.callNative(RNPushdy.pushAttribute, attr, value, commitImmediately);
  }

  async getPlayerID() {
    return this.callNative(RNPushdy.getPlayerID);
  }

  /**
   * ========= Hooks ============
   */

  /**
   * To see a list of supported events and its data structure
   * See guide on https://guide.pushdy.com/
   * TODO: Update this guide url
   *
   * @param listeners {[eventName]: function onEventNameTriggered() => {}}
   */
  startSubscribers(listeners) {
    const eventEmitter = new NativeEventEmitter(RNPushdy);

    const keys = Object.keys(listeners);
    for (let i = 0, c = keys.length; i < c; i++) {
      const eventName = keys[i];
      const listener = listeners[eventName];

      if (eventName === 'onNotificationReceived' || eventName === 'onNotificationOpened') {
        // Convert notification to PushdyNotification
        this.subscribers[eventName] = eventEmitter.addListener(eventName, (event) => {
          event.notification = new PushdyNotification(event.notification);
          listener(event)
        });
      } else {
        this.subscribers[eventName] = eventEmitter.addListener(eventName, (event) => {
          listener(event)
        });
      }
    }

    // console.log('{startSubscribers} this.subscribers: ', this.subscribers);
    /**
     * On some android devices, you need to check if events was successfully subscribed then you can send events to JS
     * Otherwise, Native will send event while NativeEventEmitter.addListener was not ready => Cause event was lost
     *
     * Reproduction:
     *  1. Press a noti in noti center while app is in BG / closed state
     *  2. App opened > React was init > JS was init / re-int(if BG) > subscribed again > Ready to receive event
     *  3. Native send a onNotificationOpen event when JS is not "Ready to receive event"
     *
     *
     */
    if (isAndroid) {
      // Read more about "enableFlag" at com.reactNativePushdy.PushdySdk#subscribedEventNames
      this.subscribers["enableFlag"] = eventEmitter.addListener("enableFlag", (event) => {});
      this.callNative(RNPushdy.setSubscribedEvents, keys);
    }
  }

  stopSubscribers() {
    const keys = Object.keys(this.subscribers);
    for (let i = 0, c = keys.length; i < c; i++) {
      const k = keys[i];
      this.subscribers[k].remove();
    }
    this.subscribers = {};
  }

  /**
   * ============ Internal function ===========
   */
  async callNative(fn, ...args) {
    /**
     * Report error with call stack
     * Find stack path
     */
    if (!fn) {
      try {
        throw Error("Native function was not defined. Ensure that RNPushdy.XXX is exposed to JS. Please investigate the Browser Console stack trace to know the missing function");
      }
      catch (e) {
        console.error(e);
      }

      return undefined;
    }

    return new Promise(async (resolve, reject) => {
      setTimeout(() => {
        // reject('Execution time is over ' + this.ttl);
        resolve(undefined); // Force to resolve to undefined without catch
      }, this.ttl);

      // const result = await fn(...args);
      // console.log('{callNative} result: ', result);
      // resolve(result);

      resolve(fn(...args));
    })
  }
}

export class PushdyNotification {
  title = null
  subtitle = null
  body = null
  image = null
  data = {}
  android = {}
  ios = {}

  /**
   * a = new PushdyNotification({title: 1, body: "test"})
   */
  constructor(data) {
    if (data) {
      const keys = Object.keys(data);
      for (let i = 0, c = keys.length; i < c; i++) {
        const k = keys[i];
        const v = data[k];
        this[k] = v;
      }
    } else {
      console.error("[PushdyNotification] data is null");
    }
  }

  /**
   * a = PushdyNotification.from({title: 1, body: "test"})
   */
  static from(genericObject) {
    if (!genericObject) {
      console.error("[PushdyNotification] genericObject is null");
    }

    return Object.assign(new PushdyNotification(), genericObject)
  }
}

export default new RNPushdyWrapper();
