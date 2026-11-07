const express = require("express");
const router = express.Router();

const snippetController = require("../controllers/snippetController");

router.get("/", snippetController.getSnippets);

module.exports = router;