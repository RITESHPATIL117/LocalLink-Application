import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../../styles/globalStyles';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';

const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.contentContainer}>
        <Text style={globalStyles.title}>Provider Dashboard</Text>
        <Text style={globalStyles.subtitle}>Welcome back, {user?.name}</Text>

        <Button 
          title="Add New Business" 
          onPress={() => navigation.navigate('AddBusiness')} 
        />
        
        <View style={[globalStyles.card, { marginTop: 20 }]}>
          <Text style={{fontWeight: 'bold'}}>Quick Stats</Text>
          <Text>Total Views: 154</Text>
          <Text>New Leads: 12</Text>
          <Text>Average Rating: 4.8</Text>
        </View>

        <Button title="Logout" onPress={logout} variant="secondary" />
      </View>
    </View>
  );
};

export default DashboardScreen;
