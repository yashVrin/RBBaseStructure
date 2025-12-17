import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

export type DeviceType = 'phone' | 'tablet';

export interface DeviceInfo {
  isPhone: boolean;
  isTablet: boolean;
  deviceType: DeviceType;
  screenWidth: number;
  screenHeight: number;
}

const TABLET_MIN_WIDTH = 768;

const getDeviceInfo = (): DeviceInfo => {
  const { width, height } = Dimensions.get('window');
  const isTablet = width >= TABLET_MIN_WIDTH;

  return {
    isPhone: !isTablet,
    isTablet,
    deviceType: isTablet ? 'tablet' : 'phone',
    screenWidth: width,
    screenHeight: height,
  };
};

/**
 * Custom hook to detect device type (phone vs tablet)
 * Automatically updates when screen dimensions change (e.g., orientation)
 */
const useDeviceType = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getDeviceInfo());

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setDeviceInfo(getDeviceInfo());
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return deviceInfo;
};

export default useDeviceType;
