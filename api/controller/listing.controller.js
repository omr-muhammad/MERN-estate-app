import Listing from '../models/listing.model.js';
import catchAsyncError from '../utils/catchAsyncError.utils.js';
import CreateError from '../utils/error.utils.js';

function correctData(type, data) {
  let query;

  if (type) {
    query = data === '' || data === undefined ? ['sale', 'rent'] : data;
    return { $in: query };
  }

  query = data === 'false' || data === undefined ? [true, false] : true;

  return { $in: query };
}

export const setUserId = (req, res, next) => {
  req.body.userRef = req.user._id;
  next();
};

export const createListing = catchAsyncError(async function (req, res, next) {
  const newListing = await Listing.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      listing: newListing,
    },
  });
});

export const getUserListings = catchAsyncError(async function (req, res, next) {
  if (req.user.id !== req.params.userId) {
    console.log(req.user.id, req.params.id);
    return next(
      CreateError(`You don't have permession to see these listings`, 401)
    );
  }

  const listings = await Listing.find({ userRef: req.user.id });

  res.status(200).json({
    status: 'success',
    data: {
      listings,
    },
  });
});

export const deleteListing = catchAsyncError(async function (req, res, next) {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return next(CreateError('Listing not found', 404));

  if (req.user.id !== listing.userRef.toString())
    return next(CreateError('You can only delete your own listings', 401));

  await Listing.findByIdAndDelete(listing._id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const updateListing = catchAsyncError(async function (req, res, next) {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return next(CreateError('Listing not found.', 404));

  if (req.user.id !== listing.userRef.toString())
    return next(CreateError('You can only update your own listings', 401));

  const updatedListing = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      listing: updatedListing,
    },
  });
});

export const getListing = catchAsyncError(async function (req, res, next) {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return next(CreateError('Listing not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      listing,
    },
  });
});

export const getAllListings = catchAsyncError(async function (req, res, next) {
  const limit = +req.query.limit || 9;
  const startIndex = +req.query.startIndex || 0;
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order || 'desc';

  let { offer, furnished, parking, type, searchTerm } = req.query;

  offer = correctData(false, offer);
  furnished = correctData(false, furnished);
  parking = correctData(false, parking);
  type = correctData(true, type);

  const listings = await Listing.find({
    name: { $regex: searchTerm || '' },
    offer,
    furnished,
    parking,
    type,
  })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

  res.status(200).json({
    status: 'success',
    data: {
      results: listings.length,
      listings,
    },
  });
});
