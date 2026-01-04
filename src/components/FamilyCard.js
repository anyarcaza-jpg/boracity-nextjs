import Link from 'next/link';
import Image from 'next/image';

export default function FamilyCard({ family, compact = false }) {
  return (
    <Link
      href={`/family/${family.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Imagen */}
      <div className="bg-gray-100 aspect-[4/3] relative overflow-hidden">
        <Image
          src={family.images?.thumbnail || 'https://via.placeholder.com/400x300/FF4500/ffffff?text=BIM'}
          alt={family.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Contenido */}
      <div className={compact ? "p-4" : "p-6"}>
        <h3 className={`font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors ${compact ? 'text-base' : 'text-lg'}`}>
          {family.name}
        </h3>

        {!compact && family.metadata && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <i className="fas fa-download text-primary"></i>
              {family.metadata.downloads.toLocaleString()}
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold capitalize">
              {family.category}
            </span>
          </div>
        )}

        {compact && (
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold capitalize mt-2">
            {family.category}
          </span>
        )}
      </div>
    </Link>
  );
}