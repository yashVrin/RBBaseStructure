import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import ScreenContainer from '@components/ScreenContainer';
import OtpInput from '@components/OtpInput';
import BaseButton from '@components/BaseButton';
import Colors from '@assets/Colors';
import {
  CommonActions,
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from '@react-navigation/native';
import { setLoggedIn } from '@store/slices/authSlice';
import { useDispatch } from 'react-redux';

// Define the param list for this navigator (adjust as per your app)
type RootStackParamList = {
  OtpInputScreen: { phone_number: string };
  BottomTabs: undefined;
};

const OtpInputScreen: React.FC = () => {
  // Typing the route params
  const route = useRoute<RouteProp<RootStackParamList, 'OtpInputScreen'>>();
  const { phone_number } = route.params;

  // Typing navigation
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [otp, setOtp] = useState<string>('');
  const [timer, setTimer] = useState<number>(30);
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (timer === 0) {
      setResendDisabled(false);
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = () => {
    if (otp.length === 4) {
      Alert.alert('OTP Verified');
      dispatch(setLoggedIn());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'BottomTabs' }],
        }),
      );
    } else {
      Alert.alert('Invalid OTP', 'Please enter the full 4-digit code.');
    }
  };

  const handleResend = (event?: GestureResponderEvent) => {
    if (!resendDisabled) {
      Alert.alert('OTP Sent', `New OTP sent to ${phone_number}`);
      setTimer(30);
      setResendDisabled(true);
      setOtp('');
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          We've sent a 4-digit code to your phone {phone_number}
        </Text>

        <OtpInput code={otp} setCode={setOtp} maxLength={4} />

        <BaseButton
          title="Verify OTP"
          onPress={handleVerify}
          disabled={otp.length !== 4 || !resendDisabled}
        />

        <View style={styles.timerContainer}>
          {resendDisabled ? (
            <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.GRAY,
    textAlign: 'center',
    marginVertical: 10,
  },
  timerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  timerText: {
    color: Colors.GRAY,
    fontSize: 14,
  },
  resendText: {
    color: Colors.PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OtpInputScreen;
