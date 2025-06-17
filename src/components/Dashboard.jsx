import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export function Dashboard({ transactions }) {
  const monthlyRef = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    if (!transactions.length) return;

    const monthMap = {};
    const catMap = {};
    transactions.forEach(t => {
      const month = t.date.slice(0, 7);
      monthMap[month] = (monthMap[month] || 0) + t.amount;
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });

    const months = Object.keys(monthMap);
    const monthData = Object.values(monthMap);
    const cats = Object.keys(catMap);
    const catData = Object.values(catMap);

    if (monthlyRef.current) {
      new Chart(monthlyRef.current, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: 'Monthly Spend',
            data: monthData,
            borderColor: '#9333ea',
          }],
        },
      });
    }

    if (categoryRef.current) {
      new Chart(categoryRef.current, {
        type: 'doughnut',
        data: {
          labels: cats,
          datasets: [{
            data: catData,
            backgroundColor: [
              '#a78bfa', '#c4b5fd', '#ddd6fe', '#e9d5ff', '#d8b4fe'
            ],
          }],
        },
      });
    }
  }, [transactions]);

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <p className="text-xl font-semibold">Total Spent: ${total.toFixed(2)}</p>
      <div className="grid md:grid-cols-2 gap-4">
        <canvas ref={monthlyRef} className="bg-white p-2 rounded" />
        <canvas ref={categoryRef} className="bg-white p-2 rounded" />
      </div>
    </div>
  );
}
