import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata = {
  title: { default: process.env.NEXT_PUBLIC_SITE_NAME || 'My Blog', template: '%s | My Blog' },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Blog và Portfolio cá nhân',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
