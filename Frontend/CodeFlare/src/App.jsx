import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/sidebar';
import SnippetFeed from './components/snippetFeed';
import CodeViewer from './components/codeViewer';
import { api } from './services/api';
import { SAMPLE_SNIPPETS } from './mockData';

export default function App() {
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingMock, setIsUsingMock] = useState(false);

  // Fetch snippets from live backend
  const fetchSnippets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSnippets();
      setSnippets(data);
      setIsUsingMock(false);

      // Keep selection or default to first item
      setSelectedSnippet((prev) => {
        if (!data || data.length === 0) return null;
        if (prev) {
          const match = data.find((s) => s.id === prev.id);
          if (match) return match;
        }
        return data[0];
      });
    } catch (err) {
      console.warn('Backend fetch failed, offering fallback:', err.message);
      setError(
        `Could not connect to backend server at http://localhost:5000 (${err.message}). Is the backend running?`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  // Fallback to mock data if backend is offline during local dev
  const handleUseMockData = () => {
    setSnippets(SAMPLE_SNIPPETS);
    setSelectedSnippet(SAMPLE_SNIPPETS[0]);
    setError(null);
    setIsUsingMock(true);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans bg-[#080d1a]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Snippet Feed */}
      <SnippetFeed
        snippets={snippets}
        selectedSnippet={selectedSnippet}
        onSelectSnippet={setSelectedSnippet}
        loading={loading}
        error={error}
        onRetry={fetchSnippets}
      />

      {/* Right Code Inspection Pane */}
      <CodeViewer snippet={selectedSnippet} />

      {/* Offline / Mock Warning Toast */}
      {isUsingMock && (
        <div className="fixed bottom-4 right-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 backdrop-blur-md">
          <span>⚠️ Showing local mock data (Backend offline)</span>
          <button
            onClick={fetchSnippets}
            className="underline hover:text-white font-medium"
          >
            Reconnect
          </button>
        </div>
      )}
    </div>
  );
}
