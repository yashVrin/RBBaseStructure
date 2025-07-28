import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/auth/Login/Login';
import Search from '../screens/main/Search/Search';
import BottomTabs from './BottomTabs';
import SplashScreen from '../screens/auth/SplashScreen/SplashScreen';
import LoggerFile from '../screens/main/LoggerFile/LoggerFile';
import OtpInputScreen from '../screens/auth/OtpInputScreen/OtpInputScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        name="LoggerFile"
        screenOptions={{ headerShown: true }}
        component={LoggerFile}
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
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
