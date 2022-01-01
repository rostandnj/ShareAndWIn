import React, {Component, useEffect, useState, useRef} from 'react';
import {Image, View} from 'react-native';
import variables from '../var/variables';
import FastImage from 'react-native-fast-image';
import ImageColors from 'react-native-image-colors';
const ScaledImageSimple = (props) => {
  const [color, setColor] = useState('transparent');
  const [source, setSource] = useState({
    uri: props.source,
    priority: FastImage.priority.low,
    cache: FastImage.cacheControl.immutable,
  });
  return (
    <View
      style={{
        height: 250,
        width: variables.deviceWidth,
        //backgroundColor: color,
      }}>
      <FastImage
        source={source}
        resizeMode={FastImage.resizeMode.contain}
        style={{
          height: 250,
          width: variables.deviceWidth,
          ...props.style,
        }}
      />
    </View>
  );
};
export default ScaledImageSimple;
