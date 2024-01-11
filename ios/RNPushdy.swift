//
//  Pushdy.swift
//  react-native-pushdy
//
//  Created by luatnd on 16/12/19.
//

import Foundation
import os
import PushdySDK

/**
 Prevent this module re-intialized due some error;
 */
var didIntialized:Bool = false;
/**
 Check RNPushdy has been connect to PushdySDK success:
 that means PushdySDK has: deviceId was set, delegate, delegateHandler, launchOptions.
 */
var initlizedWithPushdy:Bool = false;

@objc(RNPushdy)
public class RNPushdy: RCTEventEmitter {
    // private static var delegate:RNPushdyDelegate;
    @objc public static var instance:RNPushdy? = nil;

    @objc private static var clientKey:String? = nil
    @objc private static var delegate:UIApplicationDelegate? = nil
    @objc private static var launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    @objc private static var mIsAppOpenedFromPush: Bool = false
    
    override init() {
        super.init()
        
        // React native will create new instance after we create singleton instance in AppDelegate.m
        // So i react do reinit, we need to grant new instance to RNPushdy.instance
        // This ensure that RCTBridge will work properly
        RNPushdy.instance = self
    }
    
    /**
     * See android SDK and document to know why we use this var
     */
    private var isRemoteNotificationRegistered:Bool = false
    
    /*
     - Expose singleton instance for using in AppDelegate.m
     - TODO: Check this fn is still be used or not
    */
    @objc public static func getInstance() -> RNPushdy {
        if RNPushdy.instance == nil {
            RNPushdy.instance = RNPushdy();
            print("[ERROR] This case should not happen: Manually init RNPushdy() instance")
        }

        return instance!;
    }
    
    /*
     --- Setup event listeners
     Note: since use override, we don't need to specify the @objc directive.
     */
    override public static func requiresMainQueueSetup() -> Bool {
        // https://facebook.github.io/react-native/docs/native-modules-ios#implementing--requiresmainqueuesetup
        // As document said: only do this if your module initialization relies on calling UIKit!
        return true
    }
    
    override public func constantsToExport() -> [AnyHashable : Any]! {
        return [:]
    }
    
    /**
     - Usage:
     sendEvent(withName: "onIncrement", body: ["count": count])
     */
    override public func supportedEvents() -> [String]! {
        return [
            "onNotificationOpened",
            "onNotificationReceived",
            "onRemoteNotificationFailedToRegister",
            "onRemoteNotificationRegistered",
            "onTokenUpdated",
        ]
    }
    
    public func sendEventToJs(eventName:String, body:[AnyHashable : Any] = [:]) {
        sendEvent(withName: eventName, body: body)
    }
    public static func sendEventToJs(eventName:String, body:[AnyHashable : Any] = [:]) {
        self.getInstance().sendEventToJs(eventName: eventName, body: body)
    }
    // End --- Setup event listeners
    
    // Variable type correlation:  https://medium.com/ios-os-x-development/swift-and-objective-c-interoperability-2add8e6d6887
    @objc
    public static func sayHello(_
        stringArgument: String, numberArgument: Int
        ) -> Void {
        let msg:String = "stringArgument: \(stringArgument), numberArgument: \(numberArgument)"
        
        NSLog(msg);
    }

