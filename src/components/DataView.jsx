import React from 'react';

export function DataView({ transactions }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-2 py-1">Date</th>
            <th className="px-2 py-1">Description</th>
            <th className="px-2 py-1">Amount</th>
            <th className="px-2 py-1">Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50">
              <td className="px-2 py-1">{t.date}</td>
              <td className="px-2 py-1">{t.description}</td>
              <td className="px-2 py-1 text-right">${t.amount.toFixed(2)}</td>
              <td className="px-2 py-1">{t.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
