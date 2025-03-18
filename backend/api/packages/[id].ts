// api/packages/[id].ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../utils/dbConnect';
// Import your Package model
import Package from '../../src/models/Package';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const pkg = await Package.findById(id);
        if (!pkg) {
          return res.status(404).json({ message: 'Package not found' });
        }
        res.status(200).json(pkg);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching package' });
      }
      break;
    
    case 'PUT':
      try {
        const updatedPackage = await Package.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPackage) {
          return res.status(404).json({ message: 'Package not found' });
        }
        res.status(200).json(updatedPackage);
      } catch (error) {
        res.status(500).json({ message: 'Error updating package' });
      }
      break;
    
    case 'DELETE':
      try {
        const deletedPackage = await Package.findByIdAndDelete(id);
        if (!deletedPackage) {
          return res.status(404).json({ message: 'Package not found' });
        }
        res.status(200).json({ message: 'Package deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting package' });
      }
      break;
    
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}