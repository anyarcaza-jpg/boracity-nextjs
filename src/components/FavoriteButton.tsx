/**
 * FavoriteButton Component
 * Reusable favorite toggle button with animations
 * @version 1.0.0
 */

'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  familyId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export default function FavoriteButton({
  familyId,
  size = 'md',
  showLabel = false,
  className = '',
}: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite: checkIsFavorite } = useFavorites();
  const isActive = checkIsFavorite(familyId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(familyId);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        bg-white/90 backdrop-blur-sm
        hover:bg-white
        transition-all duration-300
        group
        ${className}
      `}
      aria-label={isActive ? 'Remove from favorites' : 'Add to favorites'}
      title={isActive ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        size={iconSizes[size]}
        className={`
          transition-all duration-300
          ${isActive 
            ? 'fill-red-500 text-red-500 scale-100' 
            : 'text-gray-600 scale-90 group-hover:scale-100'
          }
          group-hover:scale-110
        `}
        strokeWidth={2}
      />
      {showLabel && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {isActive ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}