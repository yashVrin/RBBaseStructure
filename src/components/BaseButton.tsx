import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  Animated,
} from 'react-native';
import Colors from '@assets/Colors';

type BaseButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>; // Optional: if you want to allow custom styling
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const BaseButton: React.FC<BaseButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 40,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 3,
    }).start();
  };

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        style,
        disabled && styles.buttonDisabled,
        { transform: [{ scale: scaleValue }] },
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: Colors.PRIMARY_LIGHT,
  },
  text: {
    color: Colors.WHITE,
    fontSize: 18,
  },
});

export default BaseButton;
