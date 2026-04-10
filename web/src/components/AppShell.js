'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

const HIDE_CHROME_PREFIXES = ['/admin', '/provider', '/inbox', '/login', '/register', '/forgot-password'];

export default function AppShell({ children }) {
  const pathname = usePathname() || '';
  const hideChrome = HIDE_CHROME_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  return (
    <div className="flex flex-col min-h-screen">
      {!hideChrome && <Navbar />}
      <main className={`flex-grow ${hideChrome ? '' : 'page-shell'}`}>
        {children}
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}
