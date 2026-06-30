import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

export const metadata = {
  title: { default: 'My Blog & Portfolio', template: '%s | My Blog' },
  description: 'Blog và Portfolio cá nhân',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" toastOptions={{
            style: { fontSize: 13, borderRadius: 8 },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }} />
        </AuthProvider>
      </body>
    </html>
  );
}
