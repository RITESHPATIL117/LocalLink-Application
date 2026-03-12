import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../../styles/globalStyles';

const ListingsScreen = () => {
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.contentContainer}>
        <Text style={globalStyles.title}>All Services</Text>
        <Text style={globalStyles.subtitle}>Search and filter businesses here.</Text>
      </View>
    </View>
  );
};

export default ListingsScreen;
