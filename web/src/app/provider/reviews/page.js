'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import businessOwnerService from '../../../services/businessOwnerService';
import reviewService from '../../../services/reviewService';

export default function ReviewsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const businessesRes = await businessOwnerService.getBusinesses().catch(() => ({ data: [] }));
      const businesses = businessesRes.data || businessesRes || [];
      
      let allReviews = [];

      await Promise.all(
        businesses.map(async (biz) => {
          try {
            const revRes = await reviewService.getReviewsByBusiness(biz.id);
            const bizReviews = revRes.data || revRes || [];
            
            const mappedReviews = bizReviews.map(r => ({
              ...r,
              id: r.id || Math.random().toString(),
              customer: r.user?.name || r.customerName || 'Customer',
              rating: r.rating || 5,
              comment: r.comment || r.text || '',
              service: biz.name || 'General Service',
              date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
              rawDate: r.createdAt ? new Date(r.createdAt) : new Date(),
              reply: r.reply || null
            }));
            
            allReviews = [...allReviews, ...mappedReviews];
          } catch (e) {
            console.error(e);
          }
        })
      );
      
      // Fallback mock data
      if (allReviews.length === 0) {
        allReviews = [
          { id: '1', customer: 'Sarah Jenkins', rating: 5, comment: 'Excellent service! The professional was on time and very polite. Fixed my issue in under an hour.', service: 'Plumbing Repair', date: 'Yesterday', rawDate: new Date(), reply: null },
          { id: '2', customer: 'Mike Ross', rating: 4, comment: 'Good work, but arrived a bit late due to traffic.', service: 'AC Maintenance', date: '2 days ago', rawDate: new Date(Date.now() - 172800000), reply: 'Hi Mike, thanks for the feedback! We apologize for the delay and will ensure better timing next time.' },
        ];
      }

      allReviews.sort((a, b) => b.rawDate - a.rawDate);
      setReviews(allReviews);
    } catch (e) {
      console.log('Error fetching provider reviews:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Needs Reply') return !r.reply;
    if (activeTab === '5 Stars') return r.rating === 5;
    return true;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const handleReplyPress = (review) => {
    setSelectedReview(review);
    setReplyText(review.reply || '');
    setReplyModalVisible(true);
  };

  const submitReply = async () => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      // await reviewService.replyToReview(selectedReview.id, replyText);
      setReviews(prev => prev.map(r => r.id === selectedReview.id ? { ...r, reply: replyText } : r));
      setReplyModalVisible(false);
    } catch (e) {
      alert("Error posting reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', position: 'relative' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: '#FFF', padding: '24px', borderBottom: '1px solid #F1F5F9', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '16px' }}>←</button>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#1E293B', letterSpacing: '-1px', margin: 0 }}>Customer Feedback</h1>
            <p style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', margin: '4px 0 0 0' }}>Manage your reputation & ratings</p>
          </div>
        </div>
        {reviews.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FEF3C7', padding: '8px 16px', borderRadius: '16px', border: '1px solid #FDE68A' }}>
            <span style={{ color: '#B45309' }}>⭐</span>
            <span style={{ color: '#B45309', fontWeight: '900', fontSize: '18px', marginLeft: '6px' }}>{avgRating}</span>
          </div>
        )}
      </div>

      <div className="container" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
          {['All', 'Needs Reply', '5 Stars'].map((tab) => {
            const isActive = activeTab === tab;
            const needsReplyCount = tab === 'Needs Reply' ? reviews.filter(r => !r.reply).length : 0;
            return (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                style={{ 
                  display: 'flex', alignItems: 'center', backgroundColor: isActive ? 'var(--color-primary)' : '#FFF', 
                  color: isActive ? '#FFF' : '#64748B', border: isActive ? '1px solid var(--color-primary)' : '1px solid #F1F5F9', 
                  padding: '10px 16px', borderRadius: '24px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', 
                  boxShadow: isActive ? '0 4px 8px rgba(30,64,175,0.2)' : '0 2px 5px rgba(0,0,0,0.02)', transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}
              >
                {tab}
                {tab === 'Needs Reply' && needsReplyCount > 0 && (
                  <span style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#FEF2F2', color: isActive ? '#FFF' : '#EF4444', minWidth: '18px', height: '18px', borderRadius: '9px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '9px', fontWeight: '900', marginLeft: '6px' }}>
                    {needsReplyCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '20px' }}>⏳ Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#FFF', borderRadius: '32px', boxShadow: '0 10px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '60px', backgroundColor: '#FEF3C7', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px auto', fontSize: '50px' }}>
              ⭐
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1E293B', marginBottom: '12px' }}>No Reviews Yet</h2>
            <p style={{ color: '#64748B', lineHeight: '24px', maxWidth: '400px', margin: '0 auto' }}>When customers leave feedback for your services, they will appear here. Encourage your clients to review you!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredReviews.map((rev) => (
              <div key={rev.id} style={{ backgroundColor: '#FFF', borderRadius: '28px', padding: '24px', border: '1px solid #F1F5F9', boxShadow: '0 12px 24px rgba(30,41,59,0.04)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', backgroundColor: '#F59E0B', opacity: 0.6 }} />
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: 'rgba(30,64,175,0.1)', color: 'var(--color-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontWeight: '900', marginRight: '16px', border: '1px solid rgba(30,64,175,0.2)' }}>
                    {rev.customer.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#1E293B', letterSpacing: '-0.5px' }}>{rev.customer}</div>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', marginTop: '4px' }}>💼 {rev.service}</div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>{rev.date}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '4px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < rev.rating ? '#F59E0B' : '#E5E7EB', fontSize: '14px' }}>★</span>
                  ))}
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#B45309', marginLeft: '6px' }}>{rev.rating}.0</span>
                </div>

                {rev.comment && (
                  <p style={{ fontSize: '16px', color: '#334155', lineHeight: '26px', marginBottom: '20px', fontWeight: '500', margin: '0 0 20px 0' }}>{rev.comment}</p>
                )}

                {rev.reply ? (
                  <div onClick={() => handleReplyPress(rev)} style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '20px', borderLeft: '4px solid var(--color-primary)', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}>
                    <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--color-primary)', letterSpacing: '0.5px', marginBottom: '10px' }}>↳ Your Response</div>
                    <p style={{ fontSize: '15px', color: '#475569', lineHeight: '24px', fontWeight: '500', margin: 0 }}>{rev.reply}</p>
                  </div>
                ) : (
                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px', marginTop: '4px' }}>
                    <button 
                      onClick={() => handleReplyPress(rev)}
                      style={{ backgroundColor: 'var(--color-primary)', color: '#FFF', display: 'flex', width: '100%', padding: '14px', borderRadius: '16px', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', fontSize: '14px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 8px rgba(30,64,175,0.3)' }}
                    >
                      💬 Respond to Customer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModalVisible && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }} onClick={() => setReplyModalVisible(false)}>
          <div style={{ backgroundColor: '#FFF', width: '100%', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', padding: '30px', boxShadow: '0 -10px 20px rgba(0,0,0,0.1)', animation: 'slideUp 0.3s ease-out' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1E293B', letterSpacing: '-1px', margin: 0 }}>Your Response</h2>
              <button onClick={() => setReplyModalVisible(false)} style={{ background: 'none', border: 'none', fontSize: '28px', color: '#94A3B8', cursor: 'pointer' }}>✖</button>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Replying to {selectedReview?.customer}</div>
              <div style={{ fontSize: '14px', color: '#475569', fontStyle: 'italic', lineHeight: '20px' }}>"{selectedReview?.comment}"</div>
            </div>

            <textarea
              style={{ backgroundColor: '#F1F5F9', borderRadius: '20px', padding: '20px', height: '150px', width: '100%', fontSize: '16px', color: '#1E293B', fontWeight: '500', marginBottom: '24px', border: '1px solid #E2E8F0', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
              placeholder="Write your professional response here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              autoFocus
            />

            <button 
              onClick={submitReply}
              disabled={!replyText.trim() || isSubmitting}
              style={{ backgroundColor: 'var(--color-primary)', height: '56px', width: '100%', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', color: '#FFF', fontSize: '16px', fontWeight: '900', cursor: (!replyText.trim() || isSubmitting) ? 'not-allowed' : 'pointer', opacity: (!replyText.trim() || isSubmitting) ? 0.5 : 1, boxShadow: '0 8px 12px rgba(30,64,175,0.3)' }}
            >
              {isSubmitting ? 'Posting...' : 'Post Response'}
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: \`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      \`}} />
    </div>
  );
}
