// src/components/detail/MetadataStats.tsx
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface MetadataStatsProps {
  stats: {
    likes: number;
    downloads: number;
    views: number;
    collections?: number;
  };
  className?: string;
}

export function MetadataStats({ stats, className }: MetadataStatsProps) {
  
  const statItems = [
    { label: 'Likes', value: stats.likes },
    { label: 'Downloads', value: stats.downloads },
    { label: 'Views', value: stats.views },
  ];

  if (stats.collections) {
    statItems.push({ label: 'Collections', value: stats.collections });
  }

  return (
    <div className={cn('flex items-center justify-between py-3', className)}>
      {statItems.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <span className="text-xl font-bold text-gray-900">
            {formatNumber(item.value)}
          </span>
          <span className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}