import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../../styles/globalStyles';

const UsersScreen = () => {
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.contentContainer}>
        <Text style={globalStyles.title}>Manage Users</Text>
        <Text style={globalStyles.subtitle}>View, edit, or ban user accounts.</Text>
      </View>
    </View>
  );
};

export default UsersScreen;
