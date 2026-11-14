const express = require("express");
const router = express.Router();

const snippetController = require("../controllers/snippetController");
const { requireAuth } = require("../middlewares/authMiddleware");

// Enforce authentication on ALL snippet endpoints
// No user can view, create, edit, or delete snippets without a valid JWT token
router.use(requireAuth);

// GET all snippets for the logged-in user
router.get("/", snippetController.getSnippets);

// POST create a new snippet for the logged-in user
router.post("/", snippetController.createSnippet);

// GET a snippet by ID (must belong to logged-in user)
router.get("/:id", snippetController.getSnippetByID);

// GET snippets by language (must belong to logged-in user)
router.get("/language/:language", snippetController.getSnippetByLanguage);

// PUT update a snippet by ID (must belong to logged-in user)
router.put("/:id", snippetController.updateSnippet);

// DELETE a snippet by ID (must belong to logged-in user)
router.delete("/:id", snippetController.deleteSnippet);

module.exports = router;
