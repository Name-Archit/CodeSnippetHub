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

  // Hook Rule: Always call hooks at the top level before any early return!
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
        <span className="text-5xl mb-4 opacity-40">&lt;/&gt;</span>
        <p className="text-base font-semibold text-slate-300">No snippet selected</p>
        <p className="text-sm text-slate-500 mt-2 max-w-115 leading-relaxed">
          Click on any snippet from the feed to inspect, edit, or copy its code.
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden mt-5 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors"
          >
            ← View Snippet Feed
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
      className={`bg-[#080d1a] p-5 sm:p-7 flex flex-col h-full overflow-hidden ${className}`}
    >
      {/* Mobile Back Button */}
      {onBack && (
        <div className="md:hidden mb-4">
          <button
            onClick={onBack}
            className="text-sm text-slate-300 hover:text-white flex items-center gap-2 py-1.5 px-3 rounded-lg bg-slate-800/90 border border-slate-700 font-medium"
          >
            <span>←</span> Back to Snippets
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex justify-between items-start mb-5 gap-3">
        <div className="overflow-hidden flex-1">
          <h2
            className="text-xl sm:text-2xl font-bold text-white truncate"
            title={snippet.title}
          >
            {snippet.title}
          </h2>
          <div className="flex items-center gap-2.5 mt-2">
            <span className="text-xs sm:text-sm font-semibold px-3 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
              {snippet.language}
            </span>
            <span className="text-xs sm:text-sm text-slate-400">
              {codeLines.length} {codeLines.length === 1 ? 'line' : 'lines'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Edit */}
          {onEditSnippet && (
            <button
              onClick={() => onEditSnippet(snippet)}
              className="p-2 sm:p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 text-base"
              title="Edit Snippet"
            >
              ✎
            </button>
          )}

          {/* Delete */}
          {onDeleteSnippet && (
            <button
              onClick={() => onDeleteSnippet(snippet)}
              className="p-2 sm:p-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors border border-transparent hover:border-red-900/50 text-base"
              title="Delete Snippet"
            >
              🗑
            </button>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all flex items-center gap-2 ${
              copied
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-sm'
                : 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-500/30 active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <span className="text-base">✓</span> <span>Copied!</span>
              </>
            ) : (
              <>
                <span className="text-base">📋</span> <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Toolbar */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 mb-2.5 px-1 font-medium">
        <span>Language: <span className="text-slate-200 capitalize">{getPrismLanguage(snippet.language)}</span></span>
        <button
          onClick={() => setWrapCode((prev) => !prev)}
          className={`px-2.5 py-1 rounded-md border text-xs sm:text-sm transition-colors ${
            wrapCode
              ? 'bg-slate-800 text-slate-200 border-slate-700'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
          title="Toggle soft wrapping"
        >
          {wrapCode ? 'Wrap: On' : 'Wrap: Off'}
        </button>
      </div>

      {/* Code Display Area with Syntax Highlighting & Line Gutter */}
      <div className="flex-1 bg-[#050811] border border-slate-800 rounded-xl overflow-auto flex shadow-inner">
        {/* Line Numbers Gutter */}
        <div className="select-none py-4 pl-3.5 pr-3 text-right text-slate-500 bg-[#070b16] border-r border-slate-800/80 font-mono text-xs sm:text-sm leading-relaxed shrink-0">
          {codeLines.map((_, idx) => (
            <div key={idx}>{idx + 1}</div>
          ))}
        </div>

        {/* Highlighted Code (Medium font size: text-sm sm:text-base) */}
        <div className="flex-1 p-4 sm:p-5 overflow-auto">
          <pre
            className={`leading-relaxed font-mono text-sm sm:text-base text-slate-100 ${
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
