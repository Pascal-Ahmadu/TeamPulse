'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import AuthProvider from '@/components/auth/auth-provider';
// Remove AuthGuard import - not needed with the fixed AuthProvider

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* Remove AuthGuard wrapper - AuthProvider handles everything */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}