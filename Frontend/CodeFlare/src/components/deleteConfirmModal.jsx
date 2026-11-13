import React from 'react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  snippetTitle = '',
  isDeleting = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0b132b] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-lg">
            ⚠️
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Delete Snippet</h3>
            <p className="text-xs text-slate-400">This action is permanent</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-white">"{snippetTitle}"</span>?
          This will permanently remove it from your PostgreSQL database.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md shadow-red-950/40 transition-all flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Deleting...
              </>
            ) : (
              'Confirm Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
