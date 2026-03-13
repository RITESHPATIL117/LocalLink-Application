import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryItem from '../../components/CategoryItem';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const categoriesData = [
  {
    id: 'c1',
    title: 'Food & Restaurants',
    icon: 'restaurant',
    isMaterial: false,
    subcategories: [
      { id: 'sc1-1', name: 'Restaurants', icon: 'restaurant', isMaterial: false },
      { id: 'sc1-2', name: 'Cafes', icon: 'cafe', isMaterial: false },
      { id: 'sc1-3', name: 'Bakeries', icon: 'baguette', isMaterial: true },
      { id: 'sc1-4', name: 'Sweet Shops', icon: 'ice-cream', isMaterial: false },
      { id: 'sc1-5', name: 'Catering Services', icon: 'silverware-variant', isMaterial: true },
      { id: 'sc1-6', name: 'Fast Food', icon: 'fast-food', isMaterial: false },
      { id: 'sc1-7', name: 'Chinese Restaurants', icon: 'noodles', isMaterial: true },
    ]
  },
  {
    id: 'c2',
    title: 'Health & Medical',
    icon: 'medkit',
    isMaterial: false,
    subcategories: [
      { id: 'sc2-1', name: 'Hospitals', icon: 'hospital-building', isMaterial: true },
      { id: 'sc2-2', name: 'Clinics', icon: 'medical', isMaterial: false },
      { id: 'sc2-3', name: 'Dentists', icon: 'tooth', isMaterial: true },
      { id: 'sc2-4', name: 'Diagnostic Labs', icon: 'flask', isMaterial: false },
      { id: 'sc2-5', name: 'Physiotherapists', icon: 'human-handsup', isMaterial: true },
      { id: 'sc2-6', name: 'Dermatologists', icon: 'face-man-profile', isMaterial: true },
      { id: 'sc2-7', name: 'General Physicians', icon: 'stethoscope', isMaterial: true },
    ]
  },
  {
    id: 'c3',
    title: 'Home Services',
    icon: 'home',
    isMaterial: false,
    subcategories: [
      { id: 'sc3-1', name: 'Plumbers', icon: 'water-pump', isMaterial: true },
      { id: 'sc3-2', name: 'Electricians', icon: 'flash', isMaterial: false },
      { id: 'sc3-3', name: 'Carpenters', icon: 'saw-blade', isMaterial: true },
      { id: 'sc3-4', name: 'Painters', icon: 'format-paint', isMaterial: true },
      { id: 'sc3-5', name: 'AC Repair', icon: 'air-conditioner', isMaterial: true },
      { id: 'sc3-6', name: 'Pest Control', icon: 'bug', isMaterial: false },
      { id: 'sc3-7', name: 'House Cleaning', icon: 'broom', isMaterial: true },
    ]
  },
  {
    id: 'c4',
    title: 'Local Shops',
    icon: 'storefront',
    isMaterial: false,
    subcategories: [
      { id: 'sc4-1', name: 'Grocery Stores', icon: 'cart', isMaterial: false },
      { id: 'sc4-2', name: 'Electrical Shops', icon: 'power-plug', isMaterial: true },
      { id: 'sc4-3', name: 'Hardware Stores', icon: 'tools', isMaterial: true },
      { id: 'sc4-4', name: 'Mobile Phone Shops', icon: 'cellphone', isMaterial: true },
      { id: 'sc4-5', name: 'Gift Shops', icon: 'gift', isMaterial: false },
      { id: 'sc4-6', name: 'Stationery Shops', icon: 'pencil-ruler', isMaterial: true },
    ]
  },
  {
    id: 'c5',
    title: 'Education',
    icon: 'school',
    isMaterial: false,
    subcategories: [
      { id: 'sc5-1', name: 'Schools', icon: 'school', isMaterial: false },
      { id: 'sc5-2', name: 'Colleges', icon: 'domain', isMaterial: true },
      { id: 'sc5-3', name: 'Coaching Classes', icon: 'chalkboard-teacher', isMaterial: true },
      { id: 'sc5-4', name: 'Dance Classes', icon: 'human-female-dance', isMaterial: true },
      { id: 'sc5-5', name: 'Music Classes', icon: 'musical-notes', isMaterial: false },
      { id: 'sc5-6', name: 'Computer Training', icon: 'laptop', isMaterial: false },
    ]
  },
  {
    id: 'c6',
    title: 'Beauty & Personal Care',
    icon: 'sparkles',
    isMaterial: false,
    subcategories: [
      { id: 'sc6-1', name: 'Beauty Parlours', icon: 'content-cut', isMaterial: true },
      { id: 'sc6-2', name: 'Hair Salons', icon: 'cut', isMaterial: false },
      { id: 'sc6-3', name: 'Spa & Massage', icon: 'spa', isMaterial: true },
      { id: 'sc6-4', name: 'Skin Clinics', icon: 'lotion', isMaterial: true },
      { id: 'sc6-5', name: 'Tattoo Studios', icon: 'pen', isMaterial: true },
    ]
  },
  {
    id: 'c7',
    title: 'Automobile Services',
    icon: 'car',
    isMaterial: false,
    subcategories: [
      { id: 'sc7-1', name: 'Car Repair', icon: 'car-wrench', isMaterial: true },
      { id: 'sc7-2', name: 'Bike Repair', icon: 'motorbike', isMaterial: true },
      { id: 'sc7-3', name: 'Car Rental', icon: 'car-key', isMaterial: true },
      { id: 'sc7-4', name: 'Taxi Services', icon: 'taxi', isMaterial: true },
      { id: 'sc7-5', name: 'Driving Schools', icon: 'steering', isMaterial: true },
    ]
  },
  {
    id: 'c8',
    title: 'Real Estate & Construction',
    icon: 'business',
    isMaterial: false,
    subcategories: [
      { id: 'sc8-1', name: 'Property Dealers', icon: 'home-city', isMaterial: true },
      { id: 'sc8-2', name: 'Builders & Contractors', icon: 'hammer-wrench', isMaterial: true },
      { id: 'sc8-3', name: 'Interior Designers', icon: 'sofa', isMaterial: true },
      { id: 'sc8-4', name: 'Architects', icon: 'compass-outline', isMaterial: true },
      { id: 'sc8-5', name: 'Building Material', icon: 'wall', isMaterial: true },
    ]
  }
];

const CategoriesScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: '#F8F9FA' }]}>
      <View style={styles.header}>
        <Text style={styles.title}>All Categories</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {categoriesData.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              {category.isMaterial ? (
                <MaterialCommunityIcons name={category.icon} size={24} color={colors.primary} />
              ) : (
                <Ionicons name={category.icon} size={24} color={colors.primary} />
              )}
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </View>
            <View style={styles.subcategoriesGrid}>
              {category.subcategories.map((subItem) => (
                <View key={subItem.id} style={styles.gridItem}>
                  <CategoryItem
                    item={subItem}
                    onPress={() => navigation.navigate('Subcategory', { subcategory: subItem.name })}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary || '#333',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  categorySection: {
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary || '#333',
    marginLeft: 10,
  },
  subcategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
  },
  gridItem: {
    width: '33.33%',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default CategoriesScreen;
