// src/components/detail/ImageGallery.tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ImageGallery({ images, alt, className }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement>(null);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsLoading(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsLoading(true);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setIsLoading(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Posición de la lupa
    setMagnifierPosition({ x, y });

    // Calcular posición del background para el zoom
    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;
    setBgPosition({ x: bgX, y: bgY });
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const magnifierSize = 160;
  const zoomLevel = 2.5;

  return (
    <div className={cn('space-y-4', className)}>
      {/* IMAGEN PRINCIPAL CON LUPA */}
      <div 
        ref={imgRef}
        className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden group shadow-lg cursor-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        
        {/* Skeleton mientras carga */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Imagen */}
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          fill
          className={cn(
            'object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          priority={currentIndex === 0}
          quality={90}
          sizes="(max-width: 768px) 100vw, 50vw"
          onLoad={() => setIsLoading(false)}
        />

        {/* LUPA LIQUID GLASS MEJORADA */}
        {showMagnifier && !isLoading && (
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${magnifierSize}px`,
              height: `${magnifierSize}px`,
              left: `${magnifierPosition.x}px`,
              top: `${magnifierPosition.y}px`,
              transform: 'translate(-50%, -50%)',
              backgroundImage: `url(${images[currentIndex]})`,
              backgroundSize: `${zoomLevel * 200}%`,
              backgroundPosition: `${bgPosition.x}% ${bgPosition.y}%`,
              backgroundRepeat: 'no-repeat',
              border: '3px solid rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(0px)',
              boxShadow: `
                0 0 0 1px rgba(255, 255, 255, 0.5),
                0 8px 32px rgba(0, 0, 0, 0.2),
                inset 0 0 20px rgba(255, 255, 255, 0.3)
              `,
            }}
          >
            {/* Brillo liquid glass */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)',
              }}
            />
            {/* Borde interno brillante */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.6)',
              }}
            />
          </div>
        )}

        {/* Botones de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              onMouseEnter={handleMouseLeave}
              onMouseLeave={handleMouseEnter}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-full shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/90 hover:scale-110 z-10 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={handleNext}
              onMouseEnter={handleMouseLeave}
              onMouseLeave={handleMouseEnter}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-full shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/90 hover:scale-110 z-10 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            {/* Indicador de posición */}
            <div 
              onMouseEnter={handleMouseLeave}
              onMouseLeave={handleMouseEnter}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium shadow-lg z-10"
            >
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* MINIATURAS */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                'relative aspect-square rounded-lg overflow-hidden transition-all duration-200',
                'hover:scale-105 hover:ring-2 hover:ring-primary',
                currentIndex === index
                  ? 'ring-2 ring-primary scale-105'
                  : 'ring-1 ring-gray-200 opacity-70 hover:opacity-100'
              )}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="20vw"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}