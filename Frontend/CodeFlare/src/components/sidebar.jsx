import React from 'react';

export default function Sidebar({
  user = null,
  isOpen = false,
  onClose,
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

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 bg-[#080d1a] text-slate-300">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-red-500 font-bold text-xl tracking-wider">
            <span className="font-mono">&lt;/&gt;</span> CODEFLARE
          </div>
          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close menu"
            >
              ✕
            </button>
          )}
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
          <div
            onClick={() => {
              if (onClose) onClose();
              onOpenAuth();
            }}
            className="p-3 bg-[#0d1527] hover:bg-[#121c33] rounded-xl mb-6 border border-slate-800 hover:border-red-500/40 cursor-pointer transition-all group"
            title="Click to sign in or register"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                Guest Mode
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Offline
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onClose) onClose();
                onOpenAuth();
              }}
              className="w-full py-1.5 px-3 bg-red-600 group-hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition-all shadow-sm shadow-red-950/40 pointer-events-auto"
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
            onClick={() => {
              if (onClose) onClose();
              onCreateClick();
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors flex items-center gap-2 group active:scale-98"
          >
            <span className="text-red-400 font-bold group-hover:scale-110 transition-transform">
              +
            </span>
            Create New Snippet
          </button>

          {/* Update Button */}
          <button
            onClick={() => {
              if (onClose) onClose();
              onUpdateClick();
            }}
            disabled={!hasSelectedSnippet}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
              hasSelectedSnippet
                ? 'hover:bg-slate-800 text-slate-300 active:scale-98'
                : 'text-slate-600 cursor-not-allowed opacity-50'
            }`}
            title={!hasSelectedSnippet ? 'Select a snippet to edit' : ''}
          >
            <span className="text-amber-400">✎</span>
            Update Snippet
          </button>

          {/* Delete Button */}
          <button
            onClick={() => {
              if (onClose) onClose();
              onDeleteClick();
            }}
            disabled={!hasSelectedSnippet}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
              hasSelectedSnippet
                ? 'hover:bg-red-950/40 text-red-400 hover:text-red-300 active:scale-98'
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
            onClick={() => {
              if (onClose) onClose();
              onLogout();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors flex items-center gap-2"
          >
            <span>⎋</span> Sign Out
          </button>
        )}
        <div className="text-[10px] text-slate-600 px-3">
          <p>CodeFlare v1.0</p>
          <p>Responsive & Cloud Ready</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar (>= 1024px) */}
      <aside className="hidden lg:block lg:w-60 xl:w-64 border-r border-slate-800 h-full shrink-0 select-none">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Slide-Over Drawer (< 1024px) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop blur overlay */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Slide-out Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#080d1a] border-r border-slate-800 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
