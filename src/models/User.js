import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    subscriptionPlan: {
      type: String,
      enum: ["freemium", "premium"],
      default: "freemium",
    },
    isPremium: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
