import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="error-boundary">
                    <h2>Something went wrong</h2>
                    {this.state.error && this.state.error.message && (
                        <p className="error-message">
                            {this.state.error.message.includes('Firebase')
                                ? 'Firebase initialization error. Please check your configuration.'
                                : this.state.error.message}
                        </p>
                    )}
                    <div className="error-actions">
                        <button onClick={() => window.location.reload()}>
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 