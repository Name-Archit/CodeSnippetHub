const pool = require("../../config/db");

const createSnippet = async (snippetData) => {

    const result = await pool.query("INSERT INTO snippets (title, language, description, code) values ($1, $2, $3, $4) RETURNING *",
         [snippetData.title, snippetData.language, snippetData.description, snippetData.code]);
    return result.rows[0] || null;
};

const getAllSnippets = async () => {
    const result = await pool.query('SELECT * FROM snippets');
    return result.rows; 
};

const getSnippetByID = async (id) => {
    const result = await pool.query("SELECT * FROM snippets WHERE id = $1", [parseInt(id)]);
    return result.rows[0] || -1;
};

const getSnippetByLanguage = async ( language ) => {
    const result = await pool.query("SELECT * FROM snippets WHERE language = $1", [language]);
    return result.rows.length > 0 ? result : null;
}

const updateSnippet = async (id, updatedData) => {
    const result = await pool.query("UPDATE snippets SET title = $1, language = $2, description = $3, code = $4 WHERE id = $5 RETURNING *",
        [updatedData.title, updatedData.language, updatedData.description, updatedData.code, parseInt(id)]);

    return result.rows[0] || null;    
}

const deleteSnippet = async(id) => {
    const result = await pool.query("DELETE FROM snippets WHERE id = $1 RETURNING *", [parseInt(id)]);
    return result.rows[0] || null;
}

module.exports = {
    getAllSnippets,
    createSnippet,
    getSnippetByID,
    getSnippetByLanguage,
    updateSnippet,
    deleteSnippet
};