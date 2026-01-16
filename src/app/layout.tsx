// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Providers } from '@/components/Providers';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Boracity - Free Revit Families & BIM Assets',
  description: 'Download professional Revit families, SketchUp models, and 3D assets for architects and designers.',
  keywords: ['revit families', 'bim', 'architecture', 'free downloads'],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ErrorBoundary>
            <Navbar />
            <main className="pt-[70px]">
              {children}
            </main>
            <Footer />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}