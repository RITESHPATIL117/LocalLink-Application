import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import favoriteService from '../services/favoriteService';

const FAVORITES_KEY = '@localhub_favorites_v1';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const backendFavorites = await favoriteService.getFavorites().catch(() => null);
      if (backendFavorites) {
        setFavorites(backendFavorites);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(backendFavorites));
      } else {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const isFavorite = (businessId) => {
    return favorites.some(b => String(b.id) === String(businessId));
  };

  const toggleFavorite = async (business) => {
    try {
      await favoriteService.toggleFavorite(business.id).catch(() => null);

      let updatedFavorites = [];
      if (isFavorite(business.id)) {
        updatedFavorites = favorites.filter(b => String(b.id) !== String(business.id));
      } else {
        updatedFavorites = [business, ...favorites];
      }
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (e) {
      console.error('Failed to update favorites', e);
    }
  };

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite
  };
};
