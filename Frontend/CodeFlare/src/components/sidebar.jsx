import React from 'react';

export default function Sidebar({
  onCreateClick,
  onUpdateClick,
  onDeleteClick,
  hasSelectedSnippet = false
}) {
  return (
    <aside className="w-[15%] bg-[#080d1a] text-slate-300 border-r border-slate-800 flex flex-col p-4 justify-between h-full select-none">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-2 text-red-500 font-bold text-xl mb-8 tracking-wider">
          <span className="font-mono">&lt;/&gt;</span> CODEFLARE
        </div>

        {/* User Info / Profile Preview */}
        <div className="flex items-center gap-3 p-2 bg-[#0d1527] rounded-lg mb-6 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-red-600/30 border border-red-500/40 flex items-center justify-center font-bold text-xs text-red-300">
            CF
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">My Workspace</p>
            <p className="text-[11px] text-slate-400 truncate">Personal Snippets</p>
          </div>
        </div>

        {/* Navigation & CRUD Actions */}
        <nav className="space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Workspace
          </div>

          <button className="w-full text-left px-3 py-2 rounded-lg bg-red-600/15 text-red-400 font-medium text-xs border border-red-500/30 flex items-center gap-2">
            <span>📑</span> All Snippets
          </button>

          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 pt-3 mb-1">
            Actions
          </div>

          {/* Create Button */}
          <button
            onClick={onCreateClick}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors flex items-center gap-2 group"
          >
            <span className="text-red-400 font-bold group-hover:scale-110 transition-transform">
              +
            </span>
            Create New
          </button>

          {/* Update Button */}
          <button
            onClick={onUpdateClick}
            disabled={!hasSelectedSnippet}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
              hasSelectedSnippet
                ? 'hover:bg-slate-800 text-slate-300'
                : 'text-slate-600 cursor-not-allowed opacity-50'
            }`}
            title={!hasSelectedSnippet ? 'Select a snippet to edit' : ''}
          >
            <span className="text-amber-400">✎</span>
            Update Snippet
          </button>

          {/* Delete Button */}
          <button
            onClick={onDeleteClick}
            disabled={!hasSelectedSnippet}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
              hasSelectedSnippet
                ? 'hover:bg-red-950/40 text-red-400 hover:text-red-300'
                : 'text-slate-600 cursor-not-allowed opacity-50'
            }`}
            title={!hasSelectedSnippet ? 'Select a snippet to delete' : ''}
          >
            <span className="text-red-500">🗑</span>
            Delete Snippet
          </button>
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
        <p>CodeFlare v1.0</p>
        <p className="text-[10px] text-slate-600">PostgreSQL Powered</p>
      </div>
    </aside>
  );
}
