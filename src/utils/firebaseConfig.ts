import notifee from '@notifee/react-native';
import remoteConfig from '@react-native-firebase/remote-config';
// import { firebase } from '@react-native-firebase/crashlytics';
import firebase from '@react-native-firebase/app';
import crashlytics from '@react-native-firebase/crashlytics';
import { Alert, Linking, Platform } from 'react-native';
import VersionCheck from 'react-native-version-check';

const iosStoreURL = 'https://apps.apple.com/in/app/facebook/id284882215';
const androidStoreURL =
  'https://play.google.com/store/apps/details?id=com.facebook.katana&hl=en_IN';

export const initializeFirebase = async (): Promise<void> => {
  try {
    // Reset notification badge count
    await notifee.setBadgeCount(0);

    // Set default remote config
    await remoteConfig().setDefaults({
      minimum_version: VersionCheck.getCurrentVersion(),
    });

    await remoteConfig().fetch(0);
    await remoteConfig().activate();

    const minimumVersion = remoteConfig()
      .getValue('minimum_version')
      .asString();

    const minimumVersionAndroid = remoteConfig()
      .getValue('minimum_version_android')
      .asString();

    const currentVersion = VersionCheck.getCurrentVersion();
    console.log(currentVersion,"react-native-version-check");
    

    const updateNeeded = await VersionCheck.needUpdate({
      currentVersion,
      latestVersion:
        Platform.OS === 'android' ? minimumVersionAndroid : minimumVersion,
    });

    if (updateNeeded?.isNeeded) {
      Alert.alert(
        "There's a new version of our app.",
        "Make sure you're on the newest version so you do not miss out on new features.",
        [
          {
            text: 'Update Now',
            onPress: () => {
              const storeUrl =
                Platform.OS === 'ios' ? iosStoreURL : androidStoreURL;
              Linking.canOpenURL(storeUrl).then(supported => {
                if (supported) Linking.openURL(storeUrl);
              });
            },
          },
        ],
        { cancelable: false },
      );
    }
  } catch (e: any) {
    console.error('Firebase initialization error:', e);
    crashlytics()
      .log('Internal server error (api name): ' + e?.message || e);
  }
};
