/**
 * This component is used to display Pushdy banner
 * as a Popup WebView.
 * They will have 3 different types: TOP_BANNER: 0, BOTTOM_BANNER: 1, MIDDLE_BANNER: 2
 * If type is TOP_BANNER or BOTTOM_BANNER, the banner will be displayed as a Popup WebView and will be placed at the top or bottom of the screen.
 * If type is MIDDLE_BANNER, the banner will be displayed as a Popup WebView and will be placed at the center of the screen.
 */
import React, { useEffect, useRef } from 'react';
import { Clipboard, Dimensions, Image, StyleSheet, View } from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Share from 'react-native-share';
import { captureRef } from 'react-native-view-shot';
import WebView from 'react-native-webview';
import { useCreation, useReactive } from 'ahooks';
import icSave from './assets/save.png';
import icClose from './assets/close.png';
import icShare from './assets/share.png';

import { getStatusBarHeight, requestPermisionMediaAndroid } from './Util';
import EventBus, { EventName } from './EventBus';

const color = {
  white: '#ffffff',
  grey1: '#1a1a1a',
};

const SCREEN_WIDTH = Dimensions.get('window').width || Dimensions.get('screen').width;

/**
 * How it works:
 * 1. When the app is launched, we will check if there is any banner to display.
 * 2. Display the banner with full height and check to size of the banner.
 * 3. If the banner is too large, we will resize it to fit the screen.
 * 4. Change the banner position and show it.
 * 5. If click outside the banner, we will close the banner.
 * @param {{
 *  bottomView?: React.Component,
 * topView?: React.Component,
 * }} props 
 * @returns 
 */
