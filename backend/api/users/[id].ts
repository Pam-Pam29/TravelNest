// api/users/[id].ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../utils/dbConnect';
// Import your User model
import User from '../../src/models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const user = await User.findById(id).select('-password');
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
      }
      break;
    
    case 'PUT':
      try {
        // Here you might want to add authorization checks
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { 
          new: true,
          runValidators: true
        }).select('-password');
        
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
      }
      break;
    
    case 'DELETE':
      try {
        // Here you might want to add authorization checks
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
      }
      break;
    
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}