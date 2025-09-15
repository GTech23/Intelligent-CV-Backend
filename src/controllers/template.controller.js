
import ResumeTemplate from "../models/ResumeTemplate.js";

export async function createTemplate(req, res,){
    const body = req.body;
    const newTemplate = new ResumeTemplate({...body});
    await newTemplate.save()
    res.status(201).json({success: true, message: `Template created`})
}


export async function getTemplates(req, res) {
    const templates = await ResumeTemplate.find();
    if(templates.length === 0 || !templates) return res.status(404).json({message: `Templates not found`});

    res.status(200).json({success: true, templates})
}