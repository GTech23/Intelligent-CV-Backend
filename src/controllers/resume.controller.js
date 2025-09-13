import Resume from "../models/Resume.js";

export async function createResume(req, res){
    const body = req.body;
    const id = req.user.id
    const newResume = new Resume({...body, userId: id});
    console.log(newResume);
    await newResume.save();
    res.status(210).json({message: `Resume created`, success: true})
}

export async function getResumes(){

}

export async function getResume(){

}

export async function updateResume(){

}

export async function deleteResume(){

}