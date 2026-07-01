import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

export const metadata = {
  title: { default: 'ENGINEERING_PORTFOLIO_V1.0', template: '%s | ENGINEERING_PORTFOLIO_V1.0' },
  description: 'Precision mechanical engineering, products, and technical documentation.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" toastOptions={{
            style: { fontSize: 12, borderRadius: 0, fontFamily: 'Space Mono, monospace' },
            success: { iconTheme: { primary: '#1a3a2a', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }} />
        </AuthProvider>
      </body>
    </html>
  );
}
