'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  FiArrowLeft, FiHeart, FiStar, FiMapPin, FiCalendar, FiPhone, 
  FiCheckCircle, FiInfo, FiImage, FiBriefcase, FiX, FiAward, FiSend
} from 'react-icons/fi';
import businessService from '../../../services/businessService';
import reviewService from '../../../services/reviewService';
import leadService from '../../../services/leadService';

const TABS = ['Overview', 'Services', 'Reviews', 'Photos'];

export default function BusinessDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.id;

  const [business, setBusiness] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (businessId) {
      fetchBusiness();
      fetchReviews();
    }
  }, [businessId]);

  const fetchBusiness = async () => {
    try {
      const res = await businessService.getBusinessById(businessId);
      setBusiness(res.data || res);
    } catch (e) {
      console.error('Error fetching business:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await reviewService.getReviewsByBusiness(businessId);
      setReviews(res.data || []);
    } catch (e) {
      console.error('Error fetching reviews:', e);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      await reviewService.createReview({
        business_id: businessId,
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewModalVisible(false);
      setReviewComment('');
      fetchReviews();
      alert('Review submitted successfully!');
    } catch (e) {
      alert('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>⏳ Synchronizing business vault...</div>;
  if (!business) return <div style={{ padding: '100px', textAlign: 'center' }}>Business not found.</div>;

  const businessImage = business.image_url || business.image || 'https://images.unsplash.com/photo-1621905252507-eb6368d5ba18';

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      
      {/* Cover Section - 1:1 Parity with Glassmorphism Overlay */}
      <section style={{ height: '400px', position: 'relative', overflow: 'hidden' }}>
        <img src={businessImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Cover" />
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))' 
        }} />
        
        {/* Float Header */}
        <div style={{ 
          position: 'absolute', top: '30px', left: '40px', right: '40px', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 
        }}>
          <button 
            onClick={() => router.back()}
            style={{ 
              width: '50px', height: '50px', borderRadius: '25px', backgroundColor: 'rgba(255,255,255,0.2)', 
              backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', color: '#FFF',
              display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'
            }}
          >
            <FiArrowLeft size={22} />
          </button>
          
          <button 
            onClick={() => setIsFav(!isFav)}
            style={{ 
              width: '50px', height: '50px', borderRadius: '25px', backgroundColor: isFav ? '#FFF' : 'rgba(255,255,255,0.2)', 
              backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', color: isFav ? '#EF4444' : '#FFF',
              display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s'
            }}
          >
            {isFav ? <FiHeart fill="#EF4444" size={22} /> : <FiHeart size={22} />}
          </button>
        </div>

        {/* Info Pill Over Glass Header Area */}
        <div style={{ 
          position: 'absolute', bottom: '-40px', left: '40px', right: '40px', 
          padding: '40px', backgroundColor: '#FFF', borderRadius: '32px', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)', zIndex: 5, border: '1px solid #F1F5F9'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div style={{ 
                width: '100px', height: '100px', borderRadius: '30px', border: '6px solid #FFF', 
                backgroundColor: '#F3F4F6', overflow: 'hidden', marginTop: '-80px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}>
                <img src={business.avatar || businessImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ marginTop: '-40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '1000', color: '#1E293B', margin: 0, letterSpacing: '-1px' }}>{business.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1,2,3,4,5].map(i => <FiStar key={i} color="#F59E0B" fill="#F59E0B" size={14} />)}
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: '900', color: '#1E293B' }}>{business.rating || '4.9'}</span>
                  <span style={{ color: '#94A3B8', fontSize: '14px', fontWeight: '600' }}>({business.reviewsCount || 0} Reviews)</span>
                </div>
              </div>
            </div>
            {business.tier === 'Diamond' && (
              <div style={{ backgroundColor: '#EEF2FF', padding: '10px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #E0E7FF', marginTop: '-40px' }}>
                <FiAward color="#4F46E5" size={18} />
                <span style={{ fontSize: '13px', fontWeight: '900', color: '#4F46E5', letterSpacing: '0.5px' }}>DIAMOND PARTNER</span>
              </div>
            )}
          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '40px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748B' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F1F5F9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FiMapPin size={18} />
              </div>
              <span style={{ fontWeight: '700', fontSize: '15px' }}>{business.address || 'Sangli, Maharashtra'}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flex: 1, justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setBookingModalVisible(true)}
                style={{ 
                  backgroundColor: 'var(--color-primary)', color: '#FFF', padding: '18px 40px', borderRadius: '20px',
                  fontWeight: '900', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(30,64,175,0.2)',
                  fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px'
                }}
              >
               <FiCalendar /> Book Appointment
              </button>
              <button style={{ 
                width: '56px', height: '56px', borderRadius: '20px', backgroundColor: '#FFF', 
                border: '2px solid var(--color-primary)', color: 'var(--color-primary)',
                display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'
              }}>
                <FiPhone size={22} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: '1200px', margin: '140px auto 100px auto', padding: '0 40px' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '48px', borderBottom: '2px solid #F1F5F9', marginBottom: '40px' }}>
          {TABS.map(tab => {
            const active = activeTab === tab;
            return (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  padding: '20px 0', border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: '16px', fontWeight: '800', position: 'relative',
                  color: active ? 'var(--color-primary)' : '#64748B'
                }}
              >
                {tab}
                {active && (
                  <div style={{ position: 'absolute', bottom: '-2px', left: 0, width: '100%', height: '4px', backgroundColor: 'var(--color-primary)', borderRadius: '2px' }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Content Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '60px' }}>
          
          <div className="tab-panel">
            {activeTab === 'Overview' && (
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1E293B', marginBottom: '20px' }}>About this professional</h3>
                <p style={{ fontSize: '17px', color: '#475569', lineHeight: '1.8', fontWeight: '500' }}>
                  {business.description || `We provide elite ${business.category?.toLowerCase() || 'service'} in Sangli. Our verified team ensures a 100% satisfaction guarantee with same-day support for all emergencies. Book your slot today for the most reliable service in town.`}
                </p>
                <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                   <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '24px', border: '1px solid #F1F5F9' }}>
                     <FiAward size={28} color="var(--color-primary)" />
                     <h5 style={{ marginTop: '16px', fontSize: '16px', fontWeight: '900' }}>Verified Expert</h5>
                     <p style={{ color: '#94A3B8', fontSize: '13px', margin: '8px 0 0 0' }}>Background checks cleared</p>
                   </div>
                   <div style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '24px', border: '1px solid #F1F5F9' }}>
                     <FiCheckCircle size={28} color="#10B981" />
                     <h5 style={{ marginTop: '16px', fontSize: '16px', fontWeight: '900' }}>Price Guarantee</h5>
                     <p style={{ color: '#94A3B8', fontSize: '13px', margin: '8px 0 0 0' }}>Transparent market pricing</p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'Services' && (
              <div>
                 <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1E293B', marginBottom: '24px' }}>Available Services</h3>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {['Premium Support', 'Standard Repair', 'Maintenance Visit', 'Emergency Call'].map(s => (
                      <div key={s} style={{ backgroundColor: '#FFF', padding: '20px 24px', borderRadius: '20px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F0FDF4', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <FiCheckCircle color="#10B981" size={20} />
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: '#1E293B' }}>{s}</span>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1E293B' }}>Recent Feedback</h3>
                  <button onClick={() => setReviewModalVisible(true)} style={{ color: 'var(--color-primary)', fontWeight: '900', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>+ Write Review</button>
                </div>
                {reviews.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {reviews.map(rev => (
                      <div key={rev.id} style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '28px', border: '1px solid #F1F5F9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={rev.user?.avatar || `https://ui-avatars.com/api/?name=${rev.user_name || 'U'}`} style={{ width: '48px', height: '48px', borderRadius: '16px' }} />
                            <div>
                              <h5 style={{ margin: 0, fontSize: '16px', fontWeight: '900' }}>{rev.user_name || 'Verified Customer'}</h5>
                              <span style={{ fontSize: '12px', color: '#94A3B8' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div style={{ backgroundColor: '#FEF9C3', padding: '6px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                             <FiStar fill="#854D0E" color="#854D0E" size={14} />
                             <span style={{ color: '#854D0E', fontWeight: '900', fontSize: '14px' }}>{rev.rating}</span>
                          </div>
                        </div>
                        <p style={{ color: '#475569', fontSize: '15px', fontWeight: '500', lineHeight: '1.6', margin: 0 }}>{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <FiInfo size={40} color="#D1D5DB" />
                    <p style={{ color: '#94A3B8', marginTop: '12px' }}>No reviews yet. Be the first!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Photos' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} style={{ borderRadius: '24px', overflow: 'hidden', height: '220px' }}>
                    <img src={`${businessImage}?sig=${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside>
            {/* Action Sidecar */}
            <div style={{ backgroundColor: '#FFF', borderRadius: '32px', padding: '32px', border: '1px solid #F1F5F9', position: 'sticky', top: '120px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                 <div style={{ fontSize: '12px', fontWeight: '900', color: '#94A3B8', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>STARTING FROM</div>
                 <div style={{ fontSize: '36px', fontWeight: '1000', color: '#1E293B' }}>₹499 <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: '600' }}>/ visit</span></div>
              </div>
              <button 
                onClick={() => setBookingModalVisible(true)}
                style={{ width: '100%', padding: '20px', borderRadius: '20px', backgroundColor: 'var(--color-primary)', color: '#FFF', border: 'none', fontWeight: '1000', fontSize: '16px', letterSpacing: '0.5px', cursor: 'pointer', boxShadow: '0 8px 30px rgba(30,64,175,0.2)' }}>
                SCHEDULE VISIT
              </button>
              
              <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ width: '10px', height: '10px', borderRadius: '5px', backgroundColor: '#10B981' }} />
                   <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>Available for Booking today</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <FiCheckCircle color="#var(--color-primary)" />
                   <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>Verified background</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <FiBriefcase color="#var(--color-primary)" />
                   <span style={{ fontSize: '14px', fontWeight: '700', color: '#475569' }}>120+ successful services</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '32px', paddingTop: '32px', textAlign: 'center' }}>
                 <p style={{ color: '#94A3B8', fontSize: '13px', fontWeight: '600' }}>Share with friends</p>
                 <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                    {['Twitter', 'WhatsApp', 'Mail'].map(s => (
                       <div key={s} style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                          <FiSend size={16} color="#64748B" />
                       </div>
                    ))}
                 </div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* Booking Modal Overlay */}
      {bookingModalVisible && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '32px', width: '600px', padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>Confirm Booking</h2>
              <button onClick={() => setBookingModalVisible(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={32} color="#94A3B8" /></button>
            </div>
            <p>You are booking a service with <b>{business.name}</b>. A professional will contact you shortly.</p>
            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <button style={{ backgroundColor: 'var(--color-primary)', color: '#FFF', padding: '20px', borderRadius: '20px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>Proceed to Schedule</button>
               <button onClick={() => setBookingModalVisible(false)} style={{ backgroundColor: '#F1F5F9', color: '#64748B', padding: '20px', borderRadius: '20px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal Overlay */}
      {reviewModalVisible && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '32px', width: '500px', padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>Rate & Review</h2>
              <button onClick={() => setReviewModalVisible(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={28} color="#94A3B8" /></button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
              {[1,2,3,4,5].map(i => (
                <FiStar 
                  key={i} 
                  size={32} 
                  cursor="pointer"
                  fill={reviewRating >= i ? '#F59E0B' : 'transparent'} 
                  color={reviewRating >= i ? '#F59E0B' : '#CBD5E1'}
                  onClick={() => setReviewRating(i)}
                />
              ))}
            </div>
            <textarea 
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="What was your experience like?"
              style={{ width: '100%', height: '120px', borderRadius: '20px', padding: '16px', border: '1.5px solid #F1F5F9', backgroundColor: '#F8FAFC', outline: 'none', resize: 'none', fontFamily: 'inherit', color: '#1E293B', marginBottom: '24px' }}
            />
            <button 
              onClick={handleReviewSubmit}
              disabled={submittingReview}
              style={{ width: '100%', backgroundColor: 'var(--color-primary)', color: '#FFF', padding: '20px', borderRadius: '20px', fontWeight: '900', border: 'none', cursor: 'pointer', opacity: submittingReview ? 0.7 : 1 }}>
              {submittingReview ? 'Posting...' : 'SUBMIT REVIEW'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
