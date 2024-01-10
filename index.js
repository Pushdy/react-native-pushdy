import React from 'react';
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue';
import EventBus, { EventName } from './src/EventBus';
import { PushdyBanner } from './src/PushdyBanner';

const forceDevEnv = false; // null mean env will not be force, false is force prod, true is force dev
const dev = __DEV__;
if (forceDevEnv != null ? forceDevEnv : dev) {
  MessageQueue.spy((msg) => {
    if (
      msg.module === 'RNPushdy' ||
      (msg.module === null && msg.method.toString().indexOf('RNPushdy') >= 0)
    ) {
      const fromTo = msg.type === 0 ? '[To JS]' : '[To Native]';
      const color = msg.type === 0 ? '#693' : '#639';
      console.log('%c' + fromTo + ' msg:', 'color: ' + color, msg);
    } else if (msg.module === 'RCTDeviceEventEmitter') {
      return;

      // Ignore websocketMessage
      if (msg.args && msg.args[0] === 'websocketMessage') {
        return;
      }

      const fromTo = msg.type === 0 ? '[To JS]' : '[To Native]';
      const color = msg.type === 0 ? '#693' : '#639';
      console.log(
        '%c' + fromTo + ' args, msg:',
        'color: ' + color,
        msg.args,
        msg
      );
    }
  });
  console.log('{PushdyMessaging} Spy enabled: ');
} else {
  console.log('{PushdyMessaging} Spy disabled: ');
}

const { RNPushdy } = NativeModules;
// console.log('{react-native-pushdy/index} RNPushdy: ', RNPushdy);

const isIos = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';
const logStyle = {
  warning: 'background: orange',
  error: 'background: red',
};

const Test_Banner_HTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" >
    <title></title>
</head>
<style>
    @import url('https://fonts.cdnfonts.com/css/futura-lt');
    html,
    body,
    div,
    span,
    applet,
    object,
    iframe,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    blockquote,
    pre,
    a,
    abbr,
    acronym,
    address,
    big,
    cite,
    code,
    del,
    dfn,
    em,
    img,
    ins,
    kbd,
    q,
    s,
    samp,
    small,
    strike,
    strong,
    sub,
    sup,
    tt,
    var,
    b,
    u,
    i,
    center,
    dl,
    dt,
    dd,
    ol,
    ul,
    li,
    fieldset,
    form,
    label,
    legend,
    table,
    caption,
    tbody,
    tfoot,
    thead,
    tr,
    th,
    td,
    article,
    aside,
    canvas,
    details,
    embed,
    figure,
    figcaption,
    footer,
    header,
    hgroup,
    menu,
    nav,
    output,
    ruby,
    section,
    summary,
    time,
    mark,
    audio,
    video {
        margin: 0;
        padding: 0;
        border: 0;
    }

    body {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .banner-pushdy {
        height: 594px;
        width: 324px;
        margin: 10px auto;
        border-radius: 10px;
        background-image: url('https://cdn.24hmoney.vn/upload/img/2023-4/news-body-img/2023-12-20/a4ef1fa4-a94b-4518-92fa-46f4dab81edb-1703065684828-width648height1130.jpg');
        background-repeat: no-repeat;
        background-size: 324px 594px;
    }
    .free-space {
        height: 63%;
    }
    .content {
        height: 37%;
        position: relative;
        padding: 0 20px;
    }
    .content>.user_name {
        text-align: center;
    }
    .avatar {
        width: 90px;
        height: 100%;
        position: absolute;
        top: -22px;
    }
    .avatar>img {
        width: 100%;
        border-radius: 8px;
    }
    .avatar>.block-name {
        text-align: center;
    }
    .wish {
        width: calc(100% - 110px);
        margin-top: 6px;
        position: absolute;
        top: revert;
        right: 0;
        font-family: sans-serif;
        font-size: 14px;
        line-height: 18px;
        margin-right: 7px;
    }
    .wish>.content_ {
        padding: 0 10px 0 20px;
        font-family: "Futura LT", sans-serif;
    }
    .signer {
        padding-left: 16px;
        padding-top: 8px;
    }
</style>
<body>
    <div class="banner-pushdy">
        <div class="free-space"></div>
        <div class="content">
            <div class="avatar">
                <img id="avatar_" src="" alt="">
                <p class="block-name"><b id="user_name"></b></p>
            </div>
            <div class="wish">
                <div class="content_" id="content_wish"></div>
                <div class="signer">
                    <canvas id="myCanvas" width="115" height="60"></canvas>
                </div>
            </div>
        </div>
    </div>
    </body>
<script>
    // set avatrar
    let userName = "Trương Gia Bình"
    let dom_avatar = document.getElementById("avatar_")
    dom_avatar.setAttribute("src", 'https://cdn.24hmoney.vn/upload/img/2023-3/user-avatar/2023-09-25/bdaa3a5e-1b51-4e4e-a0d0-7d8fff55e15d-1695624764685-width200height200.jpg')
    // set usser
    let dom_userName = document.getElementById("user_name")
    dom_userName.innerText = userName
    // set content wish
    let dom_wish = document.getElementById("content_wish")
    let data = "<i styl=''>Cảm ơn quý khách <b style='font-style: normal;font-family: sans-serif;'>Trương Gia Bình</b> vì đã lựa chọn 24HMoney. Nhân dịp năm mới 2024, công ty kính chúc quý khách an khang, thịnh vượng, vạn sự như ý!</i>"
    dom_wish.insertAdjacentHTML('beforeend', data)
    let url_signer = 'https://cdn.24hmoney.vn/upload/img/signed/sign-bangpd.svg'
    let dom_signer = document.getElementById("signer_img")
    drawImage()
    function drawImage() {
        let ctx = document.getElementById("myCanvas").getContext("2d");
        let img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0); // Or at whatever offset you like
        };
        img.src = url_signer;
        // ctx.drawImage(img,0,0);  
    }
