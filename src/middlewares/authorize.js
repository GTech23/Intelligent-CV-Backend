import jwt, { decode } from 'jsonwebtoken'

export default function authorizeAuth(req, res, next){
    const header = req.headers;
    const tokenHeader = header['authorization'];
    if(!tokenHeader) res.status(401).json({message: `Access Denied. Token required`})
    
    if(!tokenHeader.includes('Bearer ')) res.status(400).json({message: `Indicate Bearer when sending token`});
    const token = tokenHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    }catch(error){
        console.error(error);
        res.status(400).json({error, success: false})
    }
    

    next()
}