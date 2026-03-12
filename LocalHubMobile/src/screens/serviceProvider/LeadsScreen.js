import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../../styles/globalStyles';

const LeadsScreen = () => {
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.contentContainer}>
        <Text style={globalStyles.title}>Customer Leads</Text>
        <Text style={globalStyles.subtitle}>Inquiries and booking requests.</Text>
      </View>
    </View>
  );
};

export default LeadsScreen;
