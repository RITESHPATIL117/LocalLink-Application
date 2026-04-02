import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SkeletonLoader = ({ width: w = '100%', height = 100, borderRadius = 16, style }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    shimmerLoop.start();
    return () => shimmerLoop.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[{ width: w, height, borderRadius, backgroundColor: '#E5E7EB', overflow: 'hidden' }, style]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.4)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

export const CardSkeleton = () => (
  <View style={skeletonStyles.card}>
    <View style={skeletonStyles.header}>
      <SkeletonLoader width={50} height={50} borderRadius={25} />
      <View style={skeletonStyles.headerText}>
        <SkeletonLoader width="60%" height={16} borderRadius={4} />
        <SkeletonLoader width="40%" height={12} borderRadius={4} style={{ marginTop: 8 }} />
      </View>
    </View>
    <SkeletonLoader width="100%" height={14} borderRadius={4} style={{ marginTop: 16 }} />
    <SkeletonLoader width="90%" height={14} borderRadius={4} style={{ marginTop: 8 }} />
    <View style={skeletonStyles.footer}>
      <SkeletonLoader width="30%" height={30} borderRadius={15} />
      <SkeletonLoader width="30%" height={30} borderRadius={15} />
    </View>
  </View>
);

export const StatPillSkeleton = ({ width: w = '48%', height = 180 }) => (
  <View style={[skeletonStyles.statPill, { width: w, height }]}>
    <SkeletonLoader width={40} height={40} borderRadius={15} />
    <View style={{ marginTop: 'auto' }}>
      <SkeletonLoader width="70%" height={24} borderRadius={6} />
      <SkeletonLoader width="40%" height={12} borderRadius={4} style={{ marginTop: 8 }} />
    </View>
  </View>
);

const skeletonStyles = StyleSheet.create({
  card: { padding: 20, backgroundColor: '#FFF', borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6' },
  header: { flexDirection: 'row', alignItems: 'center' },
  headerText: { flex: 1, marginLeft: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  statPill: { width: '48%', height: 180, borderRadius: 32, padding: 20, backgroundColor: '#FFF', justifyContent: 'space-between', marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' }
});

export default SkeletonLoader;
