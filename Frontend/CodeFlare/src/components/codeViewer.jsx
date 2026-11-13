import React, { useState } from 'react';

export default function CodeViewer({
  snippet,
  onEditSnippet,
  onDeleteSnippet
}) {
  const [copied, setCopied] = useState(false);

  if (!snippet) {
    return (
      <section className="w-[25%] bg-[#080d1a] p-6 text-slate-500 flex flex-col items-center justify-center h-full text-center">
        <span className="text-4xl mb-3 opacity-40">&lt;/&gt;</span>
        <p className="text-sm font-medium text-slate-400">No snippet selected</p>
        <p className="text-xs text-slate-600 mt-1 max-w-[200px]">
          Click on any snippet from the feed to inspect, edit, or copy its code.
        </p>
      </section>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code to clipboard:', err);
    }
  };

  const lineCount = (snippet.code || '').split('\n').length;

  return (
    <section className="w-[25%] bg-[#080d1a] p-6 flex flex-col h-full overflow-hidden">
      {/* Top Header */}
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="overflow-hidden">
          <h2 className="text-xl font-bold text-white truncate" title={snippet.title}>
            {snippet.title}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
              {snippet.language}
            </span>
            <span className="text-xs text-slate-500">
              {lineCount} {lineCount === 1 ? 'line' : 'lines'}
            </span>
          </div>
        </div>

        {/* Action Buttons: Copy, Edit, Delete */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onEditSnippet && (
            <button
              onClick={() => onEditSnippet(snippet)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
              title="Edit Snippet"
            >
              ✎
            </button>
          )}

          {onDeleteSnippet && (
            <button
              onClick={() => onDeleteSnippet(snippet)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors border border-transparent hover:border-red-900/50"
              title="Delete Snippet"
            >
              🗑
            </button>
          )}

          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              copied
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-sm'
                : 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-500/30 active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <span>✓</span> Copied!
              </>
            ) : (
              <>
                <span>📋</span> Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="flex-1 bg-[#050811] border border-slate-800 rounded-xl p-4 overflow-auto font-mono text-xs text-slate-200">
        <pre className="leading-relaxed whitespace-pre font-mono">
          <code>{snippet.code}</code>
        </pre>
      </div>
    </section>
  );
}
