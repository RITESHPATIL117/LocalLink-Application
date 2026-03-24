import { useWindowDimensions, TouchableOpacity, Image, TextInput } from 'react-native';

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
          { name: 'Pipe Repair', icon: 'construct' },
          { name: 'Water Heater', icon: 'thermometer' },
          { name: 'Leak Detection', icon: 'water' }
        ],
        'Electrician': [
          { name: 'Wiring', icon: 'flash' },
          { name: 'Lighting', icon: 'sunny' },
          { name: 'Panels', icon: 'grid' }
        ],
        'Cleaning': [
          { name: 'Deep Clean', icon: 'sparkles' },
          { name: 'Standard', icon: 'color-wand' },
          { name: 'Move Out', icon: 'home' }
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
    backgroundColor: '#FFF',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#111827',
  },
  scrollContent: {
    paddingBottom: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  categorySection: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  subcategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    padding: 6,
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
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
  },
});

export default CategoriesScreen;
