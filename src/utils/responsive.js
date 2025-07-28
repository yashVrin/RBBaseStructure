// src/utils/responsive.js
import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on standard screen sizes
const guidelineBaseWidth = 375; // iPhone X width
const guidelineBaseHeight = 812; // iPhone X height

export const scale = size => (SCREEN_WIDTH / guidelineBaseWidth) * size;

export const verticalScale = size =>
  (SCREEN_HEIGHT / guidelineBaseHeight) * size;

export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Width & Height Percentage Helpers
export const wp = percentage => (SCREEN_WIDTH * percentage) / 100;
export const hp = percentage => (SCREEN_HEIGHT * percentage) / 100;

// Font Scaling
export const normalizeFont = size => {
  const scaleSize = scale(size);
  return Math.round(PixelRatio.roundToNearestPixel(scaleSize));
};
