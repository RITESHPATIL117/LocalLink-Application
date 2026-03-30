import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';

const SocialLoginButtons = () => {
  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>Or continue with</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
          <Ionicons name="logo-google" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
          <Ionicons name="logo-apple" size={22} color="#FFF" />
          <Text style={styles.buttonText}>Apple ID</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    width: '100%',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  dividerText: {
    marginHorizontal: 15,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default SocialLoginButtons;
