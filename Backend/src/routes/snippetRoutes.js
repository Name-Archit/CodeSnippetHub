const express = require("express");
const router = express.Router();

const snippetController = require("../controllers/snippetController");

// GET all snippets
router.get("/", snippetController.getSnippets);

// POST a new snippet
router.post("/", snippetController.createSnippet);

// GET a snippet by ID
router.get("/:id", snippetController.getSnippetByID);

//GET a snippet by language
router.get("/language/:language", snippetController.getSnippetByLanguage);

module.exports = router;