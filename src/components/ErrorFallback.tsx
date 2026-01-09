interface ErrorFallbackProps {
  error: Error;
  resetError?: () => void;
  variant?: 'global' | 'local';
}

export function ErrorFallback({ error, resetError, variant = 'global' }: ErrorFallbackProps) {
  if (variant === 'global') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">!</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Algo salio mal</h1>
          <p className="text-gray-600 mb-2">Lo sentimos, ocurrio un error inesperado.</p>
          <p className="text-sm text-gray-500 mb-6">{error.message}</p>
          <div className="space-x-4">
            {resetError && (
              <button onClick={resetError} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Intentar de nuevo
              </button>
            )}
            <a href="/" className="inline-block px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border border-red-200 bg-red-50 rounded-lg p-6 text-center">
      <div className="text-4xl mb-3">!</div>
      <h3 className="font-semibold text-gray-900 mb-2">Error al cargar</h3>
      <p className="text-sm text-gray-600 mb-4">{error.message || 'Este contenido no esta disponible'}</p>
      {resetError && (
        <button onClick={resetError} className="text-sm px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition">
          Reintentar
        </button>
      )}
    </div>
  );
}