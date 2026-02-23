import React, { useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Animated,
} from 'react-native';
import Colors from '@assets/Colors';

type OtpInputProps = {
  code: string;
  setCode: (code: string) => void;
  maxLength?: number;
  error?: boolean;
};

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const OtpInput: React.FC<OtpInputProps> = ({
  code,
  setCode,
  maxLength = 6,
  error = false,
}) => {
  // Array of refs for TextInputs
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const animatedValues = useRef(
    Array.from({ length: maxLength }).map(() => new Animated.Value(0)),
  ).current;

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

  const handleChange = (text: string, index: number) => {
    const updatedCode = code.split('');
    updatedCode[index] = text;
    setCode(updatedCode.join(''));

    if (text && index < maxLength - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    Animated.spring(animatedValues[index], {
      toValue: 1,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  };

  const handleBlur = (index: number) => {
    Animated.spring(animatedValues[index], {
      toValue: 0,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: shakeAnim }] }]}>
      {Array.from({ length: maxLength }).map((_, index) => {
        const borderColor = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [Colors.GRAY, Colors.PRIMARY],
        });

        const scale = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        });

        return (
          <AnimatedTextInput
            key={index}
            ref={(ref: any) => {
              inputsRef.current[index] = ref;
            }}
            style={[
              styles.input,
              {
                borderColor,
                transform: [{ scale }],
                borderWidth: 1.5, // Slightly thicker for focus
              },
            ]}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(text: string) => handleChange(text, index)}
            onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            onBlur={() => handleBlur(index)}
            value={code[index] || ''}
          />
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: Colors.WHITE,
  },
});

export default OtpInput;
