import './globals.css';
import StoreProvider from '../store/StoreProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: {
    default: 'LocalHub | Find & Book Verified Local Services',
    template: '%s | LocalHub'
  },
  description: 'Connect with top-rated local professionals instantly. Search for plumbers, electricians, cleaners, beauty experts and more in your neighborhood.',
  keywords: ['local services', 'plumber', 'electrician', 'cleaning', 'home services', 'verified professionals'],
  authors: [{ name: 'LocalHub Team' }],
  openGraph: {
    title: 'LocalHub | Find & Book Verified Local Services',
    description: 'Connect with top-rated local professionals instantly.',
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
  twitter: {
    card: 'summary_large_image',
    title: 'LocalHub | Local Services at Your Doorstep',
    description: 'The easiest way to find and book local professionals.',
    images: ['https://localhub.pro/twitter-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
