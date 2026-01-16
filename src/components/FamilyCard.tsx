import Link from 'next/link';
import Image from 'next/image';
import { Download, Eye } from 'lucide-react';
import type { Family } from '@/types';
import { ErrorBoundaryLocal } from '@/components/ErrorBoundaryLocal';
import FavoriteButton from '@/components/FavoriteButton';

interface FamilyCardProps {
  family: Family;
}

export default function FamilyCard({ family }: FamilyCardProps) {
  if (!family || !family.id) {
    return null;
  }

  const thumbnailUrl = family.images?.thumbnail || '/assets/images/placeholder.png';
  const categoryName = family.category || 'uncategorized';
  const slug = family.slug || family.id;
  const name = family.name || 'Untitled';
  const description = family.description || '';
  const downloads = family.metadata?.downloads || 0;
  const views = family.metadata?.views || 0;
  const fileSize = family.file?.size || 'N/A';

  return (
    <ErrorBoundaryLocal>
      <Link
        href={`/revit/${categoryName}/${slug}`}
        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
      >
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <Image
            src={thumbnailUrl}
            alt={name}
            width={400}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full uppercase">
            {categoryName}
          </div>

          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FavoriteButton familyId={family.id} size="sm" />
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              <span>{downloads.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{views.toLocaleString()}</span>
            </div>
            
            <div className="text-xs">
              {fileSize}
            </div>
          </div>
        </div>
      </Link>
    </ErrorBoundaryLocal>
  );
}