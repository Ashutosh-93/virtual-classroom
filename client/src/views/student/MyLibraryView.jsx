import React from 'react';

export default function MyLibraryView() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">My Purchased Library</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Access and manage the engineering paths you own.</p>
      </div>

      {/* Empty Condition / Content Grid Canvas Wrapper */}
      <div className="border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl p-12 text-center bg-white/50 dark:bg-[#121212]/30">
        <span className="text-3xl block mb-3">📚</span>
        <h3 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">No active assets loaded</h3>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 max-w-sm mx-auto">
          Courses you purchase from the main marketplace discovery catalog directory will cleanly compile inside this view.
        </p>
      </div>
    </div>
  );
}