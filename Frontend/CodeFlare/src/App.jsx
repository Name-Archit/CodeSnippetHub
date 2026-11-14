import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/sidebar';
import SnippetFeed from './components/snippetFeed';
import CodeViewer from './components/codeViewer';
import SnippetModal from './components/snippetModal';
import DeleteConfirmModal from './components/deleteConfirmModal';
import AuthModal from './components/authModal';
import { api } from './services/api';
import { SAMPLE_SNIPPETS } from './mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Responsive Navigation State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('feed'); // 'feed' | 'viewer'

  const [snippets, setSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingMock, setIsUsingMock] = useState(false);

  // Modal State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Global Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Initial user session verification
  useEffect(() => {
    async function loadUserSession() {
      try {
        const user = await api.getMe();
        if (user) {
          setCurrentUser(user);
        }
      } catch (err) {
        console.warn('Session verification failed or expired:', err.message);
        api.logout();
      }
    }
    loadUserSession();
  }, []);

  // Fetch snippets for current user context
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
  }, [fetchSnippets, currentUser]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setIsDeleteOpen(false);
        setIsAuthModalOpen(false);
        setIsMobileSidebarOpen(false);
      }
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setModalMode('create');
        setIsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // When a snippet is clicked on mobile, automatically navigate to viewer tab
  const handleSelectSnippet = (snippet) => {
    setSelectedSnippet(snippet);
    setMobileTab('viewer');
  };

  // Auth Handlers
  const handleAuthSuccess = async ({ mode, username, email, password }) => {
    if (mode === 'register') {
      const res = await api.register({ username, email, password });
      setCurrentUser(res.user);
      showToast(`Welcome to CodeFlare, ${res.user.username}! 🚀`);
    } else {
      const res = await api.login({ email, password });
      setCurrentUser(res.user);
      showToast(`Welcome back, ${res.user.username}! 👋`);
    }
    fetchSnippets();
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    showToast('Signed out successfully', 'info');
    fetchSnippets();
  };

  // Fallback to sample mock data
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

  // Submit Create or Update
  const handleModalSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        const newSnippet = await api.createSnippet(formData);
        setSnippets((prev) => [newSnippet, ...prev]);
        setSelectedSnippet(newSnippet);
        setMobileTab('viewer');
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
      setMobileTab('feed');
      showToast('Snippet deleted successfully 🗑');
    } catch (err) {
      console.error('Failed to delete snippet:', err);
      showToast(`Error deleting snippet: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans bg-[#080d1a] relative">
      {/* Mobile Top App Bar (Visible on mobile & tablets < 1024px) */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#080d1a] border-b border-slate-800 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Open menu"
          >
            <span className="text-xl">☰</span>
          </button>
          <div className="flex items-center gap-1.5 text-red-500 font-bold text-lg tracking-wider">
            <span className="font-mono">&lt;/&gt;</span> CODEFLARE
          </div>
        </div>

        {/* Mobile View Toggle Pills (Only on small screens < 768px) */}
        <div className="flex md:hidden items-center bg-[#0d1527] border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setMobileTab('feed')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
              mobileTab === 'feed'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setMobileTab('viewer')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium ${
              mobileTab === 'viewer'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Code
          </button>
        </div>

        <button
          onClick={handleOpenCreate}
          className="p-1.5 sm:px-3 sm:py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-semibold hover:bg-red-600/30 transition-all flex items-center gap-1"
        >
          <span>+</span> <span className="hidden sm:inline">New</span>
        </button>
      </header>

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* 1. Sidebar (Desktop Persistent + Mobile Drawer) */}
        <Sidebar
          user={currentUser}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onCreateClick={handleOpenCreate}
          onUpdateClick={() => handleOpenEdit()}
          onDeleteClick={() => handleOpenDelete()}
          hasSelectedSnippet={Boolean(selectedSnippet)}
        />

        {/* 2. Middle Snippet Feed (Primary generous workspace) */}
        <SnippetFeed
          snippets={snippets}
          selectedSnippet={selectedSnippet}
          onSelectSnippet={handleSelectSnippet}
          loading={loading}
          error={error}
          onRetry={fetchSnippets}
          className={`
            ${mobileTab === 'feed' ? 'flex flex-1' : 'hidden'}
            md:flex md:w-[55%] lg:w-auto lg:flex-1
          `}
        />

        {/* 3. Right Code Viewer (Balanced 33%-38% inspection pane) */}
        <CodeViewer
          snippet={selectedSnippet}
          onEditSnippet={handleOpenEdit}
          onDeleteSnippet={handleOpenDelete}
          onBack={() => setMobileTab('feed')}
          className={`
            ${mobileTab === 'viewer' ? 'flex flex-1' : 'hidden'}
            md:flex md:w-[45%] lg:w-[38%] xl:w-[35%] 2xl:w-[33%]
          `}
        />
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
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
        <div className="fixed top-16 sm:top-4 right-4 bg-[#121b35] border border-red-500/40 text-slate-200 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50">
          <div>
            <p className="font-semibold text-red-400">Backend Server Offline</p>
            <p className="text-[11px] text-slate-400">Run: cd Backend && npm run dev</p>
          </div>
          <button
            onClick={handleUseMockData}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors shrink-0"
          >
            Mock Data
          </button>
        </div>
      )}

      {/* Global Notification Toast */}
      {toast && (
        <div
          className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 px-4 py-2.5 rounded-xl border text-xs font-semibold shadow-2xl backdrop-blur-md transition-all flex items-center gap-2 max-w-[90vw] ${
            toast.type === 'error'
              ? 'bg-red-950/80 border-red-500/60 text-red-200'
              : toast.type === 'info'
              ? 'bg-blue-950/80 border-blue-500/60 text-blue-200'
              : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
          }`}
        >
          <span>{toast.type === 'error' ? '❌' : toast.type === 'info' ? 'ℹ️' : '✓'}</span>
          <span className="truncate">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
