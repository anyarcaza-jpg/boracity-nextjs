import { Inter } from 'next/font/google';

// ============================================================
// IMPORTS DE CSS EN ORDEN CORRECTO
// IMPORTANTE: Las variables DEBEN cargarse PRIMERO
// ============================================================

// 1. VARIABLES PRIMERO (para que estén disponibles en todos los demás CSS)
import '../styles/core/variables.css';

// 2. CORE - Fundamentos
import '../styles/core/reset.css';
import '../styles/core/typography.css';

// 3. LAYOUT - Estructura
import '../styles/layout/navbar.css';
import '../styles/layout/hero.css';
import '../styles/layout/footer.css';

// 4. COMPONENTS - Componentes
import '../styles/components/buttons.css';
import '../styles/components/cards.css';
import '../styles/components/filters.css';
import '../styles/components/modal.css';
import '../styles/components/forms.css';

// 5. PAGES - Páginas específicas
import '../styles/pages/categories.css';
import '../styles/pages/pricing.css';
import '../styles/pages/family-detail.css';

// 6. RESPONSIVE
import '../styles/responsive.css';

// 7. GLOBALS - Utilidades finales
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Boracity - Free Revit Families',
  description: 'Download high-quality Revit families for architectural projects',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}