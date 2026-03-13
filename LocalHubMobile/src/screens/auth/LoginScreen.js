import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

import { loginUser } from '../../store/authSlice';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password too short').required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleLogin = (values) => {
    dispatch(loginUser(values))
      .unwrap()
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Logged in successfully!',
        });
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: err || 'Something went wrong',
        });
      });
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      <Text style={globalStyles.title}>LocalHub</Text>
      <Text style={globalStyles.subtitle}>Sign in to continue</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <InputField 
              label="Email" 
              value={values.email} 
              onChangeText={handleChange('email')} 
              onBlur={handleBlur('email')}
              placeholder="Enter your email" 
              keyboardType="email-address"
              autoCapitalize="none"
              error={touched.email && errors.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <InputField 
              label="Password" 
              value={values.password} 
              onChangeText={handleChange('password')} 
              onBlur={handleBlur('password')}
              placeholder="Enter your password" 
              secureTextEntry 
              error={touched.password && errors.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <Button 
              title={loading ? "Logging in..." : "Login"} 
              onPress={handleSubmit} 
              disabled={loading}
            />
            
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
                Sign Up
              </Text>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#666',
  },
  registerLink: {
    color: colors.primary,
    fontWeight: 'bold',
  }
});

export default LoginScreen;
