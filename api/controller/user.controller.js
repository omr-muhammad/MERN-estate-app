import bycrpt from "bcryptjs";
import User from "../models/user.model.js";
import catchAsyncError from "../utils/catchAsyncError.utils.js";
import CreateError from "../utils/error.utils.js";

export const updateMe = catchAsyncError(async function (req, res, next) {
  if (req.user.id !== req.params.id)
    return next(CreateError("You can only update your own account", 401));

  if (req.body.password) {
    req.body.password = await bycrpt.hash(req.body.password, 12);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar,
      password: req.body.password,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.clearCookie("access_token");
  res.status(201).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsyncError(async function (req, res, next) {
  if (req.params.id !== req.user.id)
    return CreateError("You do not have permission to do this action", 400);

  await User.findByIdAndDelete(req.user.id);

  console.log("User Deleted Successfully");
  res.clearCookie("access_token");
  res.status(204).json({
    status: "success",
    data: {
      user: null,
    },
  });
});

export const getUserById = catchAsyncError(async function (req, res, next) {
  const user = await User.findById(req.params.id);

  if (!user) return next(CreateError("User not found", 404));

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
