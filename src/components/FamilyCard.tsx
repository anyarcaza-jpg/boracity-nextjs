import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { Download, Eye } from 'lucide-react';
import type { Family } from '@/types';

interface FamilyCardProps {
  family: Family;
}

export default function FamilyCard({ family }: FamilyCardProps) {
  return (
    <Link
      href={`/revit/${family.category}/${family.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* Imagen */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <OptimizedImage
         src={family.images.thumbnail}
         category={family.category}
         variant="thumbnail"
         alt={family.name}
         className="w-full h-48 object-cover"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full uppercase">
          {family.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {family.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {family.description}
        </p>

        {/* Footer Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            <span>{family.metadata.downloads.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{family.metadata.views.toLocaleString()}</span>
          </div>
          
          <div className="text-xs">
            {family.file.size}
          </div>
        </div>
      </div>
    </Link>
  );
}