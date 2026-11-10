import React from 'react';

export default function Sidebar() {
  return (
    <aside className="w-[20%] bg-[#080d1a] text-slate-300 border-r border-slate-800 flex flex-col p-4 justify-between h-full">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 text-red-500 font-bold text-xl mb-8">
          <span>&lt;/&gt;</span> CODEFLARE
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 p-2 bg-[#0d1527] rounded-lg mb-6 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white">AR</div>
          <div>
            <p className="text-sm font-semibold text-white">Alex Rivera</p>
            <p className="text-xs text-slate-400">Developer</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-400">Dashboard</button>
          <button className="w-full text-left px-3 py-2 rounded-md bg-red-600/20 text-red-400 font-medium border border-red-500/30">Snippets</button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-400">+ Create New</button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-400">Actions</button>
        </nav>
      </div>

      <button className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-800 text-slate-400 text-sm">Settings</button>
    </aside>
  );
}