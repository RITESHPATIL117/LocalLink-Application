import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import categoryService from '../../services/categoryService';
import CategoryItem from '../../components/CategoryItem';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import { renderDynamicIcon } from '../../utils/iconHelper';

const CategoriesScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const numColumns = width > 1024 ? 6 : width > 768 ? 4 : 3;
  const itemWidth = `${100 / numColumns}%`;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    // ... fetching logic remains same ...
    try {
      const res = await categoryService.getCategories();
      let rawData = res.data || [];
      const subcategoryMap = {
        'Plumbing': [
          { name: 'Pipe Repair', icon: 'construct', image: 'https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=300' },
          { name: 'Water Heater', icon: 'thermometer', image: 'https://images.unsplash.com/photo-1585938389612-a552a28d6914?q=80&w=300' },
          { name: 'Leak Detection', icon: 'water', image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=300' }
        ],
        'Electrician': [
          { name: 'Wiring', icon: 'flash', image: 'https://images.unsplash.com/photo-1621905252507-b352224075b9?q=80&w=300' },
          { name: 'Lighting', icon: 'sunny', image: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?q=80&w=300' },
          { name: 'Panels', icon: 'grid', image: 'https://images.unsplash.com/photo-1521747669139-02cd71498b04?q=80&w=300' }
        ],
        'Cleaning': [
          { name: 'Deep Clean', icon: 'sparkles', image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=300' },
          { name: 'Standard', icon: 'color-wand', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300' },
          { name: 'Move Out', icon: 'home', image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=300' }
        ],
      };

      const structuredCategories = rawData.map(c => ({
        ...c,
        subcategories: subcategoryMap[c.name] || [
          { name: `${c.name} Pro`, icon: 'star' },
          { name: `Basic ${c.name}`, icon: 'hammer' }
        ]
      }));
      setCategoriesData(structuredCategories);
    } catch (error) {
      console.log('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categoriesData.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) || 
    cat.subcategories.some(sub => sub.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: '#F9FAFB' }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>All Categories</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput 
            placeholder="Search all services..." 
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filteredCategories.length > 0 ? filteredCategories.map((category, index) => (
            <AnimatedFadeIn key={category.id || index} delay={index * 100} duration={500}>
              <View style={styles.categorySection}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <View style={styles.iconCircle}>
                      {renderDynamicIcon(category.icon, 20, colors.primary)}
                    </View>
                    <Text style={styles.categoryTitle}>{category.name}</Text>
                  </View>
                </View>

                <View style={styles.subcategoriesGrid}>
                  {category.subcategories.map((subItem, subIndex) => (
                    <View key={subIndex} style={[styles.gridItem, { width: itemWidth }]}>
                      <CategoryItem
                        item={subItem}
                        onPress={() => navigation.navigate('SearchResults', { query: subItem.name })}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </AnimatedFadeIn>
          )) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color="#E5E7EB" />
              <Text style={styles.emptyText}>No matching categories found</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  scrollContent: {
    paddingBottom: 60,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  categorySection: {
    marginTop: 24,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.5,
  },
  subcategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    padding: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 17,
    color: '#9CA3AF',
    fontWeight: '700',
  },

});

export default CategoriesScreen;
