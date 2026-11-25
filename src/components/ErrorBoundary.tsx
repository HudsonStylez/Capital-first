import React from 'react';

interface State {
  hasError: boolean;
}

/** Catches render/runtime errors so the app shows a recovery screen instead of
 *  a blank page, and can reset stale local data (a common cause of breakage). */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('App error:', error);
  }

  private resetLocal = () => {
    try {
      localStorage.removeItem('capitalone_v6_banking_store');
      sessionStorage.clear();
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-lg border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Something went wrong</h2>
            <p className="text-xs text-slate-500 mb-4">
              Your data is safe. Reload, or reset the local cache if the problem continues.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-2.5 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-sm rounded-lg cursor-pointer"
              >
                Reload
              </button>
              <button
                type="button"
                onClick={this.resetLocal}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-lg cursor-pointer"
              >
                Reset local data &amp; reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;