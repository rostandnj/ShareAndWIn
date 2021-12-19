import * as React from 'react';
import {View} from 'react-native';

function SearchScreen(props) {
  console.log(props.route.params.type);
  return <View />;
}

export default SearchScreen;
