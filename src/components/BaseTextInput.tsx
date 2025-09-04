import React from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextInputProps,
} from 'react-native';
import Colors from '@assets/Colors';

type BaseTextInputProps = TextInputProps & {
  error?: string;
};

const BaseTextInput: React.FC<BaseTextInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={Colors.GRAY}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderColor: Colors.BACKGROUND,
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
