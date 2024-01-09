import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, `Username mustn't be empty`],
      unique: [true, `This username is already used please try another one`],
    },
    email: {
      type: String,
      required: [true, `email mustn't be empty`],
      unique: [true, `This email is already used please try another one`],
    },
    password: {
      type: String,
      required: [true, `Password mustn't be empty`],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
