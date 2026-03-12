import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../styles/colors';

const CategoryItem = ({ item, onPress, type = 'square' }) => {
  if (type === 'wide') {
    return (
      <TouchableOpacity style={styles.wideContainer} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.wideIconContainer}>
          {item.isMaterial ? (
            <MaterialCommunityIcons name={item.icon} size={24} color={item.color || colors.primary} />
          ) : (
            <Ionicons name={item.icon} size={24} color={item.color || colors.primary} />
          )}
        </View>
        <Text style={styles.wideLabel} numberOfLines={2}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.squareContainer} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        {item.isMaterial ? (
          <MaterialCommunityIcons name={item.icon} size={32} color={item.color || colors.primary} />
        ) : (
          <Ionicons name={item.icon} size={32} color={item.color || colors.primary} />
        )}
      </View>
      <Text style={styles.label} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  squareContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 90,
    height: 100,
    marginHorizontal: 6,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    padding: 8,
  },
  iconContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 16,
  },
  wideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flex: 1, // To let flexWrap handle distribution
    minWidth: '45%',
  },
  wideIconContainer: {
    marginRight: 10,
  },
  wideLabel: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
});

export default CategoryItem;
