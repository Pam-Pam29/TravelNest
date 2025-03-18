// api/packages/index.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../../utils/dbConnect';
// Import your Package model
import Package from '../../src/models/Package';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const packages = await Package.find({});
        res.status(200).json(packages);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching packages' });
      }
      break;
    
    case 'POST':
      try {
        const newPackage = new Package(req.body);
        await newPackage.save();
        res.status(201).json(newPackage);
      } catch (error) {
        res.status(500).json({ message: 'Error creating package' });
      }
      break;
    
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}