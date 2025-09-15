import Resume from "../models/Resume.js";
import puppeteer from "puppeteer";

import mongoose from "mongoose";
export async function createResume(req, res) {
  const body = req.body;
  const id = req.user.id;
  const newResume = new Resume({
    ...body,
    templateId: "68c8580c0c771e6b72642d09",
    userId: id,
  });
  await newResume.save();
  res.status(201).json({ message: `Resume created`, success: true });
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

export async function renderResume(req, res) {
  const templateId = req.params.id;

  try {
    const resume = await Resume.findOne({
      _id: templateId,
      userId: req.user.id,
    }).populate("templateId");

    if (!resume)
      return res
        .status(404)
        .json({ message: `Resume not found`, success: false });
    console.log(resume.templateId.fileName);
    return res.render(resume.templateId.filePath, {
      resume: resume.toObject(),
    });
  } catch (error) {
    res.status(500).json({
      error: `Error fetching resume ${error.name}`,
      success: false,
    });
  }
}

export async function downloadResume(req, res) {
  const templateId = req.params.id;

  try {
    const resume = await Resume.findOne({
      _id: templateId,
      userId: req.user.id,
    }).populate("templateId");
    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    }

    // render the HTML using handlebars
    res.render(
      resume.templateId.filePath,
      { resume: resume.toObject() },
      async (err, html) => {
        if (err) throw err;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
        });

        await browser.close();

        res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="resume.pdf"`,
          "Content-Length": pdfBuffer.length,
        });

        res.send(pdfBuffer);
      }
    );
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Failed to download resume" });
  }
}
