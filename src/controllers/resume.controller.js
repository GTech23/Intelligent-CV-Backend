import Resume from "../models/Resume.js";
import ResumeTemplate from "../models/ResumeTemplate.js";

export async function createResume(req, res) {
  const body = req.body;
  const id = req.user.id;
  try {
    const newResume = new Resume({
      ...body,
      name: `${body.personal.title} Resume`,
      userId: id,
    });

    await newResume.save();
    res
      .status(201)
      .json({ message: `Resume saved successfully`, success: true });
  } catch (e) {
    res.status(500).json({ error: `Error saving resume ${e}`, success: false });
  }
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
      .json({ error: `Error fetching resume ${error}`, success: false });
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
  const resumeData = req.body;
  try {
    const resume = await ResumeTemplate.findOne({
      _id: templateId,
    });

    if (!resume)
      return res
        .status(404)
        .json({ message: `Template not found`, success: false });

    let templatePath = resume.filePath;

    const htmlContent = await new Promise((resolve, reject) => {
      req.app.render(templatePath, { resume: resumeData }, (err, html) => {
        if (err) reject(err);
        resolve(html);
      });
    });

    res.setHeader("Content-Type", "text/html");
    res.send(htmlContent);
  } catch (error) {
    res.status(500).json({
      error: `Error fetching resume, ${error.message}`,
      success: false,
    });
  }
}

export async function downloadResume(req, res) {
  const templateId = req.params.id;
  const resumeData = req.body;

  try {
    const resumeTemplateDoc = await ResumeTemplate.findOne({
      _id: templateId,
    });

    if (!resumeTemplateDoc) {
      return res
        .status(404)
        .json({ message: `Template not found`, success: false });
    }

    const templatePath = resumeTemplateDoc.filePath;

    // Render the EJS template to an HTML string
    const htmlContent = await new Promise((resolve, reject) => {
      req.app.render(templatePath, { resume: resumeData }, (err, html) => {
        if (err) reject(err);
        resolve(html);
      });
    });

    const response = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.PDFSHIFT_API_KEY,
      },
      body: JSON.stringify({
        body: htmlContent,
      }),
    });

    const pdfBuffer = await response.arrayBuffer();
    console.log(htmlContent);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({
      error: `Error Downloading resume, ${error.message}`,
      success: false,
    });
  }
}
