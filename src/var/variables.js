import {Platform, Dimensions} from 'react-native';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import {parse} from 'fecha';
import TimeAgo from 'javascript-time-ago';

let defaultUser =
  'data:image/png;base64,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';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;
let hasSoftMenu = false;
let deviceRealHeight = 0;
let deviceSoftMenuBar = 0;
let deviceStatusBar = 0;
let deviceSoftMenuHeight = 0;
let softMenuBar = 0;
if (platform === 'android') {
  hasSoftMenu = ExtraDimensions.isSoftMenuBarEnabled();
  deviceRealHeight = ExtraDimensions.getRealWindowHeight();
  deviceSoftMenuBar = ExtraDimensions.getStatusBarHeight();
  deviceStatusBar = ExtraDimensions.getStatusBarHeight();
  deviceSoftMenuHeight =
    ExtraDimensions.isSoftMenuBarEnabled() === false ? 0 : 75;
  softMenuBar = ExtraDimensions.getSoftMenuBarHeight();
}
let workingScreenHeigth = deviceHeight - deviceStatusBar - softMenuBar;

if (hasSoftMenu) {
  workingScreenHeigth = workingScreenHeigth;
}
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
  deviceSoftMenuBar,
  deviceWidth,
  deviceHeight,
  itemWidth,
  sliderWidth,
  slideHeight,
  itemHorizontalMargin,
  isIphoneX,
  defaultColor,
  hasSoftMenu,
  deviceRealHeight,
  deviceSoftMenuHeight,
  defaultUser,
  deviceStatusBar,
  workingScreenHeigth,
  softMenuBar,
};
