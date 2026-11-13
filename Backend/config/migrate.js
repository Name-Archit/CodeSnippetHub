const pool = require('./db');

const migrateDatabase = async () => {
    try {
        console.log("Verifying PostgreSQL database tables and columns...");

        // 1. Create Users Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 2. Create Snippets Table
        await pool.query(`
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
        `);

        // 3. Safely add missing columns if snippets table already existed
        await pool.query(`
            ALTER TABLE snippets ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
            ALTER TABLE snippets ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
            ALTER TABLE snippets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
        `);

        // 4. Create Performance Indexes
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_snippets_user_id ON snippets (user_id);
            CREATE INDEX IF NOT EXISTS idx_snippets_language ON snippets (LOWER(language));
        `);

        console.log("PostgreSQL database tables and columns verified! ✅");
    } catch (error) {
        console.error("Database auto-migration warning:", error.message);
    }
};

module.exports = migrateDatabase;
