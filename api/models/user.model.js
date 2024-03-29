import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    password: {
      type: String,
      required: [true, `Password mustn't be empty`],
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hashSync(this.password, 12);

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
