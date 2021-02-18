import React from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import propTypes from 'prop-types';
import Pushdy from 'react-native-pushdy';


export default class CustomInAppBannerBaseView extends React.PureComponent {
  static propTypes = {
    // No props should be supported for this banner, it's stateful component
  }

  constructor(props) {
    super(props);

    this.state = {
      visible: false,

      id: null,
      title: null,
      message: null,
      media_url: null,
      // notificationData: null, // Use to handle on banner tapped
    };

    this.onTapNotification = this.onTapNotification.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * This view is for demo only
   *
   * You should override:
   * - render function
   * - onTapNotification
   * - onClose
   */
  render() {
    const {visible, title, message, media_url} = this.state;

    return !visible ? null : (
      <TouchableOpacity onPress={this.onTapNotification}>
        <View style={{
          flex: 1, width: 300, height: 150, backgroundColor: '#eee',
          padding: 10,
          paddingTop: 6,
          marginTop: 0,
        }}>

          {(media_url) && <Image source={{ uri: media_url }} style={s.img} />}

          <View style={s.txtContent}>
            {!!title && <Text style={s.title} ellipsisMode={'tail'} numberOfLines={3}>{title}</Text>}
            {!!message && <Text style={s.msg} ellipsisMode={'tail'} numberOfLines={3}>{message}</Text>}
          </View>

          <TouchableOpacity onPress={this.onClose} style={s.closeIcoArea}>
            <View><Text>Close</Text></View>
          </TouchableOpacity>

        </View>
      </TouchableOpacity>
    );
  }


  show(notification) {
    if (this.mounted && notification) {
      notification.visible = true;
      this.setState(notification);
      this.hideAfter(10000);
    } else {
      // retry?
      // console.log('{NotificationBannerView.show} Component not mounted yet: ', );
    }
  }

  hideAfter(ms) {
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }

    this.autoHideTimeout = setTimeout( () => {
      if (this.mounted) {
        this.setState({
          visible: false,

          id: null,
          title: null,
          message: null,
          media_url: null,
        });
      }
    }, ms);
  }

  onClose() {
    console.log('{CustomInAppBannerNotificationView.onClose} : ', );
    this.hideAfter(0);
  }

  onTapNotification() {
    console.log('{CustomInAppBannerNotificationView.onTapNotification} : ', this.state);
    // notice SDK
    Pushdy.handleCustomInAppBannerPressed(this.state.id)

    this.onClose();
  }
}

const s = StyleSheet.create({
  img: {
    marginRight: 15, // Image can show and hide so put space right to it
    width: 59, height: 59, borderRadius: 4
  },

  txtContent: {
    flex: 1,
    paddingRight: 15, // pad to closeIco
  },

  title: {
    marginTop: -4,
    // ...CS.text(CS.hnBold, color.grey1, 18, 21),
  },
  msg: {
    marginTop: 5,
    // ...CS.text(CS.hnRegular, color.black, 16, 19),
  },

  closeIcoArea: {
    // ...CS.flexEnd,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',

    // Make the press area wider so user can easily press in
    position: 'absolute',
    top: -22, right: -25,
    width: 65, height: 50,
    // ...CS.border(1, 'blue'),
  },
})