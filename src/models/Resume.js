import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Templates",
      required: true,
    },

    personal: {
      photoUrl: { type: String },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      title: { type: String },
      email: { type: String, required: true },
      phone: { type: String },
      address: { type: String },
      country: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      linkedin: { type: String },
      website: { type: String },
      summary: { type: String },
    },

    education: [
      {
        school: String,
        degree: String,
        fieldOfStudy: String,
        graduationMonth: String,
        graduationYear: String,
        removeGraudationDate: Boolean,
        location: String,
      },
    ],

    experience: [
      {
        company: String,
        position: String,
        startMonth: String,
        endMonth: String,
        country: String,
        province: String,
        city: String,
        endYear: String,
        isCurrentlyWorking: Boolean,
        responsibilities: [String],
      },
    ],

    skills: [String],

    certifications: [String],

    languages: [
      {
        name: String,
        level: String,
      },
    ],

    references: [
      {
        firstName: String,
        lastName: String,
        company: String,
        jobTitle: String,
        phone: String,
        email: String,
        relationshipStatus: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
