// src/app/sitemap.js
import { getAllFamilies } from '@/lib/families';

export default async function sitemap() {
  const baseUrl = 'https://boracity.com';
  
  // Get all families (await porque es async)
  const families = await getAllFamilies();
  
  // Family pages
  const familyUrls = families.map((family) => ({
    url: `${baseUrl}/family/${family.id}`,
    lastModified: family.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Static pages
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/categories/furniture`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories/doors`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories/windows`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories/lighting`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  return [...staticUrls, ...familyUrls];
}