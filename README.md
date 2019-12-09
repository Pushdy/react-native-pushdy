# react-native-pushdy

## Getting started

`$ npm install react-native-pushdy --save`
`$ yarn add react-native-pushdy`

### Mostly automatic installation

`$ react-native link react-native-pushdy`

## Usage
```javascript
import Pushdy from 'react-native-pushdy';

// TODO: What to do with the module?
Pushdy;
```


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

# restart js bundle server (sometime)
$ [react-native-pushdy-example]    react-native start

# Sometime, you need to sync android studio project with graddle file
```

OR you just need to create a soft link to `react-native-pushdy`
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

NOTE: This npm link method haven't got successful yet :((
