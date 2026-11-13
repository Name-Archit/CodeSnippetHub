const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "codeflare_super_secret_jwt_key_2026";

/**
 * Strict Auth Middleware: Rejects unauthorized requests
 */
const requireAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please sign in."
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded; // { id, email, username }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session. Please sign in again."
        });
    }
};

/**
 * Optional Auth Middleware: Attaches req.user if token is present, continues otherwise
 */
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        }
    } catch {
        // Silently ignore invalid token in optional mode
    }
    next();
};

module.exports = {
    requireAuth,
    optionalAuth
};
