// src/components/detail/UserInfo.tsx
'use client';

import { useState } from 'react';
import { Share2, UserPlus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import FavoriteButton from '@/components/FavoriteButton';

interface UserInfoProps {
  author: {
    name: string;
    avatar?: string;
  };
  familyId: string;
  initialStats?: {
    isFollowing?: boolean;
  };
  className?: string;
}

export function UserInfo({ author, familyId, initialStats, className }: UserInfoProps) {
  const [isFollowing, setIsFollowing] = useState(initialStats?.isFollowing || false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${author.name} - Boracity`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      
      {/* AUTOR + FOLLOW */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-primary font-bold text-lg">
              {author.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Nombre */}
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{author.name}</span>
        </div>

        {/* Botón Follow */}
        <button
          onClick={handleFollow}
          className={cn(
            'ml-2 px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200',
            isFollowing
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105'
          )}
        >
          {isFollowing ? (
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Following
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <UserPlus className="w-4 h-4" />
              Follow
            </span>
          )}
        </button>
      </div>

      {/* ACCIONES (Favorite, Share) */}
      <div className="flex items-center gap-2">
        
        {/* Favorite Button */}
        <FavoriteButton 
          familyId={familyId} 
          size="md" 
          showLabel={false}
        />

        {/* Share */}
        <button
          onClick={handleShare}
          className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="Share"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}