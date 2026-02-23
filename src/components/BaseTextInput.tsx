import React, { useRef } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextInputProps,
  Animated,
} from 'react-native';
import Colors from '@assets/Colors';

type BaseTextInputProps = TextInputProps & {
  error?: string;
};

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const BaseTextInput: React.FC<BaseTextInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  ...rest
}) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [error, shakeAnim]);

  const handleFocus = (e: any) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (rest.onFocus) {
      rest.onFocus(e);
    }
  };

  const handleBlur = (e: any) => {
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    if (rest.onBlur) {
      rest.onBlur(e);
    }
  };

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.BACKGROUND || '#F5F7FA', Colors.PRIMARY],
  });

  const labelTop = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [15, -10],
  });

  const labelFontSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const labelColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.GRAY, Colors.PRIMARY],
  });

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.label,
          {
            top: labelTop,
            fontSize: labelFontSize,
            color: error ? Colors.ERROR : labelColor,
            backgroundColor: Colors.BACKGROUND,
            paddingHorizontal: 4,
            left: 12,
          },
        ]}
      >
        {placeholder}
      </Animated.Text>
      <AnimatedTextInput
        style={[
          styles.input,
          {
            borderColor,
            borderWidth: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 2],
            }),
            transform: [{ translateX: shakeAnim }],
          },
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    zIndex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: Colors.BACKGROUND,
  },
  inputError: {
    borderColor: Colors.ERROR,
  },
  errorText: {
    color: Colors.ERROR,
    fontSize: 13,
    marginTop: 4,
  },
});

export default BaseTextInput;
