package com.reactNativePushdy;

import android.util.ArrayMap;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;


import com.google.gson.Gson;
import com.google.gson.JsonObject;

import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class ReactNativeJson {

  public static WritableMap convertMapToWritableMap(Map<String, ?> map) {
    WritableMap writableMap = Arguments.createMap();

    for (Map.Entry<String, ?> i : map.entrySet()) {
      String k = i.getKey();
      Object v = i.getValue();

      if (v == null) {
        writableMap.putNull(k);
      } else {
        String varType = v.getClass().getSimpleName();

        switch (varType) {
          case "String":
            writableMap.putString(k, (String) v);
            break;
          case "Integer":
            writableMap.putInt(k, (Integer) v);
            break;
          case "Double":
            writableMap.putDouble(k, (Double) v);
            break;
          case "Boolean":
            writableMap.putBoolean(k, (Boolean) v);
            break;
            case "LinkedTreeMap":
            writableMap.putMap(k, convertMapToWritableMap((Map<String, ?>) v));
            break;
          default:
            String msg = "[ERROR] [Pushdy] ReactNativeJson.convertMapToWritableMap: Unhandled varType: " + varType + " | Please notice Pushdy's developer to fix this problem";
            Log.e("Pushdy", msg);
            writableMap.putString(k, msg);
            // throw new Exception("ReactNativeJson.convertMapToWritableMap: Unhandled varType: " + varType);
        }
      }
    }

    return writableMap;
  }

  /**
   *
   * @param writableMap
   * @return
   * @throws Exception
   */
  public static Map<String, ?> convertWritableMapToMap(WritableMap writableMap) throws Exception {
    throw new Exception("This function was not implemented");

//    Map<String, ?> map = new HashMap<>();
//
//    ReadableMapKeySetIterator iterator = writableMap.keySetIterator();
//    while (iterator.hasNextKey()) {
//      String key = iterator.nextKey();
//      switch (writableMap.getType(key)) {
//        case Null:
//          map.put(key, null);
//          break;
//        case Boolean:
//          map.put(key, writableMap.getBoolean(key));
//          break;
//        case Number:
//          map.put(key, writableMap.getDouble(key));
//          break;
//        case String:
//          map.put(key, writableMap.getString(key));
//          break;
//        case Map:
//          map.put(key, convertMapToJson(writableMap.getMap(key)));
//          break;
//        case Array:
//          map.put(key, convertArrayToJson(writableMap.getArray(key)));
//          break;
//      }
//    }

//    return map;
  }

  public static JSONObject convertJavaMapToJson(Map<String, ?> map) {
    return new JSONObject(map);
  }

  public static Map<String, ?> convertJsonToJavaMap(JSONObject jsonObject) {
    HashMap m = new Gson().fromJson(jsonObject.toString(), HashMap.class);
    return m;
  }

  public static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
    WritableMap map = new WritableNativeMap();

    Iterator<String> iterator = jsonObject.keys();
    while (iterator.hasNext()) {
      String key = iterator.next();
      Object value = jsonObject.get(key);
      if (value instanceof JSONObject) {
        map.putMap(key, convertJsonToMap((JSONObject) value));
      } else if (value instanceof  JSONArray) {
        map.putArray(key, convertJsonToArray((JSONArray) value));
      } else if (value instanceof  Boolean) {
        map.putBoolean(key, (Boolean) value);
      } else if (value instanceof  Integer) {
        map.putInt(key, (Integer) value);
      } else if (value instanceof  Double) {
        map.putDouble(key, (Double) value);
      } else if (value instanceof String)  {
        map.putString(key, (String) value);
      } else {
        map.putString(key, value.toString());
      }
    }
    return map;
  }

  public static WritableArray convertJsonToArray(JSONArray jsonArray) throws JSONException {
    WritableArray array = new WritableNativeArray();

    for (int i = 0; i < jsonArray.length(); i++) {
      Object value = jsonArray.get(i);
      if (value instanceof JSONObject) {
        array.pushMap(convertJsonToMap((JSONObject) value));
      } else if (value instanceof  JSONArray) {
        array.pushArray(convertJsonToArray((JSONArray) value));
      } else if (value instanceof  Boolean) {
        array.pushBoolean((Boolean) value);
      } else if (value instanceof  Integer) {
        array.pushInt((Integer) value);
      } else if (value instanceof  Double) {
        array.pushDouble((Double) value);
      } else if (value instanceof String)  {
        array.pushString((String) value);
      } else {
        array.pushString(value.toString());
      }
    }
    return array;
  }

  public static JSONObject convertMapToJson(ReadableMap readableMap) throws JSONException {
    JSONObject object = new JSONObject();
    ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
    while (iterator.hasNextKey()) {
      String key = iterator.nextKey();
      switch (readableMap.getType(key)) {
        case Null:
          object.put(key, JSONObject.NULL);
          break;
        case Boolean:
          object.put(key, readableMap.getBoolean(key));
          break;
        case Number:
          object.put(key, readableMap.getDouble(key));
          break;
        case String:
          object.put(key, readableMap.getString(key));
          break;
        case Map:
          object.put(key, convertMapToJson(readableMap.getMap(key)));
          break;
        case Array:
          object.put(key, convertArrayToJson(readableMap.getArray(key)));
          break;
      }
    }
    return object;
  }

  public static JSONArray convertArrayToJson(ReadableArray readableArray) throws JSONException {
    JSONArray array = new JSONArray();
    for (int i = 0; i < readableArray.size(); i++) {
      switch (readableArray.getType(i)) {
        case Null:
          break;
        case Boolean:
          array.put(readableArray.getBoolean(i));
          break;
        case Number:
          array.put(readableArray.getDouble(i));
          break;
        case String:
          array.put(readableArray.getString(i));
          break;
        case Map:
          array.put(convertMapToJson(readableArray.getMap(i)));
          break;
        case Array:
          array.put(convertArrayToJson(readableArray.getArray(i)));
          break;
      }
    }
    return array;
  }
}