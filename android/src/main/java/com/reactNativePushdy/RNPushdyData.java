package com.reactNativePushdy;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class RNPushdyData {

  /**
   * Convert PushdySDK datastructure into RNPushdy datastructure.
   *    RNPushdy DS must be indentical between iOS & Android.
   *    This's called Universal Data Structure (UDS).
   *
   * Example notification param:
   *    notification:
   *      notification:
   *        body: "Ít nhất 7 tỉnh thành sẽ bị ảnh hưởng, cần sẵn sàng tinh thần ứng phó"
   *        image: "https://vortex.accuweather.com/adc2010/images/icons-numbered/01-l.png"
   *        title: "Bão số 6 hướng đi khó lường"
   *      data:
   *        _nms_image: "https://znews-photo.zadn.vn/w660/Uploaded/cqdhmdxwp/2019_08_14/kuncherry90_67233597_965480387137244_1646091755794003933_n_copy.jpg"
   *        _notification_id: "4a28399a-7365-45d4-92cc-a2089d953feb"
   *        _nms_payload: "eyJub3RpZmljYXRpb24iOnsidGl0bGUiOiJBbmggVsaw4bujbmcgZOG7sSDEkeG7i25oIGLDoW4gdGl2aSIsImJvZHkiOiJIw6NuZyB4ZSB04bu3IHBow7ogUGjhuqFtIE5o4bqtdCBWxrDhu6NuZyB24burYSBjw7MgdGhv4bqjIHRodeG6rW4gbOG7i2NoIHPhu60sIGzhuqFpIHLDsiBy4buJIHRpbiBt4bubaSB24buBIHRpdmkuIEjDo25nIHhlIHThu7cgcGjDuiBQaOG6oW0gTmjhuq10IFbGsOG7o25nIHbhu6thIGPDsyB0aG/huqMgdGh14bqtbiBs4buLY2ggc+G7rSwgbOG6oWkgcsOyIHLhu4kgdGluIG3hu5tpIHbhu4EgdGl2aS4gSMOjbmcgeGUgdOG7tyBwaMO6IFBo4bqhbSBOaOG6rXQgVsaw4bujbmcgduG7q2EgY8OzIHRob+G6oyB0aHXhuq1uIGzhu4tjaCBz4butLCBs4bqhaSByw7IgcuG7iSB0aW4gbeG7m2kgduG7gSB0aXZpIn0sImRhdGEiOnsicHVzaF9hY3Rpb24iOiJuYXZfdG9fYXJ0aWNsZV9kZXRhaWwiLCJwdXNoX2RhdGEiOnsiYXJ0aWNsZV9pZCI6MTc5MjY5fSwidGl0bGUiOiJCw6NvIHPhu5EgNiBoxrDhu5tuZyDEkWkga2jDsyBsxrDhu51uZyIsImJvZHkiOiLDjXQgbmjhuqV0IDcgdOG7iW5oIHRow6BuaCBz4bq9IGLhu4sg4bqjbmggaMaw4bufbmcsIGPhuqduIHPhurVuIHPDoG5nIHRpbmggdGjhuqduIOG7qW5nIHBow7MiLCJpbWFnZSI6Imh0dHBzOi8vdm9ydGV4LmFjY3V3ZWF0aGVyLmNvbS9hZGMyMDEwL2ltYWdlcy9pY29ucy1udW1iZXJlZC8wMS1sLnBuZyIsIl9ub3RpZmljYXRpb25faWQiOiI0YTI4Mzk5YS03MzY1LTQ1ZDQtOTJjYy1hMjA4OWQ5NTNmZWIifX0="
   *
   * Example UDS:
   *  universalNotification:
   *    _nms_image: "https://znews-photo.zadn.vn/w660/Uploaded/cqdhmdxwp/2019_08_14/kuncherry90_67233597_965480387137244_1646091755794003933_n_copy.jpg"
   *    _notification_id: "4a28399a-7365-45d4-92cc-a2089d953feb"
   *    _nms_payload: "eyJub3RpZmljYXRpb24iOnsidGl0bGUiOiJBbmggVsaw4bujbmcgZOG7sSDEkeG7i25oIGLDoW4gdGl2aSIsImJvZHkiOiJIw6NuZyB4ZSB04bu3IHBow7ogUGjhuqFtIE5o4bqtdCBWxrDhu6NuZyB24burYSBjw7MgdGhv4bqjIHRodeG6rW4gbOG7i2NoIHPhu60sIGzhuqFpIHLDsiBy4buJIHRpbiBt4bubaSB24buBIHRpdmkuIEjDo25nIHhlIHThu7cgcGjDuiBQaOG6oW0gTmjhuq10IFbGsOG7o25nIHbhu6thIGPDsyB0aG/huqMgdGh14bqtbiBs4buLY2ggc+G7rSwgbOG6oWkgcsOyIHLhu4kgdGluIG3hu5tpIHbhu4EgdGl2aS4gSMOjbmcgeGUgdOG7tyBwaMO6IFBo4bqhbSBOaOG6rXQgVsaw4bujbmcgduG7q2EgY8OzIHRob+G6oyB0aHXhuq1uIGzhu4tjaCBz4butLCBs4bqhaSByw7IgcuG7iSB0aW4gbeG7m2kgduG7gSB0aXZpIn0sImRhdGEiOnsicHVzaF9hY3Rpb24iOiJuYXZfdG9fYXJ0aWNsZV9kZXRhaWwiLCJwdXNoX2RhdGEiOnsiYXJ0aWNsZV9pZCI6MTc5MjY5fSwidGl0bGUiOiJCw6NvIHPhu5EgNiBoxrDhu5tuZyDEkWkga2jDsyBsxrDhu51uZyIsImJvZHkiOiLDjXQgbmjhuqV0IDcgdOG7iW5oIHRow6BuaCBz4bq9IGLhu4sg4bqjbmggaMaw4bufbmcsIGPhuqduIHPhurVuIHPDoG5nIHRpbmggdGjhuqduIOG7qW5nIHBow7MiLCJpbWFnZSI6Imh0dHBzOi8vdm9ydGV4LmFjY3V3ZWF0aGVyLmNvbS9hZGMyMDEwL2ltYWdlcy9pY29ucy1udW1iZXJlZC8wMS1sLnBuZyIsIl9ub3RpZmljYXRpb25faWQiOiI0YTI4Mzk5YS03MzY1LTQ1ZDQtOTJjYy1hMjA4OWQ5NTNmZWIifX0="
   *    body: "Ít nhất 7 tỉnh thành sẽ bị ảnh hưởng, cần sẵn sàng tinh thần ứng phó"
   *    image: "https://vortex.accuweather.com/adc2010/images/icons-numbered/01-l.png"
   *    title: "Bão số 6 hướng đi khó lường"
   *    ...
   *    data:
   *      push_action: "nav_to_article_detail"
   *      push_data: "{"article_id":179269}"
   *      ...
   *
   * @param notification The notification from PushdySDK
   * @return Universal data structure
   */
  public static WritableMap toRNPushdyStructure(WritableMap notification) {
    WritableMap universalNotification = new WritableNativeMap();
    WritableMap nData = new WritableNativeMap();
    WritableMap platformOption = new WritableNativeMap();


    Set<String> excludedKeys = new HashSet<>();
    excludedKeys.add("notification");
    excludedKeys.add("data");

    ReadableMap notiKey = notification.getMap("notification");
    ReadableMap dataKey = notification.getMap("data");
    ReadableMap restKey = RNPushdyData.copyExclude(notification, excludedKeys);

    if (dataKey != null) {
      nData.merge(dataKey);
    }

    if (notiKey != null) {
      RNPushdyData.copyBaseOnFieldName(notiKey, universalNotification, nData, platformOption);
    }

    RNPushdyData.copyBaseOnFieldName(restKey, universalNotification, nData, platformOption);

    universalNotification.putMap("data", nData);
    universalNotification.putMap("android", platformOption);

    return universalNotification;
  }

  /**
   * Copy sourceMap to `sourceMap` or `data` base on field name
   *
   * @param sourceMap
   * @param notification
   * @param data
   * @param platformOption
   */
  private static void copyBaseOnFieldName(ReadableMap sourceMap, WritableMap notification, WritableMap data, WritableMap platformOption) {
    ReadableMapKeySetIterator i = sourceMap.keySetIterator();
    while (i.hasNextKey()) {
      String key = i.nextKey();
      switch (key) {
        // Known String
        case "title":
        case "subtitle":
        case "body":
        case "image":
          notification.putString(key, sourceMap.getString(key));
          break;

        // Know string but these are option for android only
        case "autoCancel":
          platformOption.putString(key, sourceMap.getString(key));
          break;

        // Push the rest to `data` section
        // Push the rest _* field to `notification`
        default:
          if (key.startsWith("_")) {
            RNPushdyData.copyDynamicField(sourceMap, notification, key);
          } else {
            RNPushdyData.copyDynamicField(sourceMap, data, key);
          }
      }
    }
  }


  static void copyDynamicField(WritableMap srcMap, WritableMap dstMap, String key) {
    // TODO: java.lang.AssertionError: Illegal type provided
    // reproduction: Receive push in foreground
    switch (srcMap.getType(key)) {
      case Null:
        dstMap.putNull(key);
        break;
      case Boolean:
        dstMap.putBoolean(key, srcMap.getBoolean(key));
        break;
      case Number:
        dstMap.putDouble(key, srcMap.getDouble(key));
        break;
      case String:
        dstMap.putString(key, srcMap.getString(key));
        break;
      case Map:
        dstMap.putMap(key, DataHelper.toWritableMap(srcMap.getMap(key))); // react-native@0.60.x
        // dstMap.putMap(key, srcMap.getMap(key)); // react-native@0.61.x
        break;
      case Array:
        dstMap.putArray(key, DataHelper.toWritableArray(srcMap.getArray(key))); // react-native@0.60.x
        // dstMap.putArray(key, srcMap.getArray(key)); // react-native@0.61.x
    }
  }

  static void copyDynamicField(ReadableMap srcMap, WritableMap dstMap, String key) {
    // TODO: java.lang.AssertionError: Illegal type provided
    // reproduction: Receive push in foreground
    switch (srcMap.getType(key)) {
      case Null:
        dstMap.putNull(key);
        break;
      case Boolean:
        dstMap.putBoolean(key, srcMap.getBoolean(key));
        break;
      case Number:
        dstMap.putDouble(key, srcMap.getDouble(key));
        break;
      case String:
        dstMap.putString(key, srcMap.getString(key));
        break;
      case Map:
        dstMap.putMap(key, DataHelper.toWritableMap(srcMap.getMap(key))); // react-native@0.60.x
        // dstMap.putMap(key, srcMap.getMap(key)); // react-native@0.61.x
        break;
      case Array:
        dstMap.putArray(key, DataHelper.toWritableArray(srcMap.getArray(key))); // react-native@0.60.x
        // dstMap.putArray(key, srcMap.getArray(key)); // react-native@0.61.x
        break;
    }
  }

  /**
   * [WIP] Create a copy of map with only specified keys
   *
   * @param map The source map
   * @param keys The list of key would be copy to output map
   */
  static WritableMap pick(WritableMap map, String[] keys) {
    return new WritableNativeMap();
  }

  /**
   * Create a copy of map with only specified keys
   *
   * @param map The source map
   * @param excludedKeys The list of key would be copy to output map
   */
  static WritableMap copyExclude(WritableMap map, Set<String> excludedKeys) {
    WritableMap out = new WritableNativeMap();
    ReadableMapKeySetIterator i = map.keySetIterator();

    while (i.hasNextKey()) {
      String key = i.nextKey();
      if (!excludedKeys.contains(key)) {
        RNPushdyData.copyDynamicField(map, out, key);
      }
    }

    return out;
  }
}
