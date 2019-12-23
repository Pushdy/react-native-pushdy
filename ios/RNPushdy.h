#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
//#import <UIKit/UIKit.h>

// --- If you use Swift, you don't need header anymore
// @interface Pushdy : UIResponder <UIApplicationDelegate, RCTBridgeModule>
@interface Pushdy : RCTEventEmitter <RCTBridgeModule>
+(void)doSthFoo:(NSString*)msg;
//+(void)initWithContext:(NSString*)clientKey
//               delegate:(UIApplication *)delegate didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
@end
