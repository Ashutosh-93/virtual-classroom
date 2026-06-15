import React from 'react';

export default function WishlistView() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Wishlist & Saved Tracks</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Stash curriculum blueprints here before processing your checkouts.</p>
      </div>

      {/* Placeholder Slate Container Block */}
      <div className="border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl p-12 text-center bg-white/50 dark:bg-[#121212]/30">
        <span className="text-3xl block mb-3">🔖</span>
        <h3 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">Your saved tracks list is empty</h3>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 max-w-sm mx-auto">
          Click the bookmark indicators on the course sheets to save items for future review.
        </p>
      </div>
    </div>
  );
}