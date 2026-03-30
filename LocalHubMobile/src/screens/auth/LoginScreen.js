import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity, ScrollView, useWindowDimensions, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

import { loginUser } from '../../store/authSlice';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';

import AuthHeader from '../../components/AuthHeader';
import SocialLoginButtons from '../../components/SocialLoginButtons';
import { renderDynamicIcon } from '../../utils/iconHelper';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const roles = [
  { label: 'User', value: 'user', icon: 'user', description: 'Finding services' },
  { label: 'Provider', value: 'provider', icon: 'wrench', description: 'Offering services' },
  { label: 'Admin', value: 'admin', icon: 'settings', description: 'Managing Hub' },
];


const LoginScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [selectedRole, setSelectedRole] = useState('user');

  const passwordRef = React.useRef(null);
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

  const handleLogin = (values) => {
    dispatch(loginUser({ ...values, role: selectedRole }))
      .unwrap()
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Login Success',
          text2: `Welcome back to LocalHub!`,
        });
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: err || 'Invalid credentials',
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
                  title="Sign In" 
                  subtitle="Access your localized services and manage your requests." 
                />
              </Animated.View>

              <Animated.View style={[styles.glassCard, { opacity: fadeAnims[1], transform: [{ translateY: fadeAnims[1].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}>
                {/* Card-Based Role Selection */}
                <Text style={styles.sectionLabel}>Sign in as:</Text>
                <View style={styles.roleGrid}>
                  {roles.map((r, idx) => (
                    <TouchableOpacity
                      key={r.value}
                      activeOpacity={0.8}
                      style={[
                        styles.roleCard,
                        selectedRole === r.value && styles.activeRoleCard,
                      ]}
                      onPress={() => setSelectedRole(r.value)}
                    >
                      <View style={[
                        styles.roleIconCircle,
                        selectedRole === r.value && styles.activeRoleIconCircle
                      ]}>
                        {renderDynamicIcon(r.icon, 20, selectedRole === r.value ? '#FFF' : colors.secondary)}
                      </View>
                      <Text style={[
                        styles.roleCardLabel,
                        selectedRole === r.value && styles.activeRoleCardLabel
                      ]}>
                        {r.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Formik
                  initialValues={{ email: '', password: '' }}
                  validationSchema={LoginSchema}
                  onSubmit={handleLogin}
                >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <View>
                    <InputField 
                      label="Email Address" 
                      value={values.email} 
                      onChangeText={handleChange('email')} 
                      onBlur={handleBlur('email')}
                      placeholder="you@example.com" 
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}

                    <View style={styles.passwordHeader}>
                      <TouchableOpacity onPress={() => Toast.show({ type: 'info', text1: 'Feature coming soon' })}>
                        <Text style={styles.forgotLink}>Forgot Password?</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <InputField 
                      ref={passwordRef}
                      label="Password"
                      value={values.password} 
                      onChangeText={handleChange('password')} 
                      onBlur={handleBlur('password')}
                      placeholder="••••••••" 
                      secureTextEntry 
                      returnKeyType="go"
                      onSubmitEditing={handleSubmit}
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}

                    <Button 
                      title={loading ? "Authenticating..." : "Login to Account"} 
                      onPress={handleSubmit} 
                      disabled={loading}
                      style={styles.loginBtn}
                    />
                  </View>
                )}
              </Formik>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
                  Create One
                </Text>
              </View>
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
    shadowColor: '#1E3A8A', // Deep Royal Shadow
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
    marginBottom: 30,
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
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: -8,
    zIndex: 10,
  },
  forgotLink: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '700',
  },
  loginBtn: {
    marginTop: 24,
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  registerText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    fontWeight: '500',
  },
  registerLink: {
    color: colors.secondary,
    fontWeight: '800',
    fontSize: 15,
  }
});

export default LoginScreen;
