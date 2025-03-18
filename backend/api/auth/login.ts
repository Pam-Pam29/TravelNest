// api/auth/login.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../utils/dbConnect';
// Import your User model
import User from '../../src/models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { email, password } = req.body;
    // Your login logic here
    // ...

    res.status(200).json({ token: 'your-token', user: { /* user data */ } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
}