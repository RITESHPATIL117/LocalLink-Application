import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

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

import { useWindowDimensions } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

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
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.maxContainer}>
        <View style={[globalStyles.container, styles.container]}>
          
          <AuthHeader 
            title="Create Account" 
            subtitle="Join the localized revolution and experience seamless services." 
          />

          <Formik
            initialValues={{ name: '', email: '', password: '', role: 'user' }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
              <View>
                {/* Card-Based Role Selection */}
                <AnimatedFadeIn delay={300} duration={600}>
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
                          {renderDynamicIcon(r.icon, 20, values.role === r.value ? '#FFF' : colors.primary)}
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
                </AnimatedFadeIn>

                <AnimatedFadeIn delay={450} duration={600}>
                  <InputField 
                    label="Full Name" 
                    value={values.name} 
                    onChangeText={handleChange('name')} 
                    onBlur={handleBlur('name')}
                    placeholder="John Doe" 
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}

                  <InputField 
                    label="Email Address" 
                    value={values.email} 
                    onChangeText={handleChange('email')} 
                    onBlur={handleBlur('email')}
                    placeholder="john@example.com" 
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <InputField 
                    label="Password" 
                    value={values.password} 
                    onChangeText={handleChange('password')} 
                    onBlur={handleBlur('password')}
                    placeholder="Min 6 characters" 
                    secureTextEntry 
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
                </AnimatedFadeIn>
              </View>
            )}
          </Formik>

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
    marginBottom: 20,
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
  registerBtn: {
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  loginText: {
    color: '#6B7280',
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
