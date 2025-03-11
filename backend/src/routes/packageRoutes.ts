import express from 'express';
import Package from '../models/Package';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Get all packages
router.get('/', async (req, res) => {
  try {
    const { 
      minPrice, 
      maxPrice, 
      destination, 
      duration 
    } = req.query;

    // Build filter object
    const filter: any = {};

    if (minPrice) filter.price = { $gte: Number(minPrice) };
    if (maxPrice) filter.price = { 
      ...filter.price, 
      $lte: Number(maxPrice) 
    };
    if (destination) {
      filter.destinations = { 
        $regex: destination as string, 
        $options: 'i' 
      };
    }
    if (duration) filter.duration = Number(duration);

    const packages = await Package.find(filter);
    res.json(packages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching packages' });
  }
});

// Get single package
router.get('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(package);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching package' });
  }
});

// Create package (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newPackage = new Package(req.body);
    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating package' });
  }
});

export default router;

