import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import categoryService from '../../services/categoryService';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import { renderDynamicIcon } from '../../utils/iconHelper';
import Toast from 'react-native-toast-message';
import SkeletonLoader from '../../components/SkeletonLoader';
import * as Haptics from 'expo-haptics';

const CategoriesScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('grid');
  const [newCatImage, setNewCatImage] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Toast.show({ type: 'error', text1: 'Network Error', text2: 'Could not sync categories.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) {
      Toast.show({ type: 'error', text1: 'Required Field', text2: 'Category Name is mandatory.' });
      return;
    }

    setAdding(true);
    try {
      const payload = {
        name: newCatName,
        title: newCatName,
        icon: newCatIcon || 'grid',
        image: newCatImage || 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=400',
        color: colors.primary,
        isMaterial: false,
        subcategories: []
      };

      await categoryService.createCategory(payload);
      
      Toast.show({ type: 'success', text1: 'Category Added', text2: `${newCatName} created successfully!` });
      setModalVisible(false);
      
      // Reset form
      setNewCatName('');
      setNewCatIcon('grid');
      setNewCatImage('');
      
      fetchCategories();
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Creation Failed', text2: 'Could not add category.' });
    } finally {
      setAdding(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    (cat.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategory = ({ item, index }) => (
    <AnimatedFadeIn delay={index * 50} duration={600} style={styles.card}>
      <TouchableOpacity 
        activeOpacity={0.9} 
        style={StyleSheet.absoluteFill}
        onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate('HomeTab', { 
                screen: 'Businesses', 
                params: { categoryId: item.id } 
            });
        }}
      >
        <Image 
          source={{ uri: item.image || 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=600' }} 
          style={styles.cardBg} 
        />
        <LinearGradient 
          colors={['transparent', 'rgba(0,0,0,0.8)']} 
          style={styles.cardOverlay}
        >
          <View style={[styles.iconContainer, { backgroundColor: item.color || colors.primary }]}>
            {renderDynamicIcon(item.icon, item.isMaterial, 20, '#FFF')}
          </View>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSub}>{item.business_count || 0} Businesses</Text>
        </LinearGradient>
        <TouchableOpacity 
            style={styles.optionsBtn}
            onPress={() => Haptics.selectionAsync()}
        >
           <Ionicons name="ellipsis-vertical" size={18} color="#FFF" />
        </TouchableOpacity>
      </TouchableOpacity>
    </AnimatedFadeIn>
  );

  return (
    <SafeAreaView style={[globalStyles.container, styles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={18} color="#FFF" />
          <Text style={styles.addBtnText}>Add New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search categories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.list}>
          <View style={styles.row}>
             <SkeletonLoader width={(width - 45) / 2} height={160} borderRadius={24} style={{ marginHorizontal: 5 }} />
             <SkeletonLoader width={(width - 45) / 2} height={160} borderRadius={24} style={{ marginHorizontal: 5 }} />
          </View>
          <View style={styles.row}>
             <SkeletonLoader width={(width - 45) / 2} height={160} borderRadius={24} style={{ marginHorizontal: 5 }} />
             <SkeletonLoader width={(width - 45) / 2} height={160} borderRadius={24} style={{ marginHorizontal: 5 }} />
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => (item.id || Math.random()).toString()}
          renderItem={renderCategory}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="grid-outline" size={48} color={colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>No Categories</Text>
              <Text style={styles.emptyDesc}>Try searching for something else or add a new category.</Text>
            </View>
          }
        />
      )}

      {/* Manual Add Category Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Category</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category Name *</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. Home Cleaning"
                  value={newCatName}
                  onChangeText={setNewCatName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Icon Name (Ionicons/MCO)</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. home, car, leaf"
                  value={newCatIcon}
                  onChangeText={setNewCatIcon}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cover Image URL</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="https://..."
                  value={newCatImage}
                  onChangeText={setNewCatImage}
                  autoCapitalize="none"
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setModalVisible(false); }}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSubmitBtn} 
                onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); handleCreateCategory(); }} 
                disabled={adding}
              >
                <LinearGradient colors={[colors.primary, '#E65C00']} style={styles.modalSubmitGradient}>
                  {adding ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.modalSubmitText}>Save Category</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 4, zIndex: 10 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  addBtnText: { color: '#FFF', fontWeight: '800', marginLeft: 6, fontSize: 13 },
  
  searchSection: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, borderRadius: 18, height: 54, borderWidth: 1.5, borderColor: '#F1F5F9', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600', color: '#1E293B' },
  
  list: { padding: 15, paddingBottom: 100 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  card: { flex: 1, height: 180, borderRadius: 28, overflow: 'hidden', marginHorizontal: 6, backgroundColor: '#FFF', shadowColor: '#1E293B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 16, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9' },
  cardBg: { width: '100%', height: '100%', position: 'absolute' },
  cardOverlay: { ...StyleSheet.absoluteFillObject, padding: 16, justifyContent: 'flex-end' },
  iconContainer: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
  cardTitle: { color: '#FFF', fontSize: 18, fontWeight: '900', marginBottom: 2, letterSpacing: -0.5 },
  cardSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  optionsBtn: { position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: 40 },
  emptyIconBg: { width: 100, height: 100, borderRadius: 50, backgroundColor: `${colors.primary}10`, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginBottom: 8, letterSpacing: -0.5 },
  emptyDesc: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, fontWeight: '600' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 24, maxHeight: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#1E293B', letterSpacing: -1 },
  closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '800', color: '#475569', marginBottom: 10, marginLeft: 4 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#F1F5F9', borderRadius: 18, padding: 18, fontSize: 16, color: '#1E293B', fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: 14, marginTop: 16, marginBottom: 20 },
  modalCancelBtn: { flex: 1, height: 60, borderRadius: 18, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  modalCancelText: { color: '#64748B', fontSize: 16, fontWeight: '800' },
  modalSubmitBtn: { flex: 1, borderRadius: 18, overflow: 'hidden', elevation: 8 },
  modalSubmitGradient: { width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' },
  modalSubmitText: { color: '#FFF', fontSize: 16, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 }
});

export default CategoriesScreen;
