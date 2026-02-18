import React, { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import store from './src/store/store';
import notifee from '@notifee/react-native';
import SplashScreen from 'react-native-splash-screen';
import { initializeFirebase } from './src/utils/firebaseConfig';
import { I18nProvider } from './src/i18n/i18n';
import LottieSplashScreen from './src/screens/LottieSplashScreen';
import RevenueCatService from './src/services/RevenueCatService';


const App: React.FC = () => {
  const [showLottieSplash, setShowLottieSplash] = useState(true);

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
    initializeFirebase();
    RevenueCatService.initialize();
    // Hide native splash screen to allow Lottie animation to take over
    setTimeout(() => {
      SplashScreen.hide();
    }, 100);
  }, []);


  const handleAnimationFinish = () => {
    setShowLottieSplash(false);
  };

  return (
    <Provider store={store}>
      <I18nProvider>
        {showLottieSplash ? (
          <LottieSplashScreen onAnimationFinish={handleAnimationFinish} />
        ) : (
          <AppNavigator />
        )}
      </I18nProvider>
    </Provider>
  );
};

export default App;
