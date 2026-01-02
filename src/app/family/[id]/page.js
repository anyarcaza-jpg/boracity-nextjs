import '@/styles/pages/family-detail.css';
import { notFound } from 'next/navigation';
import { getFamilyById, getRelatedFamilies } from '@/lib/families';
import { FAMILY_CATEGORIES } from '@/data/models/family.model';

/**
 * METADATA DINÁMICA
 * Next.js llama a esta función para generar meta tags únicos
 */
export async function generateMetadata({ params }) {
  const { id } = await params;
  const family = await getFamilyById(id);

  if (!family) {
    return {
      title: 'Family Not Found - Boracity',
      description: 'The requested Revit family could not be found.'
    };
  }

  return {
    title: family.seo.title,
    description: family.seo.description,
    keywords: family.seo.keywords.join(', '),
    openGraph: {
      title: family.seo.title,
      description: family.seo.description,
      type: 'article',
      images: [
        {
          url: family.images.thumbnail,
          width: 400,
          height: 300,
          alt: family.name
        }
      ]
    }
  };
}

/**
 * PÁGINA DE DETALLE DE FAMILIA
 */
export default async function FamilyDetailPage({ params }) {
  const { id } = await params;
  
  // Obtener datos de la familia
  const family = await getFamilyById(id);

  // Si no existe, mostrar 404
  if (!family) {
    notFound();
  }

  // Obtener familias relacionadas
  const relatedFamilies = await getRelatedFamilies(id, 4);

  // Formatear fecha para mostrar
  const uploadDate = new Date(family.metadata.uploadDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="family-detail-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        <a href="/">Home</a>
        <span> / </span>
        <a href="/families">Families</a>
        <span> / </span>
        <a href={`/category/${family.category}`}>{family.category}</a>
        <span> / </span>
        <span>{family.name}</span>
      </nav>

      {/* Main Content */}
      <main className="family-content">
        <div className="family-header">
          <h1>{family.name}</h1>
          <div className="family-meta">
            <span className="category">{family.category}</span>
            <span className="stats">
              {family.metadata.downloads.toLocaleString()} downloads • {family.metadata.views.toLocaleString()} views
            </span>
          </div>
        </div>

        <div className="family-body">
          {/* Image Gallery */}
          <div className="family-images">
            <img 
              src={family.images.thumbnail} 
              alt={family.name}
              className="main-image"
            />
            <div className="gallery">
              {family.images.gallery.map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  alt={`${family.name} - View ${index + 1}`}
                  className="gallery-image"
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="family-details">
            <div className="description">
              <h2>Description</h2>
              <p>{family.description}</p>
            </div>

            <div className="specifications">
              <h3>File Information</h3>
              <dl>
                <dt>File Size:</dt>
                <dd>{family.file.size}</dd>
                
                <dt>Revit Versions:</dt>
                <dd>{family.file.revitVersions.join(', ')}</dd>
                
                <dt>Uploaded:</dt>
                <dd>{uploadDate}</dd>
                
                <dt>Author:</dt>
                <dd>{family.metadata.author}</dd>
              </dl>
            </div>

            <div className="tags">
              <h3>Tags</h3>
              <div className="tag-list">
                {family.metadata.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <a 
              href={family.file.downloadUrl}
              className="download-button"
              download
            >
              Download Free
            </a>
          </div>
        </div>

        {/* Related Families */}
        {relatedFamilies.length > 0 && (
          <section className="related-families">
            <h2>Related Families</h2>
            <div className="families-grid">
              {relatedFamilies.map((related) => (
                <a 
                  key={related.id}
                  href={`/family/${related.id}`}
                  className="family-card"
                >
                  <img src={related.images.thumbnail} alt={related.name} />
                  <h3>{related.name}</h3>
                  <p>{related.metadata.downloads.toLocaleString()} downloads</p>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}