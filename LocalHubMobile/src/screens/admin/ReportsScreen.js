import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../../styles/globalStyles';

const ReportsScreen = () => {
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.contentContainer}>
        <Text style={globalStyles.title}>System Reports</Text>
        <Text style={globalStyles.subtitle}>Analytics and financial reports.</Text>
      </View>
    </View>
  );
};

export default ReportsScreen;
