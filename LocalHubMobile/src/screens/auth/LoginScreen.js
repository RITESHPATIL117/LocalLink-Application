import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import globalStyles from '../../styles/globalStyles';
import { ROLES } from '../../utils/constants';

const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Dummy login function simulating an API call
  const handleLogin = (role) => {
    // In a real app we'd just call login(email, password)
    // Here we're injecting a fake user with a specific role for demonstration
    login(email, password).catch(() => {
      // Since there's no real backend, we mock a successful state dispatch
      const { store } = require('../../store');
      import('../../store/authSlice').then(({ setCredentials }) => {
        store.dispatch(setCredentials({
          user: { id: '1', name: 'Test User', email: 'test@localhub.com', role },
          token: 'fake-jwt-token'
        }));
      });
    });
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      <Text style={globalStyles.title}>LocalHub</Text>
      <Text style={globalStyles.subtitle}>Sign in to continue</Text>

      <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" />
      <InputField label="Password" value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry />

      <Text style={styles.demoText}>Demo Login (Select Role):</Text>
      <Button title="Login as Customer" onPress={() => handleLogin(ROLES.USER)} />
      <Button title="Login as Provider" onPress={() => handleLogin(ROLES.PROVIDER)} variant="secondary" />
      <Button title="Login as Admin" onPress={() => handleLogin(ROLES.ADMIN)} variant="secondary" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 24,
  },
  demoText: {
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

export default LoginScreen;
