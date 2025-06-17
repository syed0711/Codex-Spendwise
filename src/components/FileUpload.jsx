import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { getDocument } from 'pdfjs-dist';

const rules = [
  { keyword: 'starbucks', category: 'Food' },
  { keyword: 'uber', category: 'Transport' },
  { keyword: 'walmart', category: 'Shopping' },
];

function categorize(desc) {
  const lowered = desc.toLowerCase();
  const rule = rules.find(r => lowered.includes(r.keyword));
  return rule ? rule.category : 'Other';
}

export function FileUpload({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const handleFile = async (file) => {
    setProgress(0);
    setStatus('');

    const ext = file.name.split('.').pop().toLowerCase();
    let records = [];
    try {
      if (ext === 'csv') {
        records = await parseCsv(file);
      } else if (ext === 'xls' || ext === 'xlsx') {
        records = await parseExcel(file);
      } else if (ext === 'pdf') {
        records = await parsePdf(file);
      } else {
        setStatus('File type not recognized');
        return;
      }
      setStatus(`Imported ${records.length} records`);
      onComplete(records);
    } catch (err) {
      console.error(err);
      setStatus('Failed to parse file');
    }
  };

  const parseCsv = async (file) => {
    const text = await file.text();
    const total = text.split(/\r?\n/).length;
    return new Promise((resolve, reject) => {
      const results = [];
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        step: (row) => {
          const { data } = row;
          const item = {
            date: data.Date,
            description: data.Description,
            amount: parseFloat(data.Amount),
            category: data.Category || categorize(data.Description || ''),
          };
          results.push(item);
          setProgress(Math.round((results.length / total) * 100));
        },
        complete: () => resolve(results),
        error: (error) => reject(error),
      });
    });
  };

  const parseExcel = async (file) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);
    return json.map(row => ({
      date: row.Date,
      description: row.Description,
      amount: parseFloat(row.Amount),
      category: row.Category || categorize(row.Description || ''),
    }));
  };

  const parsePdf = async (file) => {
    const typed = new Uint8Array(await file.arrayBuffer());
    const pdf = await getDocument({ data: typed }).promise;
    const result = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await page.getTextContent();
      const str = text.items.map(t => t.str).join(' ');
      const lines = str.split(/\n|\r/).filter(Boolean);
      lines.forEach(line => {
        const parts = line.split(/,|\t/);
        if (parts.length >= 3) {
          result.push({
            date: parts[0],
            description: parts[1],
            amount: parseFloat(parts[2]),
            category: categorize(parts[1]),
          });
        }
      });
    }
    return result;
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept=".csv, .xls, .xlsx, .pdf"
        onChange={e => e.target.files && handleFile(e.target.files[0])}
        className="block"
      />
      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded h-2">
          <div
            className="bg-purple-600 h-2 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      {status && <p>{status}</p>}
    </div>
  );
}
