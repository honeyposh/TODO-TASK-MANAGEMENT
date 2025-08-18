const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    firstName: {
      type: String,
      required: [true, "Firstname is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Lastname is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
