# react-native-pushdy (RNPushdy)
This README is for Pushdy's developer, isn't intend for user

# Deploy
Publish to npm

```
npm login
npm publish --dry-run
npm publish
```


# === Development ===
## Architecture

| iOS data flows:  |                                                               |
|------------------|---------------------------------------------------------------|
| Init app:      | AppDelegate.m ---> Pushdy.swift --> PushdySDK.init              |
| JS --> native:   | JS --> Pushdy.m --> Pushdy.swift --> PushdySDK                |
| Native --> JS:   | PushdySDK --> RNPushdyDelegate.swift --> Pushdy.swift --> JS event listener |

| Android data flows: |                                                            |
|------------------|---------------------------------------------------------------|
| Init app:        | MainApplication ---> PushdyModule.init -> PushdySDK.init      |                         |
| JS --> native:   | JS --> PushdyModule --> PushdySDK                             |
| Native --> JS:   | PushdySDK --> PushdyModule --> JS event listener              |
| Get App context: | PushdyModule.reactContext                                     |


## Git branching model
| Purpose           |  branch       | Note |
|-------------------|---------------| ---  |
| release           | master        | Every time you publish a release & release to npm |
| develop           | master        | Every time you publish a release & release to npm |

Because only 1 or 2 peoples working on project, so we use simple tree structure, with only 2-3 main branch

Release new version:
- develop was checked out from `master`:
    - develop maintain all development progress,
    - all new commit was commit into `development`
    - In case multiple features were developed parallelly, all of them was checked out from develop, when complete, merge back to develop
- When we need to release:
    - increase the version in package.json,
    - merge `develop` into `master`,
    - tag + publish a release on github

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
