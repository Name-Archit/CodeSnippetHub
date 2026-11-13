import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Import essential languages
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-css';

const LANGUAGE_MAP = {
  javascript: 'javascript',
  js: 'javascript',
  react: 'jsx',
  jsx: 'jsx',
  typescript: 'typescript',
  ts: 'typescript',
  tsx: 'jsx',
  python: 'python',
  py: 'python',
  go: 'go',
  golang: 'go',
  rust: 'rust',
  rs: 'rust',
  sql: 'sql',
  bash: 'bash',
  shell: 'bash',
  sh: 'bash',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  css: 'css',
  html: 'markup',
  'html/css': 'markup'
};

/**
 * Normalizes user language string to Prism grammar identifier
 */
export function getPrismLanguage(rawLang) {
  if (!rawLang) return 'javascript';
  const clean = rawLang.toLowerCase().trim();
  return LANGUAGE_MAP[clean] || 'javascript';
}

/**
 * Safely highlight code string and return HTML
 */
export function highlightSnippet(code, language) {
  if (!code) return '';
  const prismLang = getPrismLanguage(language);
  const grammar = Prism.languages[prismLang] || Prism.languages.javascript;
  try {
    return Prism.highlight(code, grammar, prismLang);
  } catch (err) {
    console.warn(`Prism highlighting failed for ${language}:`, err);
    return code;
  }
}

export default Prism;
