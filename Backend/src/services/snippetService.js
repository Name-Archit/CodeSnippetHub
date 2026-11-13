const pool = require("../../config/db");

const createSnippet = async (snippetData, userId = null) => {
    const result = await pool.query(
        "INSERT INTO snippets (title, language, description, code, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [snippetData.title, snippetData.language, snippetData.description, snippetData.code, userId]
    );
    return result.rows[0] || null;
};

const getAllSnippets = async (userId = null) => {
    let query = "SELECT * FROM snippets";
    let params = [];

    if (userId) {
        query += " WHERE user_id = $1 OR user_id IS NULL ORDER BY created_at DESC";
        params = [userId];
    } else {
        query += " ORDER BY created_at DESC";
    }

    const result = await pool.query(query, params);
    return result.rows; 
};

const getSnippetByID = async (id, userId = null) => {
    let query = "SELECT * FROM snippets WHERE id = $1";
    const params = [parseInt(id, 10)];

    if (userId) {
        query += " AND (user_id = $2 OR user_id IS NULL)";
        params.push(userId);
    }

    const result = await pool.query(query, params);
    return result.rows[0] || null;
};

const getSnippetByLanguage = async (language, userId = null) => {
    let query = "SELECT * FROM snippets WHERE LOWER(language) = LOWER($1)";
    const params = [language];

    if (userId) {
        query += " AND (user_id = $2 OR user_id IS NULL)";
        params.push(userId);
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    return result.rows;
};

const updateSnippet = async (id, updatedData, userId = null) => {
    let query = "UPDATE snippets SET title = $1, language = $2, description = $3, code = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5";
    const params = [updatedData.title, updatedData.language, updatedData.description, updatedData.code, parseInt(id, 10)];

    if (userId) {
        query += " AND (user_id = $6 OR user_id IS NULL)";
        params.push(userId);
    }

    query += " RETURNING *";

    const result = await pool.query(query, params);
    return result.rows[0] || null;    
};

const deleteSnippet = async (id, userId = null) => {
    let query = "DELETE FROM snippets WHERE id = $1";
    const params = [parseInt(id, 10)];

    if (userId) {
        query += " AND (user_id = $2 OR user_id IS NULL)";
        params.push(userId);
    }

    query += " RETURNING *";

    const result = await pool.query(query, params);
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
