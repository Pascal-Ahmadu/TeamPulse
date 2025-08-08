/**
 * Error Boundary Component
 * 
 * A reusable error boundary component that catches JavaScript errors anywhere
 * in the child component tree and displays a fallback UI instead of crashing.
 * 
 * @file /components/ui/error-boundary.tsx
 * @author Pascal Ally Ahmadu
 * @version 1.0.0
 */

'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Fallback Component
 * 
 * Default fallback UI shown when an error occurs.
 * Provides user-friendly error message and retry functionality.
 */
function DefaultErrorFallback({ 
  error, 
  resetError 
}: { 
  error?: Error; 
  resetError: () => void;
}) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <p className="font-medium">Something went wrong</p>
          {error && (
            <p className="text-sm text-muted-foreground mt-1">
              {error.message}
            </p>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetError}
          className="ml-4"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Error Boundary Class Component
 * 
 * Implements React's error boundary pattern to catch and handle errors
 * in child components gracefully.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <DefaultErrorFallback 
          error={this.state.error} 
          resetError={this.resetError} 
        />
      );
    }

    return this.props.children;
  }
}