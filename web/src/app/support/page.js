'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SupportPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const faqs = [
    { q: 'How do I book a service?', a: 'Navigate to the Categories or search for a business, then click the "Book directly" button on their profile.' },
    { q: 'How can I register my business?', a: 'Sign out and register a new account selecting the "Provider" role, or contact our sales team at sales@localhub.com.' },
    { q: 'Is my data secure?', a: 'Yes, we use industry-standard encryption for all your data, utilizing secure JWT tokens.' },
    { q: 'What payment methods are supported?', a: 'Currently, you pay directly after the service is rendered. In-app payment integration is coming in the next batch.' }
  ];

  if (!mounted) return null;

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#FFF' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #F3F4F6', paddingBottom: '20px' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '16px' }}>←</button>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#111827', margin: 0 }}>Help & Support</h1>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '60px', padding: '40px 20px', backgroundColor: '#EFF6FF', borderRadius: '24px' }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>💬</div>
        <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1E3A8A', marginBottom: '8px' }}>How can we help you?</h2>
        <p style={{ color: '#3B82F6', fontSize: '18px', fontWeight: '600' }}>We're here 24/7 to assist you</p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', marginBottom: '20px' }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '16px', border: '1px solid #F3F4F6' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>{faq.q}</h4>
              <p style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', marginBottom: '20px' }}>Contact Us</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          
          <a 
            href="mailto:support@localhub.com"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: 'var(--color-primary)', color: '#FFF', textDecoration: 'none', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: '800', transition: 'transform 0.2s', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.2)' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>✉️</span> Email Support
          </a>
          
          <a 
            href="tel:+919876543210"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: '#10B981', color: '#FFF', textDecoration: 'none', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: '800', transition: 'transform 0.2s', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>📞</span> Call Support
          </a>

        </div>
      </div>
{/* 
      <div style={{ textAlign: 'center', marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #E5E7EB', color: '#9CA3AF', fontSize: '14px', fontWeight: '600' }}>
        LocalHub Ecosystem v1.0.0
      </div> */}
    </div>
  );
}
