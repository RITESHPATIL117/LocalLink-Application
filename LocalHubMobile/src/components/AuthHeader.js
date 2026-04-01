import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import AnimatedFadeIn from './AnimatedFadeIn';

const AuthHeader = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <AnimatedFadeIn delay={100} duration={800}>
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="pie-chart" size={36} color={colors.secondary} />
          </View>
          <Text style={styles.logoText}>
            Local<Text style={{color: colors.secondary}}>Hub</Text>
          </Text>
        </View>
      </AnimatedFadeIn>

      <AnimatedFadeIn delay={300} duration={800}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </AnimatedFadeIn>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0', // Soft Slate
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
    fontWeight: '500',
  },
});

export default AuthHeader;
