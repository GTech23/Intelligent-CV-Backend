import Resume from "../models/Resume.js";
import mongoose from "mongoose";
export async function createResume(req, res) {
  const body = req.body;
  const id = req.user.id;
  const newResume = new Resume({ ...body, userId: id });
  await newResume.save();
  res.status(210).json({ message: `Resume created`, success: true });
}

export async function getResumes(req, res) {
  const userId = req.user.id;

  try {
    const resumes = await Resume.find({ userId });

    if (!resumes || resumes.length === 0)
      return res
        .status(404)
        .json({ success: false, message: `No Resumes found for this user` });

    res.status(200).json({ success: true, count: resumes.length, resumes });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error fetching resume ${error}`, success: false });
  }
}

export async function getResume(req, res) {
  const userId = req.user.id;
  const paramId = req.params.id;

  try {
    const resume = await Resume.findOne({ _id: paramId, userId });
    if (!resume || resume.length === 0)
      return res.status(404).json(`Resume not found for this user`);
    res.status(200).json({ success: true, resume });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error fetching resume ${error}`, success: false });
  }
}

export async function updateResume(req, res) {
  const body = req.body;
  const paramId = req.params.id;
  const userId = req.user.id;

  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: paramId, userId },
      { ...body },
      { new: true, runValidators: true }
    );

    if (!resume)
      return res
        .status(404)
        .json({ message: `Resume not found`, success: false });

    res.status(200).json({ message: `Resume updated`, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error f00etching resume ${error}`, success: false });
  }
}

export async function deleteResume(req, res) {
  const userId = req.user.id;
  const paramId = req.params.id;

  try {
    await Resume.findOneAndDelete({ _id: paramId, userId });
    res.status(200).json({ message: `Resume deleted`, success: true });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Error deleting resume ${err}`, success: false });
  }
}
