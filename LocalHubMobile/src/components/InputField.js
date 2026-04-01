import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import typography from '../styles/typography';

const InputField = React.forwardRef(({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  error, 
  style,
  keyboardType = 'default',
  returnKeyType = 'done',
  onSubmitEditing,
  autoCapitalize = 'sentences',
  variant = 'dark',
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;
  const isLight = variant === 'light';

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isLight ? '#E5E7EB' : 'rgba(255,255,255,0.1)', colors.primary],
  });

  const backgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [isLight ? '#F9FAFB' : 'rgba(255,255,255,0.05)', isLight ? '#FFFFFF' : 'rgba(255,255,255,0.12)'],
  });

  const scale = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.01],
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, isLight && { color: '#4B5563' }]}>{label}</Text>}
      <Animated.View style={[
        styles.inputContainer, 
        { borderColor, backgroundColor, transform: [{ scale }] },
        error && styles.inputError
      ]}>
        <TextInput
          ref={ref}
          style={[styles.input, isLight && { color: '#111827' }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isLight ? '#9CA3AF' : 'rgba(255,255,255,0.4)'}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.iconContainer} 
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color={isFocused ? colors.primary : (isLight ? '#9CA3AF' : "rgba(255,255,255,0.5)")} 
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 60,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  iconContainer: {
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
    marginLeft: 4,
  },
});

export default InputField;
