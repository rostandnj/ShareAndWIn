import PropTypes from 'prop-types';
import React from 'react';
import {RecyclerListView} from 'recyclerlistview';
import {ScrollView, StyleSheet, View} from 'react-native';

// Create header component with gap
const style = StyleSheet.create({
  header: {
    marginTop: 16,
  },
});
const Header = () => <View style={style.header} />;

// Use forwardRef to wrap a ScrollView that has the Header before the rest of the
// Children are rendered.  forwardRef is there because RecyclerListView expects whatever you
// pass it as the externalScrollView to have the same methods available as ScrollView
// Pass dependencies for ScrollView here

// Overriding PropType because it doesn't expect a forwardRef response even though that
// works without issue
RecyclerListView.propTypes.externalScrollView = PropTypes.object;

// Use the headered scroll view to underly the RecyclerList
const RecyclerListViewWithHeader = (props) => {
  const ScrollViewWithHeader = React.useMemo(
    () =>
      React.forwardRef(({children, ...props}, ref) => {
        return (
          <ScrollView ref={ref} {...props}>
            {props.headerComponent}
            {children}
          </ScrollView>
        );
      }),
    [],
  );
  return (
    <RecyclerListView
      externalScrollView={ScrollViewWithHeader}
      scrollViewProps={{headerComponent: Header}}
      {...props}
    />
  );
};

export default RecyclerListViewWithHeader;