export const PushdyBanner = (props) => {
  const webViewRef = useRef(null);
  const viewShotRef = useRef(null);
  // const translateY = useSharedValue(+Dimensions.get('window').height);
  // const btnCOpacity = useSharedValue(0);
  const state = useReactive({
    bannerWidth: Dimensions.get('window').width,
    bannerHeight: Dimensions.get('window').height,
    border: 10,
    html: '',
    url: '',
    margin: 20,
    isShow: false,
    key: Math.random().toString(),
    shareUrl: '',
    containerWidth: Dimensions.get('window').width,
    containerHeight: Dimensions.get('window').height,
    bannerId: '',
    onShow: () => {},
    translateY: Dimensions.get('window').height,
    btnCOpacity: 0,
  });

  const onPressOutside = () => {
    hideBannerWithAnimation();
  };

  const onLoadEnd = () => {
    // inject javascript to get the size of the banner
    const widthBanner = Math.min(
      450,
      SCREEN_WIDTH - state.margin * 3,
    )
    let jsCode = `
      var body = document.getElementsByTagName('body')[0];
      // // remove all in body but keep the banner div with class banner-pushdy
      // while (body.firstChild) {
      //   if (body.firstChild.className !== 'banner-pushdy') {
      //     body.removeChild(body.firstChild);
      //   } else {
      //     break;
      //   }
      // }

      // add body style margin: 0 padding: 0
      body.style.margin = '0';
      body.style.padding = '0';

      // add this meta to head <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" >
      var meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.getElementsByTagName('head')[0].appendChild(meta);
      var banner = document.getElementsByClassName('banner-pushdy')[0];
      var bannerHeight = banner.offsetHeight;
      var bannerWidth = banner.offsetWidth;
      const newHeight = Math.floor(bannerHeight*${widthBanner}/bannerWidth)
      var styleContent = document.getElementsByClassName("wrap-card")[0]
      styleContent.style.width = "${widthBanner}px"
      styleContent.style.height = newHeight + "px"
      var heightNew = newHeight + "px"
      styleContent.style['background-size'] = "${widthBanner}px "+ heightNew;
      window.ReactNativeWebView.postMessage(JSON.stringify({bannerHeight: newHeight, bannerWidth: ${widthBanner} }));
    `;

    webViewRef.current.injectJavaScript(jsCode);
  };

  /**
   *
   * @param {import('react-native-webview').WebViewMessageEvent} event
   */
  const onMessage = (event) => {
    try {
      // handle message from the banner
      let data = JSON.parse(event.nativeEvent.data);
      if (data.bannerHeight && data.bannerWidth) {
        console.log(
          '{PushdyBanner} -> got banner size, prepare to show banner',
          data
        );
        state.bannerHeight = data.bannerHeight;
        state.bannerWidth = data.bannerWidth;
        setTimeout(() => {
          state.isShow = true;
        }, 250);
      }
    } catch (error) {}
  };

  const animeHide2 = () => {
    state.isShow = false;
    state.url = '';
    state.html = '';
    state.key = Math.random().toString();
    state.shareUrl = '';
    state.bannerId = '';
  };

  const animeHide = () => {
    // translateY.value = withTiming(+Dimensions.get('window').height, {}, () => {
    //   runOnJS(animeHide2)();
    // });

    state.translateY = +Dimensions.get('window').height;
    requestAnimationFrame(() => {
      animeHide2();
    });
  };

  const hideBannerWithAnimation = () => {
    // btnCOpacity.value = withTiming(
    //   0,
    //   {
    //     duration: 100,
    //   },
    //   () => {
    //     runOnJS(animeHide)();
    //   },
    // );

    state.btnCOpacity = 0;
    requestAnimationFrame(() => {
      animeHide();
      EventBus.emit(EventName.ON_HIDE_PUSHDY_BANNER, state.bannerId);
    });
  };

  const showBanner = (data) => {
    // When call showBanner, dissmiss all popup
    console.log('{PushdyBanner} -> onShowBanner', data);
    state.border = data?.border ?? 10;
    state.html = data?.html;
    state.url = data?.url ?? '';
    state.margin = data?.margin ?? 20;
    state.key = data?.key ?? Math.random().toString();
    state.shareUrl = data?.shareUrl ?? '';
    state.bannerId = data?.bannerId ?? '';
    state.onShow = data?.onShow ?? (() => {});
    EventBus.emit(EventName.ON_SHOW_PUSHDY_BANNER, data?.bannerId ?? '');
  };

  const hideBanner = () => {
    console.log('{PushdyBanner} -> onHideBanner');
    hideBannerWithAnimation();
  };

  const saveBannerToImage = () => {
    state.border = 0;
    setTimeout(() => {
      captureRef(viewShotRef, {
        result: 'tmpfile',
        format: 'jpg',
      })
        .then(async (path) => {
          let isGranted = await requestPermisionMediaAndroid();
          if (isGranted) {
            CameraRoll.save(path)
              .then(() => {
                // Alert to notify user that the banner is saved to gallery.
                EventBus.emit(
                  EventName.ON_ACTION_PUSHDY_BANNER,
                  state.bannerId,
                  'save',
                  path
                );
              })
              .catch((err) => {
                // Alert to notify user that the banner is not saved to gallery.
                EventBus.emit(
                  EventName.ON_ERROR_PUSHDY_BANNER,
                  state.bannerId,
                  'save',
                  err
                );
              });
          } else {
            // Alert to ask user to grant permission.
            EventBus.emit(
               EventName.ON_ERROR_PUSHDY_BANNER,
                  state.bannerId,
              'save',
              "PERMISSION_NOT_GRANTED"
            );
          }
        })
        .catch((err) => {
          console.log('{PushdyBanner} -> saveBannerToImage -> err', err);
          EventBus.emit(
            EventName.ON_ERROR_PUSHDY_BANNER,
            state.bannerId,
            'save',
            err
          );
        })
        .finally(() => {
          state.border = 10;
        });
    }, 250);
  };

  const onShown = () => {
    // show the button container
    // btnCOpacity.value = withSpring(1, {
    //   duration: 200,
    // });

    state.btnCOpacity = 1;

    if (typeof state.onShow === 'function') {
      state.onShow();
    }
  };

  const onPressShare = () => {
    console.log('{PushdyBanner} -> onPressShare');
    EventBus.emit(EventName.ON_ACTION_PUSHDY_BANNER, state.bannerId, 'share');
    // hideBanner();
    // share with base64.
    state.border = 0;
    setTimeout(() => {
      captureRef(viewShotRef, {
        result: 'tmpfile',
        format: 'jpg',
        result: 'base64'
      })
        .then(async (base64) => {
          let base64Format = `data:image/jpeg;base64,${base64}`;
          Share.open({
            urls: [base64Format],
          });
        })
        .catch((err) => {
          console.log('{PushdyBanner} -> saveBannerToImage -> err', err);
          EventBus.emit(
            EventName.ON_ERROR_PUSHDY_BANNER,
            state.bannerId,
            'share',
            err
          );
        })
        .finally(() => {
          state.border = 10;
        });
    }, 250);
    

   

  };

  const onPressCopylink = () => {
    Clipboard.setString(state.shareUrl);

    // Alert to notify user that the banner link is copied to clipboard.
    EventBus.emit('show_toast', 'Đã sao chép link thiệp');
  };

  useEffect(() => {
    EventBus.on(EventName.SHOW_PUSHDY_BANNER, showBanner);
    EventBus.on(EventName.HIDE_PUSHDY_BANNER, hideBanner);
    return () => {
      EventBus.off(EventName.SHOW_PUSHDY_BANNER, showBanner);
      EventBus.off(EventName.HIDE_PUSHDY_BANNER, hideBanner);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animShow = () => {
    // translateY.value = withSpring(
    //   0,
    //   {
    //     mass: 0.9,
    //     damping: 10,
    //     stiffness: 45,
    //     overshootClamping: false,
    //     restDisplacementThreshold: 0.01,
    //     restSpeedThreshold: 2,
    //     duration: 300,
    //   },
    //   () => {
    //     runOnJS(onShown)();
    //   },
    // );

    state.translateY = 0;
    requestAnimationFrame(() => {
      onShown();
    });
  };

  useEffect(() => {
    if (state.isShow) {
      // show the banner
      animShow();

      // re-render the banner when the screen size is changed
      Dimensions.addEventListener('change', () => {
        state.containerWidth = Dimensions.get('window').width;
        state.containerHeight = Dimensions.get('window').height;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isShow]);

  const conntainerStyles = {
    display: state.isShow ? undefined : 'none',
    flex: 1,
    position: 'absolute',
    top: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.8)',
    // paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const viewSnapshotStyle = {
    width: state.bannerWidth,
    height: state.bannerHeight,
    borderTopLeftRadius: state.border,
    borderTopRightRadius: state.border,
    borderBottomLeftRadius: state.border,
    borderBottomRightRadius: state.border,
    overflow: 'hidden',
    alignSelf: 'center',

    // position: 'absolute',
    // marginLeft: Dimensions.get('window').width / 2 - state.bannerWidth / 2 - 20,
    marginTop:
      state.containerHeight / 2 -
      state.bannerHeight / 2 -
      getStatusBarHeight() -
      50 / 2,
  };

  const webViewAutoStyle = {
    width: state.bannerWidth,
    height: state.bannerHeight,
    borderTopLeftRadius: state.border,
    borderTopRightRadius: state.border,
    borderBottomLeftRadius: state.border,
    borderBottomRightRadius: state.border,
    overflow: 'hidden',
  };

  const animatedStyle = {
    transform: [{ translateY: state.translateY }],
  };

  const viewStyle = [
    {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      borderRadius: state.border,
    },
    animatedStyle,
  ];

  const btnAnimatedStyle = {
    opacity: state.btnCOpacity,
  };

  const btnCStyle = [styles.btnC, btnAnimatedStyle];

  const source = useCreation(() => {
    if (state.url) {
      return { uri: state.url };
    }
    return { html: state.html };
  }, [state.url, state.html]);

  return (
    <SafeAreaView style={conntainerStyles}>
      <View style={styles.hideBackground} />
      <View activeOpacity={1} style={styles.hiddenTouch} onPress={() => {}}>
        <View collapsable={false} style={viewStyle}>
          {props.topView}
          <View
            collapsable={false}
            pointerEvents='none'
            style={viewSnapshotStyle}
            ref={viewShotRef}
          >
            <WebView
              key={state.key}
              ref={webViewRef}
              showsVerticalScrollIndicator={false}
              scalesPageToFit={true}
              scrollEnabled={false}
              setSupportMultipleWindows={false}
              textInteractionEnabled={false}
              overScrollMode={'never'}
              pinchGestureEnabled={false}
              source={source}
              onMessage={onMessage}
              onLoadEnd={onLoadEnd}
              style={webViewAutoStyle}
            />
          </View>
          <View style={btnCStyle}>
            <TouchableOpacity style={[styles.btn, {
              backgroundColor: '#E61D42'
            }]} onPress={saveBannerToImage}>
              <Image source={icSave} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, {
              backgroundColor:'#01BC75'
            }]} onPress={onPressShare}>
              <Image source={icShare} size={16} style={styles.icon} />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.btn} onPress={onPressCopylink}>
              <IconSvg name={'icCopy'} size={16} color={color.grey1} />
            </TouchableOpacity> */}
            <TouchableOpacity style={[styles.btn, {
              backgroundColor:'#DFDFDF'
            }]} onPress={onPressOutside}>
              <Image
                source={icClose}
                style={styles.iconClose}
              />
            </TouchableOpacity>
          </View>
          {props.bottomView}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  hiddenTouch: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  hideBackground: {
    position: 'absolute',
    width: 10000,
    height: 10000,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  btnC: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },

  icon: {
    width: 40,
    height: 40,
    tintColor: 'white'
  },
  iconClose: {
    width: 40,
    height: 40,
    tintColor: '#7f7f7f'
  }
});
