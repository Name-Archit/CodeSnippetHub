import React, { useState, useEffect } from 'react';

const POPULAR_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Go',
  'Rust',
  'React',
  'HTML/CSS',
  'SQL',
  'Java',
  'C++',
  'Bash/Shell',
  'JSON',
  'YAML',
  'Other'
];

export default function SnippetModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false
}) {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    title: '',
    language: 'JavaScript',
    description: '',
    code: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        language: initialData.language || 'JavaScript',
        description: initialData.description || '',
        code: initialData.code || ''
      });
    } else {
      setFormData({
        title: '',
        language: 'JavaScript',
        description: '',
        code: ''
      });
    }
    setFormErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.language.trim()) errors.language = 'Language is required';
    if (!formData.code.trim()) errors.code = 'Code content cannot be empty';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#0b132b] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080d1a]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-red-500">{isEditing ? '✎' : '+'}</span>
            {isEditing ? 'Update Code Snippet' : 'Create New Snippet'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-white transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Title & Language Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Snippet Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Debounce Utility Hook"
                className={`w-full bg-[#121b35] border ${
                  formErrors.title ? 'border-red-500' : 'border-slate-800'
                } rounded-lg px-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors`}
              />
              {formErrors.title && (
                <p className="text-xs text-red-400 mt-1">{formErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Language <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className="w-full bg-[#121b35] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500 transition-colors"
              >
                {POPULAR_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="bg-[#121b35] text-slate-200">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description <span className="text-xs text-slate-500">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="What does this snippet do or when should you use it?"
              className="w-full bg-[#121b35] border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Code Body */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Code Snippet <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {formData.code.split('\n').length} lines
              </span>
            </div>
            <textarea
              rows={10}
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder="// Paste or write your reusable code snippet here..."
              className={`w-full bg-[#050811] border ${
                formErrors.code ? 'border-red-500' : 'border-slate-800'
              } rounded-xl p-3.5 text-xs text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-red-500 leading-relaxed transition-colors resize-y`}
            />
            {formErrors.code && (
              <p className="text-xs text-red-400 mt-1">{formErrors.code}</p>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md shadow-red-950/40 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Snippet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
