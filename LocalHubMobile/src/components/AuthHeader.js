import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import AnimatedFadeIn from './AnimatedFadeIn';

const AuthHeader = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <AnimatedFadeIn delay={100} duration={600}>
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="pie-chart" size={32} color="#FFF" />
          </View>
          <Text style={styles.logoText}>Local<Text style={{color: '#F97316'}}>Hub</Text></Text>
        </View>
      </AnimatedFadeIn>

      <AnimatedFadeIn delay={200} duration={600}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </AnimatedFadeIn>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default AuthHeader;
