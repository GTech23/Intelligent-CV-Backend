import Resume from "../models/Resume.js";
import mongoose from 'mongoose'
export async function createResume(req, res){
    const body = req.body;
    const id = req.user.id
    const newResume = new Resume({...body, userId: id});
    await newResume.save();
    res.status(210).json({message: `Resume created`, success: true})
}

export async function getResumes(req, res){
    const userId = req.user.id;
    try {
        const resumes = await Resume.find({userId});
        
        if(!resumes || resumes.length === 0) res.status(404).json({success: false, message: `No Resumes found for this user`})

        res.status(200).json({success: true, count: resumes.length, resumes});

    } catch (error) {
        res.status(500).json({error: `Error fetching resume ${error}`, success: false})
    }
    
}

export async function getResume(){

}

export async function updateResume(){

}

export async function deleteResume(){

}