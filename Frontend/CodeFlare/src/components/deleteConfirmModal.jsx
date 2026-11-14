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
      <div className="w-full max-w-md bg-[#0b132b] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-xl shrink-0">
            ⚠️
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Delete Snippet</h3>
            <p className="text-sm text-slate-400">This action is permanent</p>
          </div>
        </div>

        <p className="text-base text-slate-300 leading-relaxed">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-white">"{snippetTitle}"</span>?
          This will permanently remove it from your PostgreSQL database.
        </p>

        <div className="flex justify-end gap-3.5 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-md shadow-red-950/40 transition-all flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
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
