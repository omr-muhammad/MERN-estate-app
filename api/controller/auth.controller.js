// Custom Modules
import User from "../models/user.model.js";
import catchAsyncError from "../utils/catchAsyncError.utils.js";

export const signup = catchAsyncError(async function (req, res, next) {
  const { username, email, password } = req.body;

  const newUser = await User.create({ username, email, password });

  res.status(201).json({
    status: "success",
    data: {
      newUser,
    },
  });
});
