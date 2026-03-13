import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const Skeleton = ({ width, height, radius = 4, style }) => {
  const animVal = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animVal, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(animVal, { toValue: 0.4, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, [animVal]);

  return (
    <Animated.View 
      style={[
        { width, height, borderRadius: radius, backgroundColor: '#E1E9EE', opacity: animVal },
        style
      ]} 
    />
  );
};

export default Skeleton;
