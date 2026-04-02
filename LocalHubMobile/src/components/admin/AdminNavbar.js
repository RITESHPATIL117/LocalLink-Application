import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';

const AdminNavbar = ({ items, activeId, onSelect }) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.outerContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.container}
      >
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onSelect(item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBg, isActive && { backgroundColor: `${colors.primary}20` }]}>
                <Ionicons 
                  name={isActive ? item.icon.replace('-outline', '') : item.icon} 
                  size={18} 
                  color={isActive ? colors.primary : '#64748B'} 
                />
              </View>
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  container: {
    paddingHorizontal: 24,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  activeTab: {
    backgroundColor: '#FFF',
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  iconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.2,
  },
  activeTabText: {
    color: '#0F172A',
  }
});

export default AdminNavbar;
