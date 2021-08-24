import React, {Component} from 'react';
import {Image} from 'react-native';
import variables from '../var/variables';
import FastImage from 'react-native-fast-image';
class ScaledImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: {
        uri: this.props.source,
        priority: FastImage.priority.low,
        cache: FastImage.cacheControl.immutable,
      },
    };
  }

  UNSAFE_componentWillMount() {
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
  }

  render() {
    return (
      <FastImage
        source={this.state.source}
        resizeMode={FastImage.resizeMode.cover}
        style={{
          height: 250,
          width: variables.deviceWidth,
          ...this.props.style,
        }}
      />
    );
  }
}
export default ScaledImage;
