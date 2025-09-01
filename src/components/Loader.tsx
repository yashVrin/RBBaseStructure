import React from 'react';
import { ActivityIndicator, View, ViewStyle, StyleSheet } from 'react-native';
import Colors from '@assets/Colors';

// Use a native ActivityIndicator to avoid library prop forwarding issues
// that may pass `color` to a native View and crash on iOS.

type LoaderProps = {
  style?: ViewStyle | ViewStyle[];
  size?: number | 'small' | 'large';
  color?: string;
};

export const Loader: React.FC<LoaderProps> = ({
  style,
  size = 'large',
  color = Colors.PRIMARY,
}) => {
  return (
    <View style={[
      styles.overlay,
      ...(Array.isArray(style) ? style : [style]),
    ]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
});