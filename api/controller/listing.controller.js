import Listing from "../models/listing.model.js";
import catchAsyncError from "../utils/catchAsyncError.utils.js";
import CreateError from "../utils/error.utils.js";

export const setUserId = (req, res, next) => {
  req.body.userRef = req.user._id;
  next();
};

export const createListing = catchAsyncError(async function (req, res, next) {
  const newListing = await Listing.create(req.body);

  res.status(201).json({
    status: "success",
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
    status: "success",
    data: {
      listings,
    },
  });
});

export const deleteListing = catchAsyncError(async function (req, res, next) {
  const listing = await Listing.findById(req.params.id);

  if (!listing) return next(CreateError("Listing not found", 404));

  console.log(req.user._id, listing.userRef);
  if (req.user.id !== listing.userRef.toString())
    return next(CreateError("You can only delete your own listings", 401));

  await Listing.findByIdAndDelete(req.user.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
