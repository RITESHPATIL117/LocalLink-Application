import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

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
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.maxContainer}>
        <View style={[globalStyles.container, styles.container]}>
          
          <AuthHeader 
            title="Sign In" 
            subtitle="Access your localized services and manage your requests." 
          />

          {/* Card-Based Role Selection */}
          <AnimatedFadeIn delay={300} duration={600}>
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
                    {renderDynamicIcon(r.icon, 20, selectedRole === r.value ? '#FFF' : colors.primary)}
                  </View>
                  <Text style={[
                    styles.roleCardLabel,
                    selectedRole === r.value && styles.activeRoleCardLabel
                  ]}>
                    {r.label}
                  </Text>
                  {!isWeb && <Text style={styles.roleDescription} numberOfLines={1}>{r.description}</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </AnimatedFadeIn>

          <AnimatedFadeIn delay={450} duration={600}>
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
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <View style={styles.passwordHeader}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TouchableOpacity onPress={() => Toast.show({ type: 'info', text1: 'Feature coming soon' })}>
                    <Text style={styles.forgotLink}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
                
                <InputField 
                  value={values.password} 
                  onChangeText={handleChange('password')} 
                  onBlur={handleBlur('password')}
                  placeholder="••••••••" 
                  secureTextEntry 
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
                
                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Don't have an account? </Text>
                  <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
                    Create One
                  </Text>
                </View>
              </View>
            )}
          </Formik>
          </AnimatedFadeIn>

          <SocialLoginButtons />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
  },
  maxContainer: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
    flex: 1,
  },
  container: {
    padding: 32,
    justifyContent: 'center',
    flex: 1,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 16,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  roleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  roleCard: {
    flex: 0.31,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  activeRoleCard: {
    borderColor: colors.primary,
    backgroundColor: '#FFF',
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  roleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeRoleIconCircle: {
    backgroundColor: colors.primary,
  },
  roleCardLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
  },
  activeRoleCardLabel: {
    color: colors.primary,
  },
  roleDescription: {
    fontSize: 9,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  forgotLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  loginBtn: {
    marginTop: 24,
    borderRadius: 16,
    height: 56,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  registerText: {
    color: '#6B7280',
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
