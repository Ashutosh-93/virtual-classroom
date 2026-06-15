import React from 'react';

export default function CertificatesView() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Certificates & Achievements</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Access your verified credentials and academic milestone markers.</p>
      </div>

      {/* Placeholder Slate Container Block */}
      <div className="border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl p-12 text-center bg-white/50 dark:bg-[#121212]/30">
        <span className="text-3xl block mb-3">🏅</span>
        <h3 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">No credentials unlocked yet</h3>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 max-w-sm mx-auto">
          When you complete 100% of the lectures in a blueprint track, your official graduation credentials will spawn here.
        </p>
      </div>
    </div>
  );
}