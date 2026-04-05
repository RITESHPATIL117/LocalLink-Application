"use client";
import { useRouter } from 'next/navigation';

export default function UserManagementPage() {
  const router = useRouter();

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '16px' }}>←</button>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--color-text)', marginBottom: '4px' }}>User Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>Manage platform customers.</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '80px 20px', border: '1px dashed var(--color-border)', borderRadius: '16px', backgroundColor: '#F9FAFB' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Coming Soon</h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
          This page is currently under construction to match the exact features of the LocalHub React Native app.
        </p>
      </div>
    </div>
  );
}
