//#import "Pushdy.h"

//@implementation Pushdy
//
//RCT_EXPORT_MODULE()

//RCT_EXPORT_METHOD(sampleMethod:(NSString *)stringArgument numberParameter:(nonnull NSNumber *)numberArgument callback:(RCTResponseSenderBlock)callback)
//{
//    // TODO: Implement some actually useful functionality
//    callback(@[[NSString stringWithFormat: @"numberArgument22: %@ stringArgument: %@", numberArgument, stringArgument]]);
//}

//@end


/**
 * Change to use Swift instead of Objective-C
 * This guide might be useful for you:
 * https://teabreak.e-spres-oh.com/swift-in-react-native-the-ultimate-guide-part-1-modules-9bb8d054db03#f662
 */
// ====== Expose Class and function to JS ========
#import <React/RCTBridgeModule.h>
#import "React/RCTEventEmitter.h"

// Expose to JS as Pushdy instead of RNPushdy
// Objective-C type in Swift: https://www.natashatherobot.com/swift-the-deceptively-simple-programming-language/

@interface RCT_EXTERN_MODULE(RNPushdy, RCTEventEmitter)

RCT_EXTERN_METHOD(
                  sampleMethod: (NSString *)stringArgument
                  numberArgument: (nonnull NSNumber *)numberArgument
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )


RCT_EXTERN_METHOD(
                  initPushdy: (NSDictionary *)options
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  getDeviceToken: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  registerForPushNotifications: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  isRemoteNotificationRegistered: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  isNotificationEnabled: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  setPushBannerAutoDismiss: (BOOL)autoDismiss
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  setPushBannerDismissDuration: (nonnull NSNumber *)seconds
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  setCustomPushBanner: (NSString *)viewType
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  setCustomMediaKey: (NSString *)mediaKey
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  setDeviceId: (NSString *)deviceId
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  getDeviceId: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  getPendingNotification: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  getPendingNotifications: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  setAttributeFromValueContainer: (NSString *)attr
                  valueContainer:(NSDictionary *)valueContainer
                  imme:(BOOL)imme
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  setAttributeFromOption: (NSDictionary *)options
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  setAttribute: (NSString *)attr
                  value:(NSString *)value
                  imme:(BOOL)imme
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  getInitialNotification: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  removeInitialNotification: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  pushAttribute: (NSString *)attr
                  values:(NSArray *)values
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  getPlayerID: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )
RCT_EXTERN_METHOD(
                  isAppOpenedFromPush: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  setApplicationIconBadgeNumber: (nonnull NSNumber *)count
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  getApplicationIconBadgeNumber: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  useSDKHandler: (BOOL)enabled
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  handleCustomInAppBannerPressed: (NSString *)notificationId
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  getPendingEvents: (nonnull NSNumber *)count
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  setPendingEvents: (NSArray *)events
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                )

RCT_EXTERN_METHOD(
                  removePendingEvents: (NSNumber *)count
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  setApplicationId: (NSString *) appId
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  trackEvent: (NSString *)eventName
                  params:(NSDictionary *)params
                  immediate:(BOOL)immediate
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  pushPendingEvents: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )
RCT_EXTERN_METHOD(
                  subscribe: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  getAllBanners: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  trackBanner: (NSString *)bannerId
                  type:(NSString *)type
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )
RCT_EXTERN_METHOD(
                  getBannerData: (NSString *)bannerId
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

/**
 Swift: Calling Swift functions from Objective-C
 https://ericasadun.com/2014/08/21/swift-calling-swift-functions-from-objective-c/
 */
//+ (void)initWithContext:(NSString*)clientKey
//            delegate:(UIApplication *)delegate
//            didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
//{
//    NSLog(@"OK initWithContext!");
//    // [Pushdy initWithContext:clientKey delegate:delegate launchOptions:launchOptions];
//}

/**
 Test
 import
 */
+(void)doSthFoo:(NSString*)message {
    NSLog(@"OK doSthFoo! %@", message);
}

@end
