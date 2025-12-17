// src/utils/responsive.ts
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on standard screen sizes (iPhone X)
const TABLET_MIN_WIDTH = 768;

// Based on standard screen sizes
// iPhone X for phones, iPad Pro 11" for tablets
const guidelineBaseWidth = SCREEN_WIDTH >= TABLET_MIN_WIDTH ? 834 : 375;
const guidelineBaseHeight = SCREEN_WIDTH >= TABLET_MIN_WIDTH ? 1194 : 812;

/**
 * Check if current device is a tablet
 */
export const isTablet = (): boolean => {
  return SCREEN_WIDTH >= TABLET_MIN_WIDTH;
};

/**
 * Get responsive value based on device type
 * @param phoneValue - Value to use on phones
 * @param tabletValue - Value to use on tablets
 */
export const getResponsiveValue = <T,>(phoneValue: T, tabletValue: T): T => {
  return isTablet() ? tabletValue : phoneValue;
};

// Scale size horizontally
export const scale = (size: number): number =>
  (SCREEN_WIDTH / guidelineBaseWidth) * size;

// Scale size vertically
export const verticalScale = (size: number): number =>
  (SCREEN_HEIGHT / guidelineBaseHeight) * size;

// Moderate scale with factor (default 0.5)
export const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (scale(size) - size) * factor;

// Width Percentage helper
export const wp = (percentage: number): number =>
  (SCREEN_WIDTH * percentage) / 100;

// Height Percentage helper
export const hp = (percentage: number): number =>
  (SCREEN_HEIGHT * percentage) / 100;

// Normalize font size based on scale and pixel density
export const normalizeFont = (size: number): number => {
  const scaleSize = scale(size);
  return Math.round(PixelRatio.roundToNearestPixel(scaleSize));
};
