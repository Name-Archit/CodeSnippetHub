// API Service Layer for CodeFlare
// Base API URL can be overridden via Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Standard fetch wrapper with error handling and JSON parsing
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const json = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = json?.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMsg);
    }

    return json;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  /**
   * Fetch all snippets
   */
  async getSnippets() {
    const res = await request('/snippets');
    return res.data || [];
  },

  /**
   * Fetch a single snippet by ID
   */
  async getSnippetById(id) {
    const res = await request(`/snippets/${id}`);
    return res.data;
  },

  /**
   * Fetch snippets filtered by language
   */
  async getSnippetsByLanguage(language) {
    const res = await request(`/snippets/language/${encodeURIComponent(language)}`);
    return res.data || [];
  },

  /**
   * Create a new snippet
   */
  async createSnippet(snippetData) {
    const res = await request('/snippets', {
      method: 'POST',
      body: JSON.stringify(snippetData)
    });
    return res.data;
  },

  /**
   * Update an existing snippet
   */
  async updateSnippet(id, snippetData) {
    const res = await request(`/snippets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(snippetData)
    });
    return res.data;
  },

  /**
   * Delete a snippet
   */
  async deleteSnippet(id) {
    const res = await request(`/snippets/${id}`, {
      method: 'DELETE'
    });
    return res.data;
  }
};
