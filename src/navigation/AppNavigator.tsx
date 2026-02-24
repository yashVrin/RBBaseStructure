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

// Define types for stack params if needed (you can add params if your screens use them)

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  LoggerFile: undefined;
  Search: undefined;
  OtpInputScreen: undefined;
  BottomTabs: undefined;
  Language: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // Smooth slide default
        animationDuration: 450, // Premium slower feel
        fullScreenGestureEnabled: true,
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
          animation: 'fade_from_bottom', // Modern entry
          animationTypeForReplace: 'push'
        }}
      />
      <Stack.Screen
        name="LoggerFile"
        component={LoggerFile}
        options={{
          headerShown: true,
          animation: 'slide_from_bottom',
          presentation: 'modal'
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
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={{
          animation: 'fade',
          animationTypeForReplace: 'push'
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
    </Stack.Navigator>

  </NavigationContainer>
);

export default AppNavigator;
