import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';

const { width } = Dimensions.get('window');

const TICKER_DATA = [
  { id: '1', icon: 'people', text: '53 Experts online in your city' },
  { id: '2', icon: 'shield-checkmark', text: '100% Verified Professionals' },
  { id: '3', icon: 'flash', text: 'New plumbing booking 2m ago' },
  { id: '4', icon: 'star', text: 'Highest rated service in Sangli' },
];

const TrustTicker = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollX, {
            toValue: -width,
            duration: 10000,
            useNativeDriver: true,
          }),
          Animated.timing(scrollX, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    startAnimation();
  }, [scrollX]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.tickerWrapper, { transform: [{ translateX: scrollX }] }]}>
        {[...TICKER_DATA, ...TICKER_DATA].map((item, index) => (
          <View key={`${item.id}-${index}`} style={styles.tickerItem}>
            <Ionicons name={item.icon} size={14} color={colors.primary} />
            <Text style={styles.tickerText}>{item.text}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 34,
    backgroundColor: `${colors.primary}08`,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  tickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  tickerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.3,
  },
});

export default TrustTicker;
