import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BusinessCard from '../../components/BusinessCard';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';

const dummySavedBusinesses = [
  {
    id: '101',
    name: 'Sagar Ratna Restaurant',
    category: 'Restaurants',
    rating: '4.8',
    address: 'South Extension, New Delhi',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
  },
  {
    id: '103',
    name: 'QuickFix Electricals',
    category: 'Electricians',
    rating: '4.5',
    address: 'Andheri West, Mumbai',
    image: 'https://images.unsplash.com/photo-1621905252507-eb6368d5ba18',
  },
];

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState(dummySavedBusinesses);

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: '#F8F9FA' }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Businesses</Text>
      </View>
      
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You haven't saved any businesses yet.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <BusinessCard 
              business={item} 
              onPress={() => navigation.navigate('BusinessDetails', { business: item })} 
            />
          )}
        />
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
    color: colors.textPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default FavoritesScreen;
