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

// Define your navigation param list (adjust as needed)
type RootStackParamList = {
  BottomTabs: undefined;
  SplashScreen: undefined;
};

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'BottomTabs' }],
        }),
      ); // Navigate to main app
    }, 2000);

    return () => clearTimeout(timer); // Clean up timer on unmount
  }, [navigation]);

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
      return true; // Assume true since Android below 13 doesn't require explicit permission
    }
  };

  const requestPermissionsNotifications = async (): Promise<void> => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        if (result === RESULTS.GRANTED) {
          // Permission granted
        } else {
          // Permission denied or blocked
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // Android < 13 or fallback
      try {
        const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        if (result === RESULTS.GRANTED) {
          // Permission granted
        } else {
          // Permission denied or blocked
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    (async () => {
      const hasPermission = await requestUserPermission();

      if (hasPermission) {
        const fcmToken = await messaging().getToken();
        console.log('❄️ FCM Token:', fcmToken);
      } else {
        console.log('Not authorized for notifications');
      }

      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          console.log('Initial notification:', remoteMessage);
          if (remoteMessage) {
            // Handle initial notification
          }
        });

      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification opened:', remoteMessage);
        if (remoteMessage) {
          // Handle notification opened when app is in background
        }
      });

      messaging().setBackgroundMessageHandler(
        async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
          // Handle background message
        },
      );

      const unsubscribe = messaging().onMessage(onMessageReceived);

      return () => {
        unsubscribe();
      };
    })();
  }, []);

  const onMessageReceived = async (
    message: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'App',
      badge: false,
    });

    try {
      await notifee.displayNotification({
        id: message.messageId,
        title: message.notification?.title,
        body: message.notification?.body,
        data: message.data,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          badgeIconType: AndroidBadgeIconType.SMALL,
          pressAction: {
            id: 'default',
          },
          showTimestamp: true,
          badgeCount: 0,
        },
        ios: {
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            sound: true,
          },
          critical: true,
        },
      });
    } catch (error) {
      console.error('Notifee displayNotification error:', error);
    }

    notifee.onBackgroundEvent(
      async ({ type, detail }: { type: EventType; detail: any }) => {
        const { notification, pressAction } = detail;

        if (type === EventType.PRESS) {
          // TODO: Navigate based on notification
        }
        await notifee.cancelNotification(notification.id);
      },
    );

    notifee.onForegroundEvent(
      ({ type, detail }: { type: EventType; detail: any }) => {
        if (type === EventType.PRESS) {
          // TODO: Handle press in foreground
        }
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App</Text>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
