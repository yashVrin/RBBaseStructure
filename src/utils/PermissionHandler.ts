import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
  PermissionStatus,
} from 'react-native-permissions';
import { Platform, Alert, Linking } from 'react-native';

type PermissionType =
  | 'camera'
  | 'location'
  | 'locationWhenInUse'
  | 'storage'
  | 'notifications';

type PermissionResult = {
  granted: boolean;
  message?: string;
  blocked?: boolean;
  limited?: boolean;
  results?: Record<string, boolean>;
};

type RequestMultiplePermissionsOptions = {
  requestAlwaysLocation?: boolean;
};

class PermissionHandler {
  static getPermissions(): Record<PermissionType, string | undefined> {
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

  static getAndroidStoragePermission(): string {
    const version = Number(Platform.Version);
    if (version >= 33) return PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
    if (version >= 30) return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    return PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
  }

  static async checkPermission(permission: string): Promise<PermissionStatus> {
    try {
      return await check(permission);
    } catch (error) {
      console.error('Permission check error:', error);
      return RESULTS.UNAVAILABLE;
    }
  }

  static async requestPermission(
    permission: string,
  ): Promise<PermissionStatus> {
    try {
      return await request(permission);
    } catch (error) {
      console.error('Permission request error:', error);
      return RESULTS.UNAVAILABLE;
    }
  }

  static showPermissionAlert(
    type: string,
    onRetry?: () => void,
    onCancel?: () => void,
  ): void {
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

  static async requestCameraPermission(): Promise<PermissionResult> {
    const { camera } = this.getPermissions();
    if (!camera) throw new Error('Camera permission unavailable');

    const status = await this.checkPermission(camera);
    if (status === RESULTS.GRANTED) return { granted: true };

    const result = await this.requestPermission(camera);
    return this.buildResult(result, 'Camera');
  }

  static async requestLocationPermission(
    always = false,
  ): Promise<PermissionResult> {
    return Platform.OS === 'ios'
      ? this.requestiOSLocationPermission(always)
      : this.requestAndroidLocationPermission();
  }

  static async requestiOSLocationPermission(
    always: boolean,
  ): Promise<PermissionResult> {
    const { location, locationWhenInUse } = this.getPermissions();
    if (!location || !locationWhenInUse) {
      throw new Error('Location permission unavailable');
    }

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

  static async requestAndroidLocationPermission(): Promise<PermissionResult> {
    const { location } = this.getPermissions();
    if (!location) throw new Error('Location permission unavailable');
    return this.handleBasicPermission(location, 'Location');
  }

  static async requestStoragePermission(): Promise<PermissionResult> {
    const { storage } = this.getPermissions();
    if (!storage) throw new Error('Storage permission unavailable');

    if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
      return this.requestAndroid13StoragePermissions();
    }

    return this.handleBasicPermission(storage, 'Storage');
  }

  static async requestAndroid13StoragePermissions(): Promise<PermissionResult> {
    const types = [
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
    ];

    const results: Record<string, boolean> = {};
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

  static async requestNotificationsPermission(): Promise<PermissionResult> {
    const { notifications } = this.getPermissions();
    if (!notifications) throw new Error('Notification permission unavailable');

    if (Platform.OS === 'android' && Number(Platform.Version) < 33) {
      return { granted: true, message: 'Notification granted by default' };
    }

    return this.handleBasicPermission(notifications, 'Notifications');
  }

  static async requestMultiplePermissions(
    types: PermissionType[] = [],
    options: RequestMultiplePermissionsOptions = {},
  ): Promise<Record<string, PermissionResult>> {
    const results: Record<string, PermissionResult> = {};

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
      } catch (error: any) {
        results[type] = {
          granted: false,
          message: error.message || 'Unknown error',
        };
      }
    }

    return results;
  }

  static async isLocationAlwaysGranted(): Promise<boolean> {
    if (Platform.OS !== 'ios') return false;
    const { location } = this.getPermissions();
    if (!location) return false;
    return (await this.checkPermission(location)) === RESULTS.GRANTED;
  }

  static async isLocationWhenInUseGranted(): Promise<boolean> {
    const { locationWhenInUse, location } = this.getPermissions();
    const permission = Platform.OS === 'ios' ? locationWhenInUse : location;
    if (!permission) return false;
    return (await this.checkPermission(permission)) === RESULTS.GRANTED;
  }

  static async debugPermissionStatus(): Promise<
    Record<string, PermissionStatus>
  > {
    const permissions = this.getPermissions();
    const status: Record<string, PermissionStatus> = {};

    for (const [key, value] of Object.entries(permissions)) {
      if (value) {
        status[key] = await this.checkPermission(value);
      }
    }

    console.log('Permission statuses:', status);
    return status;
  }

  static buildResult(status: PermissionStatus, type: string): PermissionResult {
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

  static async handleBasicPermission(
    permission: string,
    type: string,
  ): Promise<PermissionResult> {
    const status = await this.checkPermission(permission);
    if (status === RESULTS.GRANTED) return { granted: true };

    const requestResult = await this.requestPermission(permission);
    return this.buildResult(requestResult, type);
  }
}

export default PermissionHandler;
