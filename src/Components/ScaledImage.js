import React, {Component} from 'react';
import {Image, View} from 'react-native';
import variables from '../var/variables';
import FastImage from 'react-native-fast-image';
import ImageColors from 'react-native-image-colors';
class ScaledImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '#c4c4c4',
      source: {
        uri: this.props.source,
        priority: FastImage.priority.low,
        cache: FastImage.cacheControl.immutable,
      },
    };
  }

  async UNSAFE_componentWillMount() {
    /*Image.getSize(this.props.source, (width, height) => {
      if (this.props.width && !this.props.height) {
        this.setState({
          width: this.props.width,
          height: height * (this.props.width / width),
        });
      } else if (!this.props.width && this.props.height) {
        this.setState({
          width: width * (this.props.height / height),
          height: this.props.height,
        });
      } else {
        this.setState({width: width, height: height});
      }
    });*/
    const result = await ImageColors.getColors(this.state.source, {
      fallback: '#c4c4c4',
      cache: true,
      key: 'unique_key',
    });
    let color = '#000';
    this.setState({color: result.dominant});
  }

  render() {
    return (
      <View
        style={{
          height: 250,
          width: variables.deviceWidth,
          backgroundColor: this.state.color,
        }}>
        <FastImage
          source={this.state.source}
          resizeMode={FastImage.resizeMode.contain}
          style={{
            height: 250,
            width: variables.deviceWidth,
            ...this.props.style,
          }}
        />
      </View>
    );
  }
}
export default ScaledImage;
