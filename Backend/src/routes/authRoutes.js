const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { requireAuth } = require("../middlewares/authMiddleware");

// Public Auth Endpoints
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected Profile Endpoint
router.get("/me", requireAuth, authController.getMe);

module.exports = router;
