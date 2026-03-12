import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const packages = [
  { id: 'free', name: 'Free Listing', price: '₹0 / mo', features: ['Basic Profile', 'Photo Gallery', 'Customer Reviews'] },
  { id: 'silver', name: 'Silver Package', price: '₹499 / mo', features: ['Verified Badge', 'Top 5 in Search', 'Lead Generation'] },
  { id: 'gold', name: 'Gold Package', price: '₹999 / mo', features: ['Gold Badge', 'Top 3 in Search', 'Premium Support', 'Analytics Dashboard'] },
  { id: 'diamond', name: 'Diamond Partner', price: '₹1499 / mo', features: ['Diamond Badge', '#1 in Search', 'Dedicated Account Manager', 'No Ads on Profile'] },
];

const PricingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={[globalStyles.container, styles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pricing Plans</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollArea}>
        <Text style={styles.subtitle}>Supercharge your business with premium local listings.</Text>
        
        {packages.map((pkg, index) => (
          <View key={pkg.id} style={[styles.packageCard, index === 3 && styles.diamondCard]}>
            <View style={styles.packageHeader}>
              <Text style={[styles.packageName, index === 3 && { color: '#FFF' }]}>{pkg.name}</Text>
              <Text style={[styles.packagePrice, index === 3 && { color: '#FFF' }]}>{pkg.price}</Text>
            </View>
            
            <View style={styles.featuresList}>
              {pkg.features.map((feature, i) => (
                <View key={i} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={index === 3 ? '#FFF' : colors.success} />
                  <Text style={[styles.featureText, index === 3 && { color: '#FFF' }]}>{feature}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity style={[styles.button, index === 3 ? styles.diamondButton : null]} onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.buttonText, index === 3 && { color: colors.primary }]}>
                Choose Plan
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
  },
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
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  packageCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  diamondCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    transform: [{ scale: 1.02 }],
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 16,
  },
  packageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 15,
    color: colors.text,
  },
  button: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 15,
  },
  diamondButton: {
    backgroundColor: '#FFF',
  },
});

export default PricingScreen;
