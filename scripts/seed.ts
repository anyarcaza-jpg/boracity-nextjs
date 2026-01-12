// scripts/seed.ts
import { config } from 'dotenv';
config({ path: '.env.local' });

// @ts-ignore
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const mockFamilies = [
  {
    slug: 'bar-chair-modern',
    category: 'furniture',
    name: 'ALUNVA Bar Chair - Modern Design',
    description: 'Modern bar chair with sleek design, perfect for kitchen islands and high counters.',
    thumbnail_url: 'https://ik.imagekit.io/nbqxh22tq/revit/furniture/bar-chair.png?tr=w-400,q-80,f-auto',
    file_url: '/downloads/bar-chair-modern.rfa',
    file_size: '245 KB',
    downloads: 1247,
    views: 3891,
    author: 'Boracity Team',
    tags: ['bar', 'chair', 'furniture', 'modern', 'kitchen'],
    revit_versions: ['2025', '2024', '2023'],
    created_at: new Date('2024-01-15')
  },
  {
    slug: 'armchair-ottoman-set',
    category: 'furniture',
    name: 'Armchair 78 with Ottoman',
    description: 'Elegant armchair with matching ottoman, perfect for living rooms.',
    thumbnail_url: 'https://ik.imagekit.io/nbqxh22tq/revit/furniture/armchair-ottoman.png?tr=w-400,q-80,f-auto',
    file_url: '/downloads/armchair-ottoman-set.rfa',
    file_size: '312 KB',
    downloads: 892,
    views: 2134,
    author: 'Boracity Team',
    tags: ['armchair', 'ottoman', 'furniture', 'living room'],
    revit_versions: ['2025', '2024'],
    created_at: new Date('2024-02-01')
  },
  {
    slug: 'exterior-door-two-lite',
    category: 'doors',
    name: 'Exterior Door - Two Lite',
    description: 'Exterior door with two glass lites for natural light.',
    thumbnail_url: 'https://ik.imagekit.io/nbqxh22tq/revit/doors/exterior-door-two-lite.png?tr=w-400,q-80,f-auto',
    file_url: '/downloads/exterior-door-two-lite.rfa',
    file_size: '189 KB',
    downloads: 2134,
    views: 5678,
    author: 'Boracity Team',
    tags: ['door', 'exterior', 'glass', 'two lite'],
    revit_versions: ['2025', '2024', '2023'],
    created_at: new Date('2024-01-10')
  },
  {
    slug: 'exterior-door-glass-wood',
    category: 'doors',
    name: 'Exterior Glass Wood Door',
    description: 'Modern exterior door with glass and wood cladding.',
    thumbnail_url: 'https://ik.imagekit.io/nbqxh22tq/revit/doors/exterior-door-glass-wood.png?tr=w-400,q-80,f-auto',
    file_url: '/downloads/exterior-door-glass-wood.rfa',
    file_size: '367 KB',
    downloads: 1456,
    views: 3421,
    author: 'Boracity Team',
    tags: ['door', 'exterior', 'glass', 'wood'],
    revit_versions: ['2025', '2024', '2023'],
    created_at: new Date('2024-02-05')
  },
  {
    slug: 'awning-window-triple',
    category: 'windows',
    name: 'Awning Window - Triple Vertical',
    description: 'Triple vertical awning window for maximum ventilation.',
    thumbnail_url: 'https://ik.imagekit.io/nbqxh22tq/revit/windows/awning-window-triple.png?tr=w-400,q-80,f-auto',
    file_url: '/downloads/awning-window-triple.rfa',
    file_size: '278 KB',
    downloads: 1789,
    views: 4234,
    author: 'Boracity Team',
    tags: ['window', 'awning', 'triple', 'vertical'],
    revit_versions: ['2025', '2024', '2023'],
    created_at: new Date('2024-01-25')
  },
  {
    slug: 'casement-window-double',
    category: 'windows',
    name: 'Casement Window - Double',
    description: 'Double casement window with excellent ventilation.',
    thumbnail_url: 'https://ik.imagekit.io/nbqxh22tq/revit/windows/casement-window-double.png?tr=w-400,q-80,f-auto',
    file_url: '/downloads/casement-window-double.rfa',
    file_size: '321 KB',
    downloads: 934,
    views: 2156,
    author: 'Boracity Team',
    tags: ['window', 'casement', 'double'],
    revit_versions: ['2025', '2024', '2023'],
    created_at: new Date('2024-02-10')
  },
  {
    slug: 'ceiling-lamp-modern',
    category: 'lighting',
    name: 'Ceiling Lamp - Modern Pendant',
    description: 'Contemporary ceiling pendant lamp with elegant design.',
    thumbnail_url: 'https://ik.imagekit.io/nbqxh22tq/revit/lighting/ceiling-lamp.png?tr=w-400,q-80,f-auto',
    file_url: '/downloads/ceiling-lamp-modern.rfa',
    file_size: '156 KB',
    downloads: 2456,
    views: 6123,
    author: 'Boracity Team',
    tags: ['lighting', 'pendant', 'ceiling', 'modern'],
    revit_versions: ['2025', '2024', '2023'],
    created_at: new Date('2024-01-30')
  },
  {
    slug: 'ceiling-fan-light',
    category: 'lighting',
    name: 'Ceiling Fan with Integrated Light',
    description: 'Ceiling fan with integrated lighting fixture.',
    thumbnail_url: 'https://ik.imagekit.io/nbqxh22tq/revit/lighting/ceiling-fan.png?tr=w-400,q-80,f-auto',
    file_url: '/downloads/ceiling-fan-light.rfa',
    file_size: '234 KB',
    downloads: 1678,
    views: 3892,
    author: 'Boracity Team',
    tags: ['lighting', 'ceiling fan', 'fan', 'LED'],
    revit_versions: ['2025', '2024', '2023'],
    created_at: new Date('2024-02-15')
  }
];

async function seed() {
  console.log('🌱 Iniciando migración de 8 familias...\n');
  
  let success = 0;
  
  for (const family of mockFamilies) {
    try {
      console.log(`📦 Migrando: ${family.name}...`);
      
      await sql`
        INSERT INTO families (
          slug, category, name, description,
          thumbnail_url, file_url, file_size,
          downloads, views, author, tags, revit_versions, created_at
        ) VALUES (
          ${family.slug}, ${family.category}, ${family.name}, ${family.description},
          ${family.thumbnail_url}, ${family.file_url}, ${family.file_size},
          ${family.downloads}, ${family.views}, ${family.author},
          ${family.tags}, ${family.revit_versions}, ${family.created_at}
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          downloads = EXCLUDED.downloads,
          views = EXCLUDED.views
      `;
      
      console.log(`   ✅ ${family.name} - OK\n`);
      success++;
    } catch (error) {
      console.log(`   ❌ Error: ${error}\n`);
    }
  }
  
  console.log(`\n📊 Migradas: ${success}/8`);
  
  const result = await sql`SELECT COUNT(*) as count FROM families`;
  console.log(`📊 Total en DB: ${result[0].count}`);
  
  console.log('\n🎉 ¡Completado!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});