    @objc
    public static func registerSdk(_ clientKey:String, delegate:UIApplicationDelegate, launchOptions: [UIApplication.LaunchOptionsKey: Any]?) {
        // if have intialized, prevent intializing again;
        if (didIntialized){
            return;
        }

        didIntialized = true;
        self.clientKey = clientKey
        self.delegate = delegate
        self.launchOptions = launchOptions
        
        let deviceData:[String:Any]? = self.getLocalData(key: "deviceId");
        let deviceId = deviceData?["id"] as? String;
        /**
         If having deviceId in localStorage, try to get it and initialized right now without delegateHandler.
         if not, do not intialize. Wait for initPushdy from react-native to initialize
         */
        if (deviceId != nil) {
            Pushdy.setDeviceID(deviceId!);
            Pushdy.initWith(clientKey: self.clientKey!
            , delegate: self.delegate!
            , launchOptions: self.launchOptions)
            initlizedWithPushdy = true;
            /**
             Need to call this to observe the incoming push notification.
            */
            Pushdy.registerForPushNotifications();
        }
        
        self.mIsAppOpenedFromPush = self.checkIsAppOpenedFromPush(_launchOptions: launchOptions);
        
        if #available(iOS 13.0, *){
            NotificationCenter.default.addObserver(self, selector: #selector(self.appEntersBackground), name: UIScene.willDeactivateNotification, object: nil);
        } else {
            NotificationCenter.default.addObserver(self, selector: #selector(self.appEntersBackground), name: UIApplication.willResignActiveNotification, object: nil);
        }
    }
    
    @objc
    public static func checkIsAppOpenedFromPush(_launchOptions:[UIApplication.LaunchOptionsKey: Any]?) ->Bool {
        if let launchOptions = _launchOptions, let _ = launchOptions[UIApplication.LaunchOptionsKey.remoteNotification] as? [String : Any] {
            return true;
        } else {
            return false;
        }
    }
    
    @objc
    public static func setIsAppOpenedFromPush(isPushOpening: Bool)->Void {
        self.mIsAppOpenedFromPush = isPushOpening;
    }
    
    @objc
    public static func appEntersBackground() {
        RNPushdy.self.mIsAppOpenedFromPush = false;
    }
    
    @objc
    public func initPushdy(_
        options: NSDictionary,
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) {
        var deviceId:String = "";
        if options["deviceId"] != nil {
            deviceId = options["deviceId"] as! String
        } else {
            reject("InvalidArgument", "RNPushdy.initPushdy: Invalid param: options.deviceId is required", NSError(domain: "", code: 200, userInfo: nil))
        }
        if deviceId.isEmpty {
            reject("InvalidArgument", "RNPushdy.initPushdy: Invalid param: options.deviceId cannot be empty", NSError(domain: "", code: 200, userInfo: nil))
        }
        let dict: [String:Any] = [
            "id": deviceId,
        ];
        RNPushdy.setLocalData(key: "deviceId", value: dict);
        /**
         If RNPushdy doesn't intialized with Pushdy from registerSdk due to not having deviceId
         in localStorage, try to initialize it here
         */
        /**
         -------- NEW FLOW --------
         If HAVE deviceId,
         1. try to initialize with PushdySDK without handler called by registerSdk (invoked by applicationDidFinishLauchingWithOptions.
         2. try to add delegateHandler to PushdySDK later called by initPushdy(invoked by initPushdy when ReactNative App start and ready to handle message.
         If not,
         1. registerSdk normally. (without initialize with Pushdy)
         2. initPushdy when ReactNative App start and ready to handle message.
         */
        if(!initlizedWithPushdy){
            Pushdy.setDeviceID(deviceId);
            Pushdy.initWith(clientKey: RNPushdy.clientKey!
            , delegate: RNPushdy.delegate!
            , delegaleHandler: RNPushdyDelegate()
            , launchOptions: RNPushdy.launchOptions)
        } else {
            /**
             Try to set handler for RNPushdy that intialized by registerSdk.
             */
            Pushdy.setDelegateHandler(delegateHandler: RNPushdyDelegate());
        }
        
        //old
//        Pushdy.setDeviceID(deviceId);
//        Pushdy.initWith(clientKey: RNPushdy.clientKey!
//        , delegate: RNPushdy.delegate!
//        , delegaleHandler: RNPushdyDelegate()
//        , launchOptions: RNPushdy.launchOptions)


        /**
        * If user allowed, you still need to call this to register UNUserNotificationCenter delegation
        * Otherwise, you still receive push in bg but not fg, you cannot handle push click action
        * Android was registered by default so you don't need to register for android

         === ios token flow: ===
         JS ready
         RNPushdy.initWith(deviceToken passed from JS)
         Pushdy.registerForPushNotifications()
         notificationCenter.requestAuthorization()
         application.registerForRemoteNotifications()
         ---> register xong --->
         OS > application:didRegisterForRemoteNotificationsWithDeviceToken:

        */
        Pushdy.registerForPushNotifications()
        
        resolve(true)
    }

    @objc
    func sampleMethod(_
        stringArgument: String, numberArgument: NSNumber,
                                resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        let msg:String = "stringArgument: \(stringArgument), numberArgument: \(numberArgument)"
        
        NSLog(msg);
        
        if (Int(truncating: numberArgument) < 0) {
            reject("InvalidNumberArgument", "numberArgument cannot be negative", NSError(domain: "", code: 200, userInfo: nil))
        } else {
            // let a:Array<Any> = [msg, Int(truncating: numberArgument) * 2];
            resolve([msg, Int(truncating: numberArgument) * 2])
        }
    }
    
    @objc
    func getDeviceToken(_
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        let t:String? = Pushdy.getDeviceToken()
        
        print("[RNPushdy.getDeviceToken] got token: %s", t ?? "nil")
        resolve(t ?? "")
    }
    
    @objc
    func registerForPushNotifications(_
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        Pushdy.registerForPushNotifications()
        resolve(true)
    }
    
    @objc
    func isRemoteNotificationRegistered(_
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        resolve(isRemoteNotificationRegistered)
    }
    
    @objc
    func isNotificationEnabled(_
        resolve: @escaping RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        Pushdy.checkNotificationEnabled { (enabled:Bool) in
            resolve(enabled)
        }
    }
    
    @objc
    func setPushBannerAutoDismiss(_
        autoDismiss: Bool,
                                  resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        Pushdy.setPushBannerAutoDismiss(autoDismiss)
        resolve(true)
    }
    
    @objc
    func setPushBannerDismissDuration(_
        seconds: NSNumber,
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        Pushdy.setPushBannerDismissDuration(Double(truncating: seconds))
        resolve(true)
    }
    
    /*
     WIP: This func is not complete and might not work.
     - TODO: Implement this func
     */
    @objc
    func setCustomPushBanner(_
        viewType: String,
                             resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        var banner:UIView = UIView();
        switch (viewType) {
        case "largeIconAsBigImage":
            banner = UIView();
            break;
        case "todo":
            banner = UIView();
            break;
        default:
            NSLog("[Pushdy] setCustomPushBanner: Invalid viewType: %@", viewType)
        }
        
        do {
            try Pushdy.setCustomPushBanner(banner)
            resolve(true)
        } catch {
            reject("PushdySDK_ERR", "[Pushdy] setCustomPushBanner: oh got exception!", error)
        }
    }
    
    @objc
    func setCustomMediaKey(_
        mediaKey: String,
                           resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        PDYNotificationView.setCustomMediaKey(mediaKey)
        resolve(true)
    }
    
    @objc
    func setDeviceId(_
        id: String,
                     resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        Pushdy.setDeviceID(id)
        resolve(true)
    }
    
    @objc
    func getDeviceId(_
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        resolve(Pushdy.getDeviceID())
    }
    
    @objc
    func getPendingNotification(_
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        let pendingNotification = Pushdy.getPendingNotification()
        if pendingNotification == nil {
            resolve(nil)
        } else {
            let universalNotification = RNPushdy.toRNPushdyStructure(pendingNotification!)
            resolve(universalNotification)
        }
    }
    
    @objc
    func getPendingNotifications(_
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        let pendingNotifications:[[String:Any]] = Pushdy.getPendingNotifications()
        let universalNotifications:[[String:Any]] = pendingNotifications.map({(i) -> [String:Any] in
            return RNPushdy.toRNPushdyStructure(i)
        })

        resolve(universalNotifications)
    }
    
    @objc
    func getInitialNotification(_
        resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock
        ) -> Void {
        let initialNotification:[String: Any]? = RNPushdy.getLocalData(key: "initialNotification");
        if initialNotification != nil {
            let universalNotification = RNPushdy.toRNPushdyStructure(initialNotification ?? [:]);
            resolve(universalNotification)
        } else {
            resolve(nil);
        }
    }
    
    @objc
    func removeInitialNotification(_
        resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock
        ) -> Void {
        RNPushdy.removeLocalData(key: "initialNotification");
    }
    
    @objc
    func isAppOpenedFromPush(_
        resolve: RCTPromiseResolveBlock, rejecter
        reject:RCTPromiseRejectBlock) -> Void {
        resolve(RNPushdy.self.mIsAppOpenedFromPush);
    }
    
    
    // I don't know why this was not work so I use setAttributeFromOption instead
    @objc
    func setAttributeFromValueContainer(_
        attr: String, valueContainer: NSDictionary, commitImmediately:Bool,
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        do {
            let data:Any = valueContainer["data"] as Any
            try Pushdy.setAttribute(attr, value: data, commitImmediately:commitImmediately)
            resolve(true)
        } catch {
            reject("PushdySDK_ERR", "[Pushdy] setAttribute: oh got exception!", error)
        }
    }

    @objc
    public func setAttributeFromOption(_
        options: NSDictionary,
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) {
        var attr:String = ""
        if options["attr"] != nil {
            attr = options["attr"] as! String
        } else {
            reject("InvalidArgument", "RNPushdy.initPushdy: Invalid param: options.deviceId is required", NSError(domain: "", code: 200, userInfo: nil))
            return
        }
        
        do {
            let data = options["data"] as Any
            let immediately = options["immediately"] as! Bool
            try Pushdy.setAttribute(attr, value: data, commitImmediately:immediately)
            resolve(true)
            return
        } catch {
            reject("PushdySDK_ERR", "[Pushdy] setAttribute: oh got exception!", error)
            return
        }
    }
    
    @objc
    func setAttribute(_
        attr: String, value: String, commitImmediately:Bool,
                      resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        do {
            try Pushdy.setAttribute(attr, value: value, commitImmediately:commitImmediately)
            resolve(true)
        } catch {
            reject("PushdySDK_ERR", "[Pushdy] setAttribute: oh got exception!", error)
        }
    }
    
    // Do not use this function because SDK is unstable for this fn, let check it later if we have time
    // @deprecated
    @objc
    func pushAttribute(_
        attr: String, values: [String],
                      resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        do {
            try Pushdy.pushAttribute(attr, value: values)
            resolve(true)
        } catch {
            reject("PushdySDK_ERR", "[Pushdy] pushAttribute: oh got exception!", error)
        }
    }
    
    @objc
    func getPlayerID(_
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        resolve(Pushdy.getPlayerID())
    }
    
    @objc func setApplicationIconBadgeNumber(_
        count: NSNumber,
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        // Pushdy.setApplicationIconBadgeNumber using count Int;
        // And setApplicationIconBadgeNumber call from ReactNative is NSNumber type.
        // So that need to convert NSNumber to Int.
        let countInt = count.intValue;
        Pushdy.setApplicationIconBadgeNumber(countInt)
        resolve(true)
    }

    @objc func getApplicationIconBadgeNumber(_
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        resolve(Pushdy.getApplicationIconBadgeNumber())
    }
    
    @objc func useSDKHandler(
        _ enabled: Bool,
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        Pushdy.useSDKHandler(enabled)
        resolve(true)
    }
    
    @objc func handleCustomInAppBannerPressed(
        _ notificationId: String,
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        Pushdy.handleCustomInAppBannerPressed(notificationId)
        resolve(true)
    }

    @objc func getPendingEvents(_ count: NSNumber,
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        let countInt = count.intValue;
        let pendingEvents = Pushdy.getPendingTrackEvents(count: countInt)
        // NSLog("RNPushdy.getPendingEvents")
        resolve(pendingEvents)
    }

    @objc func removePendingEvents(_ count: NSNumber,
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        let countInt = count.intValue;
        Pushdy.removePendingTrackingEvents(countInt)
        resolve(true)
    }
    
    @objc func setPendingEvents(_ events: NSArray,
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        Pushdy.setPendingTrackEvents(events as! [NSObject])
        resolve(true)
    }
    
    @objc func setApplicationId(_ appId: String,
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        // NSLog("RNPushdy.setApplicationId: \(appId)")
        Pushdy.setApplicationId(appId)
        resolve(true)
    }
    
    @objc func trackEvent(_ eventName: String,
        params: NSDictionary,
        immediate: Bool,
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        NSLog("RNPushdy.trackEvent: \(eventName)")
        do {
            try Pushdy.trackEvent(eventName: eventName, params: params, immediate: immediate) { _ in
                
            } failure: {_,_ in
            }
        } catch {
            
        }
        resolve(true);
    }

    @objc func pushPendingEvents(_
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        // NSLog("RNPushdy.pushPendingEvents:")
        try? Pushdy.pushPendingEvents();
        resolve(true)
    }

    @objc func subscribe(_
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        Pushdy.subscribe()
        resolve(true)
    }

    @objc func getAllBanners(_
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        let banners = Pushdy.getAllBanners()
        resolve(banners)
    }

    @objc func trackBanner(_ bannerId: String,
        type: String,
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        Pushdy.trackBanner(bannerId: bannerId, type: type)
        resolve(true)
    }

    @objc func getBannerData(_ bannerId: String,
        resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
    ) -> Void {
        let bannerData = Pushdy.getBannerData(bannerId: bannerId)
        resolve(bannerData)
    }


    // MARK: Hooks
    /*
    ======== HOOKS ==========
     Hooks was migrated to RNPushdyDelegate.swift due 
     Do not use hook here anymore
    */
//    public func onNotificationOpened(_ notification: [String : Any], fromState: String) {
//        print("{RNPushdy.onNotificationOpened} from state: \(fromState)")
//
//        let universalNotification = RNPushdy.toRNPushdyStructure(notification)
//        sendEventToJs(eventName: "onNotificationOpened", body:["notification": universalNotification, "fromState": fromState])
//    }
//
//    public func onNotificationReceived(_ notification: [String : Any], fromState: String) {
//        print("{RNPushdy.onNotificationReceived} from state: \(fromState)")
//
//        let universalNotification = RNPushdy.toRNPushdyStructure(notification)
//        sendEventToJs(eventName: "onNotificationReceived", body:["notification": universalNotification, "fromState": fromState])
//    }
//
//    public func onRemoteNotificationRegistered(_ deviceToken: String) {
//        print("{RNPushdy.onRemoteNotificationRegistered} deviceToken: \(deviceToken)")
//
//        sendEventToJs(eventName: "onRemoteNotificationRegistered", body:["deviceToken": deviceToken])
//    }
//
//    public func onRemoteNotificationFailedToRegister(_ error: NSError) {
//        print("{RNPushdy.onRemoteNotificationFailedToRegister} error: \(error)")
//
//        sendEventToJs(eventName: "onRemoteNotificationFailedToRegister", body:["error": error])
//    }
}
