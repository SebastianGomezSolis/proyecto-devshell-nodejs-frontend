import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{ padding: '24px', border: '1px solid #ef4444', background: '#111', margin: '16px 0' }}>
          <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 500, marginBottom: '8px' }}>
            ⚠ error en el componente
          </div>
          <div style={{ color: '#a0a09a', fontSize: '11px', fontFamily: 'JetBrains Mono' }}>
            {this.state.error?.message}
          </div>
          <button
            className="btn-secondary"
            onClick={() => this.setState({ hasError: false, error: undefined })}
            style={{ fontSize: '10px', padding: '4px 12px', marginTop: '12px' }}
          >
            reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
