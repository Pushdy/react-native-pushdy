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
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Pushdy, NSObject)

RCT_EXTERN_METHOD(
  sampleMethod: (NSString *)stringArgument
  numberArgument: (nonnull NSNumber *)numberArgument
  resolve: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

@end
