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
$ [react-native-pushdy-example]    yarn upgrade react-native-pushdy
```
