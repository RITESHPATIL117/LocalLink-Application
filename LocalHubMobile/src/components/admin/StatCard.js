import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const StatCard = ({ title, value, trend, isUp, icon, color, delay = 0, onPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
        delay,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        delay,
      }),
    ]).start();
  }, [delay, opacityAnim, scaleAnim]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 150, friction: 3, useNativeDriver: true }),
    ]).start();
    if (onPress) onPress();
  };

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity activeOpacity={0.9} onPress={handlePress} style={styles.touchable}>
        <LinearGradient
          colors={['#1E40AF', '#1E3A8A']} // Imperial Royal Blue Gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Glassmorphism Badge */}
          <View style={[styles.glassBadge, { backgroundColor: isUp ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }]}>
            <Ionicons name={isUp ? 'trending-up' : 'trending-down'} size={12} color={isUp ? '#10B981' : '#EF4444'} />
            <Text style={[styles.trendText, { color: isUp ? '#10B981' : '#EF4444' }]}>{trend}</Text>
          </View>

          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}25` }]}>
              <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={styles.textGroup}>
              <Text style={styles.value} numberOfLines={1}>{value}</Text>
              <Text style={styles.title} numberOfLines={1}>{title.toUpperCase()}</Text>
            </View>
          </View>

          {/* Decorative Pulse Line */}
          <View style={[styles.pulseLine, { backgroundColor: color, opacity: 0.3 }]} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    aspectRatio: 0.72, // Vertical Pill Look
    marginVertical: 8,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  touchable: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  glassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  trendText: {
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  content: {
    marginTop: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  textGroup: {
    gap: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -1,
  },
  title: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
  },
  pulseLine: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  }
});

export default StatCard;
