import './globals.css';
import { WebsiteSchema, OrganizationSchema } from '@/components/SchemaOrg';
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: {
    default: 'Boracity - Free Revit Families, SketchUp Models & 3D Assets',
    template: '%s | Boracity'
  },
  description: 'Download 10,000+ professional Revit families, SketchUp models, D5 Render assets & textures. Free for students & architects.',
  keywords: ['revit families', 'bim', 'sketchup models', 'd5 render', 'textures', 'architectural assets'],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 pt-[70px]">{children}</main>
        <Footer />
        
        {/* Schema.org Structured Data for SEO */}
        <WebsiteSchema />
        <OrganizationSchema />
      </body>
    </html>
  )
}