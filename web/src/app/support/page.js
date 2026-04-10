'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiMessageCircle, FiMail, FiPhone, FiChevronDown, FiBookOpen } from 'react-icons/fi';
import Button from '../../components/Button';

export default function SupportPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: 'How do I book a service?', a: 'Navigate to the Categories or search for a business, then click the "Book Now" button on their profile. Our system will immediately notify the provider.' },
    { q: 'How can I register my business as a provider?', a: 'Sign out and register a new account selecting the "Provider" role, or contact our sales team at sales@localhub.pro for enterprise onboarding.' },
    { q: 'Is my data secure?', a: 'Yes. We use industry-standard bank-level encryption for all your data, utilizing secure JWT tokens and encrypted database storage.' },
    { q: 'What payment methods are supported?', a: 'Currently, you pay the provider directly after the service is rendered. In-app payment integration (Stripe) is arriving in Q3.' }
  ];

  return (
    <div className="bg-bg-main min-h-screen flex flex-col">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[100] py-6 shadow-subtle">
        <div className="section-container max-w-4xl flex items-center gap-6">
          <motion.button 
            whileHover={{ x: -4 }}
            onClick={() => router.back()} 
            className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-all"
          >
            <FiChevronLeft size={24} />
          </motion.button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Help & Support Center</h1>
        </div>
      </header>

      <main className="section-container max-w-4xl py-12 flex-grow">
        
        {/* Support Hero Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-50/50 p-10 md:p-16 rounded-[40px] border border-primary/10 text-center mb-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full" />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white shadow-premium rounded-3xl mx-auto flex items-center justify-center text-primary mb-8 border border-slate-100">
              <FiMessageCircle size={40} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">How can we help today?</h2>
            <p className="text-xl text-primary font-bold">We&apos;re here 24/7 to guarantee your success.</p>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-8 flex items-center gap-3">
             <FiBookOpen className="text-primary" /> Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <motion.div 
                  key={idx}
                  initial={false}
                  animate={{ backgroundColor: isOpen ? '#F8FAFC' : '#FFFFFF' }}
                  className={`border rounded-3xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary/20 shadow-subtle' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-6 flex justify-between items-center"
                  >
                    <h4 className="text-lg font-black text-slate-900 pr-8">{faq.q}</h4>
                    <motion.div 
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isOpen ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400'}`}
                    >
                      <FiChevronDown size={20} />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 pt-2 text-slate-500 font-medium leading-relaxed border-t border-slate-100 mx-6 mt-2">
                       {faq.a}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Contact Strip */}
        <div className="mb-16">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-8">Direct Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="mailto:support@localhub.pro" className="group">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-subtle group-hover:shadow-premium group-hover:border-primary/20 transition-all text-center h-full flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <FiMail />
                </div>
                <h4 className="text-xl font-black text-slate-900">Email Support</h4>
                <p className="text-slate-400 font-medium text-sm">support@localhub.pro</p>
              </div>
            </a>
            
            <a href="tel:+18001234567" className="group">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-subtle group-hover:shadow-premium group-hover:border-emerald-500/20 transition-all text-center h-full flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <FiPhone />
                </div>
                <h4 className="text-xl font-black text-slate-900">Priority Hotline</h4>
                <p className="text-slate-400 font-medium text-sm">+1 (800) 123-4567</p>
              </div>
            </a>
          </div>
        </div>

      </main>
      
    </div>
  );
}
