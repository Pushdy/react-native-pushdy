#import <React/RCTBridgeModule.h>
//#import <UIKit/UIKit.h>

//@interface Pushdy : UIResponder <UIApplicationDelegate, RCTBridgeModule>
@interface Pushdy : NSObject <RCTBridgeModule>
+(void)doSthFoo:(NSString*)msg;
//+(void)initWithContext:(NSString*)clientKey
//               delegate:(UIApplication *)delegate didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
@end
