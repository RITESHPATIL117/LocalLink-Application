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
    borderRadius: 30,
    marginHorizontal: 16,
    padding: 4,
    height: 60,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  locationWrapper: {
    flex: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#F3F4F6',
  },
  divider: {
    display: 'none', // replaced by borderLeft on locationWrapper
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  searchButton: {
    backgroundColor: colors.primary,
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  searchButtonText: {
    display: 'none', // Use icon only for elite look
  },


});

export default SearchBar;
