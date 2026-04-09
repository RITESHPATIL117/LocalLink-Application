import './globals.css';
import StoreProvider from '../store/StoreProvider';
import AppShell from '../components/AppShell';

export const metadata = {
  title: {
    default: 'LocalHub | Find & Book Verified Local Services in Sangli',
    template: '%s | LocalHub'
  },
  description: 'Connect with top-rated local professionals in Sangli instantly. Search for plumbers, electricians, cleaners, beauty experts and more in your neighborhood.',
  keywords: ['local services', 'sangli', 'plumber', 'electrician', 'cleaning', 'home services', 'verified professionals'],
  authors: [{ name: 'LocalHub Team' }],
  openGraph: {
    title: 'LocalHub | Find & Book Verified Local Services',
    description: 'Connect with top-rated local professionals in Sangli instantly.',
    url: 'https://localhub.pro',
    siteName: 'LocalHub',
    images: [
      {
        url: 'https://localhub.pro/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-primary selection:text-white">
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
