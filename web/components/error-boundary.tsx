import AlertTriangleIcon from '@geist-ui/icons/alertTriangle';
import React from 'react';
import Empty from './empty';

interface ErrorBoundaryState {
  error: Error | null;
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component {
  state: ErrorBoundaryState = {
    error: null,
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      error,
      hasError: true,
    };
  }

  render(): React.ReactNode {
    const { error, hasError } = this.state;
    const { children } = this.props;

    if (error && hasError) {
      return (
        <Empty text={error?.message} icon={<AlertTriangleIcon size={80} />} />
      );
    }

    return children;
  }
}
