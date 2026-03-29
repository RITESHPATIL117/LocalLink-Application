import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, Platform } from 'react-native';
import colors from '../styles/colors';
import typography from '../styles/typography';

const Button = ({ title, onPress, style, textStyle, variant = 'primary', disabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  let buttonVariantStyle = styles.primary;
  let textVariantStyle = styles.textPrimary;

  if (variant === 'secondary') {
    buttonVariantStyle = styles.secondary;
    textVariantStyle = styles.textSecondary;
  } else if (variant === 'outline') {
    buttonVariantStyle = styles.outline;
    textVariantStyle = styles.textOutline;
  }

  const buttonStyle = ({ pressed }) => [
    styles.button,
    buttonVariantStyle,
    isHovered && styles.buttonHovered,
    disabled && styles.disabled,
    pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
    style,
  ];

  const labelStyle = [
    styles.text,
    textVariantStyle,
    textStyle,
  ];


  return (
    <Pressable 
      style={buttonStyle} 
      onPress={onPress} 
      disabled={disabled}
      onHoverIn={() => Platform.OS === 'web' && setIsHovered(true)}
      onHoverOut={() => Platform.OS === 'web' && setIsHovered(false)}
    >
      <Text style={labelStyle}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  buttonHovered: {
    opacity: 0.9,
    shadowOpacity: 0.2,
    shadowRadius: 20,
    transform: [{ scale: 1.02 }],
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: '#FFFFFF',
  },
  textOutline: {
    color: colors.primary,
  },


});

export default Button;
