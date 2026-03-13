import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

import { registerUser } from '../../store/authSlice';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const RegisterScreen = ({ navigation }) => {
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[globalStyles.container, styles.container]}>
        <Text style={globalStyles.title}>Create Account</Text>
        <Text style={globalStyles.subtitle}>Sign up to get started</Text>

        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <InputField 
                label="Name" 
                value={values.name} 
                onChangeText={handleChange('name')} 
                onBlur={handleBlur('name')}
                placeholder="Enter your full name" 
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}

              <InputField 
                label="Email" 
                value={values.email} 
                onChangeText={handleChange('email')} 
                onBlur={handleBlur('email')}
                placeholder="Enter your email" 
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
                placeholder="Create a password" 
                secureTextEntry 
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <Button 
                title={loading ? "Creating Account..." : "Sign Up"} 
                onPress={handleSubmit} 
                disabled={loading}
              />
              
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                  Sign In
                </Text>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: colors.primary,
    fontWeight: 'bold',
  }
});

export default RegisterScreen;
