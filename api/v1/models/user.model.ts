import mongoose from "mongoose";
import { generateRandomString } from "../../../helpers/generate";

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: {
      type: String,
      default: "",
    },
    password: String,
    token: {
      type: String,
      default: () => generateRandomString(30),
    },
    deleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema, "users");

export default User;
