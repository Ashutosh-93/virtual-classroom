import React from 'react';

export default function PurchaseLogsView() {
  // Sample structural log array data 
  const logs = [
    { id: "TXN-88291", date: "2026-05-12", items: "Advanced React Systems Design", total: "₹3,499", status: "Success" }
  ];

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Purchase History</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Review your digital statements, tax receipts, and payment parameters.</p>
      </div>

      <div className="w-full overflow-hidden bg-white dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-[#151515] border-b border-[#ebebeb] dark:border-[#232323] text-xs font-bold uppercase tracking-wider text-neutral-400">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Billing Date</th>
                <th className="p-4">Acquired Blueprint</th>
                <th className="p-4">Amount Paid</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebebeb] dark:divide-[#232323] text-sm text-neutral-700 dark:text-neutral-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-50/50 dark:hover:bg-[#151515]/30 transition-colors">
                  <td className="p-4 font-mono text-xs text-neutral-500">{log.id}</td>
                  <td className="p-4 text-xs">{log.date}</td>
                  <td className="p-4 font-semibold text-neutral-900 dark:text-neutral-100">{log.items}</td>
                  <td className="p-4 font-medium">{log.total}</td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}