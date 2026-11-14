const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");

const pool = require("../config/db");
const migrateDatabase = require("../config/migrate");
const authRoutes = require("./routes/authRoutes");
const snippetRoutes = require("./routes/snippetRoutes");

const app = express();

// Allowed Origins for CORS (Localhost + Vercel Deployment)
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://codeflare-seven.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app") ||
            origin.includes("localhost") ||
            origin.includes("127.0.0.1")
        ) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/snippets", snippetRoutes);

// Health check with database diagnostic report
app.get("/", async (req, res) => {
    let dbStatus = "connected";
    let dbError = null;

    try {
        await pool.query("SELECT NOW()");
    } catch (err) {
        dbStatus = "disconnected";
        dbError = err.message;
    }

    res.json({
        success: true,
        message: "CodeFlare API is LIVE 🚀",
        database: {
            status: dbStatus,
            usingDatabaseUrl: Boolean(process.env.DATABASE_URL),
            error: dbError
        },
        timestamp: new Date().toISOString()
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

// Initialize Database Schema on Boot and Start Server
const startServer = async () => {
    await migrateDatabase();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
