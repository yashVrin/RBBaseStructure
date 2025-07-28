import * as React from 'react';
import { DotIndicator } from 'react-native-indicators';
import Colors from '../assets/Colors';
/**
 * Loader Custom Component is used for writing Text in Whole app.
 */
export const Loader = function Loader(props) {
  const { style } = props;
  const styles = [style];
  const {
    colors,
    count,
    // font = typography.Poppins_Regular,
  } = props;

  return (
    <DotIndicator
      {...props}
      color={Colors.PRIMARY}
      count={3}
      size={13}
      animating
      style={[
        {
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',

          // height: 50,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
        },
      ]}
    />
  );
};
