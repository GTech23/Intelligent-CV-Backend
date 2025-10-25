import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateBulletPoint = async(req, res) => {
    try {
  const { jobTitle } = req.body;
  const prompt = `You are a Resume expert and career coach. Generate a list of job responsibilities or duties for a ${jobTitle}. Maximum of 10. Do not include any introduction, title, or explanation — only the list.`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const duties = text
    .split(/\r?\n/) 
    .map(line => line.trim())
    .map(line =>
      line
        .replace(/^(\*+|-+|•+|\d+[\.\)]\s*)/, "") 
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .trim()
    )
    .filter(line => line.length > 0);

  res.json({ duties });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}

    
}

export const generateSummary = async(req, res) => {
   try {
  const { jobTitle } = req.body;
  const prompt = `You are a Resume expert and career coach. Generate a career objective or job summary for a ${jobTitle}. 
  Maximum of 10. Do not include any introduction, title, or explanation — only the list.`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const objectives = text
    .split(/\r?\n/) 
    .map(line => line.trim())
    .map(line =>
      line
        .replace(/^(\*+|-+|•+|\d+[\.\)]\s*)/, "") 
        .replace(/\*\*(.*?)\*\*/g, "$1") 
        .replace(/\*(.*?)\*/g, "$1") 
        .trim()
    )
    .filter(line => line.length > 0);

  res.json({ objectives });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}

    
}