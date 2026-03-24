import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedFadeIn from './AnimatedFadeIn';

const SocialLoginButtons = () => {
  return (
    <AnimatedFadeIn delay={800} duration={600}>
      <View style={styles.container}>
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
            <Ionicons name="logo-google" size={24} color="#EA4335" />
            <Text style={styles.buttonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
            <Ionicons name="logo-apple" size={24} color="#000" />
            <Text style={styles.buttonText}>Apple</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedFadeIn>
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
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
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
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});

export default SocialLoginButtons;
