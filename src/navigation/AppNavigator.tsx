import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import Login from '../screens/auth/Login/Login';
import Search from '../screens/main/Search/Search';
import BottomTabs from './BottomTabs';
import SplashScreen from '../screens/auth/SplashScreen/SplashScreen';
import LoggerFile from '../screens/main/LoggerFile/LoggerFile';
import OtpInputScreen from '../screens/auth/OtpInputScreen/OtpInputScreen';
import LanguageScreen from '../screens/main/Language/LanguageScreen';
import PaywallScreen from '../screens/main/PaywallScreen';

// Define types for stack params if needed (you can add params if your screens use them)

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  LoggerFile: undefined;
  Search: undefined;
  OtpInputScreen: undefined;
  BottomTabs: undefined;
  Language: undefined;
  Paywall: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // Default premium slide
        animationDuration: 400, // Slightly longer for smoother feel
        fullScreenGestureEnabled: true, // Allow swiping back from anywhere
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          animation: 'fade',
          animationTypeForReplace: 'push' // Smooth replacement
        }}
      />
      <Stack.Screen
        name="LoggerFile"
        component={LoggerFile}
        options={{
          headerShown: true,
          animation: 'slide_from_bottom',
          presentation: 'modal' // Modal feel for logger
        }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: true,
          animation: 'fade_from_bottom'
        }}
      />
      <Stack.Screen
        name="OtpInputScreen"
        component={OtpInputScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_bottom'
        }}
      />
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={{
          animation: 'fade',
          animationTypeForReplace: 'push' // Premium entry to main app
        }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{
          headerShown: true,
          title: 'Language',
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen
        name="Paywall"
        component={PaywallScreen}
        options={{
          headerShown: true,
          title: 'Premium',
          animation: 'slide_from_bottom',
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>

  </NavigationContainer>
);

export default AppNavigator;
