const snippetService = require("../services/snippetService");

const getSnippets = (req, res) => {
    const snippets = snippetService.getAllSnippets();

    res.status(200).json({
        success: true,
        data: snippets
    });
};

const createSnippet = (req, res) => {

    const { title, language, code } = req.body;

    if (!title || !title.trim() ||
        !language || !language.trim() ||
        !code || !code.trim()) {

        return res.status(400).json({
            success: false,
            message: "Title, language and code are required"
        });
    }

    const newSnippet = snippetService.createSnippet(req.body);

    res.status(201).json({
        success: true,
        message: "Snippet created successfully",
        data: newSnippet
    });
};

module.exports = {
    getSnippets,
    createSnippet
};