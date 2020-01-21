//
//  Pushdy.swift
//  react-native-pushdy
//
//  Created by luatnd on 16/12/19.
//

import Foundation
import os
import PushdySDK


@objc(RNPushdy)
public class RNPushdy: RCTEventEmitter {
    // private static var delegate:RNPushdyDelegate;
    @objc private static var instance:RNPushdy? = nil;
    
    override init() {
        super.init()
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
    
    /**
     - Usage:
     [RNPushdy initWithClientKey:...]
     */
    @objc
    public static func initWith(clientKey:String, delegate:UIApplicationDelegate, launchOptions: [UIApplication.LaunchOptionsKey: Any]?) {
        Pushdy.initWith(clientKey: clientKey
            , delegate: delegate
            , delegaleHandler: RNPushdyDelegate()
            , launchOptions: launchOptions)

//        Pushdy.initWith(clientKey: clientKey
//            , delegate: delegate
//            , launchOptions: launchOptions)
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
        seconds: Double,
                                      resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        Pushdy.setPushBannerDismissDuration(seconds)
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
    func setAttribute(_
        attr: String, value: String,
                      resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock
        ) -> Void {
        do {
            try Pushdy.setAttribute(attr, value: value)
            resolve(true)
        } catch {
            reject("PushdySDK_ERR", "[Pushdy] setAttribute: oh got exception!", error)
        }
    }
    
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
