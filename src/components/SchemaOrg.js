// src/components/SchemaOrg.js
/**
 * Schema.org Structured Data Component
 * Para mejorar SEO y aparecer en rich snippets de Google
 */

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Boracity",
    "description": "Free Revit Families, SketchUp Models, D5 Render Assets & Textures for Architects",
    "url": "https://boracity.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://boracity.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Boracity",
    "url": "https://boracity.com",
    "logo": "https://boracity.com/logo.png",
    "description": "Professional BIM and 3D assets platform for architects and designers",
    "sameAs": [
      "https://twitter.com/boracity",
      "https://www.facebook.com/boracity",
      "https://www.linkedin.com/company/boracity"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema({ family }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": family.name,
    "description": family.description,
    "image": family.imageUrl,
    "brand": {
      "@type": "Brand",
      "name": "Boracity"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": family.metadata.rating || "4.5",
      "reviewCount": family.metadata.downloads
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}