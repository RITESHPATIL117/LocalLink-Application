'use client';
import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const contactInfo = [
    { title: 'Email Us', value: 'support@localhub.pro', icon: <FiMail />, desc: 'We respond within 24 hours' },
    { title: 'Call Us', value: '+1 (555) 000-0000', icon: <FiPhone />, desc: 'Mon-Fri from 8am to 6pm' },
    { title: 'Find Us', value: '123 Hub Lane, Sangli, MH', icon: <FiMapPin />, desc: 'Visit our headquarters' },
  ];

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Get in Touch</h1>
          <p style={styles.subtitle}>Have questions? We're here to help you scaling your business or finding the right pro.</p>
        </div>
      </section>

      <section style={styles.content}>
        <div style={styles.grid}>
          {/* Info Side */}
          <div style={styles.infoSide}>
            <h2 style={styles.sectionTitle}>Contact Information</h2>
            <p style={styles.paragraph}>Fill out the form and our team will get back to you within 24 hours.</p>
            
            <div style={styles.infoCards}>
              {contactInfo.map((info, i) => (
                <div key={i} style={styles.infoCard}>
                  <div style={styles.iconBox}>{info.icon}</div>
                  <div>
                    <h4 style={styles.infoTitle}>{info.title}</h4>
                    <p style={styles.infoValue}>{info.value}</p>
                    <p style={styles.infoDesc}>{info.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div style={styles.formSide}>
            {submitted ? (
              <div style={styles.successCard}>
                <FiCheckCircle style={styles.successIcon} />
                <h3 style={styles.successTitle}>Message Sent!</h3>
                <p style={styles.successText}>Thank you for reaching out. We'll get back to you shortly.</p>
                <button 
                  style={styles.backBtn} 
                  onClick={() => setSubmitted(false)}
                >Send another message</button>
              </div>
            ) : (
              <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input type="text" placeholder="John Doe" style={styles.input} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input type="email" placeholder="john@example.com" style={styles.input} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Subject</label>
                  <select style={styles.input} required>
                    <option value="">Select a topic</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Business Listing">Business Listing</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Message</label>
                  <textarea 
                    placeholder="How can we help you?" 
                    style={{ ...styles.input, height: '150px', resize: 'none' }} 
                    required 
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  style={styles.submitBtn} 
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  {!loading && <FiSend style={{ marginLeft: '10px' }} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#F8FAFC', minHeight: '100vh' },
  hero: {
    backgroundColor: '#1E293B',
    padding: '80px 24px',
    color: '#FFF',
    textAlign: 'center',
    borderBottom: '1px solid #334155',
  },
  heroContent: { maxWidth: '800px', margin: '0 auto' },
  title: { fontSize: '42px', fontWeight: '900', marginBottom: '16px', letterSpacing: '-1px' },
  subtitle: { fontSize: '18px', color: '#94A3B8', fontWeight: '500' },
  content: { padding: '80px 24px' },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1.2fr', 
    gap: '60px', 
    maxWidth: '1100px', 
    margin: '0 auto',
    alignItems: 'start'
  },
  infoSide: { paddingRight: '20px' },
  sectionTitle: { fontSize: '32px', fontWeight: '900', color: '#1E293B', marginBottom: '16px' },
  paragraph: { fontSize: '16px', color: '#64748B', marginBottom: '40px' },
  infoCards: { display: 'flex', flexDirection: 'column', gap: '24px' },
  infoCard: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  iconBox: { 
    padding: '14px', 
    backgroundColor: 'var(--color-primary, #3B82F6)', 
    borderRadius: '16px', 
    color: '#FFF', 
    fontSize: '20px',
    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)'
  },
  infoTitle: { fontSize: '18px', fontWeight: '800', color: '#1E293B', marginBottom: '4px' },
  infoValue: { fontSize: '16px', fontWeight: '700', color: 'var(--color-primary, #3B82F6)', marginBottom: '4px' },
  infoDesc: { fontSize: '14px', color: '#94A3B8', fontWeight: '500' },
  formSide: { 
    backgroundColor: '#FFF', 
    padding: '40px', 
    borderRadius: '32px', 
    boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
    border: '1px solid #F1F5F9'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '800', color: '#475569' },
  input: { 
    padding: '14px 20px', 
    borderRadius: '14px', 
    border: '1px solid #E2E8F0', 
    fontSize: '15px', 
    backgroundColor: '#F8FAFC',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%'
  },
  submitBtn: { 
    padding: '16px', 
    backgroundColor: 'var(--color-primary, #3B82F6)', 
    color: '#FFF', 
    border: 'none', 
    borderRadius: '16px', 
    fontSize: '16px', 
    fontWeight: '900', 
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
  },
  successCard: { textAlign: 'center', padding: '40px 0' },
  successIcon: { fontSize: '64px', color: '#10B981', marginBottom: '24px' },
  successTitle: { fontSize: '28px', fontWeight: '900', color: '#1E293B', marginBottom: '12px' },
  successText: { fontSize: '16px', color: '#64748B', marginBottom: '32px' },
  backBtn: { 
    backgroundColor: '#F1F5F9', 
    border: 'none', 
    padding: '12px 24px', 
    borderRadius: '12px', 
    fontWeight: '800', 
    color: '#475569', 
    cursor: 'pointer' 
  },
};
