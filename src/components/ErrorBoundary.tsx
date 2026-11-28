import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected rendering error.',
    };
  }

  public componentDidCatch(error: Error): void {
    // Keep failure observable in browser devtools without crashing the root tree
    console.error('Tatkhalsa Web Pothi render error:', error);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleResetAndReload = (): void => {
    try {
      window.localStorage.removeItem('tatkhalsa.pothi.activePothiId');
      window.localStorage.removeItem('tatkhalsa.pothi.sehajProgress');
      window.localStorage.removeItem('tatkhalsa.pothi.readerSettings');
      window.localStorage.removeItem('tatkhalsa.pothi.queue');
    } catch {
      // ignore storage errors
    }
    window.location.href = '/';
  };

  public render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6EE] text-[#14213D] px-4 py-10">
        <div className="w-full max-w-md rounded-xl border border-[#D9CEB8] bg-[#FFFDF8] p-6 shadow-sm text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7A4900]">
            Tatkhalsa Web Pothi
          </p>
          <h1 className="text-2xl font-serif font-semibold text-[#14213D]">
            Unable to display this view
          </h1>
          <p className="text-sm leading-relaxed text-[#4A5568]">
            A temporary display issue occurred while loading Pothi Sahib. Reload
            to restore the latest version cleanly.
          </p>
          {this.state.errorMessage && (
            <p className="rounded-lg bg-[#F4EFE4] px-3 py-2 text-xs font-mono text-[#5B4636] break-words">
              {this.state.errorMessage}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={this.handleReload}
              className="rounded-lg bg-[#14213D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1E3158] cursor-pointer"
            >
              Reload Pothi Sahib
            </button>
            <button
              type="button"
              onClick={this.handleResetAndReload}
              className="rounded-lg border border-[#D9CEB8] bg-white px-4 py-2.5 text-sm font-medium text-[#14213D] hover:bg-[#F4EFE4] cursor-pointer"
            >
              Reset Local State
            </button>
          </div>
        </div>
      </div>
    );
  }
}
