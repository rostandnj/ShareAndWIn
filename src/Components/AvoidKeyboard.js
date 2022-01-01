import React, {Component} from 'react';
import {Animated, Easing, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
import variables from '../var/variables';

class AvoidKeyboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedViewHeight: new Animated.Value(0),
      viewHeight: variables.deviceHeight,
    };

    this.setViewHeightOnce = this.setViewHeightOnce.bind(this);
    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
  }

  setViewHeightOnce(event) {
    const {height} = event.nativeEvent.layout;
    if (this.state.viewHeight === 0) {
      const avoidPaddingBottom = 15;
      this.setState({
        viewHeight: height + avoidPaddingBottom,
        animatedViewHeight: new Animated.Value(height + avoidPaddingBottom),
      });
    }
  }

  keyboardWillShow(e) {
    const {viewHeight} = this.state;
    if (viewHeight) {
      requestAnimationFrame(() => {
        // eslint-disable-line no-undef
        Animated.timing(this.state.animatedViewHeight, {
          toValue: viewHeight - e.endCoordinates.height,
          duration: 200,
          delay: 0,
          easing: Easing.inOut(Easing.ease),
        }).start();
      });
    }
  }

  keyboardWillHide() {
    requestAnimationFrame(() => {
      // eslint-disable-line no-undef
      Animated.timing(this.state.animatedViewHeight, {
        toValue: this.state.viewHeight,
        duration: 200,
        delay: 0,
        easing: Easing.inOut(Easing.ease),
      }).start();
    });
  }

  render() {
    let animatedHeight;
    const {viewHeight} = this.state;
    if (viewHeight > 0) {
      animatedHeight = {maxHeight: this.state.animatedViewHeight};
    }
    return (
      <Animated.View
        style={{height: variables.deviceHeight}}
        onLayout={this.setViewHeightOnce}>
        {this.props.children}
      </Animated.View>
    );
  }
}

AvoidKeyboard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AvoidKeyboard;
