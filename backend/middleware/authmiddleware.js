const jwt=require('jsonwebtoken');

const KEY="jwt_token";

const verifyUser=(req,res,next)=>{
    const token=req.cookies.token;

    if(!token) return res.status(400).json({message:"No Token"});

    try{
        req.decode=jwt.verify(token,KEY);
        next();
    }
    catch(err){
        return res.status(400).json({message:err});
    }
};

module.exports={verifyUser};