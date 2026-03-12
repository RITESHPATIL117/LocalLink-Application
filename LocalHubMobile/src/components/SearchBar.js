import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';

const SearchBar = ({ onSearchPress }) => {
  return (
    <View style={styles.container}>
      {/* Service Search Input */}
      <View style={styles.inputWrapper}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder="Search Services..."
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Vertical Divider */}
      <View style={styles.divider} />

      {/* Location Input */}
      <View style={styles.locationWrapper}>
        <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder="Location"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 16,
    padding: 6,
    height: 54,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputWrapper: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  locationWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SearchBar;
