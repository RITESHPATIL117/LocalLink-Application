'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiHeart, FiStar, FiMapPin, FiCalendar, FiPhone, 
  FiCheckCircle, FiInfo, FiImage, FiBriefcase, FiX, FiAward, FiSend, FiTag, FiClock
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
    } catch (e) {
      alert('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Synchronizing Provider Vault...</p>
      </div>
    </div>
  );

  if (!business) return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main">
      <div className="text-center">
         <FiInfo size={48} className="text-slate-200 mx-auto mb-6" />
         <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Business not found.</h2>
         <button onClick={() => router.push('/')} className="btn-premium mt-8">Back to Home</button>
      </div>
    </div>
  );

  const businessImage = business.image_url || business.image || 'https://images.unsplash.com/photo-1621905252507-eb6368d5ba18';

  return (
    <div className="bg-bg-main min-h-screen pb-32">
      
      {/* 1. Immersive Cover Section */}
      <section className="h-[450px] relative overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          src={businessImage} 
          className="w-full h-full object-cover" 
          alt="Provider Cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/80" />
        
        {/* Float Controls */}
        <div className="section-container max-w-7xl absolute top-10 left-0 right-0 z-10 flex justify-between">
          <motion.button 
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 text-white flex items-center justify-center shadow-premium"
          >
            <FiArrowLeft size={24} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFav(!isFav)}
            className={`w-14 h-14 rounded-2xl backdrop-blur-xl border border-white/30 flex items-center justify-center transition-all ${
              isFav ? 'bg-white text-red-500' : 'bg-white/20 text-white'
            }`}
          >
            <FiHeart size={24} fill={isFav ? "currentColor" : "none"} />
          </motion.button>
        </div>

        {/* Hero Info Content Overlay */}
        <div className="section-container max-w-7xl absolute bottom-12 left-0 right-0 z-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="flex items-center gap-8">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-24 h-24 md:w-32 md:h-32 rounded-[40px] border-8 border-white bg-white shadow-premium overflow-hidden flex-shrink-0"
              >
                <img src={business.avatar || businessImage} alt="Avatar" className="w-full h-full object-cover" />
              </motion.div>
              <div className="pb-2">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4"
                >
                  {business.name}
                </motion.h1>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                    <FiStar className="text-amber-400 fill-amber-400" size={16} />
                    <span className="text-white font-black text-lg">{business.rating || '4.9'}</span>
                    <span className="text-white/50 text-xs font-bold">({business.reviewsCount || 0} REVIEWS)</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80 font-bold">
                    <FiMapPin size={18} className="text-primary-light" />
                    <span>{business.address || 'Sangli, MH'}</span>
                  </div>
                </div>
              </div>
            </div>

            {business.tier === 'Diamond' && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-primary/20 backdrop-blur-xl border border-primary/30 px-6 py-3 rounded-2xl flex items-center gap-3"
              >
                <FiAward className="text-primary-light" size={24} />
                <span className="text-white font-black text-xs uppercase tracking-[0.2em]">Diamond Verified</span>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <main className="section-container max-w-7xl mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Content (Tabs & Panels) */}
          <div className="lg:col-span-8">
            {/* Tabs Header */}
            <div className="flex gap-10 border-b border-slate-100 mb-10 overflow-x-auto no-scrollbar">
              {TABS.map(tab => {
                const active = activeTab === tab;
                return (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-6 relative font-black text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                      active ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab}
                    {active && (
                      <motion.div layoutId="detail-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full shadow-glow" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Tab Body */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'Overview' && (
                  <div className="space-y-12">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-6 flex items-center gap-3">
                        <FiInfo className="text-primary" /> Professional Background
                      </h3>
                      <p className="text-slate-600 text-lg leading-relaxed font-medium">
                        {business.description || `Established as a premier provider in Sangli, ${business.name} specializes in high-quality ${business.category?.toLowerCase() || 'local services'}. With a proven track record of 300+ successful bookings and a customer-first approach, we guarantee reliability and transparent pricing for every neighborhood.`}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-subtle flex items-start gap-6 group hover:border-primary/20 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                          <FiAward size={28} />
                        </div>
                        <div>
                          <h5 className="text-lg font-black text-slate-800 mb-1">Accredited Pro</h5>
                          <p className="text-slate-400 text-sm font-medium">Verified credentials and background check passed.</p>
                        </div>
                      </div>
                      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-subtle flex items-start gap-6 group hover:border-emerald-200 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform">
                          <FiCheckCircle size={28} />
                        </div>
                        <div>
                          <h5 className="text-lg font-black text-slate-800 mb-1">Elite Standard</h5>
                          <p className="text-slate-400 text-sm font-medium">Top 5% performer in customer satisfaction scores.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Services' && (
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-8">Specialized Solutions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Elite On-Site Support', 'Verified Standard Maintenance', 'Emergency Response Unit', 'Deep Diagnostic Check'].map(s => (
                        <div key={s} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-primary/20 transition-all group">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary">
                            <FiTag size={18} />
                          </div>
                          <span className="font-bold text-slate-700">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'Reviews' && (
                  <div>
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Verified Feedback</h3>
                      <button 
                        onClick={() => setReviewModalVisible(true)}
                        className="text-primary font-black text-xs uppercase tracking-widest hover:underline"
                      >
                        + Post Your Experience
                      </button>
                    </div>
                    {reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map(rev => (
                          <div key={rev.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-subtle">
                            <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-4">
                                <img src={rev.user?.avatar || `https://ui-avatars.com/api/?name=${rev.user_name || 'U'}`} className="w-12 h-12 rounded-2xl" />
                                <div>
                                  <h5 className="font-black text-slate-800">{rev.user_name || 'Verified User'}</h5>
                                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-2 border border-amber-100">
                                <FiStar className="text-amber-500 fill-amber-500" size={14} />
                                <span className="text-amber-900 font-black text-sm">{rev.rating}</span>
                              </div>
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed">{rev.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                         <FiInfo size={40} className="text-slate-200 mx-auto mb-4" />
                         <p className="text-slate-400 font-bold">Be the first to review this pro!</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'Photos' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[1,2,3,4,5,6].map(i => (
                      <motion.div 
                        key={i} 
                        whileHover={{ scale: 1.05 }}
                        className="rounded-[32px] overflow-hidden aspect-square shadow-subtle cursor-pointer group"
                      >
                        <img src={`${businessImage}?sig=${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar Action Sidecar */}
          <div className="lg:col-span-4">
            <div className="bg-slate-950 rounded-[48px] p-10 text-white sticky top-32 shadow-premium overflow-hidden">
               {/* Abstract background art inside the card */}
               <FiBriefcase className="absolute -bottom-10 -right-10 text-white/[0.03] rotate-12" size={240} />
               
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary-light">
                      <FiZap />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Service Ledger</span>
                 </div>

                 <div className="mb-10 text-center lg:text-left">
                   <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-2">Estimated Starting Price</p>
                   <div className="text-5xl font-black tracking-tighter text-white">
                      ₹499 <span className="text-sm text-white/30 font-bold uppercase tracking-widest">/ Visit</span>
                   </div>
                 </div>

                 <motion.button 
                   whileHover={{ scale: 1.02, brightness: 1.1 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => setBookingModalVisible(true)}
                   className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-glow flex items-center justify-center gap-3 mb-8"
                 >
                   <FiCalendar /> Secure This Slot
                 </motion.button>
                 
                 <div className="space-y-6 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-4 text-sm font-bold text-white/70">
                      <FiClock className="text-emerald-500" /> Available for Booking Today
                    </div>
                    <div className="flex items-center gap-4 text-sm font-bold text-white/70">
                      <FiPhone className="text-primary-light" /> Instant Voice Consultation
                    </div>
                    <div className="flex items-center gap-4 text-sm font-bold text-white/70">
                      <FiAward className="text-amber-400" /> 100% Satisfaction Guarantee
                    </div>
                 </div>

                 <div className="mt-12 flex justify-center gap-4">
                    {[FiSend, FiImage, FiBriefcase].map((Icon, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 cursor-pointer"
                      >
                         <Icon size={18} />
                      </motion.div>
                    ))}
                 </div>
               </div>
            </div>
          </div>

        </div>
      </main>

      {/* Booking Drawer (Simplified for Web) */}
      <AnimatePresence>
        {bookingModalVisible && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 py-20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingModalVisible(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white rounded-[56px] w-full max-w-xl p-10 md:p-14 relative z-10 shadow-premium"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Booking Slot</h2>
                <button onClick={() => setBookingModalVisible(false)} className="text-slate-300 hover:text-slate-600 transition-colors">
                  <FiX size={32} />
                </button>
              </div>
              <div className="space-y-8">
                 <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <img src={business.avatar || businessImage} className="w-20 h-20 rounded-2xl object-cover" />
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Confirming with</p>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tighter">{business.name}</h4>
                    </div>
                 </div>
                 <p className="text-slate-500 font-medium">Ready to proceed? We'll notify the provider immediately and they will finalize the schedule via phone or the LocalHub messaging system.</p>
                 <div className="flex flex-col gap-3 py-6">
                    <button className="btn-premium px-10 py-5 !rounded-3xl w-full">Finalize Booking Request</button>
                    <button onClick={() => setBookingModalVisible(false)} className="py-5 font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Maybe Later</button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Dialog */}
      <AnimatePresence>
        {reviewModalVisible && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 py-20">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReviewModalVisible(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[56px] w-full max-w-lg p-10 md:p-14 relative z-10 shadow-premium"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Post Review</h2>
                <button onClick={() => setReviewModalVisible(false)}><FiX size={28} className="text-slate-300 hover:text-slate-600 transition-colors" /></button>
              </div>
              <div className="space-y-8">
                <div className="flex justify-center gap-4">
                  {[1,2,3,4,5].map(i => (
                    <FiStar 
                      key={i} 
                      size={40} 
                      className={`cursor-pointer transition-all ${reviewRating >= i ? 'text-amber-500 fill-amber-500 scale-110' : 'text-slate-200'}`}
                      onClick={() => setReviewRating(i)}
                    />
                  ))}
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Your Testimonial</label>
                  <textarea 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell us about the service quality..."
                    className="w-full h-40 p-6 rounded-3xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-primary outline-none transition-all font-medium resize-none shadow-inner"
                  />
                </div>
                <button 
                  onClick={handleReviewSubmit}
                  disabled={submittingReview}
                  className="btn-premium px-10 py-5 !rounded-3xl w-full"
                >
                  {submittingReview ? 'Dispatching...' : 'Complete Review'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
