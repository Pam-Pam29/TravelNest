import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your_jwt_secret'
    ) as { id: string; email: string };

    // Add user to request object
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;

// Optional: Admin role middleware
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // In a real app, you'd check user's role from database
  if (req.user?.email !== 'admin@travenest.com') {
    return res.status(403).json({ message: 'Access denied. Admin rights required.' });
  }
  next();
};

