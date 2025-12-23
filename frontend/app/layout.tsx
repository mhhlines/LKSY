import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'lksy.org - Community QA Standards',
  description: 'Open source, version-controlled, community-maintained lists of QA values and checks for go-to-market teams.',
  keywords: ['qa standards', 'email deliverability', 'utm parameters', 'lead scoring', 'gdpr compliance'],
  openGraph: {
    title: 'lksy.org - Community QA Standards',
    description: 'Community-maintained QA standards for marketing, sales, and operations teams',
    type: 'website',
    url: 'https://lksy.org',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

