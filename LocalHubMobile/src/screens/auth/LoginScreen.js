import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

import { loginUser } from '../../store/authSlice';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
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
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [selectedRole, setSelectedRole] = useState('user');

  const passwordRef = useRef(null);
  const fadeAnimsRef = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);
  const fadeAnims = fadeAnimsRef.current;

  useEffect(() => {
    Animated.stagger(200, fadeAnims.map(anim => 
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    )).start();
  }, [fadeAnims]);

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
    <LinearGradient colors={colors.authGradient} style={styles.flex}>
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

              <Animated.View style={[styles.whiteCard, { opacity: fadeAnims[1], transform: [{ translateY: fadeAnims[1].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}>
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
                      variant="light"
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
                      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.forgotLink}>Forgot Password?</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <InputField 
                      variant="light"
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
                <Text style={styles.registerText}>Don&apos;t have an account? </Text>
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
  whiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
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
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  activeRoleCard: {
    borderColor: colors.primary,
    backgroundColor: '#EEF2FF',
  },
  roleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  activeRoleIconCircle: {
    backgroundColor: colors.primary,
  },
  roleCardLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  activeRoleCardLabel: {
    color: colors.primary,
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
    color: colors.primary,
    fontWeight: '700',
  },
  loginBtn: {
    marginTop: 24,
  },
  errorText: {
    color: '#EF4444',
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
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  registerLink: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15,
  }
});

export default LoginScreen;
