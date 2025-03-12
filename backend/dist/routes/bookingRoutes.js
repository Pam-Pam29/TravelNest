"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Booking_1 = __importDefault(require("../models/Booking"));
const Package_1 = __importDefault(require("../models/Package"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
// Create a new booking
router.post('/', authMiddleware_1.default, async (req, res) => {
    try {
        const { packageId, travelDate, numberOfTravelers } = req.body;
        // Find the package
        const travelPackage = await Package_1.default.findById(packageId);
        if (!travelPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }
        // Check package availability
        if (travelPackage.availability < numberOfTravelers) {
            return res.status(400).json({ message: 'Not enough availability for this package' });
        }
        // Calculate total price
        const totalPrice = travelPackage.price * numberOfTravelers;
        // Create booking
        const newBooking = new Booking_1.default({
            user: req.user?.id,
            package: packageId,
            travelDate: new Date(travelDate),
            totalPrice,
            numberOfTravelers
        });
        // Save booking
        await newBooking.save();
        // Update package availability
        travelPackage.availability -= numberOfTravelers;
        await travelPackage.save();
        // Populate booking with package details
        await newBooking.populate('package');
        res.status(201).json(newBooking);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating booking' });
    }
});
// Get user's bookings
router.get('/', authMiddleware_1.default, async (req, res) => {
    try {
        const bookings = await Booking_1.default.find({ user: req.user?.id })
            .populate('package')
            .sort({ bookingDate: -1 });
        res.json(bookings);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});
// Cancel a booking
router.patch('/:id/cancel', authMiddleware_1.default, async (req, res) => {
    try {
        const booking = await Booking_1.default.findOneAndUpdate({
            _id: req.params.id,
            user: req.user?.id,
            status: { $ne: 'Cancelled' }
        }, {
            status: 'Cancelled',
            paymentStatus: 'Refunded'
        }, { new: true }).populate('package');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or already cancelled' });
        }
        // Restore package availability
        await Package_1.default.findByIdAndUpdate(booking.package._id, { $inc: { availability: booking.numberOfTravelers } });
        res.json(booking);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error cancelling booking' });
    }
});
exports.default = router;
