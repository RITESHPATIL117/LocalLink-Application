'use client';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import leadService from '../services/leadService';
import Button from './Button';
import InputField from './InputField';

export default function BookingWizard({ business }) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    description: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => {
    if (!isAuthenticated) {
      // Must be logged in to book directly
      router.push('/login');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const payload = {
        business_id: business.id,
        service: 'General Service', // Or map from form
        description: formData.description,
        date: formData.date,
        time: formData.time,
        address: formData.address,
        amount: 499
      };

      await leadService.sendLead(payload);
      setSuccess(true);
    } catch (e) {
      setError(e.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--color-success)', marginBottom: '8px' }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Your request has been sent successfully.</p>
          <Button onClick={() => router.push('/requests')} style={{ width: '100%' }}>View My Requests</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {step === 1 && (
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '16px' }}>Schedule Service</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Select your preferred date and time.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <InputField 
              label="Date" 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
            />
            <InputField 
              label="Time" 
              type="time" 
              name="time" 
              value={formData.time} 
              onChange={handleChange} 
            />
          </div>

          <Button onClick={handleNext} style={{ width: '100%', marginTop: '16px' }}>Continue</Button>
          {!isAuthenticated && (
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
              You will be asked to sign in.
            </p>
          )}
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '16px' }}>Service Details</h3>
          
          {error && <div style={styles.errorAlert}>{error}</div>}

          <InputField 
            label="Service Address" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            placeholder="E.g. Flat 3B, Local Apartment" 
            required
          />

          <div style={{ marginVertical: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Requirements (Optional)</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what needs to be done..."
              style={styles.textArea}
              rows={4}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <Button type="button" variant="outline" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</Button>
            <Button type="submit" loading={loading} style={{ flex: 2 }}>Confirm Booking</Button>
          </div>
        </form>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#FFF',
    padding: '24px',
    borderRadius: '16px',
  },
  textArea: {
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    border: '1.5px solid var(--color-border)',
    backgroundColor: 'var(--color-surface-secondary)',
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical'
  },
  errorAlert: {
    padding: '12px 16px',
    backgroundColor: '#FEF2F2',
    color: 'var(--color-error)',
    borderRadius: '12px',
    border: '1px solid #FCA5A5',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '600',
  }
};
