import bycrpt from "bcryptjs";
import User from "../models/user.model.js";
import catchAsyncError from "../utils/catchAsyncError.utils.js";
import CreateError from "../utils/error.utils.js";

export const updateUser = catchAsyncError(async function (req, res, next) {
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

  res.status(201).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
