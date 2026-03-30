import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../styles/colors';
import typography from '../styles/typography';

const Button = ({ title, onPress, style, textStyle, variant = 'primary', disabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getGradient = () => {
    if (disabled) return ['#9CA3AF', '#6B7280'];
    if (variant === 'secondary') return [colors.secondary, '#B45309'];
    if (variant === 'outline') return ['transparent', 'transparent'];
    return colors.gradient || ['#0F172A', '#1E3A8A'];
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable 
        onPress={onPress} 
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onHoverIn={() => Platform.OS === 'web' && setIsHovered(true)}
        onHoverOut={() => Platform.OS === 'web' && setIsHovered(false)}
      >
        <LinearGradient
          colors={getGradient()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            variant === 'outline' && styles.outline,
            isHovered && styles.buttonHovered,
            disabled && styles.disabled,
          ]}
        >
          <Text style={[
            styles.text,
            variant === 'outline' && { color: colors.primary },
            textStyle
          ]}>
            {title}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonHovered: {
    opacity: 0.9,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

export default Button;
