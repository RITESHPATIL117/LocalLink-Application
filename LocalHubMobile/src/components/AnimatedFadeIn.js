import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const AnimatedFadeIn = ({ children, delay = 0, duration = 400, yOffset = 20, style }) => {
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [animVal, delay, duration]);

  const translateY = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [yOffset, 0]
  });

  return (
    <Animated.View style={[style, { opacity: animVal, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedFadeIn;
