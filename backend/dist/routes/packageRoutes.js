"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Package_1 = __importDefault(require("../models/Package"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
// Get all packages
router.get('/', async (req, res) => {
    try {
        const { minPrice, maxPrice, destination, duration } = req.query;
        // Build filter object
        const filter = {};
        if (minPrice)
            filter.price = { $gte: Number(minPrice) };
        if (maxPrice) {
            filter.price = {
                ...filter.price,
                $lte: Number(maxPrice)
            };
        }
        if (destination) {
            filter.destinations = {
                $regex: destination,
                $options: 'i'
            };
        }
        if (duration)
            filter.duration = Number(duration);
        const travelPackages = await Package_1.default.find(filter);
        res.json(travelPackages);
    }
    catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({
            message: 'Error fetching packages',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get single package
router.get('/:id', async (req, res) => {
    try {
        const travelPackage = await Package_1.default.findById(req.params.id);
        if (!travelPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json(travelPackage);
    }
    catch (error) {
        console.error('Error fetching package:', error);
        res.status(500).json({
            message: 'Error fetching package',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Create package (admin only)
router.post('/', authMiddleware_1.default, async (req, res) => {
    try {
        const newTravelPackage = new Package_1.default(req.body);
        await newTravelPackage.save();
        res.status(201).json(newTravelPackage);
    }
    catch (error) {
        console.error('Error creating package:', error);
        res.status(500).json({
            message: 'Error creating package',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
