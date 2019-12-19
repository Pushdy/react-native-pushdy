//
//  Pushdy.swift
//  react-native-pushdy
//
//  Created by luatnd on 16/12/19.
//

import Foundation
import os
import PushdySDK


@objc(Pushdy)
class RNPushdy: NSObject {
    // private var osLogEnabled = false

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
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

//    @objc
//    func constantsToExport() -> [AnyHashable : Any]! {
//        return ["initialCount": 0]
//    }
//    // This function is not completed :(
//    func safeOsLog(msg: StaticString, type: String, _ args: CVarArg...) {
//        if #available(iOS 10.0, *) {
//            var logType = OSLogType.default
//            switch type {
//                case "info":
//                    logType = .info
//                    break
//                case "debug":
//                    logType = .debug
//                    break
//                case "error":
//                    logType = .error
//                    break
//                case "fault":
//                    logType = .fault
//                    break
//                default:
//                    logType = OSLogType.default
//            }
//
//            os_log(msg, log: OSLog.default, type: logType, args)
//        }
//    }
}
