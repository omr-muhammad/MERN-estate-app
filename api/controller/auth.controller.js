import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export async function signup(req, res, next) {
  const { username, email, password } = req.body;

  const newUser = await User.create({ username, email, password });

  res.status(201).json({
    message: "success",
    data: {
      newUser,
    },
  });
}
