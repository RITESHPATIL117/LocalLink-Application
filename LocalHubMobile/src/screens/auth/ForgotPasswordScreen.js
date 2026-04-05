import React, { useState } from 'react';
import { 
  View, StyleSheet, Text, ActivityIndicator, 
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../components/Button';
import InputField from '../../components/InputField';
import AuthHeader from '../../components/AuthHeader';
import colors from '../../styles/colors';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Toast.show({
        type: 'success',
        text1: 'Reset Email Sent',
        text2: `A recovery link has been sent to ${values.email}`,
      });
      
      setTimeout(() => navigation.goBack(), 2000);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not send recovery email. Please try again.',
      });
    } finally {
      setLoading(false);
    }
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
              
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>

              <AuthHeader 
                title="Forgot Password" 
                subtitle="No worries! Enter your email and we'll send you a recovery link." 
              />

              <View style={styles.whiteCard}>
                <Formik
                  initialValues={{ email: '' }}
                  validationSchema={ForgotPasswordSchema}
                  onSubmit={handleResetPassword}
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
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}

                    <Button 
                      title={loading ? "Sending..." : "Send Recovery Link"} 
                      onPress={handleSubmit} 
                      disabled={loading}
                      style={styles.resetBtn}
                    />
                  </View>
                )}
              </Formik>

              <TouchableOpacity 
                style={styles.backToLogin} 
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backToLoginText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
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
  backBtn: {
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  whiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 8,
  },
  resetBtn: {
    marginTop: 24,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  backToLogin: {
    marginTop: 24,
    alignItems: 'center',
  },
  backToLoginText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15,
  }
});

export default ForgotPasswordScreen;
