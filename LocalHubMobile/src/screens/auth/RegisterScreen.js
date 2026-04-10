import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

import { registerUser } from '../../store/authSlice';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
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
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const emailRef = useRef(null);
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
                  title="Create Account" 
                  subtitle="Join the localized revolution and experience seamless services." 
                />
              </Animated.View>

              <Animated.View style={[styles.whiteCard, { opacity: fadeAnims[1], transform: [{ translateY: fadeAnims[1].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}>
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
                        variant="light"
                        label="Full Name" 
                        value={values.name} 
                        onChangeText={handleChange('name')} 
                        onBlur={handleBlur('name')}
                        placeholder="John Doe" 
                        autoCapitalize="words"
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                      />
                      {touched.name && errors.name && (
                        <Text style={styles.errorText}>{errors.name}</Text>
                      )}

                      <InputField 
                        variant="light"
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
                        variant="light"
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
    marginBottom: 20,
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
  registerBtn: {
    marginTop: 24,
  },
  errorText: {
    color: '#EF4444',
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
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  loginLink: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15,
  },
});

export default RegisterScreen;
