import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    _id: ObjectId,
    name: String,
    previewUrl: String,
    filePath: String,
    category: String,
  },
  { timestamps: true }
);

export default mongoose.model("Templates", resumeSchema);
