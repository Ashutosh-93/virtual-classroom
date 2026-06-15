import React from 'react';

export default function StudentDashboardView() {
  // Analytical metrics mock matrix
  const metrics = [
    { title: "Courses in Progress", value: "3", icon: "📖", color: "bg-blue-50 dark:bg-blue-950/30 text-blue-600" },
    { title: "Current Daily Streak", value: "7 Days", icon: "🔥", color: "bg-orange-50 dark:bg-orange-950/30 text-orange-600" },
    { title: "Certificates Earned", value: "1", icon: "🏅", color: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600" },
    { title: "Total Minutes Watched", value: "248 mins", icon: "⏱️", color: "bg-purple-50 dark:bg-purple-950/30 text-purple-600" },
  ];

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Learning Workspace</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Monitor your progression checkpoints and educational metrics.</p>
      </div>

      {/* Grid Grid Metric Array */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item, idx) => (
          <div 
            key={idx} 
            className="p-5 bg-white dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-xl flex items-center gap-4 shadow-sm"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0 ${item.color}`}>
              {item.icon}
            </div>
            <div>
              <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 block">{item.title}</span>
              <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 block">{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Canvas Placeholder Card */}
      <div className="bg-white dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-xl p-6">
        <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 mb-2">Resume Up Next</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Your recent course tracking workflows will materialize inside this container module layout block.</p>
      </div>
    </div>
  );
}