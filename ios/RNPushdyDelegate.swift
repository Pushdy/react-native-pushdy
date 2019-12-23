//
//  RNPushdyDelegate.swift
//  RNPushdy
//
//  Created by Luat on 19/12/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import PushdySDK
import React
import React.RCTEventEmitter

// @objc class RNPushdyDelegate: RCTEventEmitter {
class RNPushdyDelegate: PushdyDelegate {
    func onNotificationOpened(_ notification: [String : Any], fromState: String) {
        // call RNPushdy.sendEventToJS(name, body)
    }
    
    
    /*
     --- Setup event listeners
     Note: since use override, we don't need to specify the @objc directive.
     */
//    override static func requiresMainQueueSetup() -> Bool {
//        // https://facebook.github.io/react-native/docs/native-modules-ios#implementing--requiresmainqueuesetup
//        // As document said: only do this if your module initialization relies on calling UIKit!
//        return true
//    }
//
//    override func constantsToExport() -> [AnyHashable : Any]! {
//        return [:]
//    }
//
//    /**
//     - Usage:
//     sendEvent(withName: "onIncrement", body: ["count": count])
//     */
//    override func supportedEvents() -> [String]! {
//        return [
//            "readyForHandlingNotification",
//            "onNotificationReceived",
//            "onNotificationOpened",
//        ]
//    }
    // End --- Setup event listeners
}
