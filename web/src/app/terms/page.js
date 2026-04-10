'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiShield } from 'react-icons/fi';

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using LocalHub, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use this service.'
    },
    {
      title: '2. Description of Service',
      content: 'LocalHub provides a platform connecting users with local service providers. We do not provide the services ourselves and are not responsible for the quality of work performed by third-party professionals.'
    },
    {
      title: '3. User Responsibilities',
      content: 'You are responsible for maintaining the confidentiality of your account and password. You agree to provide accurate, current, and complete information during the registration process.'
    },
    {
      title: '4. Provider Obligations',
      content: 'Service providers must maintain all necessary licenses and insurance required by law. LocalHub reserves the right to remove any provider from the platform for any reason.'
    },
    {
      title: '5. Limitation of Liability',
      content: 'LocalHub shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.'
    }
  ];

  return (
    <div className="bg-bg-main min-h-screen">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-emerald-400" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-subtle border border-slate-100">
              <FiFileText />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">Terms of Service</h1>
            <p className="inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full">
               <FiShield className="text-primary" /> Last Updated: March 2024
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
            Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) carefully before using the LocalHub website and mobile application.
          </p>
          
          <div className="space-y-12">
            {sections.map((section, i) => (
              <div key={i} className="group">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-4 group-hover:text-primary transition-colors">
                  {section.title}
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed pl-6 border-l-2 border-slate-100 group-hover:border-primary/50 transition-colors">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 pt-10 border-t border-slate-100 text-center">
            <p className="text-slate-400 font-bold text-sm">
              If you have any questions about these Terms, please contact us at <a href="mailto:support@localhub.pro" className="text-primary">support@localhub.pro</a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
