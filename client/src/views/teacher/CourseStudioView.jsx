import React from 'react';

export default function CourseStudioView() {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Curriculum Course Studio</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Draft outlines, structure modular lectures, and publish fresh blueprints.</p>
        </div>
        <button 
          type="button"
          className="h-9 px-4 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer self-start sm:self-center transition-colors shadow-sm"
        >
          ➕ Design New Path
        </button>
      </div>

      {/* Blueprint Index Shell Canvas */}
      <div className="border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl p-12 text-center bg-white/50 dark:bg-[#121212]/30">
        <span className="text-3xl block mb-3">🛠️</span>
        <h3 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">No course structures compiled yet</h3>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 max-w-sm mx-auto">
          Click the design action module button above to begin initializing a fresh development program curriculum.
        </p>
      </div>
    </div>
  );
}