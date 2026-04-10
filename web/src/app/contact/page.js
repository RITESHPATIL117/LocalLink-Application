'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiChevronRight, FiMessageSquare } from 'react-icons/fi';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const contactInfo = [
    { title: 'Email Priority Support', value: 'support@localhub.pro', icon: <FiMail />, desc: 'Guaranteed response within 2 hours' },
    { title: 'Direct Concierge', value: '+91 (800) 123-4567', icon: <FiPhone />, desc: 'Available Mon-Fri, 9am to 6pm IST' },
    { title: 'Corporate HQ', value: 'LocalHub Tower, Sangli, MH', icon: <FiMapPin />, desc: 'Primary operations & engineering' },
  ];

  return (
    <div className="bg-bg-main min-h-screen flex flex-col">
      
      {/* Immersive Hero Section */}
      <section className="bg-slate-950 pt-32 pb-40 relative overflow-hidden">
        <motion.div 
          animate={{ x: [0, 20, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-slate-950 to-slate-950"
        />
        <div className="section-container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
              <FiMessageSquare /> 24/7 Global Support
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Have questions? We&apos;re here to help you scale your business or find the perfect professional for your next project.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="-mt-24 relative z-20 pb-32">
        <div className="section-container max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Contact Information Side */}
            <div className="w-full lg:w-5/12 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-premium"
              >
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Contact Directory</h2>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                  Select your preferred method of communication. Our elite support team is trained to resolve complex queries instantly.
                </p>
                
                <div className="space-y-6">
                  {contactInfo.map((info, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ x: 5 }}
                      className="flex gap-6 items-start group p-4 -ml-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 text-primary border border-slate-100 flex items-center justify-center text-2xl shadow-inner group-hover:bg-primary group-hover:text-white transition-colors">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-2">{info.title}</h4>
                        <p className="text-primary font-bold text-sm mb-1">{info.value}</p>
                        <p className="text-slate-400 text-xs font-semibold">{info.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Support Form Side */}
            <div className="w-full lg:w-7/12">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-10 md:p-14 rounded-[40px] border border-slate-100 shadow-premium relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-10"
                    >
                      <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow">
                        <FiCheckCircle size={48} />
                      </div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Transmission Successful</h3>
                      <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">
                        Your secure message has been routed to our support concierges. You will receive an update shortly.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setSubmitted(false)}
                        className="mx-auto"
                      >
                        Submit another request
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-8">Direct Priority Channel</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Full Name" placeholder="e.g. Jane Doe" required />
                        <InputField label="Email Address" type="email" placeholder="jane@company.com" required />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Inquiry Topic</label>
                        <select className="w-full py-4 px-5 bg-slate-50 border border-slate-100 rounded-[20px] font-semibold text-slate-800 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-subtle appearance-none cursor-pointer">
                          <option value="">Select a topic division...</option>
                          <option value="Consumer Support">Consumer Support & Bookings</option>
                          <option value="Provider Verification">Provider Verification (KYC)</option>
                          <option value="Enterprise Integration">Enterprise App Integration</option>
                          <option value="Billing">Billing & Subscription</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Message</label>
                        <textarea 
                          placeholder="Describe your issue or inquiry with as much detail as possible..."
                          required
                          className="w-full py-4 px-5 bg-slate-50 border border-slate-100 rounded-[20px] font-semibold text-slate-800 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-subtle min-h-[160px] resize-none"
                        ></textarea>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden md:block">
                           End-to-End Encrypted
                         </p>
                         <Button type="submit" loading={loading} className="w-full md:w-auto">
                           {loading ? 'Transmitting' : 'Send Message'} <FiSend className="ml-2" />
                         </Button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
}
