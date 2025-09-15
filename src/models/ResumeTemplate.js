import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    name: String,
    previewUrl: String,
    filePath: String,
    category: String,
    isPremium: {type: Boolean, default: false}
  },
  { timestamps: true }
);

export default mongoose.model("Templates", resumeSchema);
