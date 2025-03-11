import express from 'express';
import Booking from '../models/Booking';
import Package from '../models/Package';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Create a new booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { 
      packageId, 
      travelDate, 
      numberOfTravelers 
    } = req.body;

    // Find the package
    const travelPackage = await Package.findById(packageId);
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
    const newBooking = new Booking({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Get user's bookings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user?.id })
      .populate('package')
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Cancel a booking
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { 
        _id: req.params.id, 
        user: req.user?.id,
        status: { $ne: 'Cancelled' }
      },
      { 
        status: 'Cancelled',
        paymentStatus: 'Refunded'
      },
      { new: true }
    ).populate('package');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or already cancelled' });
    }

    // Restore package availability
    await Package.findByIdAndUpdate(
      booking.package._id,
      { $inc: { availability: booking.numberOfTravelers } }
    );

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

export default router;
