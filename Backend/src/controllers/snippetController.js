const snippetService = require("../services/snippetService");

const getSnippets = async (req, res) => {
    try {
        const userId = req.user?.id || null;
        const snippets = await snippetService.getAllSnippets(userId);

        res.status(200).json({
            success: true,
            data: snippets
        });
    } catch (error) {
        console.error("Error fetching snippets:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }    
};

const createSnippet = async (req, res) => {
    try {
        const { title, language, code, description } = req.body;
        const userId = req.user?.id || null;

        if (!title || !title.trim() || !language || !language.trim() || !code || !code.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title, language, and code are required"
            });
        }

        const newSnippet = await snippetService.createSnippet({
            title: title.trim(),
            language: language.trim(),
            description: description?.trim() || null,
            code
        }, userId);

        res.status(201).json({
            success: true,
            message: "Snippet created successfully",
            data: newSnippet
        });
    } catch (error) {
        console.error("Error creating snippet:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }   
};

const getSnippetByID = async (req, res) => { 
    try {
        const { id } = req.params;
        const userId = req.user?.id || null;
        const snippet = await snippetService.getSnippetByID(id, userId); 

        if (!snippet) {
            return res.status(404).json({
                success: false,
                message: "No snippet found with this ID",
                data: null
            });
        }

        res.status(200).json({
            success: true,
            message: "Snippet found successfully",
            data: snippet
        });
    } catch (error) {
        console.error("Error fetching snippet:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};

const getSnippetByLanguage = async (req, res) => {
    try {
        const { language } = req.params;
        const userId = req.user?.id || null;

        if (!language || !language.trim()) {
            return res.status(400).json({
                success: false,
                message: "Language parameter is required",
                data: null
            });
        }

        const filteredSnippets = await snippetService.getSnippetByLanguage(language, userId);

        if (filteredSnippets.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No snippets found for language: ${language}`,
                data: []
            });
        }

        res.status(200).json({
            success: true,
            message: "Snippets with specified language found successfully",
            data: filteredSnippets
        });
    } catch (error) {
        console.error("Error fetching snippets by language:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};

const updateSnippet = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, language, description, code } = req.body;
        const userId = req.user?.id || null;

        const updatedSnippet = await snippetService.updateSnippet(
            id,
            { title, language, description, code },
            userId
        );

        if (!updatedSnippet) {
            return res.status(404).json({
                success: false,
                message: "Snippet not found or you are not authorized to edit it",
                data: null
            });
        }

        res.status(200).json({
            success: true,
            message: "Snippet updated successfully",
            data: updatedSnippet
        });
    } catch (error) {
        console.error("Error updating snippet:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};

const deleteSnippet = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id || null;
        const deleted = await snippetService.deleteSnippet(id, userId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Snippet not found or you are not authorized to delete it",
                data: null
            });
        }

        res.status(200).json({
            success: true,
            message: "Snippet deleted successfully",
            data: deleted
        });
    } catch (error) {
        console.error("Error deleting snippet:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }   
};

module.exports = {
    getSnippets,
    createSnippet,
    getSnippetByID,
    getSnippetByLanguage,
    updateSnippet,
    deleteSnippet
};
