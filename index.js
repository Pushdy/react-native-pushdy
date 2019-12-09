import { NativeModules } from 'react-native';

const { Pushdy } = NativeModules;

/**
 * Wrapper to Pushdy native module
 *
 * [x] Implement TimeToLive feature
 * [x] Use async await style instead of traditional callback
 */
class RnPushdy {
  // Promise will reject if execution time is over this value in milisecs
  ttl = 10000;

  async sampleMethod(str, num) {
    return this.withTTL(Pushdy.sampleMethod, str, num).catch(e => []);
  }

  async getDeviceToken() {
    return this.withTTL(Pushdy.getDeviceToken).catch(e => null);
  }

  async isNotificationEnabled() {
    return this.withTTL(Pushdy.isNotificationEnabled).catch(e => null);
  }

  /**
   * ============ Internal function ===========
   */
  async withTTL(fn, ...args) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Execution time is over ' + this.ttl);
      }, this.ttl);

      fn(...args, (...results) => {
        resolve(results.length === 1 ? results[0] : results)
      })
    })
  }
}

export default new RnPushdy();
