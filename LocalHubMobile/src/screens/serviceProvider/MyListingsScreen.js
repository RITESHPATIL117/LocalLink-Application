import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../../styles/globalStyles';

const MyListingsScreen = () => {
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.contentContainer}>
        <Text style={globalStyles.title}>My Listings</Text>
        <Text style={globalStyles.subtitle}>Manage your published services.</Text>
      </View>
    </View>
  );
};

export default MyListingsScreen;
