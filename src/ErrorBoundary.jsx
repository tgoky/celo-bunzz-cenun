import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('An error occurred:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // You can customize the error UI here if needed
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
