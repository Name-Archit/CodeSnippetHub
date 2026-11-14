// API Service Layer for CodeFlare
const TOKEN_KEY = 'codeflare_auth_token';

/**
 * Robust Base API URL Resolution:
 * - On any public domain (e.g. codeflare-seven.vercel.app), ALWAYS routes to Render backend.
 * - On localhost or 127.0.0.1 (npm run dev), routes to local Express server on port 5000.
 */
export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    // When running on Vercel or any non-localhost host:
    if (!isLocalhost) {
      const envUrl = import.meta.env.VITE_API_BASE_URL;
      // Only use envUrl if it's not pointing to localhost
      if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
        return envUrl;
      }
      return 'https://codesnippethub.onrender.com/api';
    }
  }

  // Local development (npm run dev)
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
}

/**
 * Standard fetch wrapper with JWT header injection and error handling
 */
async function request(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  // Retrieve token if present in localStorage
  const token = localStorage.getItem(TOKEN_KEY);

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint} (Target: ${baseUrl}):`, error.message);
    throw error;
  }
}

export const api = {
  // Base URL inspector
  getBaseUrl() {
    return getApiBaseUrl();
  },

  // --- AUTHENTICATION APIS ---

  async register({ username, email, password }) {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
    if (res.data?.token) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
    }
    return res.data;
  },

  async login({ email, password }) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.data?.token) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
    }
    return res.data;
  },

  async getMe() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const res = await request('/auth/me');
    return res.data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },

  // --- SNIPPET CRUD APIS ---

  async getSnippets() {
    const res = await request('/snippets');
    return res.data || [];
  },

  async getSnippetById(id) {
    const res = await request(`/snippets/${id}`);
    return res.data;
  },

  async getSnippetsByLanguage(language) {
    const res = await request(`/snippets/language/${encodeURIComponent(language)}`);
    return res.data || [];
  },

  async createSnippet(snippetData) {
    const res = await request('/snippets', {
      method: 'POST',
      body: JSON.stringify(snippetData)
    });
    return res.data;
  },

  async updateSnippet(id, snippetData) {
    const res = await request(`/snippets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(snippetData)
    });
    return res.data;
  },

  async deleteSnippet(id) {
    const res = await request(`/snippets/${id}`, {
      method: 'DELETE'
    });
    return res.data;
  }
};
