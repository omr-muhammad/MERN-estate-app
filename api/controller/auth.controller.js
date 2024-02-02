// NODE Modules
// Third Party Modules
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Custom Modules
import User from "../models/user.model.js";
import catchAsyncError from "../utils/catchAsyncError.utils.js";
import CreateError from "../utils/error.utils.js";

function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
}

function createSendToken(user, statusCode, res) {
  const token = createToken(user._id);
  const cookieExpires = process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000;
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpires),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    path: "/",
  };

  res.cookie("access_token", token, cookieOptions);
  user.password = undefined;
  // const { password, ...resUser } = user._doc;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}

function verifyToken(req, res, next) {
  return async (err, decoded) => {
    if (err)
      return next(
        CreateError(
          "The user belonging to this token does no longer exist",
          401
        )
      );

    const user = await User.findById(decoded.id);

    if (!user) {
      res.clearCookie("access_token");
      return next(
        CreateError(`There is no user with this ID: ${decoded.id}`, 404)
      );
    }

    req.user = user;
    next();
  };
}

export const signup = catchAsyncError(async function (req, res, next) {
  const { username, email, password } = req.body;

  const newUser = await User.create({ username, email, password });

  createSendToken(newUser, 200, res);
});

export const signin = catchAsyncError(async function (req, res, next) {
  const { email, password } = req.body;

  // Error If No Data Provided
  if (!email || !password) {
    return next(CreateError("Please provide an email and a password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  // Error If User Not Exist Or Its Password Isn't Corrects
  if (!user || (await bcrypt.compare(user.password, password))) {
    return next(CreateError("Invalid email or password", 401));
  }

  // Sign In User By Sending The Token
  createSendToken(user, 200, res);
});

export const google = catchAsyncError(async function (req, res, next) {
  const { name, email, photo } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const uniqueName =
      name.replace(" ", "") + Math.random().toString(36).slice(-4);

    const newUser = await User.create({
      username: uniqueName,
      email,
      password: generatedPassword,
      avatar: photo,
    });

    return createSendToken(newUser, 200, res);
  }

  createSendToken(user, 200, res);
});

export const singout = catchAsyncError(async function (req, res, next) {
  res.clearCookie("access_token");
  res.status(200).json({
    status: "success",
    message: "User Signout Successfully",
  });
});

export const protect = catchAsyncError(async function (req, res, next) {
  // Check If There Is A Token
  const { authorization } = req.headers;

  let token;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ").at(1);
  } else if (req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  if (!token)
    return next(
      CreateError("You are not logged in. Please login to get access", 401)
    );

  // Verfication User
  // verifyToken is the function that returns the callback function which runs after the verify
  return jwt.verify(token, process.env.JWT_SECRET, verifyToken(req, res, next));
});
