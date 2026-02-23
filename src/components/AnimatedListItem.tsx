import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

interface AnimatedListItemProps {
    children: React.ReactNode;
    index: number;
    style?: StyleProp<ViewStyle>;
}

const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
    children,
    index,
    style,
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 500,
            delay: index * 100, // Staggered delay
            useNativeDriver: true,
        }).start();
    }, [animatedValue, index]);

    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0],
    });

    return (
        <Animated.View
            style={[
                style,
                {
                    opacity: animatedValue,
                    transform: [{ translateY }],
                },
            ]}
        >
            {children}
        </Animated.View>
    );
};

export default AnimatedListItem;
