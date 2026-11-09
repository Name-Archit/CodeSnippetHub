const express = require("express");
const router = express.Router();

const snippetController = require("../controllers/snippetController");

// GET all snippets
router.get("/", snippetController.getSnippets);

// POST a new snippet
router.post("/", snippetController.createSnippet);

module.exports = router;