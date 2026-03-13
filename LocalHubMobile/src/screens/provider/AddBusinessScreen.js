import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const packages = [
  { id: 'free', name: 'Free', price: '$0/mo', color: '#6B7280' },
  { id: 'silver', name: 'Silver', price: '$29/mo', color: '#9CA3AF' },
  { id: 'gold', name: 'Gold', price: '$99/mo', color: '#F59E0B' },
  { id: 'diamond', name: 'Diamond', price: '$199/mo', color: '#3B82F6' },
];

const AddBusinessScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    subCategory: '',
    location: '',
    phone: '',
  });

  const [selectedPackage, setSelectedPackage] = useState('free');
  const [images, setImages] = useState([]); // This would hold image URIs in a real implementation

  const handleCreateListing = () => {
    // Submit logic here
    alert('Listing Created Successfully!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: '#F9FAFB' }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Listing</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea}>
        
        {/* Basic Details Form */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Business Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name *</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. SuperFast Plumbing"
              value={formData.businessName}
              onChangeText={(text) => setFormData({...formData, businessName: text})}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>{formData.category || 'Select Category'}</Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Sub Category *</Text>
              <View style={styles.dropdown}>
                <Text style={styles.dropdownText}>{formData.subCategory || 'Select Subcategory'}</Text>
                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location / Address *</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter full address"
              value={formData.location}
              onChangeText={(text) => setFormData({...formData, location: text})}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. +91 9876543210"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
            />
          </View>
        </View>

        {/* Image Upload */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Upload Photos</Text>
          <Text style={styles.helperText}>Add at least 1 image to make your listing stand out.</Text>
          
          <TouchableOpacity style={styles.uploadBox}>
            <Ionicons name="cloud-upload-outline" size={40} color={colors.primary} />
            <Text style={styles.uploadText}>Tap to enhance images from gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Package Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Select Package</Text>
          <Text style={styles.helperText}>Choose a plan that fits your business needs.</Text>
          
          <View style={styles.packagesContainer}>
            {packages.map((pkg) => (
              <TouchableOpacity
                key={pkg.id}
                style={[
                  styles.packageCard,
                  selectedPackage === pkg.id && styles.activePackageCard,
                  selectedPackage === pkg.id && { borderColor: pkg.color }
                ]}
                onPress={() => setSelectedPackage(pkg.id)}
              >
                <View style={[styles.packageRibbon, { backgroundColor: pkg.color }]} />
                <View style={styles.packageContent}>
                  <Text style={[styles.packageName, selectedPackage === pkg.id && { color: pkg.color }]}>
                    {pkg.name}
                  </Text>
                  <Text style={styles.packagePrice}>{pkg.price}</Text>
                  
                  {selectedPackage === pkg.id && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark-circle" size={24} color={pkg.color} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={globalStyles.primaryButton} onPress={handleCreateListing}>
          <Text style={globalStyles.primaryButtonText}>Create Listing</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollArea: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    backgroundColor: '#F9FAFB',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F9FAFB',
  },
  dropdownText: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    marginTop: -8,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  uploadText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  packagesContainer: {
    flexDirection: 'column',
  },
  packageCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  activePackageCard: {
    borderWidth: 2,
    backgroundColor: '#F9FAFB',
  },
  packageRibbon: {
    width: 6,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
  },
  packageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 20,
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginRight: 12,
  },
  checkmark: {
    position: 'absolute',
    right: 16,
  }
});

export default AddBusinessScreen;
