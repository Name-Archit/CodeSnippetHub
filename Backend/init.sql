CREATE TABLE IF NOT EXISTS snippets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    language VARCHAR(50) NOT NULL,
    description TEXT,
    code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast searching by programming language
CREATE INDEX IF NOT EXISTS idx_snippets_language ON snippets (LOWER(language));

-- Optional initial seed data
INSERT INTO snippets (title, language, description, code)
VALUES 
    ('React Auth Hook', 'React', 'A custom hook for managing user authentication and state in React applications.', 'const useAuth = () => {\n  const [user, setUser] = useState(null);\n  const login = (data) => setUser(data);\n  const logout = () => setUser(null);\n  return { user, login, logout };\n};'),
    ('Go API Handler', 'Go', 'Clean and efficient API route handler for a Go web server.', 'func handleRoutes(w http.ResponseWriter, r *http.Request) {\n  w.Header().Set("Content-Type", "application/json")\n  fmt.Fprintf(w, `{"status": "ok"}`)\n}'),
    ('Python Data Parser', 'Python', 'A script for parsing complex JSON data structures using standard libraries.', 'import json\n\ndef parse_data(raw_json):\n    try:\n        return json.loads(raw_json)\n    except json.JSONDecodeError as err:\n        print(f"Error parsing JSON: {err}")\n        return None')
ON CONFLICT DO NOTHING;
