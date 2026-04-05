'use client';
import React from 'react';

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us when you create an account, update your profile, or request a service. This includes your name, email, phone number, and location.'
    },
    {
      title: '2. How We Use Information',
      content: 'We use your information to provide, maintain, and improve our services. This includes processing service requests, connecting you with professionals, and sending you updates.'
    },
    {
      title: '3. Data Sharing',
      content: 'When you request a service, we share your contact details with the service professionals you select. We do not sell your personal information to third-party advertisers.'
    },
    {
      title: '4. Security',
      content: 'We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access. We use encryption for sensitive data like passwords.'
    },
    {
      title: '5. Your Choices',
      content: 'You can access and update your account information at any time through our settings menu. You can also contact us to request the deletion of your account.'
    }
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Privacy Policy</h1>
          <p style={styles.lastUpdated}>Version 1.2 • Last Updated: March 2024</p>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <p style={styles.intro}>
            Your privacy is important to us. This Privacy Policy explains how LocalHub collects, uses, and protects your information when you use our website and mobile application.
          </p>
          
          {sections.map((section, i) => (
            <div key={i} style={styles.section}>
              <h2 style={styles.sectionTitle}>{section.title}</h2>
              <p style={styles.sectionContent}>{section.content}</p>
            </div>
          ))}
          
          <div style={styles.footer}>
            <p>If you have any questions about this Privacy Policy, please contact our data protection team at privacy@localhub.pro</p>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#F9FAFB', minHeight: '100vh', paddingBottom: '80px' },
  header: { backgroundColor: '#FFF', borderBottom: '1px solid #E5E7EB', padding: '60px 24px' },
  headerContent: { maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
  title: { fontSize: '42px', fontWeight: '900', color: '#111827', marginBottom: '12px' },
  lastUpdated: { fontSize: '14px', color: '#6B7280', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' },
  main: { padding: '40px 24px' },
  card: { 
    maxWidth: '800px', 
    margin: '0 auto', 
    backgroundColor: '#FFF', 
    padding: '60px', 
    borderRadius: '32px', 
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    border: '1px solid #F3F4F6'
  },
  intro: { fontSize: '18px', color: '#4B5563', lineHeight: '1.7', marginBottom: '40px' },
  section: { marginBottom: '32px' },
  sectionTitle: { fontSize: '22px', fontWeight: '900', color: '#111827', marginBottom: '16px' },
  sectionContent: { fontSize: '16px', color: '#4B5563', lineHeight: '1.8' },
  footer: { marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #F3F4F6', color: '#9CA3AF', textAlign: 'center', fontSize: '14px' }
};
