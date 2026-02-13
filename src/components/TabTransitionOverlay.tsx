import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';

interface TabTransitionOverlayProps {
    children: React.ReactNode;
}

const TabTransitionOverlay: React.FC<TabTransitionOverlayProps> = ({ children }) => {
    const isFocused = useIsFocused();
    const [showAnimation, setShowAnimation] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isFocused) {
            setShowAnimation(true);

            // Fade in the screen content
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(() => {
                setShowAnimation(false);
            }, 1000); // 1s to match animation better
            return () => clearTimeout(timer);
        } else {
            // Reset opacity when tab is hidden
            fadeAnim.setValue(0);
        }
    }, [isFocused, fadeAnim]);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                {children}
            </Animated.View>
            {showAnimation && (
                <View style={styles.overlay} pointerEvents="none">
                    <LottieView
                        source={require('../assets/animations/line_drawing.json')}
                        autoPlay
                        loop={false}
                        style={styles.animation}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.4)', // Semi-transparent for smoothness
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    animation: {
        width: 300,
        height: 300,
    },
});

export default TabTransitionOverlay;
