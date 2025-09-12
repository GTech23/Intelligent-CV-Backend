import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    _id: ObjectId,
    template: { type: ObjectId, ref: "Template" },
  

    personal: {
      fullName: { type: String, required: true },
      title: { type: String }, 
      email: { type: String, required: true },
      phone: { type: String },
      address: { type: String },
      linkedin: { type: String },
      website: { type: String },
      profileImage: { type: String },
      summary: { type: String },
    },

    education: [
      {
        school: String,
        degree: String,
        fieldOfStudy: String,
        startDate: Date,
        endDate: Date,
        grade: String,
        description: String,
      },
    ],


    experience: [
      {
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        location: String,
        description: String,
        highlights: [String],
      },
    ],

    skills: [String], 
  
    projects: [
      {
        name: String,
        link: String,
        description: String,
      },
    ],

    certifications: [
      {
        name: String,
        issuer: String,
        date: Date,
        description: String,
      },
    ],

    languages: [
      {
        name: String,
        level: String, 
      },
    ],

    
    templateId: { type: String, default: "modern" },
    lastEdited: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
