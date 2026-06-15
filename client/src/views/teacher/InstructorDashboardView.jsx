import React from 'react';

export default function InstructorDashboardView() {
  const adminStats = [
    { title: "Active Enrolled Students", value: "1,420", icon: "👥", color: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600" },
    { title: "Active Course Tracks", value: "4", icon: "📦", color: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600" },
    { title: "Gross Month Revenue", value: "₹48,250", icon: "📈", color: "bg-blue-50 dark:bg-blue-950/30 text-blue-600" },
    { title: "Pending Student Q&As", value: "12 Unresolved", icon: "💬", color: "bg-amber-50 dark:bg-amber-950/30 text-amber-600" },
  ];

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Instructor Studio Home</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">High-level operational overview of your published training blueprints and students.</p>
      </div>

      {/* Grid Summary Matrix Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, idx) => (
          <div 
            key={idx} 
            className="p-5 bg-white dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-xl flex items-center gap-4 shadow-sm"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0 ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 block">{stat.title}</span>
              <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-0.5 block">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Academy Performance Graph Placeholder Card */}
      <div className="bg-white dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-xl p-6">
        <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 mb-2">Engagement Analytics Velocity</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Graphical charts monitoring hourly student watch-times and lecture interaction spikes will draw inside this container.</p>
      </div>
    </div>
  );
}