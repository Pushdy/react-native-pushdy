import { NativeModules, NativeEventEmitter } from 'react-native';

const { Pushdy } = NativeModules;
// console.log('Pushdy: ', Pushdy);

// export default Pushdy;

/**
 * Wrapper to Pushdy native module
 *
 * [x] Implement TimeToLive feature
 * [x] Use Promise style instead of traditional callback ==> Did it on native side
 * [x] Keep same api interface between iOS & Android => Handle it on native side
 * [x] User can catch promise, do not cast all result to resolve
 */

class RnPushdy {
  // Promise will reject if execution time is over this value in milisecs
  ttl = 10000;
  subscribers = {};

  setTimeout(ttl) {
    this.ttl = ttl;
  }

  async sampleMethod(str, num) {
    return this.callNative(Pushdy.sampleMethod, str, num);
  }

  async getDeviceToken() {
    return this.callNative(Pushdy.getDeviceToken);
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
        listener(event)
      });
    }
  }

  stopSubscribers() {
    this.subscribers.map(i => i.remove());
    this.subscribers = {};
  }

  /**
   * ============ Internal function ===========
   */
  async callNative(fn, ...args) {
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

export default new RnPushdy();
