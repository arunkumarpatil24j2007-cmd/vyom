import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Vyom ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-3xl bg-[#FFF8EF] border border-[#E8DCCB] text-center space-y-3 my-4 max-w-xl mx-auto shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#FF4B19]/15 text-[#FF4B19] flex items-center justify-center mx-auto">
            <AlertTriangle size={20} />
          </div>
          <h4 className="text-sm font-bold text-[#09132E]">
            {this.props.fallbackTitle || 'Consultation Display Notice'}
          </h4>
          <p className="text-xs text-[#4A5468] max-w-md mx-auto">
            An unexpected display glitch occurred while rendering this astrological synthesis. Your chart data remains fully intact.
          </p>
          <div className="pt-2">
            <button
              onClick={this.handleReset}
              className="btn-pill-orange text-xs !py-2 !px-4 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Retry Rendering</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
