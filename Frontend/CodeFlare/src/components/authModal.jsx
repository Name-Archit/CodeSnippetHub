import React, { useState } from 'react';

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess
}) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && (!formData.username || formData.username.trim().length < 3)) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSuccess({
        mode,
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0b132b] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800 bg-[#080d1a]">
          <div className="flex items-center gap-2.5">
            <span className="text-red-500 font-bold text-lg">&lt;/&gt;</span>
            <h2 className="text-lg font-bold text-white">
              {mode === 'login' ? 'Sign In to CodeFlare' : 'Create CodeFlare Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4.5">
          {error && (
            <div className="p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl text-sm text-red-300">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                Username <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="e.g. alexrivera"
                className="w-full bg-[#121b35] border border-slate-800 rounded-xl px-4 py-2.5 text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors shadow-inner"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="developer@example.com"
              className="w-full bg-[#121b35] border border-slate-800 rounded-xl px-4 py-2.5 text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors shadow-inner"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">
              Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              className="w-full bg-[#121b35] border border-slate-800 rounded-xl px-4 py-2.5 text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors shadow-inner"
            />
            <p className="text-xs text-slate-400 mt-1.5">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-md shadow-red-950/40 transition-all flex items-center justify-center gap-2 mt-3"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </>
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center pt-3">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-slate-400 hover:text-red-400 transition-colors"
            >
              {mode === 'login' ? (
                <>Don't have an account? <span className="text-red-400 font-semibold underline ml-1">Sign up</span></>
              ) : (
                <>Already have an account? <span className="text-red-400 font-semibold underline ml-1">Sign in</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
