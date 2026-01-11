// src/components/ui/GlassCard.tsx
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'hero' | 'subtle';
  className?: string;
  hover?: boolean;
}

export function GlassCard({ 
  children, 
  variant = 'default',
  className,
  hover = true
}: GlassCardProps) {
  
  const baseClasses = 'rounded-xl overflow-hidden transition-all duration-300 ease-out';
  
  const variantClasses = {
    default: 'bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-md',
    hero: 'bg-white/90 backdrop-blur-md border border-gray-200/60 shadow-lg',
    subtle: 'bg-white/60 border border-gray-100/50 shadow-sm',
  };

  const hoverClasses = hover 
    ? 'hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 cursor-pointer'
    : '';

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        className
      )}
    >
      {children}
    </div>
  );
}