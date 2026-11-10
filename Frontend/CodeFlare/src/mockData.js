export const SAMPLE_SNIPPETS = [
  {
    id: 1,
    title: "React Auth Hook",
    language: "React",
    updatedAt: "Oct 26, 2026",
    description: "A custom hook for managing user authentication and state in React applications.",
    code: `const useAuth = () => {\n  const state = state.state();\n  const login = state.login();\n  return { state, login };\n};`,
  },
  {
    id: 2,
    title: "Go API Handler",
    language: "Go",
    updatedAt: "Oct 25, 2026",
    description: "Clean and efficient API route handler for a Go web server.",
    code: `func handleRoutes(w http.ResponseWriter, r *http.Request) {\n  fmt.Fprintf(w, "Hello, API!")\n}`,
  },
  {
    id: 3,
    title: "Python Data Parser",
    language: "Python",
    updatedAt: "Oct 24, 2026",
    description: "A script for parsing complex JSON data structures using standard libraries.",
    code: `import json\n\ndef parse_data(raw_json):\n    return json.loads(raw_json)`,
  },
];