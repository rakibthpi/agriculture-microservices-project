import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/providers/Providers';

export const metadata: Metadata = {
  title: 'Agriculture Marketplace - Fresh Farm Products',
  description:
    'Buy fresh farm products directly from farmers. Rice, vegetables, fruits, and more delivered to your door.',
  keywords: ['agriculture', 'farm products', 'organic', 'fresh vegetables', 'marketplace'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
