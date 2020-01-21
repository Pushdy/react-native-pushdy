# react-native-pushdy change logs


new update here

----------
rnpushdy@0.x was used for react-native@0.60 and bellow

rnpushdy@1.x was used for react-native@0.61 and above

The cause is:
> react-native@0.60 > react-native@0.61
From
```
public interface WritableMap extends ReadableMap {
  void putArray(@Nonnull String key, @Nullable WritableArray value);
  void putMap(@Nonnull String key, @Nullable WritableMap value);
}
```
To:
```
public interface WritableMap extends ReadableMap {
  void putArray(@NonNull String key, @Nullable ReadableArray value);
  void putMap(@NonNull String key, @Nullable ReadableMap value);
}
```