import {Platform, Dimensions} from 'react-native';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;
const platform = Platform.OS;
const platformStyle = undefined;
const isIphoneX =
  platform === 'ios' && deviceHeight === 812 && deviceWidth === 375;
const iconFontSize =
  platform === 'ios'
    ? deviceWidth > 320
      ? 24
      : 18
    : deviceWidth > 320
    ? 24
    : 18;
const defaultColor = '#65a7ef';
//const defaultColor = "#2f4183";
const defaultColorDarken = '#000E50';

function wp(percentage) {
  const value = (percentage * deviceWidth) / 100;
  return Math.round(value);
}

Dimensions.addEventListener('change', ({window, screen}) => {
  deviceHeight = window.height;
  deviceWidth = window.width;
});

const slideHeight = deviceHeight * 0.4;
const slideWidth = wp(90);
const itemHorizontalMargin = wp(2);

const sliderWidth = deviceWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default {
  platformStyle,
  platform,

  deviceWidth,
  deviceHeight,
  itemWidth,
  sliderWidth,
  slideHeight,
  itemHorizontalMargin,
  isIphoneX,
  defaultColor,
};
