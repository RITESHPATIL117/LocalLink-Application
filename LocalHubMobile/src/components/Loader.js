import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import colors from '../styles/colors';
import typography from '../styles/typography';

const Loader = ({ message = 'Loading...', fullScreen = false }) => {
  const containerStyle = fullScreen ? [styles.container, styles.fullScreen] : styles.container;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 12,
  },
});

export default Loader;
