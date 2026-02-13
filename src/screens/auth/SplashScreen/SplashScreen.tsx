import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  useNavigation,
  NavigationProp,
  CommonActions,
} from '@react-navigation/native';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import notifee, {
  AndroidBadgeIconType,
  AndroidImportance,
  EventType,
} from '@notifee/react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import Toast from 'react-native-root-toast';

import LottieSplashScreen from '../../LottieSplashScreen';

// Define your navigation param list (adjust as needed)
type RootStackParamList = {
  BottomTabs: undefined;
  SplashScreen: undefined;
};

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const navigateToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'BottomTabs' }],
      }),
    );
  };

  useEffect(() => {
    // Permission and Notification logic
    const setupApp = async () => {
      try {
        console.log('SplashScreen: Starting setup...');
        const hasPermission = await requestUserPermission();
        console.log('SplashScreen: Permission status:', hasPermission);

        if (hasPermission) {
          const fcmToken = await messaging().getToken();
          console.log('❄️ FCM Token:', fcmToken);
        } else {
          console.log('SplashScreen: Not authorized for notifications');
        }

        const remoteMessage = await messaging().getInitialNotification();
        console.log('SplashScreen: Initial notification:', remoteMessage);

        const onOpenedUnsubscribe = messaging().onNotificationOpenedApp(msg => {
          console.log('SplashScreen: Notification opened:', msg);
        });

        const onMessageUnsubscribe = messaging().onMessage(onMessageReceived);

        return () => {
          onOpenedUnsubscribe();
          onMessageUnsubscribe();
        };
      } catch (error) {
        console.error('Splash screen setup error detail:', error);
      }
    };

    const cleanupPromise = setupApp();

    // Fallback timer: ensure navigation happens after 4 seconds even if animation fails
    const timer = setTimeout(() => {
      console.log('Splash fallback timer triggered');
      navigateToHome();
    }, 4000);

    return () => {
      clearTimeout(timer);
      cleanupPromise.then(cleanup => cleanup && cleanup());
    };
  }, []);

  // Request iOS permission or Android notification permission
  const requestUserPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } else {
      await requestPermissionsNotifications();
      return true;
    }
  };

  const requestPermissionsNotifications = async (): Promise<void> => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const notifPermission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
      if (!notifPermission) return;
      try {
        await request(notifPermission);
      } catch (error) {
        console.log('Notification permission error:', error);
      }
    }
  };

  const onMessageReceived = async (
    message: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'App',
    });

    try {
      await notifee.displayNotification({
        id: message.messageId,
        title: message.notification?.title,
        body: message.notification?.body,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
        },
      });
    } catch (error) {
      console.error('Notifee error:', error);
    }
  };

  return (
    <LottieSplashScreen onAnimationFinish={navigateToHome} />
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