</script>
</html>`;

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
  "push_action": "navigate_to_article_detail",
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
   * @deprecated: Use _CustomInAppBannerComponent != null instead
   * @private
   */
  // _useSDKInAppBannerHandler = true
  _CustomInAppBannerComponent = null;

  /**
   * @param {Number} ttl Time to live in miliseconds. Default to 10,000 ms
   */
  setTimeout(ttl) {
    this.ttl = ttl;
  }

  async sampleMethod(str, num) {
    return this.callNative(RNPushdy.sampleMethod, str, num);
  }

  async initPushdy(options) {
    return this.callNative(RNPushdy.initPushdy, options);
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
      console.log(
        '%c{RnPushdy.ios_registerForPushNotification} support iOS only: ',
        logStyle.warning
      );
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
   * @deprecated Please use `setCustomInAppBannerComponent` instead
   */
  async enablePushdyInAppBanner(enable) {
    if (isAndroid) {
      return this.callNative(RNPushdy.setBadgeOnForeground, enable);
    } else {
      console.error(
        '[WIP] TODO: Check if this function is supported on iOS. For now, You should use this function on Android only'
      );
      return false;
    }
  }

  /**
   *
   * @param {boolean} autoDismiss
   * @returns
   */
  async setPushBannerAutoDismiss(autoDismiss) {
    return this.callNative(RNPushdy.setPushBannerAutoDismiss, autoDismiss);
  }

  /**
   *
   * @param {number} sec
   * @returns
   */
  async setPushBannerDismissDuration(sec) {
    return this.callNative(RNPushdy.setPushBannerDismissDuration, sec);
  }

  /**
   *
   * @param {string} viewType
   * @returns
   */
  async setCustomPushBanner(viewType) {
    return this.callNative(RNPushdy.setCustomPushBanner, viewType);
  }

  /**
   * @param {string} mediaKey
   * @deprecated
   */
  async setCustomMediaKey(mediaKey) {
    console.error('Do not supported');
    return false;
    return this.callNative(RNPushdy.setCustomMediaKey, mediaKey);
  }

  /**
   * You need to call this fn first
   * @param {string} id
   */
  async setDeviceId(id) {
    if (!id) {
      throw Error('setDeviceId: id cannot be empty');
    }

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
    return a ? new PushdyNotification(a) : undefined;
  }

  async getPendingNotifications() {
    const items = await this.callNative(RNPushdy.getPendingNotifications);
    return items.map((i) => new PushdyNotification(i));
  }

  /**
   * Flow here:
   * When clicking notification from background or foreground. onNotificationOpened is triggered then
   * notification is saved.
   * getInitialNotification is used to re-trigger open notification when app restarts.
   * If you handled initicalNotification successful, please call removeInitalNotification.
   * Resolved issue: https://github.com/Pushdy/react-native-pushdy/issues/3
   * @return JSONObject
   */
  async getInitialNotification() {
    let a = await this.callNative(RNPushdy.getInitialNotification);
    return a ? new PushdyNotification(a) : null;
  }

  async removeInitialNotification() {
    return this.callNative(RNPushdy.removeInitialNotification);
  }

  /**
   * This method will return isAppOpenedFromPush = true if app opened from push (when app was killed).
   *
   * When app enters background (when opened from push) isAppOpenedFromPush will reset it's value (isAppOpenedFromPush = false).
   *
   * When app in background, then open push behavior will be different between each Platform (This method works in Android, currently not available in iOS)
   */
  async isAppOpenedFromPush() {
    return this.callNative(RNPushdy.isAppOpenedFromPush);
  }

  /**
   *
   * @param {string} attr
   * @param {any} value
   * @param {boolean} immediately
   * @returns
   */
  async setAttribute(attr, value, immediately = false) {
    if (value === null || value === undefined) {
      console.warn(
        '[Pushdy] ERROR: Invalid value argument, must not null/undefined instead of: ',
        value
      );
      return false;
    }

    // return true;

    // TODO: Reimplement setAttributeFromValueContainer for ios
    return isAndroid
      ? this.callNative(
          RNPushdy.setAttributeFromValueContainer,
          attr,
          { data: value },
          immediately
        )
      : this.callNative(RNPushdy.setAttributeFromOption, {
          attr,
          data: value,
          immediately,
        });
  }

  /**
   * @param {String} attr
   * @param {Number|String|Array} value
   * @param {Boolean} value Persist data to Pushdy immediately or let Pushdy persist it by SDK schedule
   * @returns {Promise<Boolean>}
   */
  async pushAttribute(attr, value, immediately = false) {
    if (!Array.isArray(value)) {
      value = [value];
    }

    return this.callNative(
      RNPushdy.pushAttributeArray,
      attr,
      value,
      immediately
    );
  }

  async getPlayerID() {
    return this.callNative(RNPushdy.getPlayerID);
  }

  async makeCrash() {
    return this.callNative(RNPushdy.makeCrash);
  }

  /**
   *
   * @param {number} count
   * @returns
   */
  async setApplicationIconBadgeNumber(count) {
    if (isIos) {
      return this.callNative(RNPushdy.setApplicationIconBadgeNumber, count);
    } else {
      return undefined;
    }
  }

  async getApplicationIconBadgeNumber() {
    if (isIos) {
      return this.callNative(RNPushdy.getApplicationIconBadgeNumber);
    } else {
      return undefined;
    }
  }

  /**
   * Get pending events that haven't been sent to server yet from Pushdy SDK
   * @param {Number} count
   */
  async getPendingEvents(count = 50) {
    return this.callNative(RNPushdy.getPendingEvents, count);
  }

  /**
   * Set pending events that will be sent to server later
   * @param {{
   *  events: Record<string, any>[]
   * }[]} count
   */
  setPendingEvents(events) {
    return this.callNative(RNPushdy.setPendingEvents, events);
  }

  /**
   * Remove pending events that haven't been sent to server yet from Pushdy SDK.
   *  @param {number} count
   */
  async removePendingEvents(count) {
    return this.callNative(RNPushdy.removePendingEvents, count);
  }

  /**
   * set application id to Pushdy SDK for tracking purpose
   * @param {string} applicationId
   * @returns
   */
  setApplicationId(applicationId) {
    return this.callNative(RNPushdy.setApplicationId, applicationId);
  }

  /**
   * Track event to Pushdy SDK. This event will be sent to server later or immediately
   * base on `immediate` argument
   * @param {string} event
   * @param {Record<string, any>} params
   * @param {boolean} immediate
   */
  async trackEvent(event, params, immediate = false) {
    return this.callNative(RNPushdy.trackEvent, event, params, immediate);
  }

  /**
   * Push pending events to server immediately.
   * @param {(response) => void} successCallback
   * @param {(code, message) => void} failureCallback
   */
  pushPendingEvents() {
    return this.callNative(RNPushdy.pushPendingEvents);
  }

  /**
   *
   * @param {*} notificationId
   * @returns
   */

  handleCustomInAppBannerPressed(notificationId) {
    // notice SDK that this notification was opened
    // console.log('{RNPushdyWrapper.handleCustomInAppBannerPressed} notificationId: ', notificationId);
    return this.callNative(
      RNPushdy.handleCustomInAppBannerPressed,
      notificationId
    );
  }

  /**
   * Show in app banner on foreground by using `Pushdy built-in InAppBanner` or `using custom JS banner`
   *
   * When you receive a notification in foreground:
   * - If component is null: Pushdy SDK will show a notification in a built-in InAppBanner UI, by native view, defined inside SDK
   * - If component is instance: Pushdy SDK will show a notification in a custom view
   *
   * Usage:
   * Please see the:
   * If component is instance => You take 100% control how the UI look / visible via component state,
   *
   * @param {CustomInAppBannerBaseView} component React component instance (not class definition), should inherit from  `react-native-pushdy/CustomInAppBannerBaseView`
   *                                              Because CustomInAppBannerBaseView already do some SDK communication, you don't need to care about logic, care your UI only
   *
   * @returns {Promise<boolean>}
   */
  setCustomInAppBannerComponent(component) {
    this._CustomInAppBannerComponent = component;
    return this.callNative(RNPushdy.useSDKHandler, component === null);
  }

  removeCustomInAppBannerComponent() {
    return this.setCustomInAppBannerComponent(null);
  }

  getCustomInAppBannerComponent() {
    return this._CustomInAppBannerComponent;
  }

  bannerListeners = {
    onShow: () => { },
    onHide: () => { },
    onAction: () => { },
    onError: () => { },
  }

  onShowPushdyBanner = (bannerId) => {
    this.bannerListeners.onShow(bannerId);
    this.trackBanner(bannerId, 'impression');
  };

  onHidePushdyBanner = (bannerId) => {
    this.bannerListeners.onHide(bannerId);
    this.trackBanner(bannerId, 'close');
  };

  onActionPushdyBanner = (bannerId, action_type, extra_data) => {
    this.bannerListeners.onAction(bannerId, action_type, extra_data);
    this.trackBanner(bannerId, 'click');
  };
  
  onErrorPushdyBanner = (bannerId, error, action_type) => {
    this.bannerListeners.onError(bannerId, error, action_type);
  };

  /**
   * To show a banner on foreground.
   *
   * @param {{
   *    onShow: (bannerId: string) => void,
   *    onHide: (bannerId: string) => void,
   *    onAction: (bannerId: string, action_type: "save" | "share", extra_data: any) => void,
   *    onError: (bannerId: string, error: string, action_type: string) => void,
   * }} props
   */
  initialPushdyBanner = (props) => {
    this.bannerListeners.onHide = props.onHide || (() => { });
    this.bannerListeners.onShow = props.onShow || (() => { });
    this.bannerListeners.onAction = props.onAction || (() => { });
    this.bannerListeners.onError = props.onError || (() => { });
    // register for event of PushdyBanner.
    EventBus.on(EventName.ON_SHOW_PUSHDY_BANNER, this.onShowPushdyBanner);
    EventBus.on(EventName.ON_HIDE_PUSHDY_BANNER, this.onHidePushdyBanner);
    EventBus.on(EventName.ON_ACTION_PUSHDY_BANNER, this.onActionPushdyBanner);
    EventBus.on(EventName.ON_ERROR_PUSHDY_BANNER, this.onErrorPushdyBanner);
    // send a event that ensure it's ready to show banner if needed
    EventBus.emit(EventName.READY_TO_SHOW_PUSHDY_BANNER);

    this.checkAndShowPushdyBanner();
  };

  checkAndShowPushdyBanner = async () => {
    const banners = await this.getAllBanners();
    console.log('{RNPushdyWrapper.checkAndShowPushdyBanner} banners: ', banners);

    if (Array.isArray(banners)) {
      for (let i = 0; i <banners.length; i++) {
        let banner = banners[i];
        let trackingBannerData = await this.getBannerTrackingData(banner.id);
        console.log('{RNPushdyWrapper.checkAndShowPushdyBanner} -> trackingBannerData:', trackingBannerData);

        // if banner is already shown, then skip it
        if (trackingBannerData && trackingBannerData.imp > 0) {
          continue;
        } else {
          this.trackBanner(banner.id, 'loaded');
          EventBus.emit(EventName.SHOW_PUSHDY_BANNER, {
            html: banner.html,
            bannerId: banner.id,
          });
          break;
        }

      }
    }
  };

  disposePushdyBanner = () => {
    // unregister for event of PushdyBanner.
    EventBus.off(EventName.ON_SHOW_PUSHDY_BANNER, this.onShowPushdyBanner);
    EventBus.off(EventName.ON_HIDE_PUSHDY_BANNER, this.onHidePushdyBanner);
    EventBus.off(EventName.ON_ACTION_PUSHDY_BANNER, this.onActionPushdyBanner);
    EventBus.off(EventName.ON_ERROR_PUSHDY_BANNER, this.onErrorPushdyBanner);
  };

  subscribe = () => {
    this.callNative(RNPushdy.subscribe);
  }

  getAllBanners = async() => {
    return this.callNative(RNPushdy.getAllBanners);
  };

  /**
   * @param {string} bannerId
   * @param {'impression' | 'loaded' | 'close' | 'click'} type
   */
  trackBanner =async(bannerId, type) => {
    return this.callNative(RNPushdy.trackBanner, bannerId, type);
  }

  /**
   * @param {string} bannerId
   */
  getBannerTrackingData = (bannerId) => {
    return this.callNative(RNPushdy.getBannerData, bannerId);
  }

  __testPushdyBanner = () => {
    __DEV__ &&
      console.log(
        '{RNPushdyWrapper.__testPushdyBanner} Test_Banner_HTML: ',
        Test_Banner_HTML
      );
    EventBus.emit(EventName.SHOW_PUSHDY_BANNER, {
      html: Test_Banner_HTML,
      bannerId: 'test_banner_id',
    });
  };

  PushdyBanner = () => {
    return <PushdyBanner />;
  };

  /**
   * ========= Hooks ============
   */

  /**
   * To see a list of supported events and its data structure
   * See guide on https://guide.pushdy.com/
   *
   * @param {{}} listeners {[eventName]: function onEventNameTriggered() => {}}
   */
  startSubscribers(listeners = {}) {
    const eventEmitter = new NativeEventEmitter(RNPushdy);

    const keys = Object.keys(listeners);
    for (let i = 0, c = keys.length; i < c; i++) {
      const eventName = keys[i];
      const listener = listeners[eventName];

      // ignore to subscribe if event already exist
      // const existingListeners = eventEmitter.listeners(eventName)
      // if (existingListeners.length) {
      //   console.warn('{RNPushdyWrapper.startSubscribers} already subscribed: eventName: ', eventName);
      //   continue
      // }

      if (
        eventName === 'onNotificationReceived' ||
        eventName === 'onNotificationOpened'
      ) {
        // Convert notification to PushdyNotification
        this.subscribers[eventName] = eventEmitter.addListener(
          eventName,
          (event) => {
            event.notification = new PushdyNotification(event.notification);
            listener(event);
          }
        );
      } else {
        this.subscribers[eventName] = eventEmitter.addListener(
          eventName,
          (event) => {
            listener(event);
          }
        );
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
      this.subscribers['enableFlag'] = eventEmitter.addListener(
        'enableFlag',
        (event) => {}
      );
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
        throw Error(
          'Native function was not defined. Ensure that RNPushdy.XXX is exposed to JS. Please investigate the Browser Console stack trace to know the missing function'
        );
      } catch (e) {
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
    });
  }
}

export class PushdyNotification {
  id = null;
  title = null;
  subtitle = null;
  body = null;
  image = null;

  // The custom data
  data = {};

  android = {}; //
  ios = {}; // aps: {"alert":{"title":"***","body":"***"},"mutable-content":1,"sound":{"volume":10,"name":"default","critical":1}}

  _KeyAlias = {
    _notification_id: 'id',
    _nms_image: 'image',
    aps: 'ios',
    // android: 'android',
  };

  /**
   * a = new PushdyNotification({title: 1, body: "test"})
   */
  constructor(data) {
    console.log('{PushdyNotification.constructor} data: ', data);
    if (data) {
      const keys = Object.keys(data);
      for (let i = 0, c = keys.length; i < c; i++) {
        const k = keys[i];
        const v = data[k];

        const mappedKey = this._KeyAlias[k] ? this._KeyAlias[k] : k;
        this[mappedKey] = v;
      }

      // Map some special case
      if (isIos) {
        // restore for ios
        const aps = data.aps ? data.aps : {};
        const aps_alert = aps.alert ? aps.alert : {};
        this.title = aps_alert.title;
        this.body = aps_alert.body;
      } else if (isAndroid) {
        // restore for android
        // Android is special
        const d = data.data;
        if (d) {
          this.id = d._notification_id;
          this.image = d._nms_image;
        }
      }
    } else {
      console.error('[PushdyNotification] data is null');
    }
  }
}

const RNPushdyWrapperInst = new RNPushdyWrapper();
dev && (window.tmp_Pushdy = RNPushdyWrapperInst);
export default RNPushdyWrapperInst;
