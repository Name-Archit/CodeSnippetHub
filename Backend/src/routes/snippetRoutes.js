const express = require("express");
const router = express.Router();

const snippetController = require("../controllers/snippetController");
const { optionalAuth } = require("../middlewares/authMiddleware");

// Attach optionalAuth so req.user is extracted when Authorization header is provided
router.use(optionalAuth);

// GET all snippets
router.get("/", snippetController.getSnippets);

// POST a new snippet
router.post("/", snippetController.createSnippet);

// GET a snippet by ID
router.get("/:id", snippetController.getSnippetByID);

// GET a snippet by language
router.get("/language/:language", snippetController.getSnippetByLanguage);

// PUT update a snippet by ID
router.put("/:id", snippetController.updateSnippet);

// DELETE a snippet by ID
router.delete("/:id", snippetController.deleteSnippet);

module.exports = router;
