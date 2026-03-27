import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import globalStyles from '../../styles/globalStyles';
import categoryService from '../../services/categoryService';
import AnimatedFadeIn from '../../components/AnimatedFadeIn';
import { renderDynamicIcon } from '../../utils/iconHelper';
import Toast from 'react-native-toast-message';

const CategoriesScreen = ({ navigation }) => {
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
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load categories.' });
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
    <AnimatedFadeIn delay={index * 50} style={styles.card}>
      <Image 
        source={{ uri: item.image || 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=400' }} 
        style={styles.cardBg} 
      />
      <View style={styles.cardOverlay}>
        <View style={[styles.iconContainer, { backgroundColor: item.color || colors.primary }]}>
          {renderDynamicIcon(item.icon, item.isMaterial, 22, '#FFF')}
        </View>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSub}>{(item.subcategories && item.subcategories.length) || 0} Subcategories</Text>
      </View>
      <TouchableOpacity style={styles.optionsBtn}>
         <Ionicons name="ellipsis-vertical" size={20} color="#FFF" />
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
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1F2937" />
        </View>
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCategory}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons name="grid-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyText}>No Categories Found</Text>
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
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleCreateCategory} disabled={adding}>
                {adding ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.modalSubmitText}>Save Category</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2937', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  addBtnText: { color: '#FFF', fontWeight: '700', marginLeft: 6, fontSize: 14 },
  searchSection: { padding: 20, paddingBottom: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 15, borderRadius: 12, height: 50, borderWidth: 1, borderColor: '#E5E7EB' },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  list: { padding: 15, paddingBottom: 40 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  card: { flex: 1, height: 160, borderRadius: 20, overflow: 'hidden', marginHorizontal: 5, backgroundColor: '#FFF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  cardBg: { width: '100%', height: '100%', position: 'absolute' },
  cardOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', padding: 16, justifyContent: 'flex-end' },
  iconContainer: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardTitle: { color: '#FFF', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  cardSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  optionsBtn: { position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 15, fontSize: 18, color: '#9CA3AF', fontWeight: '600' },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(17,24,39,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 16, fontSize: 16, color: '#111827' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 10, marginBottom: 20 },
  modalCancelBtn: { flex: 1, paddingVertical: 16, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center' },
  modalCancelText: { color: '#4B5563', fontSize: 16, fontWeight: '700' },
  modalSubmitBtn: { flex: 1, paddingVertical: 16, borderRadius: 16, backgroundColor: '#1F2937', alignItems: 'center' },
  modalSubmitText: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});

export default CategoriesScreen;
