import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import LottieView from 'lottie-react-native';

interface LottieSplashScreenProps {
  onAnimationFinish: () => void;
}

const { width, height } = Dimensions.get('window');

const LottieSplashScreen: React.FC<LottieSplashScreenProps> = ({
  onAnimationFinish,
}) => {
  useEffect(() => {
    // Safety timeout: transition to main app after 3 seconds even if animation fails
    const timer = setTimeout(() => {
      onAnimationFinish();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onAnimationFinish]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/morphing.json')}
        autoPlay
        loop={false}
        style={styles.animation}
        onAnimationFinish={onAnimationFinish}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#02020A', // Deep space black/navy
  },
  animation: {
    width: width,
    height: height,
  },
});

export default LottieSplashScreen;
