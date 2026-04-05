'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { FiArrowLeft, FiSearch, FiMapPin, FiChevronRight, FiCheckCircle, FiStar, FiBox } from 'react-icons/fi';
import { renderDynamicIcon } from '../../utils/iconHelper';
import categoryService from '../../services/categoryService';

export default function CategoriesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedMainCat, setSelectedMainCat] = useState(null);
  const [activeSubcategories, setActiveSubcategories] = useState([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      const rawData = res.data || res || [];
      const structured = (Array.isArray(rawData) ? rawData : []).map((c, i) => ({
        ...c,
        id: c.id || `f-${i}`,
        color: c.color || '#3B82F6',
        bg: c.bg || '#EFF6FF',
        icon: c.icon || '🛠️',
      }));
      const finalCats = structured.length > 0 ? structured : FALLBACK_CATEGORIES;
      setCategories(finalCats);
      if (finalCats.length > 0) {
        handleSelectNav(finalCats[0].id);
      }
    } catch (error) {
      setCategories(FALLBACK_CATEGORIES);
      handleSelectNav(FALLBACK_CATEGORIES[0].id);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNav = async (id) => {
    setSelectedMainCat(id);
    setSubLoading(true);
    try {
      const subRes = await categoryService.getSubcategories(id);
      setActiveSubcategories(subRes.data || subRes || []);
    } catch (e) {
      setActiveSubcategories(MOCK_SUBCATEGORIES);
    } finally {
      setSubLoading(false);
    }
  };

  if (!hasMounted) return null;

  const activeCategoryData = categories.find(c => c.id === selectedMainCat) || categories[0];
  const isSearching = search.trim().length > 0;

  return (
    <div style={styles.container}>
      {/* 1. Header Section */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.headerLeft}>
            <button onClick={() => router.back()} style={styles.backBtn}><FiArrowLeft /></button>
            <h1 style={styles.pageTitle}>Explore Services</h1>
          </div>
          <div style={styles.locationBadge}>
            <FiMapPin size={14} color="var(--color-primary)" />
            <span style={styles.locationText}>Sangli, MH ▼</span>
          </div>
        </div>

        {/* 2. Professional Search Bar */}
        <div style={styles.searchWrapper}>
          <FiSearch style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search for 'AC Repair', 'Cleaning', 'Wedding'..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          {isSearching && <button onClick={() => setSearch('')} style={styles.clearBtn}>✖</button>}
        </div>
      </header>

      {/* 3. Main Split View Layout */}
      <div style={styles.content}>
        {loading ? (
          <div style={styles.loaderArea}>
            <div className="loader-pulse" style={styles.lPulse} />
            <p>Loading the best professionals in Sangli...</p>
          </div>
        ) : (
          <div style={styles.splitLayout}>
            {/* Sidebar (Justdial Density) */}
            <aside style={styles.sidebar}>
              {categories.map((cat) => {
                const isActive = selectedMainCat === cat.id;
                return (
                  <div 
                    key={cat.id} 
                    onClick={() => handleSelectNav(cat.id)}
                    style={{ ...styles.navItem, backgroundColor: isActive ? '#FFF' : 'transparent', borderLeftColor: isActive ? cat.color : 'transparent' }}
                  >
                    <div style={{ ...styles.navIcon, backgroundColor: isActive ? cat.color : '#F1F5F9', color: isActive ? '#FFF' : '#64748B' }}>
                      {renderDynamicIcon(cat.icon, 20, isActive ? '#FFF' : '#64748B')}
                    </div>
                    <span style={{ ...styles.navLabel, color: isActive ? '#1E293B' : '#64748B', fontWeight: isActive ? '900' : '700' }}>
                      {cat.name}
                    </span>
                    {isActive && <div style={{ ...styles.activeIndicator, backgroundColor: cat.color }} />}
                  </div>
                );
              })}
            </aside>

            {/* Content (Modern Card Grid) */}
            <main style={styles.mainArea}>
               {activeCategoryData && (
                 <div style={styles.contentInner}>
                   {/* Results Header */}
                   <div style={styles.resultsHeader}>
                     <div>
                       <h2 style={styles.mainCatTitle}>{activeCategoryData.name}</h2>
                       <p style={styles.subCatDesc}>Trusted Experts • Instant Booking Available</p>
                     </div>
                     <div style={{ ...styles.typeBadge, backgroundColor: activeCategoryData.bg }}>
                       <FiCheckCircle size={14} color={activeCategoryData.color} />
                       <span style={{ color: activeCategoryData.color, fontSize: '11px', fontWeight: '900' }}>VERIFIED</span>
                     </div>
                   </div>

                   {/* Grid (Justdial Density) */}
                   <div style={styles.serviceGrid}>
                     {subLoading ? (
                       <div style={styles.subLoadingText}>Updating services...</div>
                     ) : activeSubcategories.length > 0 ? (
                       activeSubcategories.map((sub, idx) => (
                         <div 
                           key={idx} 
                           onClick={() => router.push(`/search?q=${encodeURIComponent(sub.name)}`)}
                           style={styles.serviceCard}
                           className="service-card-hover"
                         >
                           <div style={styles.imgContainer}>
                             <img 
                               src={sub.image || SUB_FALLBACKS[idx % SUB_FALLBACKS.length]} 
                               alt={sub.name} 
                               style={styles.cardImg} 
                             />
                           </div>
                           <div style={styles.cardInfo}>
                             <h4 style={styles.cardTitle}>{sub.name}</h4>
                             <div style={styles.cardFooter}>
                               <span style={styles.fromText}>From ₹499</span>
                               <div style={styles.ratingInfo}>
                                 <FiStar size={10} fill="#F59E0B" color="#F59E0B" />
                                 <span>4.8</span>
                               </div>
                             </div>
                           </div>
                         </div>
                       ))
                     ) : (
                        <div style={styles.noResults}>No specific services found.</div>
                     )}
                   </div>
                 </div>
               )}
            </main>
          </div>
        )}
      </div>

      <style jsx>{`
        .service-card-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid #F1F5F9; }
        .service-card-hover:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); border-color: var(--color-primary); }
        .loader-pulse { animation: p 1.5s infinite; }
        @keyframes p { 0% { transform: scale(0.9); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.9); opacity: 0.6; } }
      `}</style>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: { backgroundColor: '#FFF', padding: '16px 24px', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 100 },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  backBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' },
  pageTitle: { fontSize: '22px', fontWeight: '1000', color: '#111827', margin: 0, letterSpacing: '-0.5px' },
  locationBadge: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F1F5F9', padding: '8px 12px', borderRadius: '12px' },
  locationText: { fontSize: '13px', fontWeight: '800', color: '#475569' },
  searchWrapper: { position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto' },
  searchIcon: { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '18px' },
  searchInput: { width: '100%', padding: '14px 14px 14px 48px', borderRadius: '16px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '15px', fontWeight: '600', outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' },
  clearBtn: { position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '14px' },
  content: { flex: 1, overflow: 'hidden', display: 'flex' },
  splitLayout: { display: 'flex', width: '100%', maxWidth: '1400px', margin: '0 auto' },
  sidebar: { width: '120px', backgroundColor: '#F8FAFC', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  navItem: { padding: '20px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', position: 'relative', borderLeft: '4px solid transparent', transition: 'all 0.2s' },
  navIcon: { width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' },
  navLabel: { fontSize: '12px', textAlign: 'center', lineHeight: '1.2' },
  activeIndicator: { position: 'absolute', right: '0', top: '20%', bottom: '20%', width: '3px', borderTopLeftRadius: '3px', borderBottomLeftRadius: '3px' },
  mainArea: { flex: 1, backgroundColor: '#FFF', overflowY: 'auto', padding: '32px' },
  contentInner: { animation: 'f 0.4s ease-out' },
  resultsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', borderBottom: '1px solid #F1F5F9', paddingBottom: '20px' },
  mainCatTitle: { fontSize: '32px', fontWeight: '1000', color: '#1E293B', margin: '0 0 6px 0', letterSpacing: '-1px' },
  subCatDesc: { fontSize: '15px', color: '#64748B', fontWeight: '600', margin: 0 },
  typeBadge: { display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px' },
  serviceGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' },
  serviceCard: { borderRadius: '24px', overflow: 'hidden', backgroundColor: '#FFF', cursor: 'pointer' },
  imgContainer: { width: '100%', height: '140px', backgroundColor: '#F1F5F9' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover' },
  cardInfo: { padding: '16px' },
  cardTitle: { fontSize: '16px', fontWeight: '900', color: '#1E293B', marginBottom: '8px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  fromText: { fontSize: '13px', color: '#64748B', fontWeight: '700' },
  ratingInfo: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '800', color: '#1E293B' },
  loaderArea: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontWeight: '700' },
  lPulse: { width: '60px', height: '60px', borderRadius: '30px', backgroundColor: 'var(--color-primary)', opacity: 0.2, marginBottom: '24px' },
  subLoadingText: { gridColumn: '1 / -1', textAlign: 'center', color: '#94A3B8', fontWeight: '700', padding: '40px' },
  noResults: { gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: '#94A3B8', fontSize: '16px', fontWeight: '700', backgroundColor: '#F8FAFC', borderRadius: '24px' }
};

const SUB_FALLBACKS = [
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300',
  'https://images.unsplash.com/photo-1621905252507-b352224075b9?q=80&w=300',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=300',
  'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=300',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=300'
];

const FALLBACK_CATEGORIES = [
  { id: '1', name: 'Plumbing', icon: '💧', color: '#3B82F6', bg: '#EFF6FF' },
  { id: '2', name: 'Electrical', icon: '⚡', color: '#F59E0B', bg: '#FFFBEB' },
  { id: '3', name: 'Cleaning', icon: '🧹', color: '#10B981', bg: '#ECFDF5' },
  { id: '4', name: 'AC Service', icon: '❄️', color: '#06B6D4', bg: '#ECFEFF' },
  { id: '5', name: 'Salon', icon: '✂️', color: '#EC4899', bg: '#FDF2F8' },
  { id: '6', name: 'Carpentry', icon: '🪚', color: '#92400E', bg: '#FFF7ED' }
];

const MOCK_SUBCATEGORIES = [
  { id: 101, name: 'General Repair' },
  { id: 102, name: 'Installation' },
  { id: 103, name: 'Deep Cleaning' },
  { id: 104, name: 'Emergency Support' },
  { id: 105, name: 'Routine Checkup' },
];
