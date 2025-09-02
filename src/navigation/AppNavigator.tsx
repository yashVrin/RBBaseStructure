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
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        name="LoggerFile"
        component={LoggerFile}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="OtpInputScreen"
        component={OtpInputScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="Language" component={LanguageScreen} options={{ headerShown: true, title: 'Language' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
