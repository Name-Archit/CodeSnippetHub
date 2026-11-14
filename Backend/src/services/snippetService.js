const pool = require("../../config/db");

/**
 * Strict Multi-Tenant Snippet Service:
 * Every operation requires a valid userId.
 * Users can only access, modify, and delete their own snippets.
 */

const createSnippet = async (snippetData, userId) => {
    const result = await pool.query(
        "INSERT INTO snippets (title, language, description, code, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [snippetData.title, snippetData.language, snippetData.description, snippetData.code, userId]
    );
    return result.rows[0] || null;
};

const getAllSnippets = async (userId) => {
    const result = await pool.query(
        "SELECT * FROM snippets WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
    );
    return result.rows; 
};

const getSnippetByID = async (id, userId) => {
    const result = await pool.query(
        "SELECT * FROM snippets WHERE id = $1 AND user_id = $2",
        [parseInt(id, 10), userId]
    );
    return result.rows[0] || null;
};

const getSnippetByLanguage = async (language, userId) => {
    const result = await pool.query(
        "SELECT * FROM snippets WHERE LOWER(language) = LOWER($1) AND user_id = $2 ORDER BY created_at DESC",
        [language, userId]
    );
    return result.rows;
};

const updateSnippet = async (id, updatedData, userId) => {
    const result = await pool.query(
        `UPDATE snippets 
         SET title = $1, language = $2, description = $3, code = $4, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $5 AND user_id = $6 
         RETURNING *`,
        [updatedData.title, updatedData.language, updatedData.description, updatedData.code, parseInt(id, 10), userId]
    );
    return result.rows[0] || null;    
};

const deleteSnippet = async (id, userId) => {
    const result = await pool.query(
        "DELETE FROM snippets WHERE id = $1 AND user_id = $2 RETURNING *",
        [parseInt(id, 10), userId]
    );
    return result.rows[0] || null;
};

module.exports = {
    getAllSnippets,
    createSnippet,
    getSnippetByID,
    getSnippetByLanguage,
    updateSnippet,
    deleteSnippet
};
