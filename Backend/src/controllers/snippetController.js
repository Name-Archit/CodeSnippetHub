const snippetService = require("../services/snippetService");

const getSnippets = (req, res) => {
    const snippets = snippetService.getAllSnippets();

    res.status(200).json({
        success: true,
        data: snippets
    });
};

module.exports = {
    getSnippets
};