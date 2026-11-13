const snippetService = require("../services/snippetService");

const getSnippets = async (req, res) => {
    try{
    const snippets = await snippetService.getAllSnippets();

    res.status(200).json({
        success: true,
        data: snippets
    });

    }catch(error){
        console.log("Error fetching snippets", error);
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null
        });
    }    
};

const createSnippet =async (req, res) => {
    try{
         const { title, language, code } = req.body;

    if (!title || !title.trim() ||
        !language || !language.trim() ||
        !code || !code.trim()) {

        return res.status(400).json({
            success: false,
            message: "Title, language and code are required"
        });
    }

    const newSnippet = await snippetService.createSnippet(req.body);

    res.status(201).json({
        success: true,
        message: "Snippet created successfully",
        data: newSnippet
    });

    }catch(error){
        console.log("Error fetching snippets", error);
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null
        });
    }   
};

const getSnippetByID = async (req, res) => { 
    try {
        const { id } = req.params;                
        const snippet = await snippetService.getSnippetByID(id); 

        if (!snippet) {
            return res.status(404).json({
                success: false,
                message: "THERE IS NO SNIPPET WITH THIS ID",
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

        if (!language || !language.trim()) {
            return res.status(400).json({
                success: false,
                message: "Language parameter is required",
                data: null
            });
        }

        const filteredSnippets = await snippetService.getSnippetByLanguage(language);

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
    try{
        const { id } = req.params;
        const { title, language, description, code } = req.body;

        const updateSnippet =await snippetService.updateSnippet(id, { title, language, description, code });

        if(!updateSnippet){
             return res.status(404).json({
            success: false,
            message: "Snippet not found not update took place",
            data: null
        });
      }

        res.status(200).json({
          success: true,
          message: "Snippet Updates successfully",
         data: updateSnippet
      });
    }catch(error){
         console.error("Error fetching snippet:", error);
            res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
};

const deleteSnippet = async (req, res) => {
    try{
         const { id } = req.params;
    const deleteSnippet = await snippetService.deleteSnippet(id);

    if(!deleteSnippet){
        return res.status(404).json({
            success: false,
            message: "Snippet not found no deletion took place",
            data: null
        });
    }

    res.status(200).json({
        success: true,
        message: "snippet deleted successfully",
        data: deleteSnippet
    });
    }catch(error){
         console.error("Error fetching snippet:", error);
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