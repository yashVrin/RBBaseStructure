import React, { useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import Colors from '@assets/Colors';

type OtpInputProps = {
  code: string;
  setCode: (code: string) => void;
  maxLength?: number;
};

const OtpInput: React.FC<OtpInputProps> = ({
  code,
  setCode,
  maxLength = 6,
}) => {
  // Array of refs for TextInputs
  const inputsRef = useRef<Array<TextInput | null>>([]);

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

  return (
    <View style={styles.container}>
      {Array.from({ length: maxLength }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref: TextInput | null) => {
            inputsRef.current[index] = ref;
          }}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          value={code[index] || ''}
        />
      ))}
    </View>
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
