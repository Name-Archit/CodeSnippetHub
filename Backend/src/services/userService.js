const pool = require("../../config/db");
const bcrypt = require("bcryptjs");

/**
 * Create a new user with hashed password
 */
const createUser = async ({ username, email, password }) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
        `INSERT INTO users (username, email, password_hash)
         VALUES ($1, LOWER($2), $3)
         RETURNING id, username, email, created_at`,
        [username.trim(), email.trim(), passwordHash]
    );

    return result.rows[0];
};

/**
 * Find user by email (includes password_hash for authentication)
 */
const findByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
        [email.trim()]
    );
    return result.rows[0] || null;
};

/**
 * Find user by ID (excludes password hash for safe profile retrieval)
 */
const findById = async (id) => {
    const result = await pool.query(
        "SELECT id, username, email, created_at FROM users WHERE id = $1",
        [parseInt(id, 10)]
    );
    return result.rows[0] || null;
};

/**
 * Verify plaintext password against stored hash
 */
const comparePassword = async (plainPassword, passwordHash) => {
    return bcrypt.compare(plainPassword, passwordHash);
};

module.exports = {
    createUser,
    findByEmail,
    findById,
    comparePassword
};
