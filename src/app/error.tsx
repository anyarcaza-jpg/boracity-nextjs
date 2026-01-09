'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    logger.error('Error de aplicacion capturado', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold text-gray-900 mb-4">500</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Error del servidor</h1>
        <p className="text-gray-600 mb-2">Algo salio mal en nuestro servidor.</p>
        <p className="text-sm text-gray-500 mb-8">Nuestro equipo ha sido notificado y estamos trabajando en solucionarlo.</p>
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-xs font-mono text-red-800 break-all">{error.message}</p>
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Intentar de nuevo
          </button>
          <a href="/" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}