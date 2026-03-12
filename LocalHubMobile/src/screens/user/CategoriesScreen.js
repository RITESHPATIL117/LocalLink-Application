import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryItem from '../../components/CategoryItem';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

// Dummy Categories Array
const allCategories = [
  { id: '1', name: 'Restaurants', icon: 'restaurant' },
  { id: '2', name: 'Hospitals', icon: 'medkit' },
  { id: '3', name: 'Plumbers', icon: 'water' },
  { id: '4', name: 'Electricians', icon: 'flash' },
  { id: '5', name: 'Hotels', icon: 'bed' },
  { id: '6', name: 'Groceries', icon: 'cart' },
  { id: '7', name: 'Mechanics', icon: 'car' },
  { id: '8', name: 'Salons', icon: 'cut' },
  { id: '9', name: 'Pharmacies', icon: 'medical' },
  { id: '10', name: 'Gyms', icon: 'barbell' },
  { id: '11', name: 'Couriers', icon: 'airplane' },
  { id: '12', name: 'Events', icon: 'musical-notes' },
];

const CategoriesScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: '#FFF' }]}>
      <View style={styles.header}>
        <Text style={styles.title}>All Categories</Text>
      </View>
      <FlatList
        data={allCategories}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridList}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <CategoryItem 
              item={item} 
              onPress={() => navigation.navigate('SearchResults', { query: item.name })}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  gridList: {
    padding: 10,
    paddingBottom: 20,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default CategoriesScreen;
