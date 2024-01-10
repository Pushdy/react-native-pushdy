import EventEmitter from 'eventemitter3';

/**
 * Usage:
 *  Follow the docs: https://nodejs.org/api/events.html
 *  ```js
 *  EventBus.on(eventName, listener)
 *  EventBus.emit(eventName[, ...args])
 *  EventBus.off(eventName, listener)
 *
 *  import EventBus from '~/services/EventBus'
 *  EventBus.on('commentSection_needScrollAgain', this.onScrollFailed);
 *  EventBus.emit('commentSection_needScrollAgain');
 *  EventBus.off('commentSection_needScrollAgain', this.onScrollFailed);
 *  ```
 */
const EventBus = new EventEmitter();
export const EventName = {
  SHOW_PUSHDY_BANNER: '_show_pushdy_banner_',
  HIDE_PUSHDY_BANNER: '_hide_pushdy_banner_',
  ON_SHOW_PUSHDY_BANNER: 'on_show_pushdy_banner',
  ON_HIDE_PUSHDY_BANNER: 'on_hide_pushdy_banner',
  ON_ACTION_PUSHDY_BANNER: 'on_action_pushdy_banner',
  ON_ACTION_PUSHDY_BANNER_ERROR: 'on_action_pushdy_banner_error',
  ON_ACTION_PUSHDY_BANNER_NOT_PERMIT: 'on_action_pushdy_banner_not_permit',
  READY_TO_SHOW_PUSHDY_BANNER: 'ready_to_show_pushdy_banner',
  ON_ERROR_PUSHDY_BANNER: 'on_error_pushdy_banner',
};

window.tmp_EventBus = EventBus;
export default EventBus;
