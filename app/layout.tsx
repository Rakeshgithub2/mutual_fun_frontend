import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/lib/auth-context';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { FeedbackButton } from '@/components/FeedbackButton';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const geistSans = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "MutualFunds.in - India's Mutual Funds & ETFs Portal",
  description:
    'Explore, compare, and invest in mutual funds and ETFs with expert insights',
  generator: 'v0.app',
};

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} text-foreground`}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <TranslationProvider>
            <AuthProvider>
              {children}
              <FeedbackButton />
              <Toaster />
            </AuthProvider>
          </TranslationProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
