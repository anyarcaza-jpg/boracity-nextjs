// Página para listar todas las familias (Server Component)
import { sql } from '@/lib/neon';
import FamiliesTable from './FamiliesTableClient';

interface Family {
  id: string;
  slug: string;
  category: string;
  name: string;
  downloads: number;
  views: number;
  created_at: Date;
}

async function getAllFamilies(): Promise<Family[]> {
  try {
    const families = await sql`
      SELECT id, slug, category, name, downloads, views, created_at
      FROM families
      ORDER BY created_at DESC
    `;
    return families as Family[];
  } catch (error) {
    console.error('Error fetching families:', error);
    return [];
  }
}

export default async function FamiliesPage() {
  const families = await getAllFamilies();

  return <FamiliesTable families={families} />;
}