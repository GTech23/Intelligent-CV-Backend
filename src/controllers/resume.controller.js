import Resume from "../models/Resume.js";
import puppeteer from "puppeteer";

export async function createResume(req, res) {
  const body = req.body;
  const id = req.user.id;
  const newResume = new Resume({
    ...body,
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

import pdf from "html-pdf-node";
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

    res.render(
      "modern-blue",
      async (err, html) => {
        if (err) {
          console.error("Handlebars render error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Template render failed" });
        }

        try {
          // Prepare html-pdf-node input
          const file = { content: html };

          // PDF options
          const options = { format: "A4", printBackground: true };

          // Generate PDF as buffer
          const pdfBuffer = await pdf.generatePdf(file, options);

          res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="resume.pdf"`,
          });
          return res.send(pdfBuffer);
        } catch (pdfError) {
          console.error("PDF generation error:", pdfError);
          return res
            .status(500)
            .json({ success: false, message: "PDF generation failed" });
        }
      }
    );
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (error.name === "CastError") {
      return res.status(404).json({ error: `Resume not found` });
    }
    res.status(500).json({ error: "Failed to download resume" });
  }
}
