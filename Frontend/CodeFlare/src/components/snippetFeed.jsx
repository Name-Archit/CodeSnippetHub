import React from 'react';

export default function SnippetFeed({ snippets, selectedSnippet, onSelectSnippet }) {
  return (
    <main className="w-[60%] bg-[#0b132b] p-6 border-r border-slate-800 flex flex-col h-full overflow-y-auto">
      <h1 className="text-2xl font-bold text-white mb-6">CODE SNIPPET</h1>

      <div className="space-y-4">
        {snippets.map((snippet) => {
          const isSelected = selectedSnippet?.id === snippet.id;
          return (
            <div
              key={snippet.id}
              onClick={() => onSelectSnippet(snippet)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#1c2541] border-red-500/50 shadow-md'
                  : 'bg-[#121b35] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white text-lg">{snippet.title}</h3>
                <span className="text-xs text-slate-400">{snippet.updatedAt}</span>
              </div>
              
              <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-3">
                {snippet.language}
              </span>

              <p className="text-sm text-slate-400 line-clamp-2">{snippet.description}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}