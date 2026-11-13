import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/sidebar';
import SnippetFeed from './components/snippetFeed';
import CodeViewer from './components/codeViewer';
import SnippetModal from './components/snippetModal';
import DeleteConfirmModal from './components/deleteConfirmModal';
import { api } from './services/api';
import { SAMPLE_SNIPPETS } from './mockData';

export default function App() {
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingMock, setIsUsingMock] = useState(false);

  // Modal State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch snippets from live backend
  const fetchSnippets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSnippets();
      setSnippets(data);
      setIsUsingMock(false);

      setSelectedSnippet((prev) => {
        if (!data || data.length === 0) return null;
        if (prev) {
          const match = data.find((s) => s.id === prev.id);
          if (match) return match;
        }
        return data[0];
      });
    } catch (err) {
      console.warn('Backend fetch failed:', err.message);
      setError(
        `Could not connect to backend at http://localhost:5000 (${err.message}). Is the backend server running?`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  // Fallback to sample mock data if backend is offline during early testing
  const handleUseMockData = () => {
    setSnippets(SAMPLE_SNIPPETS);
    setSelectedSnippet(SAMPLE_SNIPPETS[0]);
    setError(null);
    setIsUsingMock(true);
    showToast('Loaded local sample snippets', 'info');
  };

  // CREATE Action
  const handleOpenCreate = () => {
    setModalMode('create');
    setIsModalOpen(true);
  };

  // EDIT Action
  const handleOpenEdit = (snippetToEdit) => {
    const target = snippetToEdit || selectedSnippet;
    if (!target) return;
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // DELETE Trigger
  const handleOpenDelete = (snippetToDelete) => {
    const target = snippetToDelete || selectedSnippet;
    if (!target) return;
    setIsDeleteOpen(true);
  };

  // Save (Create or Update)
  const handleModalSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        const newSnippet = await api.createSnippet(formData);
        setSnippets((prev) => [newSnippet, ...prev]);
        setSelectedSnippet(newSnippet);
        showToast('Snippet created successfully! 🚀');
      } else {
        const updated = await api.updateSnippet(selectedSnippet.id, formData);
        setSnippets((prev) =>
          prev.map((s) => (s.id === selectedSnippet.id ? updated : s))
        );
        setSelectedSnippet(updated);
        showToast('Snippet updated successfully! ✨');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save snippet:', err);
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!selectedSnippet) return;
    setIsDeleting(true);
    try {
      await api.deleteSnippet(selectedSnippet.id);
      const remaining = snippets.filter((s) => s.id !== selectedSnippet.id);
      setSnippets(remaining);
      setSelectedSnippet(remaining.length > 0 ? remaining[0] : null);
      setIsDeleteOpen(false);
      showToast('Snippet deleted successfully 🗑');
    } catch (err) {
      console.error('Failed to delete snippet:', err);
      showToast(`Error deleting snippet: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans bg-[#080d1a] relative">
      {/* 1. Left Sidebar */}
      <Sidebar
        onCreateClick={handleOpenCreate}
        onUpdateClick={() => handleOpenEdit()}
        onDeleteClick={() => handleOpenDelete()}
        hasSelectedSnippet={Boolean(selectedSnippet)}
      />

      {/* 2. Middle Snippet Feed */}
      <SnippetFeed
        snippets={snippets}
        selectedSnippet={selectedSnippet}
        onSelectSnippet={setSelectedSnippet}
        loading={loading}
        error={error}
        onRetry={fetchSnippets}
      />

      {/* 3. Right Code Viewer */}
      <CodeViewer
        snippet={selectedSnippet}
        onEditSnippet={handleOpenEdit}
        onDeleteSnippet={handleOpenDelete}
      />

      {/* Create / Edit Modal */}
      <SnippetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={modalMode === 'edit' ? selectedSnippet : null}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        snippetTitle={selectedSnippet?.title}
        isDeleting={isDeleting}
      />

      {/* Offline Fallback Banner */}
      {error && !isUsingMock && (
        <div className="fixed top-4 right-4 bg-[#121b35] border border-red-500/40 text-slate-200 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-4 z-50">
          <div>
            <p className="font-semibold text-red-400">Backend Server Offline</p>
            <p className="text-[11px] text-slate-400">Start your backend: cd Backend && npm run dev</p>
          </div>
          <button
            onClick={handleUseMockData}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Load Sample Data
          </button>
        </div>
      )}

      {/* Global Notification Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl border text-xs font-semibold shadow-2xl backdrop-blur-md transition-all flex items-center gap-2 ${
            toast.type === 'error'
              ? 'bg-red-950/80 border-red-500/60 text-red-200'
              : toast.type === 'info'
              ? 'bg-blue-950/80 border-blue-500/60 text-blue-200'
              : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
          }`}
        >
          <span>{toast.type === 'error' ? '❌' : toast.type === 'info' ? 'ℹ️' : '✓'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
