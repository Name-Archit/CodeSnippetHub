import React, { useState, useMemo } from 'react';

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
  onRetry,
  className = ''
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');

  // Dynamically extract unique languages and counts
  const languageOptions = useMemo(() => {
    const counts = {};
    snippets.forEach((s) => {
      const lang = s.language?.trim() || 'Other';
      counts[lang] = (counts[lang] || 0) + 1;
    });

    const list = Object.entries(counts).map(([name, count]) => ({
      name,
      count
    }));

    return [{ name: 'ALL', count: snippets.length }, ...list];
  }, [snippets]);

  // Combined filter: Language Pill + Search Query
  const filteredSnippets = useMemo(() => {
    return snippets.filter((s) => {
      const matchesLang =
        selectedLanguage === 'ALL' ||
        s.language?.toLowerCase() === selectedLanguage.toLowerCase();

      if (!matchesLang) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const titleMatch = s.title?.toLowerCase().includes(q);
      const descMatch = s.description?.toLowerCase().includes(q);
      const codeMatch = s.code?.toLowerCase().includes(q);
      return titleMatch || descMatch || codeMatch;
    });
  }, [snippets, selectedLanguage, searchQuery]);

  return (
    <main
      className={`bg-[#0b132b] p-5 sm:p-7 border-r border-slate-800 flex flex-col h-full overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            CODE SNIPPETS
            <span className="ml-3 text-sm font-medium px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filteredSnippets.length} of {snippets.length}
            </span>
          </h1>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, description, or code content..."
            className="w-full bg-[#121b35] border border-slate-800 rounded-xl px-4 py-3 text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500/70 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-xs sm:text-sm text-slate-400 hover:text-white px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dynamic Language Filter Chips */}
        {languageOptions.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
            {languageOptions.map((opt) => {
              const isActive = selectedLanguage === opt.name;
              return (
                <button
                  key={opt.name}
                  onClick={() => setSelectedLanguage(opt.name)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0 ${
                    isActive
                      ? 'bg-red-600/20 text-red-400 border-red-500/40 shadow-sm'
                      : 'bg-[#121b35] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {opt.name}{' '}
                  <span className="text-xs opacity-70 ml-1">
                    ({opt.count})
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Content Feed List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5">
        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-3.5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-5 sm:p-6 rounded-xl border border-slate-800/80 bg-[#121b35]/60 animate-pulse"
              >
                <div className="h-5 bg-slate-700/60 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-slate-800 rounded w-1/5 mb-3"></div>
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 rounded-xl border border-red-500/30 bg-red-950/20 text-center space-y-3">
            <p className="text-red-400 font-semibold text-base">Failed to load snippets</p>
            <p className="text-sm text-slate-400">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-md"
              >
                Retry Connection
              </button>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredSnippets.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl text-slate-500">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-base font-semibold text-slate-300">No matching snippets</p>
            <p className="text-sm text-slate-400 mt-1.5 max-w-sm">
              {searchQuery || selectedLanguage !== 'ALL'
                ? 'Try broadening your search keywords or switching language filters.'
                : 'Click "+ Create New Snippet" to store your first piece of code!'}
            </p>
            {(searchQuery || selectedLanguage !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLanguage('ALL');
                }}
                className="mt-4 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* Snippet Card List */}
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
                className={`p-5 sm:p-6 rounded-xl border cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#1c2541] border-red-500/60 shadow-lg shadow-red-950/25 ring-1 ring-red-500/30'
                    : 'bg-[#121b35] border-slate-800/80 hover:border-slate-700 hover:bg-[#152040]'
                }`}
              >
                <div className="flex justify-between items-start mb-2.5">
                  <h3 className="font-bold text-white text-lg sm:text-xl truncate pr-3">
                    {snippet.title}
                  </h3>
                  {displayDate && (
                    <span className="text-xs sm:text-sm text-slate-400 whitespace-nowrap pt-0.5">
                      {displayDate}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block px-3 py-1 rounded text-xs sm:text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                    {snippet.language}
                  </span>
                </div>

                {snippet.description && (
                  <p className="text-sm sm:text-base text-slate-300 line-clamp-2 leading-relaxed">
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
