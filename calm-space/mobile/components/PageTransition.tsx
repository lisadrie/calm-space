import { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(16);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.quad) });
        translateY.value = withTiming(0, { duration: 280, easing: Easing.out(Easing.quad) });
    }, []);

    const style = useAnimatedStyle(() => ({
        flex: 1,
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return <Animated.View style={style}>{children}</Animated.View>;
};

export default PageTransition;
