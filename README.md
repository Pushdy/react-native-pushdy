# react-native-pushdy (RNPushdy)

## Getting started

**Installing** using yarn or npm:
```
$ npm install react-native-pushdy --save
$ yarn add react-native-pushdy
```

**Linking**
- For react-native@0.60.x and above: Autolink was introduce, you don't need to do anything further, for more detail: https://github.com/react-native-community/cli/blob/master/docs/autolinking.md
- For react-native@0.5x.x, run:
```
$ react-native link react-native-pushdy
```

Additional setup:
Push notification require very deep integration, additional setup is required to support handy feature:
### Android
TODO:

### iOS
TODO:

## Usage
```javascript
import Pushdy from 'react-native-pushdy';

// TODO: What to do with the module?
Pushdy;
```

[WIP] This usage guide has not completed yet.

### Common use case
Bellow is common use cases, for api references, please see [API References](#API-References) section

**Initialization**
Android:
```
```


### API References
Bellow is RNPushdy's API References, for common use cases, please see [Common use case](#Common-use-case) section


## Version compatible

We've maintained compatible version here.
Versioning use `semver` since RNPushdy version 1.x (0.x is development stage)

react-native@0.61.x and above
* RNPushdy | android-pushdy-sdk | ios-pushdy-sdk | Note |
* --     | --     | --     | develoment stage
* @0.0.4-rn0_60 | 0.0.6  | 0.0.6  | develoment stage: android sdk change data structure
* @0.0.4 | 0.0.6  | 0.0.6  | develoment stage: android sdk change data structure
* latest | latest | latest | develoment stage

react-native@0.60.x and bellow
*  RNPushdy | android-pushdy-sdk | ios-pushdy-sdk | Note |
*  --     | --     | --     | develoment stage
*  @0.0.4 | 0.0.6  | 0.0.6  | develoment stage: android sdk change data structure
*  latest | latest | latest | develoment stage


# === Development ===
## Architecture

iOS data flows:

* Init app: AppDelegate.m ---> PushdySDK.init
* JS --> native: JS --> Pushdy.m --> Pushdy.swift --> PushdySDK
* Native --> JS: PushdySDK --> Pushdy.swift --> Pushdy.m --> JS event listener
* Get App context:  Pushdy.swift --> PushdySDK.getAppContext()

Android data flows:
* Init app: MainApplication ---> PushdyModule.init -> PushdySDK.init
* JS --> native: JS --> PushdyModule --> PushdySDK
* Native --> JS: PushdySDK --> PushdyModule --> JS event listener
* Get App context:  PushdyModule.reactContext


## Development & contribution

For faster local development experience, you might need to use local package instead of npm:
```
git clone https://github.com/Pushdy/react-native-pushdy.git
git clone https://github.com/Pushdy/react-native-pushdy-example.git
```

react-native-pushdy-example/package.json
```
{
  "dependencies": {
    "react-native-pushdy": "file:../react-native-pushdy",
  },
}
```

Every time you make changes for `react-native-pushdy`, just update it to `react-native-pushdy-example`
```bash
# update changes
$ [react-native-pushdy-example]    yarn upgrade react-native-pushdy

# restart js bundle server (if there was the new files)
$ [react-native-pushdy-example]    react-native start

# Sometime, you need to sync android studio project with graddle file

# If you change some native code
react-native run-android
```

OR
---- A more convenient way BUT
you just need to create a soft link to `react-native-pushdy`
https://medium.com/dailyjs/how-to-use-npm-link-7375b6219557

```
$ [react-native-pushdy-example]                 ls -al $(npm root -g)
$ [react-native-pushdy-example]                 cd ../react-native-pushdy
$ [react-native-pushdy]                         npm link
$ [react-native-pushdy]                         ls -al $(npm root -g)
$ [react-native-pushdy]                         cd ../reactNativePushdyExample

$ [react-native-pushdy-example]                 yarn remove react-native-pushdy
$ [react-native-pushdy-example]                 npm link react-native-pushdy
$ [react-native-pushdy-example]                 ll node_modules/react-native-pushdy
```

Output:

```
/Users/luatnd/Documents/Doc_Workspace/source/taichinh24h/reactNativePushdyExample/node_modules/react-native-pushdy
-> /Users/luatnd/.nvm/versions/node/v12.6.0/lib/node_modules/react-native-pushdy
-> /Users/luatnd/Documents/Doc_Workspace/source/taichinh24h/react-native-pushdy
```

Remember to remove this in package.json:
```
"react-native-pushdy": "file:../react-native-pushdy",
```

NOTE: I never have got successful with this method yet :((
