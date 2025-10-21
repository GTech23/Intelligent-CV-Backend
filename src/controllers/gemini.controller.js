import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateBulletPoint = async(req, res) => {
    try {
        const { jobTitle } = req.body;
        const prompt = `You are an Resume expert and career coach, Generate a list of job responsibilities or duties for a ${jobTitle}. Maximum of 5, Do not include any introduction, title, or explanation — only the list.`

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const result = await model.generateContent(prompt);
        res.json({ response: result.response.text() });
    } catch (error) {
       res.status(500).json({ error: error.message });
    }
    
}

export const generateSummary = async(req, res) => {
    try {
        const { jobTitle } = req.body;
        const prompt = `You are an Resume expert and career coach, Generate a career objective or job summary for a ${jobTitle} Do not include any introduction, title, or explanation — only the list. Maximum of 5 list`

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const result = await model.generateContent(prompt);
        res.json({ response: result.response.text() });
    } catch (error) {
       res.status(500).json({ error: error.message });
    }
    
}