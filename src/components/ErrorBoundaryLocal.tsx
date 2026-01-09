// src/components/ErrorBoundaryLocal.tsx
'use client';

import React from 'react';
import { ErrorFallback } from './ErrorFallback';
import { logger } from '@/lib/logger';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundaryLocal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log menos verboso para errores locales
    logger.warn('Error local capturado', {
      message: error.message,
      component: errorInfo.componentStack?.split('\n')[1], // Solo el componente directo
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={this.resetError}
          variant="local"  // ← La diferencia clave
        />
      );
    }

    return this.props.children;
  }
}