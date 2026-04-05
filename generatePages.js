const fs = require('fs');
const path = require('path');

const generateTemplate = (title, description) => `"use client";
import { useRouter } from 'next/navigation';

export default function ${title.replace(/\s+/g, '')}Page() {
  const router = useRouter();

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '16px' }}>←</button>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--color-text)', marginBottom: '4px' }}>${title}</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>${description}</p>
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
`;

const pages = [
  { path: 'src/app/categories/page.js', title: 'Service Categories', desc: 'Browse all available service categories.' },
  { path: 'src/app/support/page.js', title: 'Help & Support', desc: 'Get assistance and view FAQS.' },
  { path: 'src/app/settings/page.js', title: 'Account Settings', desc: 'Manage your preferences.' },
  { path: 'src/app/provider/analytics/page.js', title: 'Business Analytics', desc: 'Monitor your engagement and views.' },
  { path: 'src/app/provider/earnings/page.js', title: 'Earnings & Payouts', desc: 'Track your service revenue.' },
  { path: 'src/app/provider/reviews/page.js', title: 'Customer Reviews', desc: 'Manage feedback from your completed services.' },
  { path: 'src/app/provider/settings/page.js', title: 'Provider Settings', desc: 'Configure your business operations.' },
  { path: 'src/app/admin/users/page.js', title: 'User Management', desc: 'Manage platform customers.' },
  { path: 'src/app/admin/businesses/page.js', title: 'Business Directory', desc: 'View all registered service providers.' },
  { path: 'src/app/admin/reports/page.js', title: 'Platform Reports', desc: 'Analytics and financial reporting.' },
  { path: 'src/app/inbox/page.js', title: 'Messages', desc: 'View your active conversations.' },
  { path: 'src/app/inbox/[id]/page.js', title: 'Chat', desc: 'Real-time messaging.' }
];

pages.forEach(page => {
  const fullPath = path.join(__dirname, 'web', page.path);
  fs.writeFileSync(fullPath, generateTemplate(page.title, page.desc));
  console.log('Created: ' + fullPath);
});
