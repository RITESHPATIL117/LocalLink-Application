import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryItem from '../../components/CategoryItem';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import categoryService from '../../services/categoryService';

// Mock Categories Removed
const CategoriesScreen = ({ navigation }) => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      setCategoriesData(res.data || []);
    } catch (error) {
      console.log('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: '#F8F9FA' }]}>
      <View style={styles.header}>
        <Text style={styles.title}>All Categories</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {categoriesData.length > 0 ? categoriesData.map((category) => (
            <View key={category.id || Math.random().toString()} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                {category.isMaterial ? (
                  <MaterialCommunityIcons name={category.icon || 'star'} size={24} color={colors.primary} />
                ) : (
                  <Ionicons name={category.icon || 'star'} size={24} color={colors.primary} />
                )}
                <Text style={styles.categoryTitle}>{category.title || category.name}</Text>
              </View>
              <View style={styles.subcategoriesGrid}>
                {category.subcategories && category.subcategories.map((subItem) => (
                  <View key={subItem.id || Math.random().toString()} style={styles.gridItem}>
                    <CategoryItem
                      item={subItem}
                      onPress={() => navigation.navigate('Subcategory', { subcategory: subItem.name })}
                    />
                  </View>
                ))}
              </View>
            </View>
          )) : (
            <Text style={{ textAlign: 'center', padding: 20, color: '#999' }}>No categories available.</Text>
          )}
        </ScrollView>
      )}
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
