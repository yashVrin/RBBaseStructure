import React, { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import store from './src/store/store';
import notifee from '@notifee/react-native';
import SplashScreen from 'react-native-splash-screen';
import { initializeFirebase } from './src/utils/firebaseConfig';

const App: React.FC = () => {
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        notifee.setBadgeCount(0).catch(console.error);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    SplashScreen.hide();
    initializeFirebase();
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
