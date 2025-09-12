import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
  _id: ObjectId,
  name: String,
  email: String,
  password: String, 
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: Date,
  updatedAt: Date,
  subscriptionPlan: {type: String, enum: ['freemium', 'premium']},
  isPremium: Boolean
}
, {timestamps: true}
);

export default mongoose.model("User", userSchema);
