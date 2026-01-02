import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const family = await getFamily(resolvedParams.id);
  
  if (!family) {
    return { title: 'Not Found' };
  }
  
  return {
    title: `${family.name} - Free Revit Family | Boracity`,
    description: `Download ${family.name} Revit family. ${family.category} compatible with Revit 2020-2024.`,
  };
}

export default async function FamilyPage({ params }) {
  const resolvedParams = await params;
  const family = await getFamily(resolvedParams.id);
  
  if (!family) {
    notFound();
  }
  
  return (
    <div className="family-detail-page">
      <div className="container">
        <div className="breadcrumbs">
          <a href="/">Home</a>
          <span> / </span>
          <a href="/">Families</a>
          <span> / </span>
          <span>{family.name}</span>
        </div>
      </div>
      
      <section className="family-hero">
        <div className="container">
          <div className="family-layout">
            <div className="family-image-container">
              <img 
                src={family.image} 
                alt={family.name}
                className="family-main-image"
              />
            </div>
            
            <div className="family-info-container">
              <h1 className="family-title">{family.name}</h1>
              
              <div className="family-badges">
                <span className="badge badge-free">Free</span>
                <span className="badge badge-category">{family.category}</span>
              </div>
              
              <p className="family-description">
                Professional {family.category} Revit family for architecture.
              </p>
              
              <div className="family-stats">
                <div className="stat-item">
                  <i className="fas fa-download"></i>
                  <span>{family.downloads.toLocaleString()} downloads</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-file"></i>
                  <span>{family.fileSize}</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Revit {family.revitVersion}</span>
                </div>
              </div>
              
              <div className="family-meta">
                <div className="meta-item">
                  <strong>Category:</strong>
                  <span>{family.category}</span>
                </div>
              </div>
              
              <div className="family-actions">
                <button className="btn-primary btn-large">
                  <i className="fas fa-download"></i>
                  Download Family
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

async function getFamily(id) {
  const families = [
    {
      id: '1',
      name: 'Modern Executive Chair',
      category: 'Furniture',
      image: 'https://via.placeholder.com/800x600/20CF71/ffffff?text=Executive+Chair',
      downloads: 1543,
      fileSize: '2.5MB',
      revitVersion: '2020-2024',
    },
    {
      id: '2',
      name: 'Contemporary Office Desk',
      category: 'Furniture',
      image: 'https://via.placeholder.com/800x600/20CF71/ffffff?text=Office+Desk',
      downloads: 2103,
      fileSize: '3.1MB',
      revitVersion: '2020-2024',
    },
    {
      id: '3',
      name: 'Glass Entrance Door',
      category: 'Doors',
      image: 'https://via.placeholder.com/800x600/1AB763/ffffff?text=Glass+Door',
      downloads: 987,
      fileSize: '1.8MB',
      revitVersion: '2020-2024',
    },
  ];
  
  return families.find(f => f.id === id);
}