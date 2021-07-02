//
//  RNPushdy+Data.swift
//  react-native-pushdy
//
//  Created by Luat on 25/12/19.
//

import Foundation

public extension RNPushdy {
    /**
     Convert PushdySDK datastructure into RNPushdy datastructure.
     RNPushdy DS must be indentical between iOS & Android.
     This's called Universal Data Structure (UDS).
     
     - Example UDS:
     ````
     universalNotification:
        _nms_image: "https://znews-photo.jpg"
        _notification_id: "4a28399a-7365-45d4-92cc-a2089d953feb"
        _nms_payload: "..."
        body: "Ít nhất 7 tỉnh thành sẽ bị ảnh hưởng, cần sẵn sàng ..."
        image: "https://vortex.accuweather.com/01-l.png"
        title: "Bão số 6 hướng đi khó lường"
        ...
        data:
            push_action: "nav_to_article_detail"
            push_data: "{"article_id":179269}"
            ...
     ````
     
     - Parameters:
         - notification: The notification from PushdySDK
     - Returns: Universal data structure
     */
    internal static func toRNPushdyStructure(_ notification:[String : Any]) -> [String : Any] {
        var universalNotification:[String : Any] = [:]
        var nData:[String : Any] = [:];
        var platformOption:[String : Any] = [:];
        
        for (k, v) in notification {
            switch k {
            case "title",
                 "subtitle",
                 "body",
                 "image",
                 "aps":
                universalNotification[k] = v
                break;
            case "alertAction",
                 "badge":
                platformOption[k] = v
                break;
            default:
                if k.starts(with: "_") {
                    universalNotification[k] = v
                } else {
                    nData[k] = v
                }
            }
        }
    
        universalNotification["data"] = nData
        universalNotification["ios"] = platformOption
        
        return universalNotification
    }
    
    internal static func getLocalData(key: String) -> [String: Any]? {
        if let value = UserDefaults.standard.object(forKey: key) {
            /**
             repair error that need to getLocalData cannot return nil value even not set yet.
             */
            return value as? [String : Any];
        }
        return nil;
    }
    
    internal static func setLocalData(key: String, value: [String: Any]) {
        UserDefaults.standard.set(value, forKey: key);
        UserDefaults.standard.synchronize()
    }
    
    internal static func removeLocalData(key: String) {
        if let _ = UserDefaults.standard.object(forKey: key) {
            UserDefaults.standard.removeObject(forKey: key)
        }
    }
 }
