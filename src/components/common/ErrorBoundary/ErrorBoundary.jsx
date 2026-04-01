import { Component } from 'react';
import { Link } from 'react-router-dom';

/**
 * ErrorBoundary — catches any unhandled React render errors
 * and displays a friendly fallback instead of a blank white screen.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>

            <h1 className="font-heading text-2xl font-bold text-dark mb-2">
              Something Went Wrong
            </h1>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              We're sorry — an unexpected error occurred. Please try refreshing the page.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary text-sm px-6 py-2.5"
              >
                Refresh Page
              </button>
              <Link to="/" className="btn-outline text-sm px-6 py-2.5">
                Go Home
              </Link>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left bg-gray-50 rounded-lg p-4 text-xs text-gray-600">
                <summary className="cursor-pointer font-semibold text-gray-700">
                  Error Details (dev only)
                </summary>
                <pre className="mt-2 overflow-auto whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
