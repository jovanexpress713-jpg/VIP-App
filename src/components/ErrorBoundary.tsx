import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  lang?: 'ar' | 'en';
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('VYRO VPN Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const isAr = this.props.lang === 'ar';
      
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <ShieldAlert className="w-8 h-8 text-rose-400" />
              </div>
              
              <div>
                <h2 className="text-lg font-bold text-slate-100 mb-2">
                  {isAr ? 'حدث خطأ غير متوقع' : 'Something went wrong'}
                </h2>
                <p className="text-sm text-slate-400 mb-3">
                  {isAr 
                    ? 'واجه التطبيق مشكلة غير متوقعة. يرجى إعادة تحميل الصفحة.' 
                    : 'The app encountered an unexpected issue. Please reload the page.'}
                </p>
                {this.state.error && (
                  <details className="text-xs text-slate-500 bg-slate-950 p-3 rounded-xl border border-slate-800 text-left mt-3">
                    <summary className="cursor-pointer font-mono text-slate-400 mb-2">
                      {isAr ? 'تفاصيل الخطأ' : 'Error details'}
                    </summary>
                    <code className="block whitespace-pre-wrap break-words">
                      {this.state.error.message}
                    </code>
                  </details>
                )}
              </div>

              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={this.handleReset}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{isAr ? 'إعادة تحميل' : 'Reload'}</span>
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>{isAr ? 'الرئيسية' : 'Home'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
