// src/components/ErrorBoundary.tsx
'use client';

import React from 'react';
import { ErrorFallback } from './ErrorFallback';
import { logger } from '@/lib/logger';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Estado inicial: sin errores
    this.state = {
      hasError: false,
      error: null,
    };
  }

  // Método 1: Actualiza el estado cuando hay error
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  // Método 2: Se ejecuta DESPUÉS de capturar el error (para logging)
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log del error con contexto
    logger.error('Error capturado por ErrorBoundary', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
    
    // TODO: Aquí enviarías a Sentry en producción
    // Sentry.captureException(error);
  }

  // Método para resetear el error (botón "Reintentar")
  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    // Si hay error, muestra el fallback
    if (this.state.hasError && this.state.error) {
      // Si pasaron un fallback custom, úsalo
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Si no, usa nuestro ErrorFallback
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={this.resetError}
          variant="global"
        />
      );
    }

    // Si no hay error, renderiza los children normalmente
    return this.props.children;
  }
}