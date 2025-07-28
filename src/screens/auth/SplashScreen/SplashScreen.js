// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import notifee, {
  AndroidBadgeIconType,
  AndroidImportance,
  EventType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-root-toast';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('BottomTabs'); // Navigate to main app
    }, 2000);

    return () => clearTimeout(timer); // Clean up timer on unmount
  }, [navigation]);

  //Push notification set up start

  const requestUserPermission = async () => {
    /**
     * On iOS, messaging permission must be requested by
     * the current application before messages can be
     * received or sent
     */
    if (Platform.OS == 'ios') {
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } else {
      requestPermissionsNotifications();
    }
  };

  const requestPermissionsNotifications = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        if (result === RESULTS.GRANTED) {
        } else {
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        if (result === RESULTS.GRANTED) {
        } else {
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (requestUserPermission()) {
      /**
       * Returns an FCM token for this device
       */

      messaging()
        .getToken()
        .then(fcmToken => {
          console.log('❄️', fcmToken);
        });
    } else console.log('Not Authorization status:', authStatus);

    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        console.log('remoteMessage', remoteMessage);

        if (remoteMessage) {
        }
      });

    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log('remoteMessage', remoteMessage);

      if (remoteMessage) {
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {});
    const unsubscribe = messaging().onMessage(onMessageReceived);
    // return unsubscribe;
    return () => {
      unsubscribe;
    };
  }, []);
  const onMessageReceived = async message => {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'App',
      badge: false,
    });

    try {
      // Display a notification
      await notifee.displayNotification({
        id: message.messageId,
        title: message.notification.title,
        body: message.notification.body,
        data: message.data,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          badgeIconType: AndroidBadgeIconType.SMALL, // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'. // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
          // smallIcon: 'app_logo',
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
    } catch (error) {}
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;

      if (type === EventType.PRESS) {
        // navigate here
      }
      await notifee.cancelNotification(notification.id);
    });

    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
      }
    });
  };
  //Push notification set up end_________________________________________________________________

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
