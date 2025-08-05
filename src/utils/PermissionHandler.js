import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import { Platform, Alert, Linking } from 'react-native';

class PermissionHandler {
  static getPermissions() {
    return {
      camera: Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      }),
      location: Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      }),
      locationWhenInUse: Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      }),
      storage: Platform.select({
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        android: this.getAndroidStoragePermission(),
      }),
      notifications: Platform.select({
        ios: PERMISSIONS.IOS.POST_NOTIFICATIONS,
        android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      }),
    };
  }

  static getAndroidStoragePermission() {
    const version = Platform.Version;
    if (version >= 33) return PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
    if (version >= 30) return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    return PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
  }

  static async checkPermission(permission) {
    try {
      return await check(permission);
    } catch (error) {
      console.error('Permission check error:', error);
      return RESULTS.UNAVAILABLE;
    }
  }

  static async requestPermission(permission) {
    try {
      return await request(permission);
    } catch (error) {
      console.error('Permission request error:', error);
      return RESULTS.UNAVAILABLE;
    }
  }

  static showPermissionAlert(type, onRetry, onCancel) {
    Alert.alert(
      `${type} Permission Required`,
      `The app requires ${type.toLowerCase()} permission to function properly.`,
      [
        { text: 'Cancel', style: 'cancel', onPress: onCancel },
        {
          text: 'Open Settings',
          onPress: () => {
            openSettings().catch(() => {
              Linking.openURL(
                Platform.OS === 'ios' ? 'app-settings:' : 'package:com.app',
              );
            });
          },
        },
        { text: 'Retry', onPress: onRetry },
      ],
    );
  }

  static async requestCameraPermission() {
    const { camera } = this.getPermissions();
    if (!camera) throw new Error('Camera permission unavailable');

    const status = await this.checkPermission(camera);
    if (status === RESULTS.GRANTED) return { granted: true };

    const result = await this.requestPermission(camera);
    return this.buildResult(result, 'Camera');
  }

  static async requestLocationPermission(always = false) {
    return Platform.OS === 'ios'
      ? this.requestiOSLocationPermission(always)
      : this.requestAndroidLocationPermission();
  }

  static async requestiOSLocationPermission(always) {
    const { location, locationWhenInUse } = this.getPermissions();

    if (!always) {
      return this.handleBasicPermission(locationWhenInUse, 'Location');
    }

    const initialStatus = await this.checkPermission(locationWhenInUse);
    if (initialStatus !== RESULTS.GRANTED) {
      const requestResult = await this.requestPermission(locationWhenInUse);
      if (requestResult !== RESULTS.GRANTED) {
        return this.buildResult(requestResult, 'Location');
      }
    }

    await new Promise(res => setTimeout(res, 1000));

    const finalStatus = await this.checkPermission(location);
    if (finalStatus === RESULTS.GRANTED) return { granted: true };

    const finalRequest = await this.requestPermission(location);
    return this.buildResult(finalRequest, 'Location (Always)');
  }

  static async requestAndroidLocationPermission() {
    const { location } = this.getPermissions();
    return this.handleBasicPermission(location, 'Location');
  }

  static async requestStoragePermission() {
    const { storage } = this.getPermissions();
    if (!storage) throw new Error('Storage permission unavailable');

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      return this.requestAndroid13StoragePermissions();
    }

    return this.handleBasicPermission(storage, 'Storage');
  }

  static async requestAndroid13StoragePermissions() {
    const types = [
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
    ];

    const results = {};
    let allGranted = true;

    for (const type of types) {
      const status = await this.checkPermission(type);
      if (status === RESULTS.GRANTED) {
        results[type] = true;
        continue;
      }

      const requestStatus = await this.requestPermission(type);
      const granted = requestStatus === RESULTS.GRANTED;
      results[type] = granted;
      if (!granted) allGranted = false;
    }

    return {
      granted: allGranted,
      message: allGranted
        ? 'All storage permissions granted'
        : 'Some storage permissions denied',
      results,
    };
  }

  static async requestNotificationsPermission() {
    const { notifications } = this.getPermissions();
    if (!notifications) throw new Error('Notification permission unavailable');

    if (Platform.OS === 'android' && Platform.Version < 33) {
      return { granted: true, message: 'Notification granted by default' };
    }

    return this.handleBasicPermission(notifications, 'Notifications');
  }

  static async requestMultiplePermissions(types = [], options = {}) {
    const results = {};

    for (const type of types) {
      try {
        switch (type) {
          case 'camera':
            results.camera = await this.requestCameraPermission();
            break;
          case 'location':
            results.location = await this.requestLocationPermission(
              options.requestAlwaysLocation,
            );
            break;
          case 'storage':
            results.storage = await this.requestStoragePermission();
            break;
          case 'notifications':
            results.notifications = await this.requestNotificationsPermission();
            break;
          default:
            console.warn(`Unknown permission type: ${type}`);
        }
      } catch (error) {
        results[type] = {
          granted: false,
          message: error.message || 'Unknown error',
        };
      }
    }

    return results;
  }

  static async isLocationAlwaysGranted() {
    if (Platform.OS !== 'ios') return false;
    const { location } = this.getPermissions();
    return (await this.checkPermission(location)) === RESULTS.GRANTED;
  }

  static async isLocationWhenInUseGranted() {
    const { locationWhenInUse, location } = this.getPermissions();
    const permission = Platform.OS === 'ios' ? locationWhenInUse : location;
    return (await this.checkPermission(permission)) === RESULTS.GRANTED;
  }

  static async debugPermissionStatus() {
    const permissions = this.getPermissions();
    const status = {};

    for (const [key, value] of Object.entries(permissions)) {
      if (value) {
        status[key] = await this.checkPermission(value);
      }
    }

    console.log('Permission statuses:', status);
    return status;
  }

  // Helper for uniform result formatting
  static buildResult(status, type) {
    switch (status) {
      case RESULTS.GRANTED:
        return { granted: true, message: `${type} permission granted` };
      case RESULTS.BLOCKED:
        return {
          granted: false,
          message: `${type} permission blocked. Please enable in settings.`,
          blocked: true,
        };
      case RESULTS.LIMITED:
        return {
          granted: true,
          message: `${type} permission granted with limitations`,
          limited: true,
        };
      case RESULTS.DENIED:
        return { granted: false, message: `${type} permission denied` };
      default:
        return { granted: false, message: `${type} permission unavailable` };
    }
  }

  static async handleBasicPermission(permission, type) {
    const status = await this.checkPermission(permission);
    if (status === RESULTS.GRANTED) return { granted: true };

    const requestResult = await this.requestPermission(permission);
    return this.buildResult(requestResult, type);
  }
}

export default PermissionHandler;
