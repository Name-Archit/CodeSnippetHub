import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import SnippetFeed from './components/snippetFeed';
import CodeViewer from './components/codeViewer';
import { SAMPLE_SNIPPETS } from './mockData';

export default function App() {
  const [snippets] = useState(SAMPLE_SNIPPETS);
  const [selectedSnippet, setSelectedSnippet] = useState(SAMPLE_SNIPPETS[0]);

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans">
      <Sidebar />
      <SnippetFeed
        snippets={snippets}
        selectedSnippet={selectedSnippet}
        onSelectSnippet={setSelectedSnippet}
      />
      <CodeViewer snippet={selectedSnippet} />
    </div>
  );
}