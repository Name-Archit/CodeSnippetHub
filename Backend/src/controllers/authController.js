const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

const JWT_SECRET = process.env.JWT_SECRET || "codeflare_super_secret_jwt_key_2026";
const TOKEN_EXPIRY = "7d";

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
    );
};

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || username.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: "Username must be at least 3 characters long"
            });
        }

        if (!email || !email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "A valid email address is required"
            });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        const existingUser = await userService.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        const newUser = await userService.createUser({ username, email, password });
        const token = generateToken(newUser);

        return res.status(201).json({
            success: true,
            message: "Account created successfully! Welcome to CodeFlare 🚀",
            data: {
                user: newUser,
                token
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create account. Please try again later."
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await userService.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await userService.comparePassword(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const userSafe = {
            id: user.id,
            username: user.username,
            email: user.email,
            created_at: user.created_at
        };

        const token = generateToken(userSafe);

        return res.status(200).json({
            success: true,
            message: "Logged in successfully! 🚀",
            data: {
                user: userSafe,
                token
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication"
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await userService.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve user profile"
        });
    }
};

module.exports = {
    register,
    login,
    getMe
};
