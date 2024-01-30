import Listing from "../models/listing.model.js";
import catchAsyncError from "../utils/catchAsyncError.utils.js";

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
