import React, {Component, useEffect, useState, useRef} from 'react';
import {Image, View} from 'react-native';
import variables from '../var/variables';
import FastImage from 'react-native-fast-image';
import ImageColors from 'react-native-image-colors';
const ScaledImage = (props) => {
  const [color, setColor] = useState('transparent');
  const [source, setSource] = useState({
    uri: props.source,
    priority: FastImage.priority.low,
    cache: FastImage.cacheControl.immutable,
  });
  useEffect(() => {
    let isMounted = true; // note mutable flag
    ImageColors.getColors(source, {
      fallback: '#fff',
      cache: false,
      key: 'unique_key',
    }).then((result) => {
      if (isMounted) {
        setColor(result.dominant);
      } // add conditional check
    });
    return () => {
      isMounted = false;
    }; // cleanup toggles value, if unmounted
  }, [source]);
  return (
    <View
      style={{
        height: 250,
        width: variables.deviceWidth,
        backgroundColor: color,
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
export default ScaledImage;
