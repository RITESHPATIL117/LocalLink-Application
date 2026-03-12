import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const packages = [
  { id: 'free', name: 'Free', price: '₹0 / mo', color: '#6B7280' },
  { id: 'silver', name: 'Silver', price: '₹499 / mo', color: '#9CA3AF' },
  { id: 'gold', name: 'Gold', price: '₹999 / mo', color: '#D97706' },
  { id: 'diamond', name: 'Diamond', price: '₹1499 / mo', color: colors.primary },
];

const AddBusinessScreen = ({ navigation }) => {
  const [selectedPackage, setSelectedPackage] = useState('free');

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: '#F8F9FA' }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Business Listing</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea}>
        
        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.label}>Business Photo</Text>
          <TouchableOpacity style={styles.photoUploadBox}>
            <Ionicons name="image-outline" size={40} color={colors.textSecondary} />
            <Text style={styles.uploadText}>Tap to upload photo</Text>
          </TouchableOpacity>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.label}>Business Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. SuperFast Plumbing" 
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={styles.label}>Category</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={{ color: colors.textSecondary }}>Select a Category</Text>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.label}>Address</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Complete business address" 
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Package Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Package</Text>
          <View style={styles.packageGrid}>
            {packages.map(pkg => {
              const isActive = selectedPackage === pkg.id;
              return (
                <TouchableOpacity 
                  key={pkg.id} 
                  style={[
                    styles.packageCard, 
                    isActive && styles.activePackageCard,
                    isActive && { borderColor: pkg.color }
                  ]}
                  onPress={() => setSelectedPackage(pkg.id)}
                >
                  <View style={[styles.radioOuter, isActive && { borderColor: pkg.color }]}>
                    {isActive && <View style={[styles.radioInner, { backgroundColor: pkg.color }]} />}
                  </View>
                  <View style={styles.packageInfo}>
                    <Text style={[styles.packageName, isActive && { color: pkg.color }]}>{pkg.name}</Text>
                    <Text style={styles.packagePrice}>{pkg.price}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Submit */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitText}>Submit Listing</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  backButton: {
    padding: 4,
  },
  scrollArea: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  photoUploadBox: {
    height: 140,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  packageGrid: {
    flexDirection: 'column',
  },
  packageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  activePackageCard: {
    backgroundColor: '#F3F9FF',
    borderWidth: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  packageInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  packagePrice: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddBusinessScreen;
