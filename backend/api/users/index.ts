// api/users/index.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../utils/dbConnect';
// Import your User model
import User from '../../src/models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        // Exclude password from response
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
      }
      break;
    
    case 'POST':
      try {
        // This should be restricted since users should register through auth/register
        return res.status(403).json({ message: 'Please use the registration endpoint' });
      } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
      }
      break;
    
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}