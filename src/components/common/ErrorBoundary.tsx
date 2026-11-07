import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[FitTrack ErrorBoundary Caught Error]:', error, errorInfo);
  }

  private handleResetStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0c0f14] text-slate-100 flex items-center justify-center p-4 selection:bg-[#e2f163] selection:text-black">
          <div className="max-w-md w-full bg-[#161b22] border border-[#262c36] rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#e2f163]/15 border border-[#e2f163]/30 flex items-center justify-center text-3xl">
              ⚡
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                FitTrack Self-Healing
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                FitTrack caught a client runtime glitch and kept your data safe. Click below to reload or reset cached state.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-black/40 border border-slate-800 rounded-xl text-left text-[11px] font-mono text-rose-300 break-words max-h-32 overflow-y-auto">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-[#e2f163] hover:bg-[#cbe034] text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-[#e2f163]/20"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleResetStorage}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition cursor-pointer"
              >
                Reset Local Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
