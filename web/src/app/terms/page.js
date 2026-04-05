'use client';
import React from 'react';

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
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Terms of Service</h1>
          <p style={styles.lastUpdated}>Last Updated: March 2024</p>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <p style={styles.intro}>
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the LocalHub website and mobile application.
          </p>
          
          {sections.map((section, i) => (
            <div key={i} style={styles.section}>
              <h2 style={styles.sectionTitle}>{section.title}</h2>
              <p style={styles.sectionContent}>{section.content}</p>
            </div>
          ))}
          
          <div style={styles.footer}>
            <p>If you have any questions about these Terms, please contact us at support@localhub.pro</p>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' },
  header: { backgroundColor: '#FFF', borderBottom: '1px solid #E2E8F0', padding: '60px 24px' },
  headerContent: { maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
  title: { fontSize: '42px', fontWeight: '900', color: '#1E293B', marginBottom: '12px' },
  lastUpdated: { fontSize: '14px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' },
  main: { padding: '40px 24px' },
  card: { 
    maxWidth: '800px', 
    margin: '0 auto', 
    backgroundColor: '#FFF', 
    padding: '60px', 
    borderRadius: '32px', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    border: '1px solid #F1F5F9'
  },
  intro: { fontSize: '18px', color: '#475569', lineHeight: '1.7', marginBottom: '40px' },
  section: { marginBottom: '32px' },
  sectionTitle: { fontSize: '22px', fontWeight: '900', color: '#1E293B', marginBottom: '16px' },
  sectionContent: { fontSize: '16px', color: '#64748B', lineHeight: '1.8' },
  footer: { marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #F1F5F9', color: '#94A3B8', textAlign: 'center', fontSize: '14px' }
};
