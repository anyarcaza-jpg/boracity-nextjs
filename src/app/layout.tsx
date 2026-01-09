// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Configuración optimizada de Inter
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Evita FOUT (Flash of Unstyled Text)
  preload: true,   // Carga prioritaria
  variable: '--font-inter', // Variable CSS opcional
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
      {/* ✅ Font Awesome CDN ELIMINADO - Ahora usamos Lucide React */}
      <body className={inter.className}>
  <ErrorBoundary>
    <Navbar />
    <main className="pt-[70px]">
      {children}
    </main>
    <Footer />
  </ErrorBoundary>
</body>
    </html>
  );
}