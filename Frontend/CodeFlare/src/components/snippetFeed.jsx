import React, { useState } from 'react';

function formatDate(dateVal) {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return dateVal;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default function SnippetFeed({
  snippets = [],
  selectedSnippet,
  onSelectSnippet,
  loading = false,
  error = null,
  onRetry
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSnippets = snippets.filter((s) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = s.title?.toLowerCase().includes(q);
    const langMatch = s.language?.toLowerCase().includes(q);
    const descMatch = s.description?.toLowerCase().includes(q);
    return titleMatch || langMatch || descMatch;
  });

  return (
    <main className="w-[60%] bg-[#0b132b] p-6 border-r border-slate-800 flex flex-col h-full overflow-hidden">
      {/* Header and Search */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            CODE SNIPPETS
            <span className="ml-3 text-xs font-normal px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {snippets.length} {snippets.length === 1 ? 'item' : 'items'}
            </span>
          </h1>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, language, or keyword..."
            className="w-full bg-[#121b35] border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-5 rounded-xl border border-slate-800/80 bg-[#121b35]/60 animate-pulse"
              >
                <div className="h-4 bg-slate-700/60 rounded w-1/3 mb-3"></div>
                <div className="h-3 bg-slate-800 rounded w-1/5 mb-3"></div>
                <div className="h-3 bg-slate-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 rounded-xl border border-red-500/30 bg-red-950/20 text-center space-y-3">
            <p className="text-red-400 font-medium text-sm">Failed to load snippets</p>
            <p className="text-xs text-slate-400">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Retry Connection
              </button>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredSnippets.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl text-slate-500">
            <span className="text-3xl mb-2">📂</span>
            <p className="text-sm font-medium text-slate-400">No snippets found</p>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery
                ? `No results matching "${searchQuery}"`
                : 'Create your first snippet to get started!'}
            </p>
          </div>
        )}

        {/* Snippet List */}
        {!loading &&
          !error &&
          filteredSnippets.map((snippet) => {
            const isSelected = selectedSnippet?.id === snippet.id;
            const displayDate = formatDate(
              snippet.updated_at || snippet.updatedAt || snippet.created_at
            );

            return (
              <div
                key={snippet.id}
                onClick={() => onSelectSnippet(snippet)}
                className={`p-5 rounded-xl border cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#1c2541] border-red-500/60 shadow-lg shadow-red-950/20'
                    : 'bg-[#121b35] border-slate-800/80 hover:border-slate-700 hover:bg-[#152040]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white text-base truncate pr-2">
                    {snippet.title}
                  </h3>
                  {displayDate && (
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {displayDate}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2.5">
                  <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                    {snippet.language}
                  </span>
                </div>

                {snippet.description && (
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {snippet.description}
                  </p>
                )}
              </div>
            );
          })}
      </div>
    </main>
  );
}
