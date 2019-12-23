import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

// TODO: Rename both ios android to RNPushdy
const { Pushdy: androidPushdy, RNPushdy: iosPushdy } = NativeModules;

// console.log('Pushdy, RNPushdy: ', Pushdy, RNPushdy);

// export default Pushdy;

const isIos = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';
const logStyle = {
  warning: 'background: orange',
  error: 'background: red',
}

const Pushdy = isIos ? iosPushdy : isAndroid ? androidPushdy : null;
console.log('{react-native-pushdy/index} Pushdy: ', Pushdy);

/**
 * Wrapper to Pushdy native module
 *
 * [x] Implement TimeToLive feature
 * [x] Use Promise style instead of traditional callback ==> Did it on native side
 * [x] Keep same api interface between iOS & Android => Handle it on native side
 * [x] User can catch promise, do not cast all result to resolve
 */

class RNPushdyWrapper {
  // Promise will reject if execution time is over this value in milisecs
  ttl = 10000;
  subscribers = {};

  setTimeout(ttl) {
    this.ttl = ttl;
  }

  async sampleMethod(str, num) {
    return this.callNative(Pushdy.sampleMethod, str, num);
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
    return this.callNative(Pushdy.isRemoteNotificationRegistered);
  }

  /**
   * https://guide.pushdy.com/i/tham-chieu-sdk-api/ios-native-sdk#registerforpushnotification
   *
   * @returns {Promise<void>}
   */
  async ios_registerForPushNotification() {
    if (isIos) {
      return this.callNative(Pushdy.registerForPushNotifications);
    } else {
      console.log('%c{RnPushdy.ios_registerForPushNotification} support iOS only: ', logStyle.warning);
      return false;
    }
  }

  async isNotificationEnabled() {
    return this.callNative(Pushdy.isNotificationEnabled);
  }

  async setPushBannerAutoDismiss(autoDismiss: boolean) {
    return this.callNative(Pushdy.setPushBannerAutoDismiss, autoDismiss);
  }

  async setPushBannerDismissDuration(sec: number) {
    return this.callNative(Pushdy.setPushBannerDismissDuration, sec);
  }

  async setCustomPushBanner(viewType: String) {
    return this.callNative(Pushdy.setCustomPushBanner, viewType);
  }

  async setCustomMediaKey(mediaKey: String) {
    return this.callNative(Pushdy.setCustomMediaKey, mediaKey);
  }

  async setDeviceId(id: String) {
    return this.callNative(Pushdy.setDeviceId, id);
  }

  async getDeviceId() {
    return this.callNative(Pushdy.getDeviceId);
  }

  async getDeviceToken() {
    return this.callNative(Pushdy.getDeviceToken);
  }

  async getPendingNotification() {
    return this.callNative(Pushdy.getPendingNotification);
  }

  async getPendingNotifications() {
    return this.callNative(Pushdy.getPendingNotifications);
  }

  async setAttribute(attr: String, value) {
    return this.callNative(Pushdy.setAttribute, attr, value);
  }

  async pushAttribute(attr: String, value, commitImmediately: boolean) {
    return this.callNative(Pushdy.pushAttribute, attr, value, commitImmediately);
  }

  async getPlayerID() {
    return this.callNative(Pushdy.getPlayerID);
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
    const eventEmitter = new NativeEventEmitter(Pushdy);

    const keys = Object.keys(listeners);
    for (let i = 0, c = keys.length; i < c; i++) {
      const eventName = keys[i];
      const listener = listeners[eventName];

      this.subscribers[eventName] = eventEmitter.addListener(eventName, (event) => {
        // console.log('{RnPushdy.got event} eventName, event: ', eventName, event);
        listener(event)
      });
    }

    // console.log('{startSubscribers} this.subscribers: ', this.subscribers);
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
        throw Error("Native function was not defined. Ensure that Pushdy.XXX is exposed to JS");
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

export default new RNPushdyWrapper();
