import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, useWindowDimensions, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

import { registerUser } from '../../store/authSlice';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';

import AuthHeader from '../../components/AuthHeader';
import SocialLoginButtons from '../../components/SocialLoginButtons';
import { renderDynamicIcon } from '../../utils/iconHelper';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: Yup.string().oneOf(['user', 'provider', 'admin'], 'Invalid role').required('Role is required'),
});

const roles = [
  { label: 'User', value: 'user', icon: 'user', description: 'Customer' },
  { label: 'Provider', value: 'provider', icon: 'wrench', description: 'Worker' },
  { label: 'Admin', value: 'admin', icon: 'settings', description: 'Manager' },
];


const RegisterScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const fadeAnims = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    Animated.stagger(200, fadeAnims.map(anim => 
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    )).start();
  }, []);

  const handleRegister = (values) => {
    dispatch(registerUser(values))
      .unwrap()
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Registration Success',
          text2: 'Welcome to LocalHub!',
        });
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: err || 'Something went wrong',
        });
      });
  };

  return (
    <LinearGradient colors={colors.gradient} style={styles.flex}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.maxContainer}>
            <View style={styles.container}>
              
              <Animated.View style={{ opacity: fadeAnims[0], transform: [{ translateY: fadeAnims[0].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
                <AuthHeader 
                  title="Create Account" 
                  subtitle="Join the localized revolution and experience seamless services." 
                />
              </Animated.View>

              <Animated.View style={[styles.glassCard, { opacity: fadeAnims[1], transform: [{ translateY: fadeAnims[1].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}>
                <Formik
                  initialValues={{ name: '', email: '', password: '', role: 'user' }}
                  validationSchema={RegisterSchema}
                  onSubmit={handleRegister}
                >
                  {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                    <View>
                      {/* Card-Based Role Selection */}
                      <Text style={styles.sectionLabel}>Register as a:</Text>
                      <View style={styles.roleGrid}>
                        {roles.map((r) => (
                          <TouchableOpacity
                            key={r.value}
                            activeOpacity={0.8}
                            style={[
                              styles.roleCard,
                              values.role === r.value && styles.activeRoleCard,
                            ]}
                            onPress={() => setFieldValue('role', r.value)}
                          >
                            <View style={[
                              styles.roleIconCircle,
                              values.role === r.value && styles.activeRoleIconCircle
                            ]}>
                              {renderDynamicIcon(r.icon, 20, values.role === r.value ? '#FFF' : colors.secondary)}
                            </View>
                            <Text style={[
                              styles.roleCardLabel,
                              values.role === r.value && styles.activeRoleCardLabel
                            ]}>
                              {r.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <InputField 
                        label="Full Name" 
                        value={values.name} 
                        onChangeText={handleChange('name')} 
                        onBlur={handleBlur('name')}
                        placeholder="John Doe" 
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                      />
                      {touched.name && errors.name && (
                        <Text style={styles.errorText}>{errors.name}</Text>
                      )}

                      <InputField 
                        ref={emailRef}
                        label="Email Address" 
                        value={values.email} 
                        onChangeText={handleChange('email')} 
                        onBlur={handleBlur('email')}
                        placeholder="john@example.com" 
                        keyboardType="email-address"
                        autoCapitalize="none"
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                      />
                      {touched.email && errors.email && (
                        <Text style={styles.errorText}>{errors.email}</Text>
                      )}

                      <InputField 
                        ref={passwordRef}
                        label="Password" 
                        value={values.password} 
                        onChangeText={handleChange('password')} 
                        onBlur={handleBlur('password')}
                        placeholder="Min 6 characters" 
                        secureTextEntry 
                        returnKeyType="go"
                        onSubmitEditing={handleSubmit}
                      />
                      {touched.password && errors.password && (
                        <Text style={styles.errorText}>{errors.password}</Text>
                      )}

                      <Button 
                        title={loading ? "Creating Account..." : "Create Free Account"} 
                        onPress={handleSubmit} 
                        disabled={loading}
                        style={styles.registerBtn}
                      />
                      
                      <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already a member? </Text>
                        <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                          Sign In
                        </Text>
                      </View>
                    </View>
                  )}
                </Formik>
              </Animated.View>

              <Animated.View style={{ opacity: fadeAnims[2], transform: [{ translateY: fadeAnims[2].interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }}>
                <SocialLoginButtons />
              </Animated.View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  maxContainer: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
    flex: 1,
  },
  container: {
    padding: 24,
    justifyContent: 'center',
    flex: 1,
  },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.45,
    shadowRadius: 35,
    elevation: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 16,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  roleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleCard: {
    flex: 0.31,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  activeRoleCard: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  roleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeRoleIconCircle: {
    backgroundColor: colors.secondary,
  },
  roleCardLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.7)',
  },
  activeRoleCardLabel: {
    color: colors.secondary,
  },
  registerBtn: {
    marginTop: 24,
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  loginText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    fontWeight: '500',
  },
  loginLink: {
    color: colors.secondary,
    fontWeight: '800',
    fontSize: 15,
  },
});

export default RegisterScreen;
