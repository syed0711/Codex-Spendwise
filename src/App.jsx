import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataView } from './components/DataView';
import { Dashboard } from './components/Dashboard';
import { PieChart, Table } from 'lucide-react';

const TABS = {
  upload: 'Upload',
  data: 'Data',
  dashboard: 'Dashboard',
};

export default function App() {
  const [tab, setTab] = useState('upload');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      setTransactions(JSON.parse(stored));
    }
  }, []);

  const handleTransactions = (items) => {
    setTransactions(items);
    localStorage.setItem('transactions', JSON.stringify(items));
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <header className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <PieChart className="w-8 h-8 text-purple-600" /> SpendWise
        </h1>
        <nav className="ml-auto space-x-4">
          {Object.entries(TABS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={
                'px-3 py-1 rounded-md ' +
                (tab === key ? 'bg-purple-600 text-white' : 'bg-gray-200')
              }
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {tab === 'upload' && (
        <FileUpload onComplete={handleTransactions} />
      )}
      {tab === 'data' && (
        <DataView transactions={transactions} />
      )}
      {tab === 'dashboard' && (
        <Dashboard transactions={transactions} />
      )}
    </div>
  );
}
