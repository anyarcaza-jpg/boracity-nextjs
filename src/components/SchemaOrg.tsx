// src/components/SchemaOrg.tsx
import type { Family } from '@/types';

interface ProductSchemaProps {
  family: Family;
  url: string;
}

export function ProductSchema({ family, url }: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: family.name,
    description: family.description,
    image: family.images.thumbnail,
    brand: {
      '@type': 'Brand',
      name: 'Boracity',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    url: url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface CollectionPageSchemaProps {
  category: string;
  families: Family[];
  url: string;
}

export function CollectionPageSchema({ category, families, url }: CollectionPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.charAt(0).toUpperCase() + category.slice(1)} Revit Families`,
    description: `Free ${category} Revit families for architects and designers.`,
    url: url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: families.map((family, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${url}/${family.slug}`,
        name: family.name,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ItemListSchemaProps {
  items: Array<{ name: string; url: string; description: string }>;
  title: string;
  description: string;
  url: string;
}

export function ItemListSchema({ items, title, description, url }: ItemListSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description: description,
    url: url,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: item.url,
      name: item.name,
      description: item.description,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}