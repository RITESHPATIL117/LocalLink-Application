import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import colors from '../styles/colors';

const InteractiveRating = ({ initialRating = 0, onRatingSelect, size = 40, color = '#F59E0B' }) => {
  const [rating, setRating] = useState(initialRating);
  const [animations] = useState([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]);

  const handlePress = (index) => {
    const newRating = index + 1;
    setRating(newRating);
    onRatingSelect && onRatingSelect(newRating);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animate the selected star
    Animated.sequence([
      Animated.timing(animations[index], { toValue: 1.4, duration: 150, useNativeDriver: true }),
      Animated.spring(animations[index], { toValue: 1, friction: 3, tension: 40, useNativeDriver: true })
    ]).start();
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map((index) => (
        <Animated.View key={index} style={{ transform: [{ scale: animations[index] }] }}>
          <TouchableOpacity
            onPress={() => handlePress(index)}
            activeOpacity={0.7}
            style={styles.starWrapper}
          >
            <Ionicons
              name={index < rating ? "star" : "star-outline"}
              size={size}
              color={index < rating ? color : '#CBD5E1'}
            />
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  starWrapper: {
    marginHorizontal: 6,
  },
});

export default InteractiveRating;
