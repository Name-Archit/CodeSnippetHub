// API Service Layer for CodeFlare
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'codeflare_auth_token';

/**
 * Standard fetch wrapper with JWT header injection and error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
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
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
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
