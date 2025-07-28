import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import store from './src/store/store';
import notifee from '@notifee/react-native';
import SplashScreen from 'react-native-splash-screen';
import { initializeFirebase } from './src/utils/firebaseConfig';

const App = () => {
  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active') {
        notifee.setBadgeCount(0);
      }
    };

    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    SplashScreen.hide();
    initializeFirebase(); // ⬅️ Firebase logic
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
