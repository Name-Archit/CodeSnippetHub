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

const getSnippetByID = (req, res) => {
    const { id } = req.params;
    const snippetID = snippetService.getSnippetByID(id);

    if(!snippetID){
        return res.status(404).json({
            success: false,
            message: "THERE IS NO USER WITH THIS ID",
            data: null
        });
    }

    res.status(200).json({
        success: true,
        message: "snippet with user ID found successfully",
        data: snippetID
    });
};

const getSnippetByLanguage = (req, res) => {
    const { language } = req.params;
    const snippets = snippetService.getAllSnippets();

    const filteredSnippets = snippetService.getSnippetByLanguage(language);

    if(!language || !language.trim() || filteredSnippets.length === 0){
        return res.status(404).json({
            success: false,
            message: "No snippets found for the this language",
            data: null
        });
    }

    res.status(200).json({
        success: true,
        message: "snippets with specified language found successfully",
        data: filteredSnippets
    });
}

module.exports = {
    getSnippets,
    createSnippet,
    getSnippetByID,
    getSnippetByLanguage
};