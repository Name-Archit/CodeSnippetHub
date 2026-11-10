import React from 'react';

export default function CodeViewer({ snippet }) {
  if (!snippet) {
    return (
      <section className="w-[25%] bg-[#080d1a] p-6 text-slate-500 flex items-center justify-center h-full">
        Select a snippet to view code
      </section>
    );
  }

  return (
    <section className="w-[30%] bg-[#080d1a] p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white truncate">{snippet.title}</h2>
        <button
          onClick={() => navigator.clipboard.writeText(snippet.code)}
          className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg text-xs font-medium transition-colors"
        >
          Copy Code
        </button>
      </div>

      <div className="flex-1 bg-[#050811] border border-slate-800 rounded-xl p-4 overflow-x-auto font-mono text-sm text-slate-200">
        <pre>{snippet.code}</pre>
      </div>
    </section>
  );
}