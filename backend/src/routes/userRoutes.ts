// src/routes/userRoutes.ts
import express from 'express';
import User from '../models/User';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
