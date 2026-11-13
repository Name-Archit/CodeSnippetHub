require("dotenv").config();
const express = require("express");
const cors = require("cors");

const snippetRoutes = require("./routes/snippetRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/snippets", snippetRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CodeFlare API is LIVE and healthy 🚀"
    });
});

// 404 Catch-All Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
