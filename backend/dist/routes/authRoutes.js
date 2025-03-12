"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// User Registration
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const user = new User_1.default({
            email,
            password,
            firstName,
            lastName
        });
        await user.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});
// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});
exports.default = router;
