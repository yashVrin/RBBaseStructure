import React from 'react';
import { ViewStyle } from 'react-native';
import { DotIndicator, DotIndicatorProps } from 'react-native-indicators';
import Colors from '@assets/Colors';

type LoaderProps = Partial<DotIndicatorProps> & {
  style?: ViewStyle | ViewStyle[];
};

/**
 * Loader Custom Component is used for showing loading indicators in the app.
 */
export const Loader: React.FC<LoaderProps> = props => {
  const { style } = props;

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
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
        },
        ...(Array.isArray(style) ? style : [style]),
      ]}
    />
  );
};
