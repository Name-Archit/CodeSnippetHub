import React, { useState, useMemo } from 'react';
import { highlightSnippet, getPrismLanguage } from '../utils/prismHelper';

export default function CodeViewer({
  snippet,
  onEditSnippet,
  onDeleteSnippet,
  onBack,
  className = ''
}) {
  const [copied, setCopied] = useState(false);
  const [wrapCode, setWrapCode] = useState(false);

  // Hook Rule: Always call hooks at the top level
  const codeLines = useMemo(() => {
    if (!snippet?.code) return [];
    return snippet.code.split('\n');
  }, [snippet?.code]);

  const highlightedHtml = useMemo(() => {
    if (!snippet?.code) return '';
    return highlightSnippet(snippet.code, snippet.language);
  }, [snippet?.code, snippet?.language]);

  // Early return for empty selection state AFTER all hooks have executed
  if (!snippet) {
    return (
      <section
        className={`bg-[#080d1a] p-6 text-slate-500 flex flex-col items-center justify-center h-full text-center ${className}`}
      >
        <span className="text-4xl mb-3 opacity-40">&lt;/&gt;</span>
        <p className="text-sm font-medium text-slate-400">No snippet selected</p>
        <p className="text-xs text-slate-600 mt-1 max-w-[220px]">
          Click on any snippet from the feed to inspect, edit, or copy its code.
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            ← View Snippet List
          </button>
        )}
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

  return (
    <section
      className={`bg-[#080d1a] p-4 sm:p-6 flex flex-col h-full overflow-hidden ${className}`}
    >
      {/* Mobile Back Button (Visible only on small screens when onBack is passed) */}
      {onBack && (
        <div className="md:hidden mb-3">
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 py-1 px-2 rounded-lg bg-slate-800/80 border border-slate-700"
          >
            <span>←</span> Back to Snippets
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="overflow-hidden flex-1">
          <h2
            className="text-lg sm:text-xl font-bold text-white truncate"
            title={snippet.title}
          >
            {snippet.title}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
              {snippet.language}
            </span>
            <span className="text-xs text-slate-500">
              {codeLines.length} {codeLines.length === 1 ? 'line' : 'lines'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Edit */}
          {onEditSnippet && (
            <button
              onClick={() => onEditSnippet(snippet)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
              title="Edit Snippet"
            >
              ✎
            </button>
          )}

          {/* Delete */}
          {onDeleteSnippet && (
            <button
              onClick={() => onDeleteSnippet(snippet)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors border border-transparent hover:border-red-900/50"
              title="Delete Snippet"
            >
              🗑
            </button>
          )}

          {/* Copy */}
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
                <span>✓</span> <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <span>📋</span> <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Toolbar */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 px-1">
        <span>Syntax: {getPrismLanguage(snippet.language)}</span>
        <button
          onClick={() => setWrapCode((prev) => !prev)}
          className={`px-2 py-0.5 rounded border transition-colors ${
            wrapCode
              ? 'bg-slate-800 text-slate-300 border-slate-700'
              : 'text-slate-500 border-transparent hover:text-slate-400'
          }`}
          title="Toggle soft wrapping"
        >
          {wrapCode ? 'Wrap: On' : 'Wrap: Off'}
        </button>
      </div>

      {/* Code Display Area with Syntax Highlighting & Line Gutter */}
      <div className="flex-1 bg-[#050811] border border-slate-800 rounded-xl overflow-auto font-mono text-xs flex">
        {/* Line Numbers Gutter */}
        <div className="select-none py-4 pl-2.5 sm:pl-3 pr-2 text-right text-slate-600 bg-[#070b16] border-r border-slate-800/80 font-mono text-[11px] leading-relaxed shrink-0">
          {codeLines.map((_, idx) => (
            <div key={idx}>{idx + 1}</div>
          ))}
        </div>

        {/* Highlighted Code */}
        <div className="flex-1 p-3.5 sm:p-4 overflow-auto">
          <pre
            className={`leading-relaxed font-mono text-slate-200 ${
              wrapCode ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
            }`}
          >
            <code
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              className={`language-${getPrismLanguage(snippet.language)}`}
            />
          </pre>
        </div>
      </div>
    </section>
  );
}
