import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { FeedbackButton } from '@/components/FeedbackButton';
import './globals.css';

const geistSans = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "MutualFunds.in - India's Mutual Funds & ETFs Portal",
  description:
    'Explore, compare, and invest in mutual funds and ETFs with expert insights',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} text-foreground`}>
        <TranslationProvider>
          <AuthProvider>
            {children}
            <FeedbackButton />
          </AuthProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
