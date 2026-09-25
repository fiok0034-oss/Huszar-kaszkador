import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="py-12 px-4 max-w-4xl mx-auto my-6 border border-[#ef4444]/40 bg-[#160b0b] text-[#fca5a5] font-mono text-xs shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-[#ef4444] shrink-0" size={18} />
                <span className="text-white font-bold tracking-wider uppercase text-sm">
                  {this.props.fallbackTitle || 'ADATFORRÁS ÁTMENETILEG NEM ELÉRHETŐ'}
                </span>
              </div>
              <p className="text-xs text-[#fca5a5]/80">
                {this.props.fallbackMessage || 'A modul betöltése során váratlan hiba történt. A weboldal többi része zavartalanul működik.'}
              </p>
            </div>
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 border border-[#ef4444]/60 bg-[#ef4444]/20 hover:bg-[#ef4444]/30 text-white font-bold font-mono text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw size={14} />
              <span>ÚJRAPRÓBÁLÁS</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
