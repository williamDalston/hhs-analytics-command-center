import React from 'react';

/**
 * LoadingFallback - Better loading component with skeleton UI
 * Provides improved perceived performance compared to a simple spinner
 */
const LoadingFallback = () => {
  return (
    <div className="min-h-[50vh] p-6 animate-fadeIn">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-64 animate-pulse"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-96 animate-pulse"></div>
        </div>

        {/* Content skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card space-y-3 animate-pulse">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
              <div className="flex gap-2 mt-4">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingFallback;
