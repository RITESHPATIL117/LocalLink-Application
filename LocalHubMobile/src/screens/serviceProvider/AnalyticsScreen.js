import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../../styles/globalStyles';

const AnalyticsScreen = () => {
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.contentContainer}>
        <Text style={globalStyles.title}>Analytics</Text>
        <Text style={globalStyles.subtitle}>Track your business growth.</Text>
      </View>
    </View>
  );
};

export default AnalyticsScreen;
