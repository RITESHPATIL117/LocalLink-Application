import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReviewsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Reviews Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ReviewsScreen;
