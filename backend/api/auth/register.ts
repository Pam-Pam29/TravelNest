// api/auth/register.ts
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
    
    const { name, email, password } = req.body;
    // Your registration logic here
    // ...

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
}