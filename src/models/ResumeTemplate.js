import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    _id: ObjectId,
    name: String,
    previewUrl: String,
    filePath: String,
    category: String,
    isPremium: {type: Boolean, default: false}
  },
  { timestamps: true }
);

export default mongoose.model("Templates", resumeSchema);
