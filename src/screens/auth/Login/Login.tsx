import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import Colors from '@assets/Colors';
import BaseTextInput from '@components/BaseTextInput';
import BaseButton from '@components/BaseButton';
import ScreenContainer from '@components/ScreenContainer';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Define navigation param types (adjust as per your navigator)
type RootStackParamList = {
  OtpInputScreen: { phone_number: string };
};

const validatePhoneNumber = (phone: string): boolean => {
  const regex = /^[0-9]{10,15}$/; // Accepts 10 to 15 digits
  return regex.test(phone);
};

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [phone, setPhone] = useState<string>('');
  const [errors, setErrors] = useState<{ phone?: string }>({});

  const validateFields = (): boolean => {
    const newErrors: { phone?: string } = {};

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhoneNumber(phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (): void => {
    if (validateFields()) {
      Alert.alert('OTP Sent', `We sent an OTP to ${phone}`);
      navigation.navigate('OtpInputScreen', { phone_number: phone });
      // Here you can initiate OTP API call
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Log in</Text>

        <BaseTextInput
          placeholder="Phone Number"
          value={phone}
          onChangeText={text => {
            setPhone(text);
            if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
          }}
          error={errors.phone}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <BaseButton
          title="Send OTP"
          onPress={handleLogin}
          disabled={!validatePhoneNumber(phone)}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
});

export default LoginScreen;
