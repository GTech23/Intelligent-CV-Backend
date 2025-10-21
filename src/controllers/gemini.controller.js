import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateBulletPoint = async(req, res) => {
    try {
        const { jobTitle } = req.body;
        const prompt = `You are an expert HR recruiter and career coach. 
                        Given the following job title, generate a professional and concise list of key job responsibilities in bullet points. Job Title: ${jobTitle}Output the response as 6-10 bullet points suitable for a resume or job description. Make the tone professional and specific to the role. `

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const result = await model.generateContent(prompt);
        res.json({ response: result.response.text() });
    } catch (error) {
       res.status(500).json({ error: error.message });
    }
    
}