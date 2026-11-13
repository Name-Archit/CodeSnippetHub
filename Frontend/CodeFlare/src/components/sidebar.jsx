import React from 'react';

export default function Sidebar({
  user = null,
  onOpenAuth,
  onLogout,
  onCreateClick,
  onUpdateClick,
  onDeleteClick,
  hasSelectedSnippet = false
}) {
  const userInitials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <aside className="w-[15%] bg-[#080d1a] text-slate-300 border-r border-slate-800 flex flex-col p-4 justify-between h-full select-none">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-2 text-red-500 font-bold text-xl mb-6 tracking-wider">
          <span className="font-mono">&lt;/&gt;</span> CODEFLARE
        </div>

        {/* User Account Section */}
        {user ? (
          <div className="flex items-center gap-3 p-2.5 bg-[#0d1527] rounded-xl mb-6 border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-red-600/30 border border-red-500/40 flex items-center justify-center font-bold text-xs text-red-300 shrink-0">
              {userInitials}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-white truncate" title={user.username}>
                {user.username}
              </p>
              <p className="text-[10px] text-slate-400 truncate" title={user.email}>
                {user.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-[#0d1527] rounded-xl mb-6 border border-slate-800/80 text-center">
            <p className="text-xs font-medium text-slate-300 mb-2">Guest Mode</p>
            <button
              onClick={onOpenAuth}
              className="w-full py-1.5 px-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition-all shadow-sm shadow-red-950/40"
            >
              Sign In / Register
            </button>
          </div>
        )}

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

      {/* Footer / Logout */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2">
        {user && (
          <button
            onClick={onLogout}
            className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors flex items-center gap-2"
          >
            <span>⎋</span> Sign Out
          </button>
        )}
        <div className="text-[10px] text-slate-600 px-3">
          <p>CodeFlare v1.0</p>
          <p>JWT & PostgreSQL</p>
        </div>
      </div>
    </aside>
  );
}
