'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiShield } from 'react-icons/fi';

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us when you create an account, update your profile, or request a service. This includes your name, email, phone number, and location data when authorized.'
    },
    {
      title: '2. How We Use Information',
      content: 'We use your information to provide, maintain, and improve our services. This includes processing service requests, executing intelligent matching algorithms with professionals, and sending you critical platform updates.'
    },
    {
      title: '3. Data Sharing',
      content: 'When you request a service, we share your contact details securely with the specific service professionals you select. We absolutely do not sell your personal information to third-party advertisers.'
    },
    {
      title: '4. Security',
      content: 'We take enterprise-grade measures to help protect your personal information from loss, theft, misuse, and unauthorized access. We use end-to-end encryption for sensitive data like passwords and session tokens.'
    },
    {
      title: '5. Your Choices',
      content: 'You can access and update your account information at any time through our settings menu. You can also contact us to request a complete deletion of your account and associated digital footprint.'
    }
  ];

  return (
    <div className="bg-bg-main min-h-screen">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-subtle border border-slate-100">
              <FiLock />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">Privacy Policy</h1>
            <p className="inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full">
               <FiShield className="text-emerald-500" /> Version 1.2 • Last Updated: March 2024
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="section-container max-w-4xl py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-10 md:p-16 rounded-[40px] border border-slate-100 shadow-premium"
        >
          <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12 pb-12 border-b border-slate-100">
            Your privacy is paramount to us. This Privacy Policy explains exactly how LocalHub Elite collects, secures, uses, and protects your information when you access our ecosystem.
          </p>
          
          <div className="space-y-12">
            {sections.map((section, i) => (
              <div key={i} className="group">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-4 group-hover:text-emerald-500 transition-colors">
                  {section.title}
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed pl-6 border-l-2 border-slate-100 group-hover:border-emerald-500/50 transition-colors">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 pt-10 border-t border-slate-100 text-center">
            <p className="text-slate-400 font-bold text-sm">
              If you have any questions about this Privacy Policy, please contact our data protection team at <a href="mailto:privacy@localhub.pro" className="text-emerald-500">privacy@localhub.pro</a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
