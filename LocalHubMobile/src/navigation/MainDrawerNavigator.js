import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import UserNavigator from './UserNavigator';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
            style={styles.avatar} 
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{isAuthenticated ? user?.name : 'Guest User'}</Text>
            <Text style={styles.userRole}>{isAuthenticated ? user?.role : 'Welcome to LocalHub'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.drawerItems}>
        <DrawerItemList {...props} />
        
        <View style={styles.divider} />
        
        <DrawerItem
          label="Help & Support"
          icon={({ color, size }) => <Ionicons name="help-circle-outline" color={color} size={size} />}
          onPress={() => props.navigation.navigate('Support')}
        />
        <DrawerItem
          label="Settings"
          icon={({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />}
          onPress={() => props.navigation.navigate('Settings')}
        />
        <DrawerItem
          label="About Us"
          icon={({ color, size }) => <Ionicons name="information-circle-outline" color={color} size={size} />}
          onPress={() => props.navigation.navigate('AboutUs')}
        />

        {isAuthenticated && (
          <DrawerItem
            label="Logout"
            labelStyle={{ color: '#EF4444' }}
            icon={({ size }) => <Ionicons name="log-out-outline" color="#EF4444" size={size} />}
            onPress={() => dispatch(logout())}
          />
        )}
      </View>
      
      <View style={styles.drawerFooter}>
        <Text style={styles.footerText}>v1.0.0 Premium</Text>
      </View>
    </DrawerContentScrollView>
  );
};

const MainDrawerNavigator = () => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: isLargeScreen ? 'permanent' : 'front',
        drawerStyle: {
          width: 280,
          backgroundColor: '#FFF',
          borderRightWidth: 1,
          borderRightColor: '#F3F4F6',
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: '#6B7280',
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          marginLeft: -10,
        },
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={UserNavigator} 
        options={{ 
          title: 'Explore Services',
          drawerIcon: ({ color, size }) => <Ionicons name="compass-outline" color={color} size={size} />
        }} 
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  drawerHeader: {
    padding: 24,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  userRole: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  drawerItems: {
    flex: 1,
    paddingTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  drawerFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default MainDrawerNavigator;
