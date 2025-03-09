const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private
exports.getBookings = asyncHandler(async (req, res, next) => {
  let query;

  // If user is not admin, show only their bookings
  if (req.user.role !== 'admin') {
    query = Booking.find({ user: req.user.id }).populate({
      path: 'package',
      select: 'title destination price'
    });
  } else {
    query = Booking.find().populate({
      path: 'package',
      select: 'title destination price'
    }).populate({
      path: 'user',
      select: 'name email'
    });
  }

  const bookings = await query;

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate({
      path: 'package',
      select: 'title description price itinerary images'
    })
    .populate({
      path: 'user',
      select: 'name email'
    });

  if (!booking) {
    return next(
      new ErrorResponse(`No booking found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this booking`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Create booking
// @route   POST /api/v1/bookings
// @access  Private
exports.addBooking = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const package = await Package.findById(req.body.package);

  if (!package) {
    return next(
      new ErrorResponse(`No package found with id of ${req.body.package}`, 404)
    );
  }

  // Calculate total price
  req.body.totalPrice = package.price * req.body.numberOfTravelers;

  const booking = await Booking.create(req.body);

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Process payment
// @route   POST /api/v1/bookings/:id/payment
// @access  Private
exports.processPayment = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate({
    path: 'package',
     select: 'title price'
  });

  if (!booking) {
    return next(
      new ErrorResponse(`No booking found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is booking owner
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to pay for this booking`,
        401
      )
    );
  }

  // Create payment intent with Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: booking.totalPrice * 100, // Stripe expects amount in cents
    currency: 'usd',
    metadata: {
      bookingId: booking._id.toString(),
      packageTitle: booking.package.title
    }
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret
  });
});
