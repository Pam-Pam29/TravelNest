const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Package = require('../models/Package');

// @desc    Get all packages
// @route   GET /api/v1/packages
// @access  Public
exports.getPackages = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = Package.find(JSON.parse(queryStr))
    .populate('accommodationDetails')
    .populate('transportationDetails')
    .populate('tourGuideDetails');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Package.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const packages = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: packages.length,
    pagination,
    data: packages
  });
});

// @desc    Get single package
// @route   GET /api/v1/packages/:id
// @access  Public
exports.getPackage = asyncHandler(async (req, res, next) => {
  const package = await Package.findById(req.params.id)
    .populate('reviews')
    .populate('accommodationDetails')
    .populate('transportationDetails')
    .populate('tourGuideDetails');

  if (!package) {
    return next(
      new ErrorResponse(`Package not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: package
  });
});

// @desc    Create new package
// @route   POST /api/v1/packages
// @access  Private (Admin)
exports.createPackage = asyncHandler(async (req, res, next) => {
  const package = await Package.create(req.body);

  res.status(201).json({
    success: true,
    data: package
  });
});

// @desc    Update package
// @route   PUT /api/v1/packages/:id
// @access  Private (Admin)
exports.updatePackage = asyncHandler(async (req, res, next) => {
  let package = await Package.findById(req.params.id);

  if (!package) {
    return next(
      new ErrorResponse(`Package not found with id of ${req.params.id}`, 404)
    );
  }

  package = await Package.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: package
  });
});

// @desc    Delete package
// @route   DELETE /api/v1/packages/:id
// @access  Private (Admin)
exports.deletePackage = asyncHandler(async (req, res, next) => {
  const package = await Package.findById(req.params.id);

  if (!package) {
    return next(
      new ErrorResponse(`Package not found with id of ${req.params.id}`, 404)
    );
  }

  package.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
