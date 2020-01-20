Some common build error after install react-native-pushdy:

Relate to AppAuth error (firebase core/analytics issue): ==> https://github.com/openid/AppAuth-iOS/issues/489  dont support xcode 10 => Upgrade xcode 11

===> react-native@0.60.x do not support use_framework! so you need to update 0.61.x to support swift

Upgrade reat-native@0.59 to 0.61: Freaking bad:
Upgrade reat-native@0.60 to 0.61: Freaking bad:
https://react-native-community.github.io/upgrade-helper/?from=0.59.10&to=0.61.5

https://github.com/facebook/react-native/issues/26678
`react-native unlink` all automatic linked libraries
Unlink some redundant React's libraries: https://github.com/react-native-community/upgrade-helper/issues/47
Upgrade: https://react-native-community.github.io/rn-diff-purge/
If you have the library added in your Podfile, make sure that you don't also have it included in the Libraries folder. My problem resolved my removing react-native-fs from the Libraries
Some issue that you might deal with:
> The 'Pods-ProjectName' target has transitive dependencies that include static binaries
> https://github.com/react-native-community/react-native-maps/issues/1923


[!] The `RNCViewpager` pod failed to validate due to 1 error:
    - ERROR | attributes: Missing required attribute `homepage`.
    - WARN  | source: The version should be included in the Git tag.
    - WARN  | description: The description is equal to the summary.
> Because podspec file is missing info ==> Check the podspec file of lastest version then install latest version, or fork and install from github instead of npm

xCode Scheme: React (missing)
'React/RCT<module_name>.h' file not found
https://github.com/facebook/react-native/issues/26665#issuecomment-571082076
Find and remove all linked library and redundant header search path

use_frameworks! results in pod not finding headers of its dependencies
https://github.com/CocoaPods/CocoaPods/issues/4605
