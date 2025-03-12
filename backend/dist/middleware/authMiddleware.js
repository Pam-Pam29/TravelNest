"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        // Add user to request object
        req.user = {
            id: decoded.id,
            email: decoded.email
        };
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
exports.default = authMiddleware;
// Optional: Admin role middleware
const adminMiddleware = (req, res, next) => {
    // In a real app, you'd check user's role from database
    if (req.user?.email !== 'admin@travenest.com') {
        return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
