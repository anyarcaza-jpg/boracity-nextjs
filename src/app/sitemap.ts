// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getAllFamilies } from '@/lib/families';
import { CATEGORY_LIST } from '@/data/models/family.model';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://boracity.com';
  
  // Homepage
  const homepage: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
  
  // Revit Landing Page
  const revitLanding: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/revit`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
  ];
  
  // Category Pages
  const categoryUrls: MetadataRoute.Sitemap = CATEGORY_LIST.map((category) => ({
    url: `${baseUrl}/revit/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));
  
  // Family Detail Pages
  const families = await getAllFamilies();
  const familyUrls: MetadataRoute.Sitemap = families.map((family) => ({
    url: `${baseUrl}/revit/${family.category}/${family.slug}`,
    lastModified: family.metadata.uploadDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));
  
  return [...homepage, ...revitLanding, ...categoryUrls, ...familyUrls];
}