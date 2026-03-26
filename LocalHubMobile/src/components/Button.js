import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import typography from '../styles/typography';

const Button = ({ title, onPress, style, textStyle, variant = 'primary', disabled }) => {
  let buttonVariantStyle = styles.primary;
  let textVariantStyle = styles.textPrimary;

  if (variant === 'secondary') {
    buttonVariantStyle = styles.secondary;
    textVariantStyle = styles.textSecondary;
  } else if (variant === 'outline') {
    buttonVariantStyle = styles.outline;
    textVariantStyle = styles.textOutline;
  }

  const buttonStyle = [
    styles.button,
    buttonVariantStyle,
    disabled && styles.disabled,
    style,
  ];

  const labelStyle = [
    styles.text,
    textVariantStyle,
    textStyle,
  ];


  return (
    <TouchableOpacity 
      style={buttonStyle} 
      onPress={onPress} 
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={labelStyle}>{title}</Text>
    </TouchableOpacity>
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
