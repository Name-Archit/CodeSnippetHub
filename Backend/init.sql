-- CodeFlare Database Initialization Script
-- Database: codeSnippetHub

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Snippets Table (with user_id reference)
CREATE TABLE IF NOT EXISTS snippets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    language VARCHAR(50) NOT NULL,
    description TEXT,
    code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Migration safety check: add user_id column if table already existed without it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'snippets' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE snippets ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 4. Fast Query Indexes
CREATE INDEX IF NOT EXISTS idx_snippets_user_id ON snippets (user_id);
CREATE INDEX IF NOT EXISTS idx_snippets_language ON snippets (LOWER(language));
